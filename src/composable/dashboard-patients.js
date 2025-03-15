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
      key: ['patients.first_name', 'patients.last_name']
    },
    {
      column: 'Queue Number',
      key: 'number'
    },
    // {
    //   column: 'Transaction ID',
    //   key: 'txn_id'
    // },
    {
      column: 'Status',
      key: 'status'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}