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
      column: 'Patient',
      key: ['records.patients.first_name', 'records.patients.last_name']
    },
    // {
    //   column: 'Diagnosis',
    //   key: 'records.diagnosis'
    // },
    {
      column: 'Prescription',
      key: 'records.medication',
      no_truncate: true
    },
    {
      column: 'Amount',
      key: 'amount'
    },
    {
      column: 'Status',
      key: 'status'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}