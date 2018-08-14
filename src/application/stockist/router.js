/* eslint-disable no-unused-vars */
function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/stockist/'

export default [
  // {
  //   path: MODULE_PATH,
  //   component: load('application/stockist/components/Stockist'),
  //   name: 'Stockist',
  //   meta: {
  //     title: 'Common.menu.stockist_management',
  //     menuItem: true,
  //     requiresAuth: true
  //   },
  //   children: [
  //     {
  //       path: MODULE_PATH + 'list',
  //       component: load('application/stockist/components/StockistList'),
  //       name: 'Stockist List',
  //       meta: {
  //         title: 'Common.menu.stockist_setup',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'registration',
  //       component: load('application/stockist/components/StockistRegistration'),
  //       name: 'Stockist Registration',
  //       meta: {
  //         title: 'Common.menu.stockist_setup',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'funds/list',
  //       component: load('application/stockist/components/StockistConsignmentDepositList'),
  //       name: 'Stockist Consignment Funds',
  //       meta: {
  //         title: 'Common.menu.stockist_funds',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'funds/[:depositRefundType]/new',
  //       component: load('application/stockist/components/StockistConsignmentDepositArea'),
  //       name: 'New Stockist Consignment Deposit',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_deposit',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'funds/[:depositRefundType]/detail/[:depositRefundID]',
  //       component: load('application/stockist/components/StockistConsignmentDepositArea'),
  //       name: 'Stockist Consignment Deposit Area',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_deposit',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'funds/[:depositRefundType]/new',
  //       component: load('application/stockist/components/StockistConsignmentDepositArea'),
  //       name: 'New Stockist Consignment Refund',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_deposit',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'funds/[:depositRefundType]/detail/[:depositRefundID]',
  //       component: load('application/stockist/components/StockistConsignmentDepositArea'),
  //       name: 'Stockist Consignment Refund Area',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_deposit',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'consignment/orders/sales/list',
  //       component: load('application/stockist/components/StockistConsignmentOrderList'),
  //       name: 'Stockist Consignment Order List',
  //       meta: {
  //         title: 'Common.menu.stockist_consignment_order',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'consignment/orders/sales/detail/[:consignmentType]/[:consignmentID]',
  //       component: load('application/stockist/components/StockistConsignmentOrderReturnArea'),
  //       name: 'Stockist Consignment Order Area',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_consignment_order_area',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'consignment/orders/sales/new/[:consignmentType]',
  //       component: load('application/stockist/components/StockistConsignmentOrderReturnArea'),
  //       name: 'New Stockist Consignment Order',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_new_consignment_order',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'consignment/orders/return/list',
  //       component: load('application/stockist/components/StockistConsignmentReturnList'),
  //       name: 'Stockist Consignment Return List',
  //       meta: {
  //         title: 'Common.menu.stockist_consignment_return_list',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'consignment/orders/return/detail/[:consignmentType]/[:consignmentID]',
  //       component: load('application/stockist/components/StockistConsignmentOrderReturnArea'),
  //       name: 'Stockist Consignment Return Area',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_consignment_return_detail',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'consignment/orders/return/[:consignmentType]/new',
  //       component: load('application/stockist/components/StockistConsignmentOrderReturnArea'),
  //       name: 'New Stockist Consignment Return',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_new_consignment_return',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'consignment/stock/report',
  //       component: load('application/stockist/components/StockistConsignmentStockReport'),
  //       name: 'Stockist Consignment Stock Report',
  //       meta: {
  //         title: 'Common.menu.stockist_consignment_stock_report',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'transactions/list',
  //       component: load('application/stockist/components/StockistDailyTransactionList'),
  //       name: 'Stockist Daily Transaction',
  //       meta: {
  //         title: 'Common.menu.stockist_daily_transaction',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'transactions/list/[:stockistID]',
  //       component: load('application/stockist/components/StockistDailyTransactionList'),
  //       name: 'Stockist Daily Transaction List',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_daily_transaction',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'payment/verification',
  //       component: load('application/stockist/components/StockistPaymentVerification'),
  //       name: 'Stockist Payment Verification',
  //       meta: {
  //         title: 'Common.menu.stockist_payment_verification',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'collection/daily/report',
  //       component: load('application/stockist/components/StockistDailyCollectionReport'),
  //       name: 'Daily Collection Report',
  //       meta: {
  //         title: 'Common.menu.stockist_daily_collection_report',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'view/[:stockistUserID]',
  //       component: load('application/stockist/components/StockistRegistration'),
  //       name: 'Stockist Update',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.stockist_setup',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     }
  //   ]
  // }
]
