import { useEffect, useState } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'

// import utils
import { formatWithCurrency } from '@utilities/helper'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'
import Loading from '@components/base/Loading'

// hooks
import { useAuth } from '@hooks'

// composable
import { headers } from '@composable/transactions'
import { filters } from '@composable/filters'

function Transactions () {
  const { auth } = useAuth()
  const { metaActions, metaStates } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const transactions = {
    ...metaStates('transactions', ['list', 'count']),
    ...metaActions('transactions', ['fetch'])
  }

  const [isDataLoading, setIsDataLoading] = useState(false)

  useEffect(() => {
    loadTransactions()
  }, [page])

  const loadTransactions = async (data = null) => {
    setIsDataLoading(true)
    const filters = [
      {
        field: 'deleted_at',
        value: 'null'
      }
    ]

    if (data) {
      filters.push(...[
        {
          field: 'status',
          operator: 'like',
          value: data
        }
      ])
    }

    await transactions.fetch({
      filters,
      columns: ['id', 'record_id', 'status', 'amount'],
      aggregate: [
        {
          table: 'records',
          filters: [
            {
              field: 'id',
              key: 'record_id'
            }
          ],
          is_first: true,
          columns: ['medication', 'diagnosis', 'patient_id', 'doctor_id'],
          aggregate: [
            {
              table: 'patients',
              filters: [
                {
                  field: 'id',
                  key: 'patient_id'
                }
              ],
              is_first: true,
              columns: ['first_name', 'last_name'],
            }
          ]
        }
      ],
      is_count: true,
      pagination,
      sort
    })

    setIsDataLoading(false)
  }

  return (
    <div className="transactions">
      <Title title="Transactions" />

      <div className="flex-1">
        <Table
          headers={headers()}
          rows={transactions.list}
          selectedValue="id"
          totalRowsCount={transactions.count}
          disableButton
          onPageChance={page => setPage(page)}
          onRefresh={() => loadTransactions()}
          itemsPerPage={pagination.rows}
          onSearch={data => loadTransactions(data)}
          isLoading={isDataLoading}
          disableAllActions
        />
      </div>
    </div>
  )
}

export default Transactions