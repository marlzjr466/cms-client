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
      column: 'Date',
      key: 'created_at'
    },
    {
      column: 'Full Name',
      key: ['first_name', 'last_name']
    },
    {
      column: 'Phone Number',
      key: 'phone_number'
    },
    // {
    //   column: 'Gender',
    //   key: 'gender'
    // },
    // {
    //   column: 'Birth Date',
    //   key: 'birth_date'
    // },
    {
      column: 'Last Visit',
      key: 'records.created_at'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}