import { useEffect } from 'react'
import { useMeta } from '@opensource-dev/redux-meta'
import { useNavigate } from 'react-router-dom'
import moment from 'moment/moment'
import _ from 'lodash'

import socket from '@config/socket'

// import utils
import { formattedNumber, formatWithCurrency, formatQueueNumber } from '@utilities/helper'

// composable
import { headers } from '@composable/dashboard-patients'
import { filters } from '@composable/filters'

// images
import images from '@assets/images'

// components
import Title from '@components/base/Title'
import DatePicker from '@components/base/DatePicker'
import Table from '@components/base/Table'
import Chart from '@components/base/Chart'
import NoData from '@components/base/NoData'

function Dashboard () {
  const navigate = useNavigate()
  const { metaStates, metaActions } = useMeta()
  const { setPage, pagination, sort, page } = filters()

  const admins = {
    ...metaStates('admins', ['dashboardData', 'onlineStaff']),
    ...metaActions('admins', ['getDashboardData', 'getOnlineStaff'])
  }

  const queues = {
    ...metaStates('queues', ['list', 'count']),
    ...metaActions('queues', ['fetch'])
  }

  const records = {
    ...metaStates('records', ['list', 'count']),
    ...metaActions('records', ['fetch'])
  }

  const currentDate = moment().format("dddd, MMMM D, YYYY")

  useEffect(() => {
    admins.getDashboardData()
    admins.getOnlineStaff()
    loadQueues()

    socket.on('refresh', types => {
      if (types.includes('queues')) {
        loadQueues()
      }

      if (types.includes('transactions') || types.includes('patients')) {
        admins.getDashboardData()
      }

      if (types.includes('users')) {
        admins.getOnlineStaff()
      }
    })
  }, [])

  useEffect(() => {
    loadQueues()
  }, [page])

  const loadQueues = async () => {
    await queues.fetch({
      filters: [
        {
          field: 'created_at',
          custom_operator: 'dateequal',
          value: moment().format('YYYY-MM-DD')
        },
        {
          field: 'deleted_at',
          value: 'null'
        }
      ],
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
          columns: ['id', 'first_name', 'last_name']
        }
      ],
      is_count: true,
      pagination,
      sort
    })
  }

  function getRandomChartData () {
    return Array.from({ length: 10 }, () => Math.floor(Math.random() * (50 - 10 + 1)) + 10)
  }

  return (
    <div className="dashboard">
      <div className="flex flex-jc-sb">
        <div className="dashboard__title">
          <Title title="Hi! Welcome to Dashboard" icon={false} />
          <span>{currentDate}</span>
        </div>

        {/* <div className="dashboard__action">
          <DatePicker
            onChange={date => {
              console.log('date:', date)
            }}
          />
        </div> */}
      </div>

      <div className="dashboard__body">
        <div className="dashboard__left">
          <div className="dashboard__totals">
            <div className="card col">
              <span className="card__icon">
                <i className="fa fa-procedures"></i>
              </span>

              <div className="card__header">
                <span>
                  Overall Patients
                </span>
                <button
                  className="btn default"
                  onClick={() => navigate('/patients')}
                >
                  See Details
                </button>
              </div>

              <div className="card__body">
                <span>{admins.dashboardData.patientsCount}</span>
              </div>

              <div className="card__chart">
                <Chart
                  width="113%"
                  series={[{ name: '', data: getRandomChartData() }]}
                  colors={['#0ea5e9']}
                  showToolTip={false}
                />
              </div>
            </div>

            <div className="card col">
              <span className="card__icon">
                <i className="fa fa-box"></i>
              </span>

              <div className="card__header">
                <span>
                  Inventory
                </span>
                <button
                  className="btn default"
                  onClick={() => navigate('/products')}
                >
                  See Details
                </button>
              </div>

              <div className="card__body">
                <span>{admins.dashboardData.inventoryCount}</span>
              </div>

              <div className="card__chart">
                <Chart
                  width="113%"
                  series={[{ name: '', data: getRandomChartData() }]}
                  showToolTip={false}
                />
              </div>
            </div>

            <div className="card col">
              <span className="card__icon">
                <i className="fa-solid fa-dollar-sign"></i>
              </span>

              <div className="card__header">
                <span>
                  Overall Sales
                </span>
                <button
                  className="btn default"
                  onClick={() => navigate('/transactions')}
                >
                  See Details
                </button>
              </div>

              <div className="card__body">
                <span>{formatWithCurrency(admins.dashboardData.overallSales)}</span>
              </div>

              <div className="card__chart">
                <Chart
                  width="113%"
                  series={[{ name: '', data: getRandomChartData() }]}
                  colors={['#a855f7']}
                  showToolTip={false}
                />
              </div>
            </div>
          </div>

          <div className="dashboard__table">
            <Title title="Today's Patients" icon={false} size="16px" />

            <div className="full-width">
              <Table
                headers={headers()}
                rows={queues.list}
                selectedValue="id"
                totalRowsCount={queues.count}
                onPageChance={page => setPage(page)}
                disableButton
                itemsPerPage={pagination.rows}
                disableAllActions
              />
            </div>
          </div>
        </div>

        <div className="dashboard__right">
          <div className="dashboard__statistics">
            <Title title="Today's Statistics" icon={false} size="16px" />

            <div className="dashboard__statistics-row">
              Patients
              <span>{admins.dashboardData.todaysPatientsCount}</span>
            </div>

            <div className="dashboard__statistics-row">
              Total Sales
              <span>{formatWithCurrency(admins.dashboardData.todaysTotalSales)}</span>
            </div>
          </div>

          <div className="dashboard__online">
            <Title title="Active Staff" icon={false} size="16px" />

            {
              admins.onlineStaff.length ? (
                admins.onlineStaff.map((staff, i) => (
                  <div key={i} className="dashboard__online-item">
                    <div className="dashboard__online-item-left">
                      <span className="dashboard__online-item-left__icon">
                        <img src={images.doctorIcon} alt="Doctor Icon" />
                      </span>

                      <div className="dashboard__online-item-left__info">
                        <p>{staff.first_name} {staff.last_name}</p>
                        <span>{_.capitalize(staff.role)}</span>
                      </div>
                    </div>
                    
                    <span className="dashboard__online-item-indicator active"></span>
                  </div>
                ))
              ) : <NoData label="No active staff" />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard