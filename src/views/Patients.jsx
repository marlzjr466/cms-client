import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import { useNavigate, useParams } from 'react-router-dom'
import { useReactToPrint } from "react-to-print"
import moment from 'moment'
import _ from 'lodash'

// components
import PrescriptionPad from '@components/PrescriptionPad'
import Modal from '@components/Modal'
import SideModal from '@components/SideModal'
import Title from '@components/base/Title'
import Table from '@components/base/Table'
import Loading from '@components/base/Loading'

// hooks
import { useAuth } from '@hooks'

// utils
import swal from '@utilities/swal'
import { getAge } from '@utilities/helper'

// composable
import { headers } from '@composable/patients'
import { headers as recordsHeaders } from '@composable/doctor-dashboard'
import { filters } from '@composable/filters'

function Patients () {
  const navigate = useNavigate()
  const urlParams = useParams()
  const { auth } = useAuth()
  const { metaStates, metaActions } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const patients = {
    ...metaStates('patients', ['list', 'count']),
    ...metaActions('patients', ['fetch'])
  }

  const records = {
    ...metaStates('records', ['list', 'count']),
    ...metaActions('records', ['fetch', 'create', 'patch'])
  }

  const [isLoading, setIsLoading] = useState(false)
  const [row, setRow] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [isRecordsDataLoading, setIsRecordsDataLoading] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [printInfo, setPrintInfo] = useState(null)

  const formRef = useRef(null)
  const contentRef = useRef(null)
  const reactToPrintFn = useReactToPrint({ contentRef })

  useEffect(() => {
    if (printInfo) {
      reactToPrintFn()
    }
  }, [printInfo])

  useEffect(() => {
    loadPatients()
  }, [page])

  useEffect(() => {
    if (urlParams.id) {
      loadRecords()
    }
  }, [urlParams])

  useEffect(() => {
    if (updateData) {
      formRef.current.querySelector('[name="complaints"]').value = updateData.complaints
      formRef.current.querySelector('[name="medication"]').value = updateData.medication
      formRef.current.querySelector('[name="diagnosis"]').value = updateData.diagnosis
      formRef.current.querySelector('[name="hpi"]').value = updateData.hpi
      formRef.current.querySelector('[name="physical_exam"]').value = updateData.physical_exam
      formRef.current.querySelector('[name="remarks"]').value = updateData.remarks
    }
  }, [updateData])
  
  const loadPatients = async (data = null) => {
    setIsDataLoading(true)
    const filters = [
      {
        field: 'admin_id',
        value: auth.admin_id
      },
      {
        field: 'deleted_at',
        value: 'null'
      }
    ]

    if (data) {
      filters.push(...[
        {
          field: 'first_name',
          operator: 'like',
          value: data
        },
        {
          field: 'last_name',
          operator: 'orlike',
          value: data
        }
      ])
    }

    await patients.fetch({
      filters,
      aggregate: [
        {
          table: 'records',
          filters: [
            {
              field: 'patient_id',
              key: 'id'
            }
          ],
          is_first: true,
          columns: ['id', 'created_at'],
          sort
        }
      ],
      is_count: true,
      pagination,
      sort
    })
    
    setIsDataLoading(false)
  }

  const loadRecords = async (data = null) => {
    setIsRecordsDataLoading(true)
    const filters = [
      {
        field: 'patient_id',
        value: row?.id
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
    
    setIsRecordsDataLoading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault() // Prevent page refresh
    setIsRecordsDataLoading(true)

    // Use FormData to access the submitted values
    const formData = new FormData(formRef.current)
    const obj = Object.fromEntries(formData.entries())

    const response = await records.patch({
      key: 'id',
      data: {
        id: updateData.id,
        ...obj
      }
    })

    setUpdateData(null)
    setIsRecordsDataLoading(false)
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
      text: 'Record updated successfully!'
    })
  }

  return (
    <div className="patients">
      <PrescriptionPad
        reference={contentRef}
        data={printInfo}
      />

      <Title title="Manage Patients" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={patients.list}
          selectedValue="id"
          totalRowsCount={patients.count}
          onRefresh={() => loadPatients()}
          disableButton
          onRowClick={row => {
            setRow(row)
            navigate(`/patients/${row.id}`)
          }}
          onPageChance={value => setPage(value)}
          onSearch={data => loadPatients(data)}
          isLoading={isDataLoading}
        />
      </div>

      <SideModal
        visible={urlParams.id}
        title="Patient Information & Records"
        onClose={() => {
          setRow(null)
          navigate('/patients')
        }}
      >
        <div className="patient-info">
          <div className="patient-info-item">
            <span>Fullname</span>
            {row?.first_name} {row?.last_name}
          </div>

          <div className="patient-info-item">
            <span>Birthdate</span>
            {moment(row?.birth_date).format('MMMM D, YYYY')}
          </div>

          <div className="patient-info-item">
            <span>Gender</span>
            {_.capitalize(row?.gender)}
          </div>
        </div>

        <div className="patient-records">
          <Table
            headers={recordsHeaders()}
            rows={records.list}
            selectedValue="id"
            totalRowsCount={records.count}
            onRefresh={() => loadRecords()}
            onRowClick={row => setUpdateData(row)}
            onPageChance={value => setPage(value)}
            onSearch={data => loadRecords(data)}
            isLoading={isRecordsDataLoading}
            disableButton
            actions={[
              {
                label: 'Print prescription',
                onAction: item => setPrintInfo({
                  ...item,
                  patient: row, 
                  age: getAge(row.birth_date)
                })
              }
            ]}
          />
        </div>
      </SideModal>

      <Modal
        visible={updateData !== null}
        title="View Record"
        onClose={() => setUpdateData(null)}
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

export default Patients