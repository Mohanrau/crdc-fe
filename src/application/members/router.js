function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/members/management/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/members/components/Members'),
    name: 'Members',
    meta: {
      title: 'Common.menu.members.management',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'personal/data/list',
        component: load('application/members/components/membersPersonalDataList'),
        name: 'Personal Data List',
        meta: {
          title: 'Common.menu.sub.members.personalList',
          icon: 'contacts',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'tree/placement',
        component: load('application/members/components/membersPlacementTree'),
        name: 'Placement Tree Diagram',
        meta: {
          title: 'Common.menu.sub.members.placementTree',
          icon: 'device_hub',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'tree/sponsor',
        component: load('application/members/components/membersSponsorTree'),
        name: 'Sponsor Tree',
        meta: {
          title: 'Common.menu.sub.members.sponsorTree',
          icon: 'device_hub',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'password/reset',
        component: load('application/members/components/memberPasswordReset'),
        name: 'Member Reset Password',
        meta: {
          title: 'Common.menu.sub.members.resetPassword',
          icon: 'security',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'setup/[:memberID?]',
        component: load('application/members/components/memberSetupArea'),
        name: 'Member Setup',
        meta: {
          title: 'Common.menu.sub.members.setup',
          icon: 'face',
          menuItem: false
        },
        props: true
      },
      {
        path: MODULE_PATH + 'rank/list',
        component: load('application/members/components/memberRankList'),
        name: 'Member Rank List',
        meta: {
          title: 'Common.menu.sub.members.rank',
          icon: 'face',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'rank/update',
        component: load('application/members/components/memberRankUpdate'),
        name: 'Member Rank Update',
        meta: {
          title: 'members.rankUpdate.title',
          icon: 'face',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'status/list',
        component: load('application/members/components/memberStatusList'),
        name: 'Member Status',
        meta: {
          title: 'Common.menu.sub.members.status',
          icon: 'face',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'status/update',
        component: load('application/members/components/memberStatusUpdate'),
        name: 'Member Status Update',
        meta: {
          title: 'members.statusUpdate.title',
          icon: 'face',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'migration/list',
        component: load('application/members/components/memberMigrationList'),
        name: 'Member Migration',
        meta: {
          title: 'Common.menu.sub.members.migration',
          icon: 'face',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'migration/update',
        component: load('application/members/components/memberMigrationUpdate'),
        name: 'Member Migration Update',
        meta: {
          title: 'members.migrationUpdate.title',
          icon: 'face',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'ewallet/transaction/History',
        component: load('application/members/components/memberWalletTransactions'),
        name: 'Member eWallet Transaction History',
        meta: {
          title: 'Member eWallet Transaction History',
          icon: 'face',
          menuItem: true
        }
      }
    ]
  }
]
