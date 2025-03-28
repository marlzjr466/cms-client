import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import moment from 'moment/moment'
import _ from "lodash"

// config
import socket from '@config/socket'

// composable
import { headers } from '@composable/doctor-dashboard'
import { filters } from '@composable/filters'

// components
import PrescriptionPad from '@components/PrescriptionPad'
import Modal from '@components/Modal'
import Table from '@components/base/Table'
import Title from '@components/base/Title'
import NoData from '@components/base/NoData'
import Loading from '@components/base/Loading'

// utils
import swal from '@utilities/swal'
import { getAge, storage, formatQueueNumber } from '@utilities/helper'

// hooks
import { useAuth } from '@hooks'

function QueueManagement () {
  const { auth } = useAuth()
  const { metaStates, metaMutations, metaActions } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const records = {
    ...metaStates('records', ['list', 'count', 'servePatientsCount']),
    ...metaActions('records', ['fetch', 'create', 'patch', 'getServePatients', 'find'])
  }

  const transactions = {
    ...metaActions('transactions', ['create'])
  }

  const queues = {
    ...metaStates('queues', ['list', 'count', 'current']),
    ...metaMutations('queues', ['SET_CURRENT']),
    ...metaActions('queues', ['fetch', 'patch', 'getCurrent'])
  }

  const currentDate = moment().format("dddd, MMMM D, YYYY")

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [isGetQueueLoading, setIsGetQueueLoading] = useState(false)
  const [printInfo, setPrintInfo] = useState(null)
  const [isRecordAdded, setIsRecordAdded] = useState('false')
  const [recordId, setRecordId] = useState(null)
  const [consultationPrice, setConsultationPrice] = useState(null)

  const formRef = useRef(null)

  useEffect(() => {
    initSocketListeners()
    loadQueues()
    loadServePatientsCount()

    setIsRecordAdded(storage.get('isRecordAdded') || false)
  }, [])

  useEffect(() => {
    if (auth) {
      queues.getCurrent(auth.doctor_id)
    }
  }, [auth])

  useEffect(() => {
    if (queues.current) {
      loadRecords()
      records.find({
        is_first: true,
        filters: [
          {
            field: 'queue_id',
            value: queues.current.id
          }
        ]
      }).then(res => {
        setRecordId(res?.id || null)
      })
    }
  }, [queues.current, page])

  useEffect(() => {
    if (updateData) {
      setShowCreateModal(true)
    }
  }, [updateData])

  useEffect(() => {
    if (showCreateModal && updateData) {
      formRef.current.querySelector('[name="complaints"]').value = updateData.complaints
      formRef.current.querySelector('[name="medication"]').value = updateData.medication
      formRef.current.querySelector('[name="diagnosis"]').value = updateData.diagnosis
      formRef.current.querySelector('[name="hpi"]').value = updateData.hpi
      formRef.current.querySelector('[name="physical_exam"]').value = updateData.physical_exam
      formRef.current.querySelector('[name="remarks"]').value = updateData.remarks
    }
  }, [showCreateModal])

  const initSocketListeners = () => {
    socket.on('refresh', types => {
      if (types.includes('queues')) {
        loadQueues()
      }
    })
  }

  const loadQueues = async () => {
    await queues.fetch({
      filters: [
        {
          field: 'status',
          value: 'waiting'
        },
        {
          field: 'deleted_at',
          value: 'null'
        }
      ],
      aggregate: [
        {
          table: 'patients',
          filters: [
            {
              field: 'id',
              key: 'patient_id'
            }
          ],
          is_first: true,
          columns: ['id', 'first_name', 'last_name', 'gender', 'birth_date', 'address', 'phone_number']
        }
      ],
      is_count: true
    })
  }

  const loadRecords = async (data = null) => {
    setIsDataLoading(true)
    const filters = [
      {
        field: 'patient_id',
        value: queues.current?.patient_id
      },
      {
        field: 'deleted_at',
        value: 'null'
      }
    ]

    if (data) {
      filters.push(...[
        {
          field: 'complaints',
          operator: 'like',
          value: data
        },
        {
          field: 'remarks',
          operator: 'orlike',
          value: data
        }
      ])
    }

    await records.fetch({
      filters,
      aggregate: [
        {
          table: 'doctors',
          filters: [
            {
              field: 'id',
              key: 'doctor_id'
            }
          ],
          is_first: true,
          columns: ['id', 'first_name', 'last_name']
        }
      ],
      is_count: true,
      pagination,
      sort
    })
    
    setIsDataLoading(false)
  }

  const loadServePatientsCount = async () => {
    await records.getServePatients({
      filters: [
        {
          field: 'created_at',
          custom_operator: 'dateequal',
          value: moment().format('YYYY-MM-DD')
        },
        {
          field: 'doctor_id',
          value: auth.doctor_id
        },
        {
          field: 'deleted_at',
          value: 'null'
        }
      ],
      is_count: true
    })
  }

  const handleSetQueue = async (item = null) => {
    setIsGetQueueLoading(true)
    const [queue] =  item ? [item] : queues.list
    
    const res = await queues.patch({
      key: 'id',
      data: {
        id: queue.id,
        doctor_id: auth.doctor_id,
        status: 'in-progress'
      }
    })

    if (res.error) {
      return swal.error({
        title: 'Error',
        text: res.error.message
      })
    }

    await loadQueues()
    queues.SET_CURRENT(queue)
    setIsGetQueueLoading(false)
  }

  const handleDoneServe = async () => {
    if (!consultationPrice) {
      return swal.info({
        title: 'Missing price',
        text: 'Please add a consultation price.'
      })
    }

    swal.prompt({
      text: 'Are you sure?',
      async onConfirm () {
        try {
          const [res, resTxn] = await Promise.all([
            queues.patch({
              key: 'id',
              data: {
                id: queues.current.id,
                status: 'completed'
              }
            }),
            transactions.create({
              record_id: recordId,
              consultation_price: consultationPrice
            })
          ])

          if (res.error || resTxn.error) {
            throw new Error(error.message)
          }
          
          storage.set('isRecordAdded', false)
          setIsRecordAdded('false')
          loadServePatientsCount()
          setConsultationPrice(null)
          queues.SET_CURRENT(null)
          swal.success()
        } catch (error) {
          swal.error({
            text: error.message
          })
        }
      }
    })
  }

  const handleSubmit = async e => {
    e.preventDefault() // Prevent page refresh
    setIsLoading(true)

    // Use FormData to access the submitted values
    const formData = new FormData(formRef.current)
    const obj = Object.fromEntries(formData.entries())

    if (updateData) {
      var response = await records.patch({
        key: 'id',
        data: {
          id: updateData.id,
          ...obj
        }
      })
    } else {
      obj.admin_id = auth.admin_id
      obj.doctor_id = auth.doctor_id
      obj.patient_id = queues.current.patient_id
      obj.queue_id = queues.current.id
      var response = await records.create(obj)
      setRecordId(response[0])
    }

    storage.set('isRecordAdded', true)
    setIsRecordAdded('true')
    setUpdateData(null)
    setIsLoading(false)
    setShowCreateModal(false)
    formRef.current.reset()
    loadRecords()

    if (response.error) {
      return swal.error({
        title: 'Error',
        text: response.error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: `${updateData ? 'Record updated' : 'New record added'} successfully!`
    })
  }

  return (
    <div className="dashboard">
      <PrescriptionPad
        data={printInfo}
        onFinish={() => setPrintInfo(null)}
      />

      <div className="flex flex-jc-sb">
        <div className="dashboard__title">
          <Title title="Hi! Welcome to Dashboard" icon={false} />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="dashboard__body">
        <div className="dashboard__left">
          <div className="dashboard__manage_queue">
            <div className="header flex flex-jc-sb full-width">
              <Title title="Current Patient Records" icon={false} size="16px" />

              <div className="flex gap-2">
                {
                  queues.current && (
                    <button
                      className="btn info" onClick={handleDoneServe}
                      disabled={!eval(isRecordAdded)}
                    >
                      Done
                    </button>
                  )
                }
                
                <button
                  className="btn info"
                  disabled={!queues.count || isGetQueueLoading || queues.current}
                  onClick={() => handleSetQueue()}
                >
                  {
                    isGetQueueLoading 
                      ? <Loading size={15} thick={2} auto noBackground />
                      : !records.servePatientsCount
                        ? 'Serve Patient'
                        : 'Next Patient'
                  }
                </button>
              </div>

            </div>

            {
              queues.current ? (
                <>
                  <div className="patient-info">
                    <div className="patient-info-item">
                      <span>Fullname</span>
                      {queues.current.patients.first_name} {queues.current.patients.last_name}
                    </div>

                    {
                      queues.current.patients.birth_date && (
                        <div className="patient-info-item">
                          <span>Birthdate</span>
                          {moment(queues.current.patients.birth_date).format('MMMM D, YYYY')}
                        </div>
                      )
                    }

                    {
                      queues.current.patients.gender && (
                        <div className="patient-info-item">
                          <span>Gender</span>
                          { _.capitalize(queues.current.patients.gender)}
                        </div>
                      )
                    }

                    {
                      queues.current.patients.phone_number && (
                        <div className="patient-info-item">
                          <span>Phone Number</span>
                          {_.capitalize(queues.current.patients.phone_number)}
                        </div>
                      )
                    }

                    {
                      queues.current.patients.address && (
                        <div className="patient-info-item">
                          <span>Address</span>
                          {_.capitalize(queues.current.patients.address)}
                        </div>
                      )
                    }

                    <div className="patient-info-item">
                      <span>Queue Number</span>
                      {formatQueueNumber(queues.current.number)}
                    </div>
                  </div>

                  <div className="patient-records">
                    <Table
                      headers={headers()}
                      rows={records.list}
                      selectedValue="id"
                      totalRowsCount={records.count}
                      onRefresh={() => loadRecords()}
                      onRowClick={row => setUpdateData(row)}
                      onPageChance={value => setPage(value)}
                      onCreate={() => {
                        setUpdateData(null)
                        setShowCreateModal(true)
                      }}
                      onSearch={data => loadRecords(data)}
                      isLoading={isDataLoading}
                      itemsPerPage={pagination.rows}
                      noDelete
                      actions={[
                        {
                          label: 'Print prescription',
                          onAction: item => setPrintInfo({
                            ...item,
                            patient: queues.current.patients, 
                            age: queues.current.patients.birth_date ? getAge(queues.current.patients.birth_date) : ''
                          })
                        }
                      ]}
                    />
                    
                    <div className="consultation">
                      <div>Consultation price:</div>

                      <div className="consultation_sign">₱</div>
                      <input
                        type="text"
                        value={consultationPrice || ''}
                        onChange={e => {
                          const inputValue = e.target.value
                          const numericValue = inputValue.replace(/\D/g, "")
                          setConsultationPrice(numericValue)
                        }}
                      />
                    </div>
                  </div>
                </>
              ) : <NoData label="No active queue number" />
            }
          </div>
        </div>

        <div className="dashboard__right">
          <div className="dashboard__statistics">
            <Title title="Today's Statistics" icon={false} size="16px" />

            <div className="dashboard__statistics-row">
              Served Patients
              <span>{records.servePatientsCount}</span>
            </div>
          </div>

          <div className="dashboard__queue">
            <Title title="In Queue" icon={false} size="16px" />

            <div className="dashboard__queue-wrapper">
              {
                queues.count ? (
                  queues.list.map((queue, i) => (
                    <div key={i} className="dashboard__queue-item">
                      <div className="dashboard__queue-item-left">
                        <div className="dashboard__queue-item-left__info">
                          <div className="flex flex-col">
                            <span>{queue.patients.first_name} {queue.patients.last_name}</span>
                            {formatQueueNumber(queue.number)}
                          </div>

                          <button
                            className="btn success py-2 px-4"
                            onClick={() => handleSetQueue(queue)}
                          >
                            Priority
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : <NoData label="No available queue" />
              }
            </div>

          </div>
        </div>
      </div>

      <Modal
        visible={showCreateModal}
        title={`${updateData ? 'Update' : 'Add'} Record`}
        onClose={() => {
          setUpdateData(null)
          setShowCreateModal(false)
        }}
      >
        <form className="grid" ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Complaints</label>
            <textarea className="records" name="complaints"></textarea>
          </div>

          <div className="form-group">
            <label>Medication</label>
            <textarea className="records" name="medication"></textarea>
          </div>

          <div className="form-group">
            <label>Diagnosis</label>
            <textarea className="records" name="diagnosis"></textarea>
          </div>

          <div className="form-group">
            <label>HPI</label>
            <textarea className="records" name="hpi"></textarea>
          </div>

          <div className="form-group">
            <label>Pyshical</label>
            <textarea className="records" name="physical_exam"></textarea>
          </div>

          <div className="form-group">
            <label>Remarks</label>
            <textarea className="records" name="remarks"></textarea>
          </div>

          <div className="form-group">
            <button
              type="submit"
              className={`submit ${isLoading ? 'disabled' : ''}`}
              disabled={isLoading}
            >
              {
                isLoading ? <Loading size={20} thick={3} auto noBackground /> : (updateData ? 'Update' : 'Add')
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default QueueManagement