import { useAuth } from '@hooks'

export default () => {
  const { auth } = useAuth()

  const list = [
    {
      name: 'Dashboard',
      route: '/dashboard',
      icon: 'fa fa-th-large',
      is_hidden: auth.role !== 'admin'
    },
    {
      name: 'Doctors',
      route: '/doctors',
      icon: 'fas fa-user-doctor',
      is_hidden: auth.role !== 'admin'
    },
    {
      name: 'Attendants',
      route: '/attendants',
      icon: 'fa fa-users',
      is_hidden: auth.role !== 'admin'
    },
    {
      name: 'Categories',
      route: '/categories',
      icon: 'fa fa-tags',
      is_hidden: auth.role !== 'admin'
    },
    {
      name: 'Products',
      route: '/products',
      icon: 'fa fa-pills',
      is_hidden: auth.role !== 'admin'
    },
    // {
    //   name: 'Inventory',
    //   route: '/inventory',
    //   icon: 'fa fa-box',
    //   is_hidden: auth.role !== 'admin'
    // },
    {
      name: 'Dashboard',
      route: '/doctor/dashboard',
      icon: 'fa fa-th-large',
      is_hidden: auth.role === 'admin'
    },
    {
      name: 'Patients',
      route: '/patients',
      icon: 'fa fa-procedures',
      // is_hidden: auth.role !== 'admin'
    },
    {
      name: 'Transactions',
      route: '/transactions',
      icon: 'fa fa-credit-card',
      is_hidden: auth.role !== 'admin'
    },
    {
      name: 'Settings',
      route: '/settings',
      icon: 'fa fa-sliders-h'
    },
  ]

  return {
    list: list.filter(x => !x.is_hidden)
  }
}