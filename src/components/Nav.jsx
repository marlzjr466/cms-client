import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// images
import images from '@assets/images'

// hooks
import { useAuth } from '@hooks'

function Nav () {
  const navigate = useNavigate()
  const { auth, logout } = useAuth()

  const [showPopup, setShowPopup] = useState(false)

  return (
    <div className="nav">
      <span className="nav__logo">
        <img src={images.logo} alt="Connect PH logo" />
      </span>

      <div className="nav__user" onClick={() => setShowPopup(!showPopup)}>
        <span className="nav__user-icon">
          <img src={images.adminIcon} alt="Admin Icon" />
        </span>
        <div className="nav__user-info">
          <div>
            {auth.first_name} {auth.last_name}
            <span>
              {
                auth.role === 'admin' ? 'Administrator' : 'Doctor'
              }
            </span>
          </div>
          <i className={`fa fa-angle-down ${showPopup ? 'open' : ''}`} aria-hidden="true"></i>
        </div>

        {
          showPopup && (
            <ul className="card">
              <li onClick={() => navigate('/profile')}>
                <i className="fa fa-user" aria-hidden="true"></i>
                My Profile
              </li>

              <li onClick={logout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                Logout
              </li>
            </ul>
          )
        }
      </div>
    </div>
  )
}

export default Nav