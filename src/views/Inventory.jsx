import { useEffect } from 'react'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/inventory'

function Inventory () {
  const data = [
    { id: 1, name: 'Product 1', description: 'This is product 1', status: 'Active', created_at: new Date().toISOString() },
    { id: 2, name: 'Product 1', description: 'This is product 2', status: 'Active', created_at: new Date().toISOString() },
    { id: 3, name: 'Product 1', description: 'This is product 3', status: 'Active', created_at: new Date().toISOString() },
    { id: 4, name: 'Product 1', description: 'This is product 4', status: 'Active', created_at: new Date().toISOString() },
    { id: 5, name: 'Product 1', description: 'This is product 5', status: 'Active', created_at: new Date().toISOString() },
    { id: 6, name: 'Product 1', description: 'This is product 6', status: 'Active', created_at: new Date().toISOString() },
    { id: 7, name: 'Product 1', description: 'This is product 7', status: 'Active', created_at: new Date().toISOString() },
    { id: 8, name: 'Product 1', description: 'This is product 8', status: 'Active', created_at: new Date().toISOString() },
    { id: 9, name: 'Product 1', description: 'This is product 9', status: 'Active', created_at: new Date().toISOString() },
    { id: 10, name: 'Product 1', description: 'This is product 10', status: 'Active', created_at: new Date().toISOString() },
    { id: 11, name: 'Product 1', description: 'This is product 11', status: 'Active', created_at: new Date().toISOString() },
    { id: 12, name: 'Product 1', description: 'This is product 12', status: 'Active', created_at: new Date().toISOString() },
    { id: 13, name: 'Product 1', description: 'This is product 13', status: 'Active', created_at: new Date().toISOString() },
    { id: 14, name: 'Product 1', description: 'This is product 14', status: 'Active', created_at: new Date().toISOString() },
    { id: 15, name: 'Product 1', description: 'This is product 15', status: 'Active', created_at: new Date().toISOString() },
    { id: 16, name: 'Product 1', description: 'This is product 16', status: 'Active', created_at: new Date().toISOString() },
    { id: 17, name: 'Product 1', description: 'This is product 17', status: 'Active', created_at: new Date().toISOString() },
  ]

  return (
    <div className="inventory">
      <Title title="Manage Inventory" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={data}
          selectedValue="id"
          totalRowsCount={data.length}
          onSelect={selected => {
            console.log('selected:', selected)
          }}
          onRowClick={row => {
            console.log('row:', row)
          }}
          onPageChance={page => {
            console.log('page:', page)
          }}
        />
      </div>
    </div>
  )
}

export default Inventory