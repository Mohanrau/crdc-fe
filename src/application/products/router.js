function load (component) {
  return () => import(`src/${component}.vue`)
}

const MODULE_PATH = '/products/management/'

export default [
  {
    path: MODULE_PATH,
    component: load('application/products/components/Products'),
    name: 'Products',
    meta: {
      title: 'Common.menu.products.management',
      menuItem: true,
      requiresAuth: true
    },
    children: [
      {
        path: MODULE_PATH + 'standard/list',
        component: load('application/products/components/standardProductList'),
        name: 'Standard Products List',
        meta: {
          title: 'Common.menu.sub.products.standard',
          icon: 'drafts',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'standard/setup/[:id]',
        component: load('application/products/components/ProductStandardSetupArea'),
        name: 'Standard Product Setup',
        props: true,
        meta: {
          title: 'Common.menu.sub.products.standard.setup',
          icon: 'add',
          backRoute: MODULE_PATH + 'products/list/standard',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'kitting/list',
        component: load('application/products/components/kittingProductList'),
        name: 'Kitting Products List',
        meta: {
          title: 'Common.menu.sub.products.kitting',
          icon: 'view comfy',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'kitting/setup/[:id?]',
        component: load('application/products/components/ProductKittingSetupArea'),
        name: 'Kitting Product Setup',
        props: true,
        meta: {
          title: 'Common.menu.sub.products.kitting.setup',
          icon: 'add',
          backRoute: MODULE_PATH + 'products/list/kitting',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'grouping/list',
        component: load('application/products/components/ProductGroupingList'),
        name: 'Product Grouping List',
        meta: {
          title: 'Common.menu.sub.products.productGrouping',
          icon: 'favorite',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'grouping/setup/[:id?]',
        component: load('application/products/components/ProductGroupingSetupArea'),
        name: 'Product Grouping Setup',
        props: true,
        meta: {
          title: 'Common.menu.sub.products.productGrouping.setup',
          icon: 'add',
          menuItem: false
        }
      },
      {
        path: MODULE_PATH + 'pwpfoc/list',
        component: load('application/products/components/PwpFocList'),
        name: 'PWP and FOC - List',
        meta: {
          title: 'Common.menu.sub.products.PwpFoc',
          icon: 'loyalty',
          menuItem: true
        }
      },
      {
        path: MODULE_PATH + 'pwpfoc/setup/[:id?]',
        component: load('application/products/components/PwpFocSetupArea'),
        name: 'PWP and FOC Setup',
        props: true,
        meta: {
          title: 'Common.menu.sub.products.PwpFoc.setup',
          icon: 'add',
          menuItem: false
        }
      }
    ]
  }
]
