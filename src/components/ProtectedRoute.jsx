import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@hooks'

const ProtectedRoute = ({ element, authRequired }) => {
  const location = useLocation()
  const { auth } = useAuth()

  const adminRoutes = [
    '/dashboard',
    '/doctors',
    '/attendants',
    '/categories',
    '/products',
    '/inventory',
    '/transactions'
  ]

  if (authRequired && !auth) {
    return <Navigate to="/auth" replace />
  }

  if (auth && auth.role !== 'admin' && adminRoutes.includes(location.pathname)) {
    return <Navigate to="/doctor/dashboard" replace />
  }

  return element
}

export default ProtectedRoute
