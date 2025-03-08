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
        path: 'patients/:id',
        name: 'patients',
        component: lazy(() => import('@views/Patients')),
        authRequired: true
      },
      {
        path: 'doctor/dashboard',
        name: 'doctor-dashboard',
        component: lazy(() => import('@views/DoctorDashboard')),
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
        path: 'doctors',
        name: 'doctors',
        component: lazy(() => import('@views/Doctors')),
        authRequired: true
      },
      {
        path: 'attendants',
        name: 'attendants',
        component: lazy(() => import('@views/Attendants')),
        authRequired: true
      },
      {
        path: 'products',
        name: 'products',
        component: lazy(() => import('@views/Products')),
        authRequired: true
      },
      {
        path: 'products/:id',
        name: 'products',
        component: lazy(() => import('@views/Products')),
        authRequired: true
      },
      {
        path: 'products/:id/:tab',
        name: 'products',
        component: lazy(() => import('@views/Products')),
        authRequired: true
      },
      {
        path: 'categories',
        name: 'categories',
        component: lazy(() => import('@views/Categories')),
        authRequired: true
      },
      {
        path: 'profile',
        name: 'profile',
        component: lazy(() => import('@views/Profile')),
        authRequired: true
      }
    ]
  }
]

export default routes