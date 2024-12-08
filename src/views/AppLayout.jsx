import { Link, Outlet } from "react-router-dom";
import { useAuth } from '@hooks'

function Layout () {
  const { logout } = useAuth();

  return (
    <>
      <h1>Welcome to the App</h1>

      <ul>
        <li>
          <Link to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/inventory">
            Inventory
          </Link>
        </li>
        <li>
          <Link to="/patients">
            Patients
          </Link>
        </li>
        <li>
          <Link to="/queue-management">
            Queue Management
          </Link>
        </li>
        <li>
          <Link to="/transactions">
            Transactions
          </Link>
        </li>
        <li>
          <Link to="/settings">
            Settings
          </Link>
        </li>
      </ul>

      <button onClick={logout}>Logout</button>

      <Outlet />
    </>
  );
}

export default Layout