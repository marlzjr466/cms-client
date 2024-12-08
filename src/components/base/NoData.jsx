import PropTypes from 'prop-types'

function NoData (props) {
  return (
    <>
      <div className="no-data" nodata-msg={ !props.label ? 'No data' : props.label }>
        <i className="fa fa-file"></i>
      </div>
    </>
  )
}

NoData.propTypes = {
  label: PropTypes.string
}

export default NoData