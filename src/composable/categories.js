export function headers () {
  const headers = [
    {
      column: 'ID',
      key: 'id'
    },
    {
      column: 'Name',
      key: 'name'
    },
    {
      column: 'Created At',
      key: 'created_at'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}