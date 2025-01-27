import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';

// hooks
import { useAuth } from '@hooks'

// images
import images from '@assets/images';

// components
import Loading from '@components/base/Loading'

// utils
import { sleep } from '@utilities/helper'

function Login () {
  const navigate = useNavigate();
  const { login, auth } = useAuth();

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const formRef = useRef(null)

  useEffect(() => {
    if (auth) {
      navigate('/dashboard')
    }
  }, [auth])

  const handleLogin = async e => {
    e.preventDefault() // Prevent page refresh
    setIsLoading(true)

    // Use FormData to access the submitted values
    const formData = new FormData(formRef.current)
    const data = Object.fromEntries(formData.entries())

    // call api
    const response = await login(data)
    setIsLoading(false)

    if (response.error) {
      setErrorMessage(response.error.message)
      // formRef.current.reset()

      await sleep(3000)
      setErrorMessage(null)
    }
  };

  return (
    <div className="login">
      <div className="login-bg">
        <img src={images.loginBG} alt="Login Background" />
      </div>

      <div className="login-container">
        <div className="logo">
          <img src={images.logo} alt="Logo" />
        </div>

        <h1>Clinic Management System</h1>

        <div className="form">
          <div className="form-wrapper">
            <div className="greetings">
              Welcome back

              <span>You are just one step away to your account. Login now!</span>
            </div>

            <form ref={formRef} onSubmit={handleLogin}>
              <div className="form-group">
                <label>Your role</label>
                <select name="role" required>
                  <option value="">&nbsp;&nbsp;&nbsp;Select here</option>
                  <option value="admin">&nbsp;&nbsp;&nbsp;Admin</option>
                  <option value="doctor">&nbsp;&nbsp;&nbsp;Doctor</option>
                </select>
                <span>
                  <i className="fa fa-angle-down" aria-hidden="true"></i>
                </span>
              </div>

              <div className="form-group">
                <label>Username</label>
                <input type="text" name="username" required autoComplete="off" />
                <span>
                  <i className="fa fa-user" aria-hidden="true"></i>
                </span>
              </div>
              
              <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" required />
                <span>
                  <i className="fa fa-key" aria-hidden="true"></i>
                </span>
              </div>

              {
                errorMessage && (
                  <div className="form-group">
                    <div className="response-message invalid">
                      {errorMessage}
                    </div>
                  </div>
                )
              }

              <div className="form-group">
                <button
                  type="submit"
                  className={`submit ${isLoading ? 'disabled' : ''}`}
                  disabled={isLoading}
                >
                  {
                    isLoading ? <Loading size={20} thick={3} auto noBackground /> : 'Login'
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="login-footer">
          © 2025 Connect.PH, All rights reserved. | Develop by <span>OpenSource</span>
        </div>
      </div>
    </div>
  );
}

export default Login