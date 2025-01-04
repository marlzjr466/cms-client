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
      column: 'Description',
      key: 'description'
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