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
      column: 'Doctor',
      key: ['doctors.first_name', 'doctors.last_name']
    },
    {
      column: 'Complaints',
      key: 'complaints'
    },
    {
      column: 'Remarks',
      key: 'remarks'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}