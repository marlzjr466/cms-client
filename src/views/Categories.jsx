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
import { headers } from '@composable/categories'
import { filters } from '@composable/filters'

// utils
import swal from '@utilities/swal'

function Categories () {
  const { auth } = useAuth()
  const { metaActions, metaStates } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const categories = {
    ...metaStates('categories', ['list', 'count']),
    ...metaActions('categories', ['fetch', 'create', 'patch'])
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(false)

  const formRef = useRef(null)

  useEffect(() => {
    loadCategories()
  }, [page])

  useEffect(() => {
    if (updateData) {
      setShowCreateModal(true)
    }
  }, [updateData])

  useEffect(() => {
    if (showCreateModal && updateData) {
      formRef.current.querySelector('[name="name"]').value = updateData.name
    }
  }, [showCreateModal])

  const loadCategories = async (data = null) => {
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
          field: 'name',
          operator: 'like',
          value: data
        }
      ]
    }

    await categories.fetch({
      filters,
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
      var response = await categories.patch({
        key: 'id',
        data: {
          id: updateData.id,
          ...obj
        }
      })
    } else {
      obj.admin_id = auth.id
      var response = await categories.create(obj)
    }

    setUpdateData(null)
    setIsLoading(false)
    setShowCreateModal(false)
    formRef.current.reset()
    loadCategories()

    if (response.error) {
      swal.error({
        title: 'Error',
        text: error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: `Category ${updateData ? 'updated' : 'created'} successfully!`
    })
  }

  const handleBulkDelete = async (ids, reset) => {
    swal.prompt({
      text: 'Are you sure you want to delete this?',
      async onConfirm () {
        try {
          await Promise.all(
            ids.map(id => {
              return categories.patch({
                key: 'id',
                data: {
                  id,
                  deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              })
            })
          )
          
          reset()
          loadCategories()
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
    <div className="categories">
      <Title title="Manage Categories" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={categories.list}
          selectedValue="id"
          totalRowsCount={categories.count}
          onDelete={async (ids, reset) => handleBulkDelete(ids, reset)}
          onRefresh={() => loadCategories()}
          onRowClick={row => setUpdateData(row)}
          onPageChance={value => setPage(value)}
          onCreate={() => {
            setUpdateData(null)
            setShowCreateModal(true)
          }}
          onSearch={data => loadCategories(data)}
          isLoading={isDataLoading}
        />
      </div>

      <Modal
        visible={showCreateModal}
        title={`${updateData ? 'Update' : 'Create'} Category`}
        onClose={() => {
          setUpdateData(null)
          setShowCreateModal(false)
        }}
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required autoComplete="off" />
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

export default Categories