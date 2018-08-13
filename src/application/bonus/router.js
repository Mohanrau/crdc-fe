function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/bonus/management/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/bonus/components/Bonus'),
    name: 'Bonus',
    meta: {
      title: 'Common.menu.bonus_management',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'income/statement',
        component: load('application/bonus/components/CWIncomeBonusStatement'),
        name: 'CW Bonus Income Statements',
        meta: {
          title: 'Common.menu.cw_income_statement',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'yearly/reports',
        component: load('application/bonus/components/YearlyIncomeReports'),
        name: 'Yearly Income Statements',
        meta: {
          title: 'Common.menu.yearly_income_statement',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'stockist/commission/reports',
        component: load('application/bonus/components/StockistCommissionStatement'),
        name: 'Stockist Commission Statements',
        meta: {
          title: 'Stockist Commission Statements',
          icon: 'attach_money',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'cw-bonus-report',
        component: load('application/bonus/components/CWIncomeBonusReport'),
        name: 'CW Bonus Report',
        meta: {
          title: 'CW Bonus Report',
          icon: 'attach_money',
          menuItem: true
        }
      }
    ]
  }
]
