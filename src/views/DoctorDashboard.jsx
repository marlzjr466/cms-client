import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import moment from 'moment/moment'
import _ from "lodash"

// composable
import { headers } from '@composable/doctor-dashboard'
import { filters } from '@composable/filters'

// components
import Modal from '@components/Modal'
import Table from '@components/base/Table'
import Title from '@components/base/Title'
import NoData from '@components/base/NoData'
import Loading from '@components/base/Loading'

// utils
import swal from '@utilities/swal'

// hooks
import { useAuth } from '@hooks'

function QueueManagement () {
  const { auth } = useAuth()
  const { metaStates, metaMutations, metaActions } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const records = {
    ...metaStates('records', ['list', 'count']),
    ...metaActions('records', ['fetch', 'create', 'patch'])
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

  const formRef = useRef(null)

  useEffect(() => {
    loadQueues()
  }, [])

  useEffect(() => {
    if (auth) {
      queues.getCurrent(auth.doctor_id)
    }
  }, [auth])

  useEffect(() => {
    if (queues.current) {
      loadRecords()
    }
  }, [queues.current])

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
          columns: ['id', 'first_name', 'last_name', 'gender', 'birth_date']
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
        value: queues.current.patient_id
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

  const handleSetQueue = async () => {
    setIsGetQueueLoading(true)
    const [queue] =  queues.list
    
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
    swal.prompt({
      text: 'Are you sure?',
      async onConfirm () {
        try {
          const res = await queues.patch({
            key: 'id',
            data: {
              id: queues.current.id,
              status: 'for-transaction'
            }
          })

          if (res.error) {
            throw new Error(error.message)
          }
          
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
    }

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
                    <button className="btn info" onClick={handleDoneServe}>
                      Done
                    </button>
                  )
                }
                
                <button
                  className={`btn info ${!queues.count || isGetQueueLoading || queues.current ? 'disabled' : ''}`}
                  disabled={!queues.count || isGetQueueLoading || queues.current}
                  onClick={handleSetQueue}
                >
                  {
                    isGetQueueLoading ? <Loading size={15} thick={2} auto noBackground /> : 'Serve Patient'
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

                    <div className="patient-info-item">
                      <span>Birthdate</span>
                      {moment(queues.current.patients.birth_date).format('MMMM D, YYYY')}
                    </div>

                    <div className="patient-info-item">
                      <span>Gender</span>
                      {_.capitalize(queues.current.patients.gender)}
                    </div>

                    <div className="patient-info-item">
                      <span>Queue Number</span>
                      {queues.current.number}
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
                      noDelete
                    />
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
              <span>0</span>
            </div>

            {/* <div className="dashboard__statistics-row">
              Current Queue
              <span>----</span>
            </div> */}
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
                          <span>{queue.patients.first_name} {queue.patients.last_name}</span>
                          {queue.number}
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
            <label>Pyshical Exam</label>
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