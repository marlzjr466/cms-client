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
      column: 'Full Name',
      key: ['first_name', 'last_name']
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
      column: 'Username',
      key: 'authentications.username'
    },
    {
      column: 'Address',
      key: 'address',
      is_hidden: true
    },
    {
      column: 'Status',
      key: 'authentications.status'
    },
    {
      column: 'Created At',
      key: 'created_at'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}