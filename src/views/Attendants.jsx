import { useEffect } from 'react'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/users'

const data = [
  { id: 1, first_name: 'John', last_name: 'Doe', phone_number: '09123456789', status: 'Offline', created_at: new Date().toISOString() },
  { id: 2, first_name: 'Jane', last_name: 'Smith', phone_number: '09123456789', status: 'Offline', created_at: new Date().toISOString() },
  { id: 3, first_name: 'Bob', last_name: 'Johnson', phone_number: '09123456789', status: 'Offline', created_at: new Date().toISOString() },
  { id: 4, first_name: 'Alice', last_name: 'Brown', phone_number: '09123456789', status: 'Offline', created_at: new Date().toISOString() },
  { id: 5, first_name: 'Charlie', last_name: 'White', phone_number: '09123456789', status: 'Offline', created_at: new Date().toISOString() },
  { id: 6, first_name: 'Eve', last_name: 'Black', phone_number: '09123456789', status: 'Offline', created_at: new Date().toISOString() },
]

function Attendants () {

  return (
    <div className="users">
      <Title title="Manage Attendant" />

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

export default Attendants