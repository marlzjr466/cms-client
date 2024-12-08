import PropTypes from 'prop-types'

function ToogleSwitch ({ model, onToggle }) {
  return (
    <>
      <label className="switch">
        <input
          type="checkbox"
          checked={model}
          onChange={e => onToggle(e.target.checked)}
        />
        <span className="switch__slider"></span>
      </label>
    </>
  )
}

ToogleSwitch.propTypes = {
  model: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default ToogleSwitch