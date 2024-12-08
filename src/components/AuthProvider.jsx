import { createContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { storage } from '@utilities/helper'

export const AuthContext = createContext();

function AuthProvider ({ children }) {
  const navigate = useNavigate()
  
  const login = userData => storage.set('user', JSON.stringify(userData))
  const logout = () => {
    storage.clear()
    navigate('/auth')
  }

  const auth = storage.get('user') ? JSON.parse(storage.get('user')) : null

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider