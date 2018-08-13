function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/campaigns/management/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/campaigns/components/Campaigns'),
    name: 'Campaign',
    meta: {
      title: 'campaigns.route.sideMenu',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'campaign/list',
        component: load('application/campaigns/components/campaignList'),
        name: 'Campaign List',
        meta: {
          title: 'campaigns.route.campaignList',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'campaign/create',
        component: load('application/campaigns/components/forms/createUpdateCampaignForm'),
        name: 'New Campaign',
        meta: {
          title: 'campaigns.route.campaignNew',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'campaign/[:campaignId]/update',
        component: load('application/campaigns/components/forms/createUpdateCampaignForm'),
        name: 'Update Campaign',
        props: true,
        meta: {
          title: 'campaigns.route.campaignUpdate',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/type/list',
        component: load('application/campaigns/components/esacVoucherTypeList'),
        name: 'eSac Voucher Type List',
        meta: {
          title: 'campaigns.route.esacVoucherTypeList',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/type/create',
        component: load('application/campaigns/components/forms/createUpdateEsacVoucherTypeForm'),
        name: 'New eSac Voucher Type',
        meta: {
          title: 'campaigns.route.esacVoucherTypeNew',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/type/[:esacVoucherTypeId]/update',
        component: load('application/campaigns/components/forms/createUpdateEsacVoucherTypeForm'),
        name: 'Update eSac Voucher Type',
        props: true,
        meta: {
          title: 'campaigns.route.esacVoucherTypeUpdate',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/type/sub/list',
        component: load('application/campaigns/components/esacVoucherSubTypeList'),
        name: 'eSac Voucher Sub Type List',
        meta: {
          title: 'campaigns.route.esacVoucherSubTypeList',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/type/sub/create',
        component: load('application/campaigns/components/forms/createUpdateEsacVoucherSubTypeForm'),
        name: 'New eSac Voucher Sub Type',
        meta: {
          title: 'campaigns.route.esacVoucherSubTypeNew',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/type/sub/[:esacVoucherSubTypeId]/update',
        component: load('application/campaigns/components/forms/createUpdateEsacVoucherSubTypeForm'),
        name: 'Update eSac Voucher Sub Type',
        props: true,
        meta: {
          title: 'campaigns.route.esacVoucherSubTypeUpdate',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/list',
        component: load('application/campaigns/components/esacVoucherList'),
        name: 'eSac Voucher List',
        meta: {
          title: 'campaigns.route.esacVoucherList',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/create',
        component: load('application/campaigns/components/forms/createUpdateEsacVoucherForm'),
        name: 'New eSac Voucher',
        meta: {
          title: 'campaigns.route.esacVoucherNew',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/voucher/[:esacVoucherId]/update',
        component: load('application/campaigns/components/forms/createUpdateEsacVoucherForm'),
        name: 'Update eSac Voucher',
        props: true,
        meta: {
          title: 'campaigns.route.esacVoucherUpdate',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/promotion/list',
        component: load('application/campaigns/components/esacPromotionList'),
        name: 'eSac Promotion List',
        meta: {
          title: 'campaigns.route.esacPromotionList',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'esac/promotion/create',
        component: load('application/campaigns/components/forms/createUpdateEsacPromotionForm'),
        name: 'New eSac Promotion',
        meta: {
          title: 'campaigns.route.esacPromotionNew',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/promotion/[:esacPromotionId]/update',
        component: load('application/campaigns/components/forms/createUpdateEsacPromotionForm'),
        name: 'Update eSac Promotion',
        props: true,
        meta: {
          title: 'campaigns.route.esacPromotionUpdate',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/redemption/list',
        component: load('application/campaigns/components/esacRedemptionList'),
        name: 'eSac Redemption List',
        meta: {
          title: 'campaigns.route.esacRedemptionList',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'esac/redemption/create',
        component: load('application/campaigns/components/forms/createUpdateEsacRedemptionForm'),
        name: 'New eSac Redemption',
        meta: {
          title: 'campaigns.route.esacRedemptionNew',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'esac/redemption/[:saleID]/update/[:referer]',
        component: load('application/campaigns/components/forms/createUpdateEsacRedemptionForm'),
        name: 'Update eSac Redemption',
        props: true,
        meta: {
          title: 'campaigns.route.esacRedemptionUpdate',
          icon: 'attach_money',
          menuItem: false
        }
      }
    ]
  }
]
