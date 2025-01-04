import { useState, useRef, useEffect } from "react"
import moment from "moment"

function DatePicker ({ onChange, date = new Date() }) {
  const inputRef = useRef(null)

  const [filteredDate, setFilteredDate] = useState(date)

  useEffect(() => {
    onChange(new Date(filteredDate))
  }, [filteredDate])

  const handlePicker = () => {
    inputRef.current.showPicker()
  }

  const handleChange = e => {
    setFilteredDate(e.target.value)
  }

  return (
    <div className="datepicker">
      <input
        type="date"
        ref={inputRef}
        value={moment(filteredDate).format("YYYY-MM-DD")}
        onChange={handleChange}
      />

      <div
        className="datepicker__display"
        onClick={handlePicker}
      >
        <i className="fas fa-calendar"></i>
        {moment(filteredDate).format("DD MMM YYYY")}
        <i className="fas fa-angle-down"></i>
      </div>
    </div>
  )
}

export default DatePicker