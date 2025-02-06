import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import moment from 'moment'

// components
import Modal from '@components/Modal'
import SideModal from '@components/SideModal'
import Title from '@components/base/Title'
import Table from '@components/base/Table'
import Loading from '@components/base/Loading'

// hooks
import { useAuth } from '@hooks'

// composable
import { headers } from '@composable/products'
import { filters } from '@composable/filters'

// utils
import swal from '@utilities/swal'

function Products () {
  const { auth } = useAuth()
  const { metaActions, metaStates } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const categories = {
    ...metaStates('categories', ['list', 'count']),
    ...metaActions('categories', ['fetch'])
  }

  const products = {
    ...metaStates('products', ['list', 'count']),
    ...metaActions('products', ['fetch', 'create', 'patch'])
  }

  const productVariants = {
    ...metaStates('variants', ['list', 'count']),
    ...metaActions('variants', ['fetch', 'create', 'patch'])
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVariantLoading, setIsVariantLoading] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [updateVariantData, setUpdateVariantData] = useState(null)
  const [row, setRow] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [showVariantModal, setShowVariantModal] = useState(false)

  const formRef = useRef(null)
  const formVariantRef = useRef(null)

  useEffect(() => {
    loadCategories()
  }, [])
  
  useEffect(() => {
    loadProducts()
  }, [page])

  useEffect(() => {
    if (updateData) {
      setShowCreateModal(true)
    }
  }, [updateData])

  useEffect(() => {
    if (row) {
      loadVariants()
    }
  }, [row])

  useEffect(() => {
    if (showCreateModal && updateData) {
      formRef.current.querySelector('[name="category_id"]').value = updateData.category_id
      formRef.current.querySelector('[name="name"]').value = updateData.name
      formRef.current.querySelector('[name="description"]').value = updateData.description
    }
  }, [showCreateModal])

  const loadVariants = async () => {
    await productVariants.fetch({
      filters: [
        {
          field: 'product_id',
          value: row.id
        },
        {
          field: 'name',
          operator: '!=',
          value: 'def_var'
        },
        {
          field: 'deleted_at',
          value: 'null'
        }
      ]
    })
  }

  const loadCategories = async () => {
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

    await categories.fetch({
      filters,
      is_count: true,
      pagination,
      sort,
    })
  }

  const loadProducts = async (data = null) => {
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
        },
        {
          field: 'description',
          operator: 'like',
          value: data
        }
      ]
    }

    await products.fetch({
      filters,
      aggregate: [
        {
          table: 'product_categories',
          filters: [
            {
              field: 'id',
              key: 'category_id'
            }
          ],
          is_first: true,
          columns: ['name']
        },
        {
          table: 'product_variants',
          filters: [
            {
              field: 'product_id',
              key: 'id'
            }
          ],
          columns: ['id', 'name']
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
      var response = await products.patch({
        key: 'id',
        data: {
          id: updateData.id,
          ...obj
        }
      })
    } else {
      obj.admin_id = auth.id
      var response = await products.create(obj)
    }

    setUpdateData(null)
    setIsLoading(false)
    setShowCreateModal(false)
    formRef.current.reset()
    loadProducts()

    if (response.error) {
      swal.error({
        title: 'Error',
        text: error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: `Product ${updateData ? 'updated' : 'created'} successfully!`
    })
  }

  const handleBulkDelete = async (ids, reset) => {
    swal.prompt({
      text: 'Are you sure you want to delete this?',
      async onConfirm () {
        try {
          await Promise.all(
            ids.map(id => {
              return products.patch({
                key: 'id',
                data: {
                  id,
                  deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              })
            })
          )
          
          reset()
          loadProducts()
          swal.success()
        } catch (error) {
          swal.error({
            text: error.message
          })
        }
      }
    })
  }

  const handleSubmitVariant = async e => {
    e.preventDefault() // Prevent page refresh
    setIsVariantLoading(true)

    // Use FormData to access the submitted values
    const formData = new FormData(formVariantRef.current)
    const obj = Object.fromEntries(formData.entries())

    if (updateVariantData) {
      var response = await productVariants.patch({
        key: 'id',
        data: {
          id: updateVariantData.id,
          ...obj
        }
      })
    } else {
      obj.product_id = row.id
      var response = await productVariants.create(obj)
    }

    setUpdateVariantData(null)
    setIsVariantLoading(false)
    setShowVariantModal(false)
    formVariantRef.current.reset()
    loadVariants()

    if (response.error) {
      swal.error({
        title: 'Error',
        text: error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: `Variant ${updateData ? 'updated' : 'added'} successfully!`,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 2000
    })
  }

  return (
    <div className="products">
      <Title title="Manage Products" />

      <div className="flex-1">
        {
          !categories.count ? (
            <span className="info">
              <i className="fas fa-circle-info"></i>
              Create product category first before adding products.
            </span>
          ) : (
            <Table
              headers={headers()}
              rows={products.list}
              selectedValue="id"
              totalRowsCount={products.count}
              onDelete={async (ids, reset) => handleBulkDelete(ids, reset)}
              onRefresh={() => loadProducts()}
              onRowClick={row => setUpdateData(row)}
              onPageChance={value => setPage(value)}
              onCreate={() => {
                setUpdateData(null)
                setShowCreateModal(true)
              }}
              onSearch={data => loadProducts(data)}
              isLoading={isDataLoading}
              actions={[
                {
                  label: 'View',
                  onAction: item => setRow(item)
                }
              ]}
            />
          )
        }
      </div>

      <Modal
        visible={showCreateModal}
        title={`${updateData ? 'Update' : 'Create'} Product`}
        onClose={() => {
          setUpdateData(null)
          setShowCreateModal(false)
        }}
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category</label>
            <select name="category_id" required>
              <option value="">&nbsp;&nbsp;&nbsp;Select here</option>
              {
                categories.list.map((list, index) => (
                  <option key={index} value={list.id}>&nbsp;&nbsp;&nbsp;{list.name}</option>
                ))
              }
            </select>
            <span>
              <i className="fa fa-angle-down" aria-hidden="true"></i>
            </span>
          </div>

          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" required autoComplete="off" />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required />
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

      <SideModal
        visible={row !== null}
        title={`${row?.name} » ${row?.product_categories.name}`}
        onClose={() => setRow(null)}
      >
        <div className="product-info">
          <div className="buttons">
            <button className="btn info" onClick={() => setShowVariantModal(true)}>+ Add Variant</button>
            <button className="btn info">+ Add Item</button>
          </div>

          <div className="desc">
            <span>Description:</span>
            {row?.description}
          </div>

          <div className="body">
            <ul className="tab">
              <li className="active">All</li>

              {
                productVariants.list.map((item, index) => (
                  <li key={index}>{item.name}</li>
                ))
              }
            </ul>
            
            <div className="table">

            </div>
          </div>

          <Modal
            visible={showVariantModal}
            title="Add Variant"
            onClose={() => setShowVariantModal(false)}
          >
            <form ref={formVariantRef} onSubmit={handleSubmitVariant}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" required autoComplete="off" />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className={`submit ${isVariantLoading ? 'disabled' : ''}`}
                  disabled={isVariantLoading}
                >
                  {
                    isVariantLoading ? <Loading size={20} thick={3} auto noBackground /> : (updateData ? 'Update' : 'Add')
                  }
                </button>
              </div>
            </form>
          </Modal>
        </div>
      </SideModal>
    </div>
  )
}

export default Products