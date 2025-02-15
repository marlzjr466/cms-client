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
      column: 'First Name',
      key: 'first_name'
    },
    {
      column: 'Last Name',
      key: 'last_name'
    },
    {
      column: 'Gender',
      key: 'gender'
    },
    {
      column: 'Birth Date',
      key: 'birth_date'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}