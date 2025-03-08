import moment from "moment"
import _ from "lodash"

const PrescriptionPad = ({ reference, data }) => {
  return (
    <div ref={reference} className="full-width prescription_pad">
      <h3>Maria Fidela Hocson-Bernas, MD, DPAFP</h3>
      <p>Family Physician</p>

      <div className="prescription_pad__header">
        <div>
          <b>Clinic Hours:</b>
          <span>Monday - Saturday</span>
          <span>9:00 AM - 4:00 PM</span>

          <span>Sunday</span>
          <span>By Appointment</span>
        </div>

        <div>
          <b>Clinic Address:</b>
          <span>Rizal St., Ormoc City</span>
          <span>Tel. No.: (053) 580-4256</span>
        </div>
      </div>

      <div className="prescription_pad__info">
        <div>
          <span>Name:</span>
          <p className="name">
            {data?.patient?.first_name} {data?.patient?.last_name}
          </p>

          <span>Age:</span>
          <p className="age">
            {data?.age}
          </p>

          <span>Sex:</span>
          <p className="sex">
            {_.capitalize(data?.patient?.gender)}
          </p>
        </div>

        <div>
          <span>Address:</span>
          <p className="address">
            {data?.patient?.address}
          </p>

          <span>Date:</span>
          <p className="date">
            {moment().format('MMMM D, YYYY')}
          </p>
        </div>
      </div>

      <div className="prescription_pad__body">
        <div className="rx-logo">
          R <span>x</span>
        </div>

        <p className="medication">
          {data?.medication}
        </p>
      </div>

      <div className="prescription_pad__footer">
        <div className="top">
          <div className="left">
            Next Check-up:
          </div>
          
          <div className="right">
            <strong>Maria Fidela Bernas, M.D.</strong>
            <div>
              PRC.No.
              <strong>0080058</strong>
            </div>

            <div>
              PTR No.
              <strong>7880228</strong>
            </div>

            <div>
              S2 No.&nbsp;&nbsp;&nbsp;
              <strong></strong>
            </div>
          </div>
        </div>

        <div className="bottom">
          <p>
            "Surely goodness and love will follow me all the days of my life and I will dwell in the house of the Lord forever." Psalm 23:6
          </p>
        </div>
      </div>
    </div>
  )
}

export default PrescriptionPad