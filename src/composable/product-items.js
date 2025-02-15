import { useParams } from 'react-router-dom'
import { useMeta } from '@opensource-dev/redux-meta'

export function headers () {
  const urlParams = useParams()
  const { metaStates } = useMeta()

  const productVariants = {
    ...metaStates('variants', ['count'])
  }

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
      column: 'Variant',
      key: 'product_variants.name',
      is_hidden: urlParams.tab !== 'all' || !productVariants.count
    },
    {
      column: 'Item Name',
      key: 'name'
    },
    {
      column: 'Expiry Date',
      key: 'expired_at'
    },
    {
      column: 'Stock',
      key: 'stock'
    },
    {
      column: 'Price',
      key: 'price'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}