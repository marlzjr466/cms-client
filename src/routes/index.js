// init routes using lazy-load
import { lazy } from 'react';

const routes = [
  {
    path: '/auth',
    name: 'auth',
    component: lazy(() => import('@views/Login'))
  },
  {
    path: '/',
    name: 'app',
    component: lazy(() => import('@views/AppLayout')),
    authRequired: true,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: lazy(() => import('@views/Dashboard')),
        authRequired: true
      },
      {
        path: 'inventory',
        name: 'inventory',
        component: lazy(() => import('@views/Inventory')),
        authRequired: true
      },
      {
        path: 'patients',
        name: 'patients',
        component: lazy(() => import('@views/Patients')),
        authRequired: true
      },
      {
        path: 'queue-management',
        name: 'queue-management',
        component: lazy(() => import('@views/QueueManagement')),
        authRequired: true
      },
      {
        path: 'settings',
        name: 'settings',
        component: lazy(() => import('@views/Settings')),
        authRequired: true
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: lazy(() => import('@views/Transactions')),
        authRequired: true
      },
      {
        path: 'users',
        name: 'users',
        component: lazy(() => import('@views/Users')),
        authRequired: true
      }
    ]
  }
]

export default routes