import Auth from 'src/containers/Auth'

function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/auth/'

export default {
  path: MODULE_PATH,
  component: Auth,
  redirect: MODULE_PATH + 'connector',
  name: 'Auth',
  meta: {
    title: 'Login.sideMenu.auth.title',
    menuItem: true,
    requiresNotAuth: true,
    permission: 'public'
  },
  children: [
    {
      path: MODULE_PATH + '/reset-password/:key',
      component: load('application/login/components/ResetPassword'),
      name: 'Reset Password',
      meta: {
        menuItem: false,
        requiresNotAuth: true,
        permission: 'public'
      }
    },
    {
      path: MODULE_PATH + 'connector',
      component: load('application/login/components/Connector'),
      name: 'connector',
      props: true,
      meta: {
        menuItem: false,
        requiresNotAuth: true,
        permission: 'public'
      }
    },
    {
      path: MODULE_PATH + 'login/admin',
      component: load('application/login/components/Admin'),
      name: 'Admin',
      props: true,
      meta: {
        menuItem: false,
        requiresNotAuth: true,
        permission: 'public'
      }
    },
    {
      path: MODULE_PATH + 'update/link/:email/:token',
      component: load('application/login/components/Admin'),
      name: 'Update From Mail Link',
      props: true,
      meta: {
        menuItem: false,
        requiresNotAuth: true,
        permission: 'public'
      }
    },
    {
      path: MODULE_PATH + 'reset',
      component: load('application/login/components/Admin'),
      name: 'Reset',
      props: true,
      meta: {
        menuItem: false,
        requiresNotAuth: true,
        permission: 'public'
      }
    },
    {
      path: MODULE_PATH + 'logout',
      component: load('application/login/components/Logout'),
      name: 'Logout',
      meta: {
        title: 'Logout',
        icon: 'assignment_ind',
        menuItem: false,
        requireAuth: false,
        permission: 'public'
      }
    }
  ]
}
