import { useAuth } from '@hooks'

function Dashboard () {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Welcome, {auth.name}</h1>
    </div>
  )
}

export default Dashboard