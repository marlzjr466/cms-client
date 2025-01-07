// images
import images from '@assets/images'

// hooks
import { useAuth } from '@hooks'

function Nav () {
  const { auth } = useAuth();

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
            {auth.first_name} {auth.last_name}
            <span>Administrator</span>
          </div>
          <i className="fa fa-angle-down" aria-hidden="true"></i>
        </div>
      </div>
    </div>
  )
}

export default Nav