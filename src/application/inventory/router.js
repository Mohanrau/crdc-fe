/* eslint-disable no-unused-vars */
function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/inventory/'

export default [
  // {
  //   path: MODULE_PATH,
  //   component: load('application/inventory/components/Inventory'),
  //   redirect: MODULE_PATH + 'management',
  //   name: 'Inventory',
  //   meta: {
  //     title: 'Common.menu.inventory_management',
  //     menuItem: true,
  //     requiresAuth: true
  //   },
  //   children: [
  //     {
  //       path: MODULE_PATH + 'management',
  //       component: load('application/inventory/components/InventoryManagement'),
  //       name: 'Inventory Management',
  //       meta: {
  //         title: 'Common.menu.inventory_management',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     }
  //   ]
  // }
]
