/* eslint-disable no-unused-vars */
function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/smart/library/'

export default [
  // {
  //   path: MODULE_PATH,
  //   component: load('application/smart-library/components/SmartLibrary'),
  //   name: 'Smart Library',
  //   meta: {
  //     title: 'smartLibrary.sideMenu.title',
  //     menuItem: true,
  //     requiresAuth: true
  //   },
  //   children: [
  //     {
  //       path: MODULE_PATH + 'list',
  //       component: load('application/smart-library/components/SmartLibraryList'),
  //       name: 'Smart Library List',
  //       meta: {
  //         title: 'smartLibrary.smartLibraryList.title',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'create',
  //       component: load('application/smart-library/components/forms/createUpdateSmartLibraryForm'),
  //       name: 'New Smart Library',
  //       meta: {
  //         title: 'smartLibrary.newSmartLibrary.title',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + '[:smartLibraryId]/update',
  //       component: load('application/smart-library/components/forms/createUpdateSmartLibraryForm'),
  //       name: 'Update Smart Library',
  //       props: true,
  //       meta: {
  //         title: 'smartLibrary.updateSmartLibrary.title',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     }
  //   ]
  // }
]
