export default () => {
  const list = [
    {
      name: 'Dashboard',
      route: '/dashboard',
      icon: 'fa fa-th-large'
    },
    {
      name: 'Staff List',
      route: '/staff-list',
      icon: 'fa fa-users'
    },
    {
      name: 'Inventory',
      route: '/inventory',
      icon: 'fa fa-box'
    },
    {
      name: 'Patients',
      route: '/patients',
      icon: 'fa fa-procedures'
    },
    {
      name: 'Queue Management',
      route: '/queue-management',
      icon: 'fa fa-stream'
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