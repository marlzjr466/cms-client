import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import { useNavigate, useParams } from 'react-router-dom'
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
  const { setPage: setRecordsPage, page: recordsPage, pagination: recordsPagination } = filters()

  const patients = {
    ...metaStates('patients', ['list', 'count']),
    ...metaActions('patients', ['fetch', 'create'])
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
  const [showPatientModal, setShowPatientModal] = useState(null)
  const [isPatientLoading, setIsPatientLoading] = useState(false)
  const [isImportLoading, setIsImportLoading] = useState(false)

  const formRef = useRef(null)
  const formPatientRef = useRef(null)

  useEffect(() => {
    loadPatients()
  }, [page])

  useEffect(() => {
    loadRecords()
  }, [recordsPage])

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
        field: 'patients.admin_id',
        value: auth.admin_id
      },
      {
        field: 'patients.deleted_at',
        value: 'null'
      }
    ]

    if (data) {
      filters.push(...[
        {
          field: 'patients.first_name',
          operator: 'like',
          value: data
        },
        {
          field: 'patients.last_name',
          operator: 'orlike',
          value: data
        }
      ])
    }

    await patients.fetch({
      filters,
      leftJoin: [
        {
          table: 'records',
          field: 'records.patient_id',
          key: 'patients.id'
        }
      ],
      columns: [
        'patients.*',
        {
          raw: `
            JSON_OBJECT(
              'id', records.id,
              'created_at', records.created_at
            ) AS records
          `
        }
      ],
      groupBy: ['patients.id', 'records.id'],
      is_count: true,
      pagination,
      sort: [
        { field: 'records.created_at', direction: 'desc' },
        { field: 'patients.id', direction: 'desc' },
      ]
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
      pagination: recordsPagination,
      sort
    })
    
    setIsRecordsDataLoading(false)
  }

  const handleSubmitPatient = async e => {
    e.preventDefault() // Prevent page refresh
    setIsPatientLoading(true)

    // Use FormData to access the submitted values
    const formData = new FormData(formPatientRef.current)
    const obj = Object.fromEntries(formData.entries())

    const response = await patients.create({
      ...obj,
      admin_id: auth.admin_id
    })
    setShowPatientModal(false)
    setIsPatientLoading(false)
    formPatientRef.current.reset()
    loadPatients()

    if (response.error) {
      return swal.error({
        title: 'Error',
        text: response.error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: 'Patient added successfully!'
    })
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

  const handleImport = async data => {
    // setIsImportLoading(true)

    const extractName = fullname => {
      const [lname, fname] = fullname.split(',')

      return {
        first_name: fname?.trim() || '',
        last_name: lname?.trim() || ''
      }
    }

    const importedData = data.list.map(item => {
      const patient = {
        admin_id: auth.admin_id,
        first_name: item.customer_name ? extractName(item.customer_name).first_name : item.first_name,
        last_name: item.customer_name ? extractName(item.customer_name).last_name : item.last_name,
        address: item.address || null,
        gender: item.gender || null,
        phone_number: item.phone || item.phone_number || null,
        birth_date: item.birth_date ? moment(item.birth_date, "DD/MM/YYYY").format("YYYY-MM-DD") : null,
      }

      return patient
    })

    const response = await patients.create(importedData)
    setIsImportLoading(false)
    loadPatients()

    if (response.error) {
      return swal.error({
        title: 'Error',
        text: response.error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: 'Patient imported successfully!'
    })
  }

  return (
    <div className="patients">
      <PrescriptionPad
        data={printInfo}
        onFinish={() => setPrintInfo(null)}
      />

      <Title title="Manage Patients" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={patients.list}
          selectedValue="id"
          totalRowsCount={patients.count}
          onRefresh={() => loadPatients()}
          onCreate={() => setShowPatientModal(true)}
          noDelete
          enableImport
          onImport={handleImport}
          isImportLoading={isImportLoading}
          onRowClick={row => {
            setRow(row)
            navigate(`/patients/${row.id}`)
          }}
          onPageChance={value => setPage(value)}
          onSearch={data => loadPatients(data)}
          isLoading={isDataLoading}
          itemsPerPage={pagination.rows}
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
            <span>Phone Number</span>
            {row?.phone_number || '---'}
          </div>

          <div className="patient-info-item">
            <span>Birthdate</span>
            {row?.birth_date ? moment(row?.birth_date).format('MMMM D, YYYY') : '---'}
          </div>

          <div className="patient-info-item">
            <span>Gender</span>
            {row?.gender ? _.capitalize(row?.gender) : '---'}
          </div>

          <div className="patient-info-item">
            <span>Address</span>
            {row?.address || '---'}
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
            onPageChance={value => setRecordsPage(value)}
            onSearch={data => loadRecords(data)}
            isLoading={isRecordsDataLoading}
            itemsPerPage={recordsPagination.rows}
            disableButton
            actions={[
              {
                label: 'Print prescription',
                onAction: item => setPrintInfo({
                  ...item,
                  patient: row, 
                  age: row.birth_date ? getAge(row.birth_date) : ''
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

      <Modal
        visible={showPatientModal}
        title="Add Patient"
        onClose={() => setShowPatientModal(false)}
      >
        <form className="grid" ref={formPatientRef} onSubmit={handleSubmitPatient}>
          <div className="form-group" style={{width: '400px'}}>
            <label>First Name</label>
            <input type="text" name="first_name" required />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="last_name" required />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" required>
              <option value="">&nbsp;&nbsp;&nbsp;Select here</option>
              <option value="male">&nbsp;&nbsp;&nbsp;Male</option>
              <option value="female">&nbsp;&nbsp;&nbsp;Female</option>
            </select>
            <span>
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </span>
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone_number" required />
          </div>

          <div className="form-group">
            <label>Address</label>
            <input type="text" name="address" required />
          </div>

          <div className="form-group">
            <label>Birthdate</label>
            <input type="date" name="birth_date" required />
          </div>

          <div className="form-group">
            <button
              type="submit"
              className={`submit ${isPatientLoading ? 'disabled' : ''}`}
              disabled={isPatientLoading}
            >
              {
                isPatientLoading ? <Loading size={20} thick={3} auto noBackground /> : 'Add Patient'
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Patients