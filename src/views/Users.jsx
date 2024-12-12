import { useEffect } from 'react'

// components
import Title from '@components/base/Title'
import Table from '@components/base/Table'

function Users () {

  return (
    <div className="users">
      <Title title="Manage Users" />

      <div className="flex-1">
        <Table />
      </div>
    </div>
  )
}

export default Users