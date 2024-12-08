import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks';

const ProtectedRoute = ({ element, authRequired }) => {
  const { auth } = useAuth();

  if (authRequired && !auth) {
    return <Navigate to="/auth" replace />;
  }

  return element;
};

export default ProtectedRoute;
