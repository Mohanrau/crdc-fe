function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/settings/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/settings/components/Settings'),
    name: 'Settings',
    meta: {
      title: 'settings.sideMenu.title',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'modules/setup',
        component: load('application/settings/components/modules/moduleSetupArea'),
        name: 'Module Setup',
        meta: {
          title: 'general.module_setup.text',
          icon: 'beenhere',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'modules/create',
        component: load('application/settings/components/modules/forms/createUpdateModuleForm'),
        name: 'Create Module',
        meta: {
          title: 'general.create_module.text',
          icon: 'add',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'modules/[:moduleId]/update',
        component: load('application/settings/components/modules/forms/createUpdateModuleForm'),
        name: 'Update Module',
        meta: {
          title: 'general.update_module.text',
          icon: 'create',
          menuItem: false
        },
        props: true
      },
      {
        path: MODULE_PATH + 'roles/setup',
        component: load('application/settings/components/security/rolesSetupArea'),
        name: 'Roles Setup',
        meta: {
          title: 'settings.sideMenu.rolesSetup.title',
          icon: 'accessibility',
          menuItem: true
        },
        children: [
          {
            path: MODULE_PATH + 'roles/group/add',
            component: load('application/settings/components/security/rolesSetupArea'),
            name: 'Role Group Create',
            meta: {
              title: 'Role Group Create',
              icon: 'accessibility',
              menuItem: false
            }
          },
          {
            path: MODULE_PATH + 'roles/group/[:roleGroupID]/update',
            component: load('application/settings/components/security/rolesSetupArea'),
            name: 'Role Group Update',
            props: true,
            meta: {
              title: 'settings.sideMenu.rolesGroupUpdate.title',
              icon: 'accessibility',
              menuItem: false
            }
          }
        ]
      },
      {
        path: MODULE_PATH + 'roles/role/builder',
        component: load('application/settings/components/security/rolesSetupArea'),
        name: 'Role Builder',
        props: true,
        meta: {
          title: 'settings.sideMenu.rolesBuilder.title',
          icon: 'accessibility',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'roles/role/[:roleID]/update',
        component: load('application/settings/components/security/rolesSetupArea'),
        name: 'Role Update',
        props: true,
        meta: {
          title: 'settings.sideMenu.rolesBuilder.title',
          icon: 'accessibility',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'user/setup',
        component: load('application/settings/components/security/userSetupArea'),
        name: 'User Setup',
        props: true,
        meta: {
          title: 'settings.sideMenu.userSetup.title',
          icon: 'accessibility',
          menuItem: true
        },
        children: [
          {
            path: MODULE_PATH + 'user/setup/add',
            component: load('application/settings/components/security/rolesSetupArea'),
            name: 'Add User'
          },
          {
            path: MODULE_PATH + 'user/setup/[:userID]/update',
            component: load('application/settings/components/security/rolesSetupArea'),
            name: 'Update User',
            props: true
          }
        ]
      }
      // {
      //   path: MODULE_PATH + 'master/setup',
      //   component: load('application/settings/components/master/Masters'),
      //   name: 'Master',
      //   redirect: MODULE_PATH + 'master/setup/list',
      //   meta: {
      //     title: 'masters.sideMenu.masters.title',
      //     menuItem: true,
      //     requiresAuth: true
      //   },
      //   children: [
      //
      //     {
      //       path: MODULE_PATH + 'master/setup/list',
      //       component: load('application/settings/components/master/MasterList'),
      //       name: 'Masters List',
      //       meta: {
      //         title: 'general.master_list.text',
      //         icon: 'developer board',
      //         menuItem: true
      //       }
      //     },
      //     {
      //       path: MODULE_PATH + 'master/setup/create',
      //       component: load('application/settings/components/master/forms/createMasterForm'),
      //       name: 'Create Master',
      //       meta: {
      //         title: 'general.create_master.text',
      //         icon: 'add',
      //         menuItem: true
      //       }
      //     },
      //     {
      //       path: MODULE_PATH + 'master/setup/[:masterId]/update',
      //       component: load('application/settings/components/master/forms/updateMasterForm'),
      //       name: 'Update Master',
      //       props: true,
      //       meta: {
      //         title: 'general.update_master.text',
      //         icon: 'create',
      //         menuItem: false
      //       }
      //     }
      //   ]
      // },
      // {
      //   path: MODULE_PATH + 'master/setup/data',
      //   component: load('application/settings/components/master/MastersData'),
      //   name: 'Master Data',
      //   redirect: MODULE_PATH + '/master/setup/data/list',
      //   meta: {
      //     title: 'Master Data Setup',
      //     menuItem: true,
      //     requiresAuth: true
      //   },
      //   children: [
      //     {
      //       path: MODULE_PATH + 'master/setup/data/list',
      //       component: load('application/settings/components/master/MasterDataList'),
      //       name: 'Masters Data List',
      //       props: true,
      //       meta: {
      //         title: 'Masters Data List',
      //         icon: 'memory',
      //         menuItem: true
      //       }
      //     },
      //     {
      //       path: MODULE_PATH + 'master/setup/data/create',
      //       component: load('application/settings/components/master/forms/createMasterDataForm'),
      //       name: 'Create Master Data',
      //       meta: {
      //         title: 'Create Master Data',
      //         icon: 'add',
      //         menuItem: true
      //       }
      //     },
      //     {
      //       path: MODULE_PATH + 'master/setup/data/[:masterDataId]/update',
      //       component: load('application/settings/components/master/forms/updateMasterDataForm'),
      //       name: 'Update Master Data',
      //       props: true,
      //       meta: {
      //         title: 'Update Master Data',
      //         icon: 'create',
      //         menuItem: false
      //       }
      //     }
      //   ]
      // }
    ]
  }
]
