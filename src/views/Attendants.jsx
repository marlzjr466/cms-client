import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import moment from 'moment'

// components
import Modal from '@components/Modal'
import Title from '@components/base/Title'
import Table from '@components/base/Table'
import Loading from '@components/base/Loading'

// composable
import { headers } from '@composable/users'
import { filters } from '@composable/filters'

// hooks
import { useAuth } from '@hooks'

// utils
import swal from '@utilities/swal'

function Attendants () {
  const { auth } = useAuth()
  const { metaActions, metaStates } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const attendants = {
    ...metaStates('attendants', ['list', 'count']),
    ...metaActions('attendants', ['fetch', 'create', 'patch'])
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(false)

  const formRef = useRef(null)

  useEffect(() => {
    loadAttendants()
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

  const loadAttendants = async (data = null) => {
    setIsDataLoading(true)
    const filters = [
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

    await attendants.fetch({
      filters,
      is_count: true,
      pagination,
      sort,
      aggregate: [
        {
          table: 'authentications',
          filters: [
            {
              field: 'attendant_id',
              key: 'id'
            }
          ],
          is_first: true,
          columns: ['status', 'username']
        }
      ]
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
      var response = await attendants.patch({
        key: 'id',
        data: {
          id: updateData.id,
          ...obj
        }
      })
    } else {
      obj.admin_id = auth.id
      var response = await attendants.create(obj)
    }

    setUpdateData(null)
    setIsLoading(false)
    setShowCreateModal(false)
    formRef.current.reset()
    loadAttendants()

    if (response.error) {
      swal.error({
        title: 'Error',
        text: error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: `Attendant ${updateData ? 'updated' : 'created'} successfully!`
    })
  }
  
  const handleBulkDelete = async (ids, reset) => {
    swal.prompt({
      text: 'Are you sure you want to delete this?',
      async onConfirm () {
        try {
          await Promise.all(
            ids.map(id => {
              return attendants.patch({
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
      <Title title="Manage Attendant" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={attendants.list}
          selectedValue="id"
          totalRowsCount={attendants.count}
          onRefresh={() => loadAttendants()}
          onDelete={async (ids, reset) => handleBulkDelete(ids, reset)}
          onRowClick={row => setUpdateData(row)}
          onPageChance={value => setPage(value)}
          onCreate={() => {
            setUpdateData(null)
            setShowCreateModal(true)
          }}
          onSearch={data => loadAttendants(data)}
          isLoading={isDataLoading}
          itemsPerPage={pagination.rows}
        />
      </div>

      <Modal
        visible={showCreateModal}
        title={`${updateData ? 'Update' : 'Create'} Attendant`}
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

export default Attendants