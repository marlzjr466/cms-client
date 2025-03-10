import moment from 'moment/moment'

// import utils
import { formattedNumber, formatWithCurrency, formatQueueNumber } from '@utilities/helper'

// composable
import { headers } from '@composable/dashboard-patients'

// images
import images from '@assets/images'

// components
import Title from '@components/base/Title'
import DatePicker from '@components/base/DatePicker'
import Table from '@components/base/Table'
import Chart from '@components/base/Chart'

function Dashboard () {
  const data = []
  const currentDate = moment().format("dddd, MMMM D, YYYY")

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
                  {/* <Info message="Total number of patients." /> */}
                </span>
                <button className="btn default">See Details</button>
              </div>

              <div className="card__body">
                <span>{formattedNumber(0)}</span>
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
                  {/* <Info message="Total number of remaining products." /> */}
                </span>
                <button className="btn default">See Details</button>
              </div>

              <div className="card__body">
                <span>{formattedNumber(0)}</span>
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
                  {/* <Info message="Total number of sales." /> */}
                </span>
                <button className="btn default">See Details</button>
              </div>

              <div className="card__body">
                <span>{formatWithCurrency(0)}</span>
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
                disableButton
                itemsPerPage={pagination.rows}
              />
            </div>
          </div>
        </div>

        <div className="dashboard__right">
          <div className="dashboard__statistics">
            <Title title="Today's Statistics" icon={false} size="16px" />

            <div className="dashboard__statistics-row">
              Patients
              <span>0</span>
            </div>

            <div className="dashboard__statistics-row">
              Total Queue
              <span>0</span>
            </div>

            <div className="dashboard__statistics-row">
              Active Queue
              <span>0</span>
            </div>

            <div className="dashboard__statistics-row">
              Total Sales
              <span>{formatWithCurrency(0)}</span>
            </div>
          </div>

          <div className="dashboard__online">
            <Title title="Active Staff" icon={false} size="16px" />

            <div className="dashboard__online-item">
              <div className="dashboard__online-item-left">
                <span className="dashboard__online-item-left__icon">
                  <img src={images.doctorIcon} alt="Doctor Icon" />
                </span>

                <div className="dashboard__online-item-left__info">
                  John Doe
                  <span>Doctor</span>
                </div>
              </div>
              
              <span className="dashboard__online-item-indicator active"></span>
            </div>

            <div className="dashboard__online-item">
              <div className="dashboard__online-item-left">
                <span className="dashboard__online-item-left__icon">
                  <img src={images.doctorIcon} alt="Doctor Icon" />
                </span>

                <div className="dashboard__online-item-left__info">
                  Jane Doe
                  <span>Attendant</span>
                </div>
              </div>

              <span className="dashboard__online-item-indicator"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard