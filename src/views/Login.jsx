import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@hooks'

function Login () {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = () => {
    login({ name: 'Athena Xiantelle Shekinah' }); // Simulate user login
    navigate('/dashboard'); // Redirect to the main app
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login