import { useEffect, useState, useCallback } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import moment from 'moment'
import _ from 'lodash'

// import utils
import { formatWithCurrency } from '@utilities/helper'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'
import Loading from '@components/base/Loading'
import SideModal from '@components/SideModal'

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
  const [selected, setSelected] = useState(null)

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
      columns: ['id', 'record_id', 'status', 'amount', 'created_at', 'consultation_price', 'products_metadata'],
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
            },
            {
              table: 'doctors',
              filters: [
                {
                  field: 'id',
                  key: 'doctor_id'
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

  const subTotal = useCallback(() => {
    if (!selected) {
      return 0
    }

    return selected?.products_metadata.reduce((acc, cur) => acc + (cur.quantity * cur.price), 0)
  }, [selected])

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
          onRowClick={row => setSelected(row)}
          onRefresh={() => loadTransactions()}
          itemsPerPage={pagination.rows}
          onSearch={data => loadTransactions(data)}
          isLoading={isDataLoading}
          disableAllActions
        />
      </div>

      <SideModal
        visible={selected !== null}
        title="Transaction (CMS-0001)"
        onClose={() => setSelected(null)}
      >
        <div className="txn-info">
          <div className="txn-info-item">
            <span>Date</span>
            {moment(selected?.created_at).format('MMM DD, YYYY')}
          </div>

          <div className="txn-info-item">
            <span>Fullname</span>
            {[selected?.records.patients.first_name, selected?.records.patients.last_name].join(' ')}
          </div>

          <div className="txn-info-item">
            <span>Status</span>
            {_.capitalize(selected?.status)}
          </div>

          <div className="txn-info-item">
            <span>Served by</span>
            Dr. {[selected?.records.doctors.first_name, selected?.records.doctors.last_name].join(' ')}
          </div>
        </div>

        <div className="txn-metadata">
          <div className="txn-metadata-left">
            <span>Prescription</span>
            <p>{selected?.records.medication}</p>
          </div>

          <div className="txn-metadata-right">
            <span>Items breakdown</span>

            {
              selected?.products_metadata.length ? (
                selected?.products_metadata.map((item, i) => (
                  <div key={i}>
                    <p>
                      {item.name} <br/>
                      <span>{formatWithCurrency(item.price)} ({item.quantity}x)</span>
                    </p>
                    <b>{formatWithCurrency(item.price * item.quantity)}</b>
                  </div>
                ))
              ) : null
            }

            <div className="separator">
              <p>SubTotal:</p>
              <b>{formatWithCurrency(subTotal())}</b>
            </div>

            <div>
              <p>Consultation price:</p>
              <b>{formatWithCurrency(selected?.consultation_price)}</b>
            </div>

            <div>
              <p>TOTAL</p>
              <b>{formatWithCurrency(selected?.amount)}</b>
            </div>
          </div>
        </div>
      </SideModal>
    </div>
  )
}

export default Transactions