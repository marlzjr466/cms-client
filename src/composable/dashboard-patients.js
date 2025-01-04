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
    // {
    //   column: 'Last Name',
    //   key: 'last_name'
    // },
    {
      column: 'Queue Number',
      key: 'queue_number'
    },
    {
      column: 'Transaction ID',
      key: 'txn_id'
    },
    {
      column: 'Status',
      key: 'status'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}