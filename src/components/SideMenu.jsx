import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useMeta } from '@opensource-dev/redux-meta'

// components
import ToogleSwitch from "@components/base/ToggleSwitch"

// composable
import menu from "@composable/menu"

// hooks
import { useAuth } from '@hooks'

function SideMenu () {
  const location = useLocation()
  const navigate = useNavigate()

  const { metaStates, metaMutations } = useMeta()
  const { logout, auth } = useAuth()
  const { list } = menu()

  const [isNavCollapse, setIsNavCollapse] = useState(false)

  const theme = {
    ...metaStates('theme', ['mode']),
    ...metaMutations('theme', ['SET_MODE'])
  }

  const handleNavigate = route => navigate(route)

  return (
    <div className={`sidemenu ${isNavCollapse ? 'collapse' : ''}`}>
      <span
        className="sidemenu__collapse_btn"
        onClick={() => setIsNavCollapse(!isNavCollapse)}
      >
        <i className={`fas fa-angle-${isNavCollapse ? 'right' : 'left'}`}></i>
      </span>

      <div className="card">
        <div className="clinic-info">
          <i className="fa-solid fa-hospital" aria-hidden="true"></i>
          {
            !isNavCollapse && (
              <div>
                {auth.clinic_name}
                <span>{auth.clinic_address}</span>
              </div>
            )
          }
        </div>
      </div>

      <div className="card">
        <ul className="sidemenu__list">
          {
            list.map((item, i) => (
              <li
                key={i}
                className={location.pathname === item.route ? 'active' : ''}
                onClick={() => handleNavigate(item.route)}
              >
                <span>
                  <i className={item.icon} aria-hidden="true"></i>
                </span>
                {!isNavCollapse && item.name}
              </li>
            ))
          }
        </ul>
      </div>

      <div className="sidemenu__absolute">
        {/* <div className="card">
          <div className="footer-item">
            <div>
              <span>
                <i className="fa-solid fa-moon"></i>
              </span>
              Dark Mode
            </div>

            <span>
              <ToogleSwitch
                model={theme.mode !== 'light'}
                onToggle={value => theme.SET_MODE(!value ? 'light' : 'dark')}
              />
            </span>
          </div>
        </div> */}

        <div className="card">
          <div className="footer-item" onClick={logout}>
            <div className="pointer">
              <span>
                <i className="fa-solid fa-right-from-bracket"></i>
              </span>
                {!isNavCollapse && 'Log out'}
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SideMenu