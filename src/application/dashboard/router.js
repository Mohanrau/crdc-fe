function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/dashboard/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/dashboard/components/Dashboard'),
    redirect: MODULE_PATH + 'new',
    name: 'Home',
    meta: {
      title: 'Home',
      icon: 'home',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'new',
        component: load('application/dashboard/components/new'),
        name: 'Dashboard',
        meta: {
          title: 'Common.menu.Dashboard',
          icon: 'beenhere',
          menuItem: true,
          requiresAuth: true
        }
      }
    ]
  }
]
