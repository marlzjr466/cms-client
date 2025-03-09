import { useEffect } from 'react'

// import utils
import { formatWithCurrency } from '@utilities/helper'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/transactions'

function Transactions () {
  const data = []

  return (
    <div className="transactions">
      <Title title="Transactions" />

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
          itemsPerPage={pagination.rows}
        />
      </div>
    </div>
  )
}

export default Transactions