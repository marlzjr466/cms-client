import { useEffect } from 'react'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/inventory'
import { filters } from '@composable/filters'

function Inventory () {
  const { setPage, pagination, sort, page } = filters()
  const data = []

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
          itemsPerPage={pagination.rows}
        />
      </div>
    </div>
  )
}

export default Inventory