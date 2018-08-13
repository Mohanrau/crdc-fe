function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/reports/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/reports/components/Reports'),
    name: 'Reports',
    meta: {
      title: 'Reports',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'emails/list',
        component: load('application/reports/components/EmailReportList'),
        name: 'Email List',
        meta: {
          title: 'Email Report Lists',
          icon: 'report',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'invoice-summary',
        component: load('application/reports/components/TaxInvoiceSummaryReport'),
        name: 'Tax Invoice Summary Report',
        meta: {
          title: 'Tax Invoice Summary List',
          icon: 'report',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'invoice-by-product',
        component: load('application/reports/components/TaxInvoiceByProductDetailReport'),
        name: 'Tax Invoice By Product Detail Report',
        meta: {
          title: 'Tax Invoice By Product Detail Report',
          icon: 'report',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'product-sales-report',
        component: load('application/reports/components/ProductSalesReport'),
        name: 'Product Sales Report',
        meta: {
          title: 'Product Sales Report',
          icon: 'report',
          menuItem: true
        }
      }
    ]
  }
]
