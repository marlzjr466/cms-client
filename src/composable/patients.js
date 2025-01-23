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
      column: 'First Name',
      key: 'first_name'
    },
    {
      column: 'Last Name',
      key: 'last_name'
    },
    {
      column: 'Age',
      key: 'age'
    },
    {
      column: 'Gender',
      key: 'gender'
    },
    {
      column: 'Birth Date',
      key: 'birth_date'
    },
    {
      column: 'Address',
      key: 'address'
    },
    {
      column: 'Created At',
      key: 'created_at'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}