import Full from 'src/containers/Full'
function load (component) {
  return () => import(`src/${component}.vue`)
}

export default [
  {
    path: '/initializing',
    component: load('pages/initialize'),
    name: 'initialize',
    meta: {
      menuItem: false,
      permission: 'public',
      requiresAuth: true
    }
  },
  {
    path: '/deny',
    component: Full,
    name: 'deny',
    redirect: '/deny/403',
    meta: {
      menuItem: false,
      permission: 'public',
      requiresAuth: true
    },
    children: [
      {
        path: '/deny/403',
        component: load('pages/deny'),
        name: 'deny inline',
        meta: {
          menuItem: false,
          permission: 'public',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/error',
    component: load('pages/error'),
    name: 'error',
    meta: {
      menuItem: false,
      permission: 'public',
      requiresAuth: true
    }
  },
  {
    path: '*',
    component: load('pages/notFound'),
    name: '404',
    meta: {
      menuItem: false,
      permission: 'public'
    }
  }
]
