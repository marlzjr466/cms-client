import { useEffect } from 'react'

// import utils
import { formatWithCurrency } from '@utilities/helper'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

// composable
import { headers } from '@composable/transactions'

function Transactions () {
  const data = [
    { id: 1, created_at: new Date().toLocaleString(), patient: 'Patient 1', diagnosis: 'Daignosis 1', prescription: 'Prescription 1', amount: formatWithCurrency(100), status: 'Completed' },
    { id: 2, created_at: new Date().toLocaleString(), patient: 'Patient 2', diagnosis: 'Daignosis 2', prescription: 'Prescription 2', amount: formatWithCurrency(142), status: 'Completed' },
    { id: 3, created_at: new Date().toLocaleString(), patient: 'Patient 3', diagnosis: 'Daignosis 3', prescription: 'Prescription 3', amount: formatWithCurrency(231), status: 'Completed' },
    { id: 4, created_at: new Date().toLocaleString(), patient: 'Patient 4', diagnosis: 'Daignosis 4', prescription: 'Prescription 4', amount: formatWithCurrency(233), status: 'Completed' },
    { id: 5, created_at: new Date().toLocaleString(), patient: 'Patient 5', diagnosis: 'Daignosis 5', prescription: 'Prescription 5', amount: formatWithCurrency(521), status: 'Completed' },
    { id: 6, created_at: new Date().toLocaleString(), patient: 'Patient 6', diagnosis: 'Daignosis 6', prescription: 'Prescription 6', amount: formatWithCurrency(789), status: 'Completed' },
    { id: 7, created_at: new Date().toLocaleString(), patient: 'Patient 7', diagnosis: 'Daignosis 7', prescription: 'Prescription 7', amount: formatWithCurrency(983), status: 'Completed' },
    { id: 8, created_at: new Date().toLocaleString(), patient: 'Patient 8', diagnosis: 'Daignosis 8', prescription: 'Prescription 8', amount: formatWithCurrency(123), status: 'Completed' },
    { id: 9, created_at: new Date().toLocaleString(), patient: 'Patient 9', diagnosis: 'Daignosis 9', prescription: 'Prescription 9', amount: formatWithCurrency(279), status: 'Completed' },
    { id: 10, created_at: new Date().toLocaleString(), patient: 'Patient 10', diagnosis: 'Daignosis 10', prescription: 'Prescription 10', amount: formatWithCurrency(700), status: 'Completed' },
  ]

  return (
    <div className="patients">
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
        />
      </div>
    </div>
  )
}

export default Transactions