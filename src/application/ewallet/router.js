function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/ewallet/management/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/ewallet/components/Wallet'),
    name: 'e-Wallet',
    meta: {
      title: 'Common.menu.wallet_management',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'adjustment/list',
        component: load('application/ewallet/components/eWalletAdjustmentList'),
        name: 'e-Wallet Adjustment List',
        meta: {
          title: 'e-Wallet Adjustment',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'adjustment/details/[:adjustmentID]',
        component: load('application/ewallet/components/eWalletAdjustmentDetail'),
        name: 'e-Wallet Adjustment Detail',
        props: true,
        meta: {
          title: 'e-Wallet Adjustment Detail',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'adjustment/new',
        component: load('application/ewallet/components/eWalletAdjustmentDetail'),
        name: 'New e-Wallet Adjustment',
        meta: {
          title: 'New e-Wallet Adjustment',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'giro/payment/list',
        component: load('application/ewallet/components/eWalletGiroPaymentList'),
        name: 'e-Wallet GIRO Payment List',
        meta: {
          title: 'e-Wallet GIRO Payment List',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'giro/payment/generation',
        component: load('application/ewallet/components/eWalletGiroPaymentGeneration'),
        name: 'e-Wallet GIRO Payment Generation',
        meta: {
          title: 'e-Wallet GIRO Payment Generation',
          icon: 'attach_money',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'giro/payment/rejected/list',
        component: load('application/ewallet/components/eWalletGiroRejectedPayment'),
        name: 'e-Wallet GIRO Rejected Payment',
        meta: {
          title: 'e-Wallet GIRO Rejected Payment',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'giro/upload/payment/rejected',
        component: load('application/ewallet/components/eWalletGiroRejectedUploadReview'),
        name: 'e-Wallet GIRO Rejected Upload Review',
        meta: {
          title: 'e-Wallet GIRO Rejected Upload Review',
          icon: 'attach_money',
          menuItem: false
        }
      }
    ]
  }
]
