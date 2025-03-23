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
      column: 'Variant',
      key: 'product_variants.name',
      is_hidden: urlParams.tab !== 'all' || !productVariants.count
    },
    {
      column: 'Item Name',
      key: 'name'
    },
    {
      column: 'SKU',
      key: 'sku'
    },
    {
      column: 'Stock',
      key: 'stock'
    },
    {
      column: 'Price',
      key: 'price'
    },
    {
      column: 'Expiry Date',
      key: 'expired_at'
    },
    {
      column: 'Date',
      key: 'created_at'
    }
  ]

  return headers.filter(x => !x.is_hidden)
}