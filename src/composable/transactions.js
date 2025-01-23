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
      key: 'patient'
    },
    {
      column: 'Diagnosis',
      key: 'diagnosis'
    },
    {
      column: 'Prescription',
      key: 'prescription'
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