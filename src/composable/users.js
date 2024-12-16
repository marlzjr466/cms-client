export function headers () {
  const headers = [
    {
      column: '#',
      key: '#',
      is_hidden: true
    },
    {
      column: 'ID',
      key: 'id'
    },
    {
      column: 'Name',
      key: 'name'
    },
    {
      column: 'Email',
      key: 'email',
      is_hidden: true
    },
    {
      column: 'Phone Number',
      key: 'phone_number'
    },
    {
      column: 'Address',
      key: 'address',
      is_hidden: true
    },
    {
      column: 'Role',
      key: 'role'
    },
    {
      column: 'Status',
      key: 'status'
    },
    {
      column: 'Created At',
      key: 'created_at'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}