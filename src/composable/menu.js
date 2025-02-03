export default () => {
  const list = [
    {
      name: 'Dashboard',
      route: '/dashboard',
      icon: 'fa fa-th-large'
    },
    {
      name: 'Doctors',
      route: '/doctors',
      icon: 'fas fa-user-doctor'
    },
    {
      name: 'Attendants',
      route: '/attendants',
      icon: 'fa fa-users'
    },
    {
      name: 'Categories',
      route: '/categories',
      icon: 'fa fa-tags'
    },
    {
      name: 'Products',
      route: '/products',
      icon: 'fa fa-pills'
    },
    {
      name: 'Inventory',
      route: '/inventory',
      icon: 'fa fa-box',
      is_hidden: true
    },
    {
      name: 'Patients',
      route: '/patients',
      icon: 'fa fa-procedures'
    },
    {
      name: 'Queue Management',
      route: '/queue-management',
      icon: 'fa fa-stream',
      is_hidden: true
    },
    {
      name: 'Transactions',
      route: '/transactions',
      icon: 'fa fa-credit-card'
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