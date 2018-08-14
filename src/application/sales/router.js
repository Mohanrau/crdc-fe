/* eslint-disable no-unused-vars */
function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/sales/management/'

export default [
  // {
  //   path: MODULE_PATH,
  //   component: load('application/sales/components/Sales'),
  //   name: 'Sales',
  //   meta: {
  //     title: 'Common.menu.sales',
  //     menuItem: true,
  //     requiresAuth: true
  //   },
  //   children: [
  //     {
  //       path: MODULE_PATH + 'enrollment',
  //       component: load('application/sales/components/BackOfficeEnrollment'),
  //       name: 'Enrolment',
  //       meta: {
  //         title: 'Enrolment',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'sales/list',
  //       component: load('application/sales/components/SalesList'),
  //       name: 'New Sales & Order History',
  //       meta: {
  //         title: 'Common.menu.sub.sales.newSalesOrderHistory',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'rental/list',
  //       component: load('application/sales/components/RentalSalesList'),
  //       name: 'New Rental Sales & Rental Order History',
  //       meta: {
  //         title: 'New Rental Sales & Rental Order History',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'new',
  //       component: load('application/sales/components/SalesOrderArea'),
  //       name: 'New Sales Order',
  //       meta: {
  //         title: 'Common.menu.sub.sales.newSales',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'rental/view/[:saleID]',
  //       component: load('application/sales/components/RentalSalesOrderArea'),
  //       name: 'View Rental Sales Order',
  //       props: true,
  //       meta: {
  //         title: 'View Rental Sales Order',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'rental/new',
  //       component: load('application/sales/components/RentalSalesOrderArea'),
  //       name: 'New Rental Sales Order',
  //       meta: {
  //         title: 'New Rental Sales Order',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'view/[:saleID]',
  //       component: load('application/sales/components/SalesOrderArea'),
  //       name: 'View Sales Order',
  //       props: true,
  //       meta: {
  //         title: 'View Sales Order',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'cancellation/list',
  //       component: load('application/sales/components/SalesCancellationList'),
  //       name: 'Sales Order Cancellation List',
  //       meta: {
  //         title: 'Common.menu.sub.sales.sales_cancellation',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'cancellation/new',
  //       component: load('application/sales/components/SalesCancellationArea'),
  //       name: 'New Sales Cancellation',
  //       meta: {
  //         title: 'Common.menu.sub.sales.sales_cancellation',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'cancellation/view/[:cancellationID]',
  //       component: load('application/sales/components/SalesCancellationArea'),
  //       name: 'Sales Cancellation Detail',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.sub.sales.sales_cancellation',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'exchange/list',
  //       component: load('application/sales/components/SalesExchangeList'),
  //       name: 'Sales Exchange List',
  //       meta: {
  //         title: 'Common.menu.sub.sales.product_exchange',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'exchange/new',
  //       component: load('application/sales/components/SalesExchangeArea'),
  //       name: 'New Sales Exchange',
  //       meta: {
  //         title: 'Common.menu.sub.sales.product_exchange',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'exchange/view/[:exchangeID]',
  //       component: load('application/sales/components/SalesExchangeArea'),
  //       name: 'Sales Exchange Detail',
  //       props: true,
  //       meta: {
  //         title: 'Common.menu.sub.sales.product_exchange',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'cancellation/legacy/[:cancellationID]',
  //       component: load('application/sales/components/LegacySalesCancellationArea'),
  //       name: 'Legacy Sales Cancellation Detail',
  //       props: true,
  //       meta: {
  //         title: 'Legacy Sales Cancellation Detail',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'cancellation/legacy/new',
  //       component: load('application/sales/components/LegacySalesCancellationArea'),
  //       name: 'New Legacy Sales Cancellation',
  //       props: true,
  //       meta: {
  //         title: 'New Legacy Sales Cancellation',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'exchange/legacy/[:exchangeID]',
  //       component: load('application/sales/components/LegacySalesExchangeArea'),
  //       name: 'Legacy Product Exchange Detail',
  //       props: true,
  //       meta: {
  //         title: 'Legacy Product Exchange Detail',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'exchange/legacy/new',
  //       component: load('application/sales/components/LegacySalesExchangeArea'),
  //       name: 'New Legacy Product Exchange',
  //       props: true,
  //       meta: {
  //         title: 'New Legacy Product Exchange',
  //         icon: 'attach_money',
  //         menuItem: false
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'report/daily',
  //       component: load('application/sales/components/SalesDailyReport'),
  //       name: 'Daily Sales Report',
  //       meta: {
  //         title: 'Daily Sales Report',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'aeon/list',
  //       component: load('application/sales/components/AeonPaymentList'),
  //       name: 'Aeon Payment List',
  //       meta: {
  //         title: 'Aeon Payment List',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     },
  //     {
  //       path: MODULE_PATH + 'epp/list',
  //       component: load('application/sales/components/EPPPaymentList'),
  //       name: 'EPP Payment List',
  //       meta: {
  //         title: 'EPP Payment List',
  //         icon: 'attach_money',
  //         menuItem: true
  //       }
  //     }
  //   ]
  // }
]
