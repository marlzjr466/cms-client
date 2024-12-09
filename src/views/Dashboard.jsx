import { useAuth } from '@hooks'

function Dashboard () {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Welcome to Dashboard</h1>
    </div>
  )
}

export default Dashboard