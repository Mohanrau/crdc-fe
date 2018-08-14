/* eslint-disable no-unused-vars */
function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/procurement/'

export default [
  // {
  //   path: MODULE_PATH,
  //   component: load('application/procurement/components/Procurement'),
  //   redirect: MODULE_PATH + 'management',
  //   name: 'Procurement',
  //   meta: {
  //     title: 'Common.menu.procurement_management',
  //     menuItem: true,
  //     requiresAuth: true
  //   },
  //   children: [
  //     {
  //       path: MODULE_PATH + 'management',
  //       component: load('application/procurement/components/ProcurementManagement'),
  //       name: 'Procurement Management',
  //       meta: {
  //         title: 'Common.menu.procurement_management',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     }
  //   ]
  // }
]
