import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import moment from 'moment'

// components
import Modal from '@components/Modal'
import Title from '@components/base/Title'
import Table from '@components/base/Table'
import Loading from '@components/base/Loading'

// hooks
import { useAuth } from '@hooks'

// composable
import { headers } from '@composable/users'
import { filters } from '@composable/filters'

// utils
import swal from '@utilities/swal'

function Doctors () {
  const { auth } = useAuth()
  const { metaActions, metaStates } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const doctors = {
    ...metaStates('doctors', ['list', 'count']),
    ...metaActions('doctors', ['fetch', 'create', 'patch'])
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(false)

  const formRef = useRef(null)

  useEffect(() => {
    loadDoctors()
  }, [page])

  useEffect(() => {
    if (updateData) {
      setShowCreateModal(true)
    }
  }, [updateData])

  useEffect(() => {
    if (showCreateModal && updateData) {
      formRef.current.querySelector('[name="first_name"]').value = updateData.first_name
      formRef.current.querySelector('[name="last_name"]').value = updateData.last_name
      formRef.current.querySelector('[name="phone_number"]').value = updateData.phone_number
    }
  }, [showCreateModal])

  const loadDoctors = async (data = null) => {
    setIsDataLoading(true)
    let filters = [
      {
        field: 'admin_id',
        value: auth.id
      },
      {
        field: 'deleted_at',
        value: 'null'
      }
    ]

    if (data) {
      filters = [
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
      ]
    }

    await doctors.fetch({
      filters,
      aggregate: [
        {
          table: 'authentications',
          filters: [
            {
              field: 'doctor_id',
              key: 'id'
            }
          ],
          is_first: true,
          columns: ['status', 'username']
        }
      ],
      is_count: true,
      pagination,
      sort,
    })

    setIsDataLoading(false)
  }

  const handleSubmit = async e => {
    e.preventDefault() // Prevent page refresh
    setIsLoading(true)

    // Use FormData to access the submitted values
    const formData = new FormData(formRef.current)
    const obj = Object.fromEntries(formData.entries())

    if (updateData) {
      var response = await doctors.patch({
        key: 'id',
        data: {
          id: updateData.id,
          ...obj
        }
      })
    } else {
      obj.admin_id = auth.id
      var response = await doctors.create(obj)
    }

    setUpdateData(null)
    setIsLoading(false)
    setShowCreateModal(false)
    formRef.current.reset()
    loadDoctors()

    if (response.error) {
      swal.error({
        title: 'Error',
        text: error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: `Doctor ${updateData ? 'updated' : 'created'} successfully!`
    })
  }

  const handleBulkDelete = async (ids, reset) => {
    swal.prompt({
      text: 'Are you sure you want to delete this?',
      async onConfirm () {
        try {
          await Promise.all(
            ids.map(id => {
              return doctors.patch({
                key: 'id',
                data: {
                  id,
                  deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              })
            })
          )
          
          reset()
          loadDoctors()
          swal.success()
        } catch (error) {
          swal.error({
            text: error.message
          })
        }
      }
    })
  }

  return (
    <div className="users">
      <Title title="Manage Doctor" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={doctors.list}
          selectedValue="id"
          totalRowsCount={doctors.count}
          onRefresh={() => loadDoctors()}
          onDelete={async (ids, reset) => handleBulkDelete(ids, reset)}
          onRowClick={row => setUpdateData(row)}
          onPageChance={value => setPage(value)}
          onCreate={() => {
            setUpdateData(null)
            setShowCreateModal(true)
          }}
          onSearch={data => loadDoctors(data)}
          isLoading={isDataLoading}
        />
      </div>

      <Modal
        visible={showCreateModal}
        title={`${updateData ? 'Update' : 'Create'} Doctor`}
        onClose={() => {
          setUpdateData(null)
          setShowCreateModal(false)
        }}
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>First Name</label>
            <input type="text" name="first_name" required autoComplete="off" />
          </div>

          <div className="form-group">
            <label>Last Name</label>
            <input type="text" name="last_name" required autoComplete="off" />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phone_number" required autoComplete="off" />
          </div>

          <div className="form-group">
            <button
              type="submit"
              className={`submit ${isLoading ? 'disabled' : ''}`}
              disabled={isLoading}
            >
              {
                isLoading ? <Loading size={20} thick={3} auto noBackground /> : (updateData ? 'Update' : 'Create')
              }
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Doctors