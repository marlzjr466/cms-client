import { useEffect, useState, useRef } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import { useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import _ from 'lodash'

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
import { headers as productItemHeaders } from '@composable/product-items'
import { filters } from '@composable/filters'

// utils
import swal from '@utilities/swal'
import { sleep } from '@utilities/helper'

function Products () {
  const navigate = useNavigate()
  const urlParams = useParams()
  
  const { auth } = useAuth()
  const { metaActions, metaStates } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const categories = {
    ...metaStates('categories', ['list', 'count']),
    ...metaActions('categories', ['fetch', 'create', 'find'])
  }

  const products = {
    ...metaStates('products', ['list', 'count']),
    ...metaActions('products', ['fetch', 'create', 'patch'])
  }

  const productVariants = {
    ...metaStates('variants', ['list', 'count']),
    ...metaActions('variants', ['fetch', 'create', 'patch'])
  }

  const productItems = {
    ...metaStates('product-items', ['list', 'count']),
    ...metaActions('product-items', ['fetch', 'create', 'patch'])
  }

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isVariantLoading, setIsVariantLoading] = useState(false)
  const [updateData, setUpdateData] = useState(null)
  const [updateVariantData, setUpdateVariantData] = useState(null)
  const [updateItemData, setUpdateItemData] = useState(null)
  const [row, setRow] = useState(null)
  const [isDataLoading, setIsDataLoading] = useState(false)
  const [showVariantModal, setShowVariantModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [isImportLoading, setIsImportLoading] = useState(false)
  const [productItmesPage, setProductItemsPage] = useState(1)

  const formRef = useRef(null)
  const formVariantRef = useRef(null)
  const formItemRef = useRef(null)

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

    if (updateItemData) {
      setShowItemModal(true)
    }

    if (updateVariantData) {
      setShowVariantModal(true)
    }
  }, [updateData, updateItemData, updateVariantData])

  useEffect(() => {
    if (row) {
      loadVariants()
    }
  }, [row])

  useEffect(() => {
    if (row) {
      loadItems()
    }
  }, [urlParams])

  useEffect(() => {
    if (showCreateModal && updateData) {
      formRef.current.querySelector('[name="category_id"]').value = updateData.category_id
      formRef.current.querySelector('[name="name"]').value = updateData.name
      formRef.current.querySelector('[name="description"]').value = updateData.description
    }

    if (showItemModal && updateItemData) {
      if (updateItemData.product_variants) {
        formItemRef.current.querySelector('[name="variant_id"]').value = updateItemData.product_variants.id
      }

      formItemRef.current.querySelector('[name="stock"]').value = updateItemData.stock
      formItemRef.current.querySelector('[name="name"]').value = updateItemData.name
      formItemRef.current.querySelector('[name="price"]').value = updateItemData.price
      formItemRef.current.querySelector('[name="expired_at"]').value = moment(updateItemData.expired_at).format('YYYY-MM-DD')
    }

    if (showVariantModal && updateVariantData) {
      formVariantRef.current.querySelector('[name="name"]').value = updateVariantData.name
    }
  }, [showCreateModal, showItemModal, showVariantModal])

  const loadItems = async (data = null) => {
    const filters = [
      {
        field: 'product_id',
        value: row.id
      },
      {
        field: 'deleted_at',
        value: 'null'
      }
    ]

    if (data) {
      filters.push(...[
        {
          field: 'name',
          operator: 'like',
          value: data
        }
      ])
    }

    if (urlParams.tab !== 'all') {
      const variant = productVariants.list.find(x => getSlug(x.name) === urlParams.tab)
      if (variant) {
        filters.push({
          field: 'variant_id',
          value: variant.id
        })
      }
    }

    await productItems.fetch({
      filters,
      aggregate: [
        {
          table: 'product_variants',
          filters: [
            {
              field: 'id',
              key: 'variant_id'
            }
          ],
          is_first: true,
          columns: ['id', 'name']
        }
      ],
      is_count: true,
      pagination: {
        ...pagination,
        page: productItmesPage
      },
      sort: [
        ...sort,
        { field: 'id', direction: 'desc' }
      ]
    })
  }

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
      ],
      is_count: true
    })
  }

  const loadCategories = async () => {
    await categories.fetch({
      is_count: true,
      filters: [
        {
          field: 'admin_id',
          value: auth.id
        },
        {
          field: 'deleted_at',
          value: 'null'
        }
      ]
    })
  }

  const loadProducts = async (data = null) => {
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
          field: 'name',
          operator: 'like',
          value: data
        },
        {
          field: 'id',
          operator: 'orlike',
          value: data
        },
        {
          field: 'description',
          operator: 'orlike',
          value: data
        }
      ])
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
      sort: [
        ...sort,
        { field: 'id', direction: 'desc' }
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
      text: 'Are you sure you want to delete this products?',
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
      text: `Variant ${updateVariantData ? 'updated' : 'added'} successfully!`,
      showConfirmButton: false,
      timer: 2000,
      position: 'bottom-end'
    })
  }

  const handleSubmitItem = async e => {
    e.preventDefault() // Prevent page refresh
    setIsVariantLoading(true)

    // Use FormData to access the submitted values
    const formData = new FormData(formItemRef.current)
    const obj = Object.fromEntries(formData.entries())

    if (updateItemData) {
      var response = await productItems.patch({
        key: 'id',
        data: {
          id: updateItemData.id,
          ...obj
        }
      })
    } else {
      obj.product_id = row.id
      var response = await productItems.create(obj)
    }

    setUpdateItemData(null)
    setIsVariantLoading(false)
    setShowItemModal(false)
    formItemRef.current.reset()
    loadItems()

    if (response.error) {
      swal.error({
        title: 'Error',
        text: error.message
      })
    }
    
    swal.success({
      title: 'Success',
      text: `Item ${updateData ? 'updated' : 'added'} successfully!`,
      showConfirmButton: false,
      timer: 2000,
      position: 'bottom-end'
    })
  }

  const handleItemBulkDelete = async (ids, reset) => {
    swal.prompt({
      text: 'Are you sure you want to delete this items?',
      async onConfirm () {
        try {
          await Promise.all(
            ids.map(id => {
              return productItems.patch({
                key: 'id',
                data: {
                  id,
                  deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }
              })
            })
          )
          
          reset()
          loadItems()
          swal.success()
        } catch (error) {
          swal.error({
            text: error.message
          })
        }
      }
    })
  }

  const handleVariantDelete = async (id) => {
    swal.prompt({
      text: 'Are you sure you want to delete this variant?',
      async onConfirm () {
        try {
          productVariants.patch({
            key: 'id',
            data: {
              id,
              deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
            }
          })
          
          loadVariants()
          swal.success().then(() => {
            setRow(null)
            navigate('/products')
          })
        } catch (error) {
          swal.error({
            text: error.message
          })
        }
      }
    })
  }

  const getSlug = tab => {
    return tab.split(' ').join('-').toLowerCase()
  }

  const removeDuplicates = arr => [...new Set(arr)].filter(Boolean)

  // Extract name, dosage, volume, and brand
  const extractProductInfo = str => {
    const match = str.match(/^([\w\s\-]+?)\s([\d]+\s?(?:mg|g)?)?\s?(?:\((.*?)\))?\s?,?\s?([\d]+\s?mL)?$/)

    return {
      name: match?.[1]?.trim() || null,
      dosage: match?.[2]?.replace(/\s+/g, '') || null,
      brand: match?.[3]?.trim() || null,
      volume: match?.[4]?.replace(/\s+/g, '') || null
    }
  }

  const isNumberStrict = str => Number.isFinite(Number(str))
  const handleImport = async data => {
    try {
      if (!data.list.length) {
        throw new Error('No data in the file can be imported.')
      }
      
      setIsImportLoading(true)
      const normalizeCategory = (category) => category.replace(/\s*\/\s*/g, "/")
      const groupedByCategory = _.groupBy(data.list, (item) => normalizeCategory(item.category))
      const nestedGrouping = _.mapValues(groupedByCategory, (items) =>
        _.groupBy(items, (item) => item.name.match(/^[^\d]+/)?.[0].trim())
      )
      
      let importedCategories = []
      for (const item of Object.keys(nestedGrouping)) {
        const category = item || 'Others'
        importedCategories = [
          ...importedCategories,
          {
            admin_id: auth.admin_id,
            name: category
          }
        ]
      }

      // filter existing category
      importedCategories = importedCategories.filter(ic => !categories?.list.find(x => x.name === ic.name))
      if (importedCategories.length) {
        const res = await categories.create(importedCategories)

        if (res.error) {
          setIsImportLoading(false)
          throw new Error(res.error.message)
        }

        await loadCategories()
        await sleep(300)
      }

      for await (const item of Object.keys(nestedGrouping)) {
        const category = await categories.find({
          is_first: true,
          filters: [
            { field: 'name', value: item },
            {
              field: 'admin_id',
              value: auth.id
            }
          ]
        })

        if (category.error) {
          setIsImportLoading(false)
          throw new Error(category.error.message)
        }

        for await (const productName of Object.keys(nestedGrouping[item])) {
          const [productId] = await products.create({
            admin_id: auth.admin_id,
            category_id: category.id,
            name: productName.replace(/,/g, '')
          })

          await productItems.create(
            nestedGrouping[item][productName].map(productItem => {
              const stock = productItem.in_stock_fammed_pharmac &&
                isNumberStrict(productItem.in_stock_fammed_pharmac) && 
                parseInt(productItem.in_stock_fammed_pharmac) > 0
                  ? parseInt(productItem.in_stock_fammed_pharmac)
                  : 0

              const price = productItem.default_price &&
                isNumberStrict(productItem.default_price) &&
                parseFloat(productItem.default_price) > 0
                  ? parseInt(productItem.default_price)
                  : 0

              return {
                product_id: productId,
                name: productItem.name.replace(/,/g, ''),
                sku: productItem.sku,
                price,
                stock
              }
            })
          )
        }
      }

      await loadProducts()
      setIsImportLoading(false)
      swal.success({
        title: 'Success',
        text: 'Products imported successfully!'
      })
    } catch (error) {
      swal.error({
        text: error.message
      })
    }
  }

  const getVariantOption = () => {
    if (urlParams.tab !== 'all') {
      const variant = productVariants.list.find(x => getSlug(x.name) === urlParams.tab)
      return variant?.id || ''
    }

    return ''
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
              onDelete={(ids, reset) => handleBulkDelete(ids, reset)}
              onRefresh={() => loadProducts()}
              onRowClick={row => setUpdateData(row)}
              onPageChance={value => setPage(value)}
              enableImport
              isImportLoading={isImportLoading}
              onImport={handleImport}
              onCreate={() => {
                setUpdateData(null)
                setShowCreateModal(true)
              }}
              onSearch={data => {
                setPage(1)
                loadProducts(data)
              }}
              isLoading={isDataLoading}
              itemsPerPage={pagination.rows}
              actions={[
                {
                  label: 'View',
                  onAction: item => {
                    setProductItemsPage(1)
                    setRow(item)
                    navigate(`${item.id}/all`)
                  }
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
                categories?.list?.map((list, index) => (
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
        visible={urlParams.id}
        title={`${row?.name} - ${row?.product_categories.name}`}
        onClose={() => {
          setRow(null)
          navigate('/products')
        }}
      >
        <div className="product-info">
          <div className="buttons">
            <button className="btn info" onClick={() => setShowVariantModal(true)}>
              <i className="fas fa-plus"></i>
              Add New Variant
            </button>

            {
              urlParams.tab !== 'all' && (
                <>
                  <button className="btn warning" onClick={() => {
                    const variant = productVariants.list.find(x => getSlug(x.name) === urlParams.tab)
                    setUpdateVariantData(variant)
                  }}>
                    <i className="fas fa-pencil"></i>
                    Update Variant
                  </button>
                  
                  {
                    !productItems.count ? (
                      <button className="btn danger" onClick={() => {
                        const variant = productVariants.list.find(x => getSlug(x.name) === urlParams.tab)
                        handleVariantDelete(variant.id)
                      }}>
                        <i className="fas fa-trash"></i>
                        Delete Variant
                      </button>
                    ) : null
                  }
                </>
              )
            }
          </div>

          <div className="desc">
            <span>Description:</span>
            {row?.description || '---'}
          </div>

          <div className="body">
            <ul className="tab">
              <li
                className={'all' === urlParams.tab ? 'active' : ''}
                onClick={() => navigate(`/products/${row?.id}/all`)}
              >
                All
              </li>

              {
                productVariants.list.map((item, index) => (
                  <li
                    key={index}
                    onClick={() => navigate(`/products/${row?.id}/${getSlug(item.name)}`)}
                    className={getSlug(item.name) === urlParams.tab ? 'active' : ''}
                  >
                    {item.name}
                  </li>
                ))
              }
            </ul>
            
            <div className="content-table">
              <Table
                headers={productItemHeaders()}
                rows={productItems.list}
                selectedValue="id"
                totalRowsCount={productItems.count}
                onDelete={(ids, reset) => handleItemBulkDelete(ids, reset)}
                onRefresh={() => loadItems()}
                onRowClick={row => setUpdateItemData(row)}
                onPageChance={value => setProductItemsPage(value)}
                onCreate={() => {
                  setUpdateItemData(null)
                  setShowItemModal(true)
                }}
                onSearch={data => loadItems(data)}
                isLoading={false}
                itemsPerPage={pagination.rows}
              />
            </div>
          </div>

          <Modal
            visible={showVariantModal}
            title={`${updateVariantData ? 'Update' : 'Add'} Variant`}
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
                    isVariantLoading ? <Loading size={20} thick={3} auto noBackground /> : (updateVariantData ? 'Update' : 'Add')
                  }
                </button>
              </div>
            </form>
          </Modal>

          <Modal
            visible={showItemModal}
            title={`${updateItemData ? 'Update' : 'Add'} Item`}
            onClose={() => {
              setUpdateItemData(null)
              setShowItemModal(false)
            }}
          >
            <form ref={formItemRef} onSubmit={handleSubmitItem}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" name="name" required autoComplete="off" />
              </div>

              {
                productVariants.count ? (
                  <div className="form-group">
                    <label>Variant</label>
                    <select name="variant_id" defaultValue={getVariantOption()} required>
                      <option value="">&nbsp;&nbsp;&nbsp;Select here</option>
                      {
                        productVariants.list.map(item => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            &nbsp;&nbsp;&nbsp;{item.name}
                          </option>
                        ))
                      }
                    </select>
                    <span>
                      <i className="fa fa-angle-down" aria-hidden="true"></i>
                    </span>
                  </div>
                ) : null
              }

              <div className="form-group">
                <label>Price</label>
                <input type="number" name="price" min="0" required autoComplete="off" />
              </div>

              <div className="form-group">
                <label>Stock</label>
                <input type="number" name="stock" min="0" required autoComplete="off" />
              </div>

              <div className="form-group">
                <label>Expiry Date</label>
                <input type="date" name="expired_at" required autoComplete="off" />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className={`submit ${isVariantLoading ? 'disabled' : ''}`}
                  disabled={isVariantLoading}
                >
                  {
                    isVariantLoading ? <Loading size={20} thick={3} auto noBackground /> : (updateItemData ? 'Update' : 'Add')
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