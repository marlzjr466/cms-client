import { useEffect } from 'react'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/patients'

function Patients () {
  const data = []

  return (
    <div className="patients">
      <Title title="Manage Patients" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={data}
          selectedValue="id"
          totalRowsCount={data.length}
          disableButton
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