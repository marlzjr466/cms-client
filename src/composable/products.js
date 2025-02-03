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
      column: 'Category',
      key: 'product_categories.name'
    },
    {
      column: 'Status',
      key: 'status',
      is_hidden: true
    },
    {
      column: 'Created At',
      key: 'created_at'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}