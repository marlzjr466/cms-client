// images
import images from '@assets/images'

function Nav () {
  return (
    <div className="nav">
      <span className="nav__logo">
        <img src={images.logo} alt="Connect PH logo" />
      </span>

      <div className="nav__user">
        <span className="nav__user-icon">
          <img src={images.adminIcon} alt="Admin Icon" />
        </span>
        <div className="nav__user-info">
          <div>
            Athena Xiantelle
            <span>Administrator</span>
          </div>
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  )
}

export default Nav