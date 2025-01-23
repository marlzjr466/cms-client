import { useEffect } from 'react'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/users'

const data = [
  { id: 1, name: 'John Doe', phone_number: '09123456789', role: 'Attendant', status: 'Offline', created_at: new Date().toISOString() },
  { id: 2, name: 'Jane Smith', phone_number: '09123456789', role: 'Doctor', status: 'Offline', created_at: new Date().toISOString() },
  { id: 3, name: 'Bob Johnson', phone_number: '09123456789', role: 'Doctor', status: 'Offline', created_at: new Date().toISOString() },
  { id: 4, name: 'Alice Brown', phone_number: '09123456789', role: 'Attendant', status: 'Offline', created_at: new Date().toISOString() },
  { id: 5, name: 'Charlie White', phone_number: '09123456789', role: 'Doctor', status: 'Offline', created_at: new Date().toISOString() },
  { id: 6, name: 'Eve Black', phone_number: '09123456789', role: 'Attendant', status: 'Offline', created_at: new Date().toISOString() },
]

function Users () {

  return (
    <div className="users">
      <Title title="Manage Staff" />

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

export default Users