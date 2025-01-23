import { useEffect } from 'react'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/patients'

function Patients () {
  const data = [
    { id: 1, first_name: 'Patient', last_name: 'Patient 1', age: 21, gender: 'M', birth_date: new Date().toDateString(), address: 'Address 1', created_at: new Date().toISOString() },
    { id: 2, first_name: 'Patient', last_name: 'Patient 2', age: 67, gender: 'F', birth_date: new Date().toDateString(), address: 'Address 2', created_at: new Date().toISOString() },
    { id: 3, first_name: 'Patient', last_name: 'Patient 3', age: 48, gender: 'M', birth_date: new Date().toDateString(), address: 'Address 3', created_at: new Date().toISOString() },
    { id: 4, first_name: 'Patient', last_name: 'Patient 4', age: 25, gender: 'F', birth_date: new Date().toDateString(), address: 'Address 4', created_at: new Date().toISOString() },
    { id: 5, first_name: 'Patient', last_name: 'Patient 5', age: 32, gender: 'F', birth_date: new Date().toDateString(), address: 'Address 5', created_at: new Date().toISOString() },
    { id: 6, first_name: 'Patient', last_name: 'Patient 6', age: 17, gender: 'M', birth_date: new Date().toDateString(), address: 'Address 6', created_at: new Date().toISOString() },
  ]

  return (
    <div className="patients">
      <Title title="Manage Patients" />

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

export default Patients