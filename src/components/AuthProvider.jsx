import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeta } from '@opensource-dev/redux-meta';

import { storage, decodeToken } from '@utilities/helper'

export const AuthContext = createContext();

function AuthProvider ({ children }) {
  const navigate = useNavigate()
  const { metaActions } = useMeta()
  
  // const token = storage.get('token')
  // const [auth, setAuth] = useState(token ? decodeToken(token) : null)
  const [auth, setAuth] = useState(null)

  const authentication = {
    ...metaActions('auth', ['login', 'logout'])
  }
  
  const login = async data => {
    // const response = await authentication.login(data)

    // if (response.token) {
    //   storage.set('token', response.token)
    //   setAuth(decodeToken(response.token))
    // }

    // return response

    storage.set('token', '_token_')
    setAuth({
      id: 1,
      first_name: 'Administrator',
      last_name: ''
    })

    return '_token_'
  }

  const logout = async () => {
    // const response = await authentication.logout({
    //   user_id: auth.id
    // })

    // if (response === 'OK') {
    //   storage.clear()
    //   setAuth(null)
    //   navigate('/auth')
    // }

      storage.clear()
      setAuth(null)
      navigate('/auth')
  }

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider