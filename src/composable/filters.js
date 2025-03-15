import { useState } from 'react'

export function filters () {
  const [page, setPage] = useState(1)

  return {
    page,
    setPage,

    sort: [
      { field: 'created_at', direction: 'desc' }
    ],
    
    pagination: {
      rows: 10,
      page
    }
  }
} 