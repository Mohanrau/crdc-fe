import {FILTER_DATA} from 'src/store/localStorageKeys'
import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  notification: {
    title: '',
    message: '',
    type: ''
  },
  errors: {
    data: {}
  },
  isProcessing: false,
  isProcessingForm: false,
  isProcessingTable: false,
  isProcessingList: false,
  isProcessingSection: false,
  isProcessingCart: false,
  openCloseModalForm: {
    modalData: {}
  },
  currentUpdateId: '',
  userTypes: {
    data: {
      options: []
    }
  },
  simplePagination: {
    currentPage: 1,
    limit: 10,
    offset: 0,
    search: ''
  },
  formData: {},
  countriesOptions: {
    data: {
      options: []
    }
  },
  countriesCallCodeOptions: {
    data: {
      options: []
    }
  },
  categoriesOptions: {
    data: {
      options: []
    }
  },
  masterData: {
    data: {
      list: []
    }
  },
  languagesOptions: {
    data: {
      options: []
    }
  },
  appSettings: {
    debounceDelay: 800,
    shortcuts: [
      {
        module: 'General',
        items: [
          {
            name: 'Save / Create / Update',
            desc: 'Save operation without closing current page',
            shortcut: 'ctrl + alt + s'
          },
          {
            name: 'Save & Close',
            desc: 'Save operation success close current page and redirect to listing page',
            shortcut: 'ctrl + alt + q'
          },
          {
            name: 'Cancel',
            desc: 'Cancel operation close current page and redirect to listing page',
            shortcut: 'ctrl + alt + c'
          },
          {
            name: 'Add',
            desc: 'Open Add item screen in all modules',
            shortcut: 'ctrl + alt + a'
          }
        ]
      }
    ],
    placement: {
      levels: [
        {
          label: '5 Levels',
          value: 5
        },
        {
          label: '10 Levels',
          value: 10
        },
        {
          label: '15 levels',
          value: 15
        },
        {
          label: '20 levels',
          value: 20
        }
      ]
    },
    fallback: {
      table_rows_per_page: 10
    },
    defaulted: {
      table_color: 'amber',
      table_rows_per_page_options: [5, 10, 15, 20, 25, 50],
      table_separators: {
        options: [
          {label: 'Horizontal', value: 'horizontal'},
          {label: 'Vertical', value: 'vertical'},
          {label: 'Cell', value: 'cell'},
          {label: 'None', value: 'none'}
        ],
        selection: 'horizontal'
      }
    },
    tables: {
      products: {
        table_rows_per_page: 10
      },
      kittings: {
        table_rows_per_page: 10
      },
      modules: {
        table_rows_per_page: 10
      },
      sales: {
        table_rows_per_page: 10
      },
      pwp: {
        table_rows_per_page: 10
      },
      users: {
        table_rows_per_page: 15
      }
    },
    notifications: {
      timeout: 6000
    },
    report: {
      dailySalesReport: {
        userTypeId: 2
      }
    }
  },
  dynamicContentData: {
    data: []
  },
  statesOptions: {
    data: {
      options: []
    }
  },
  citiesOptions: {
    data: {
      options: []
    }
  },
  trashData: {
    data: []
  },
  userInfo: {
    data: {}
  },
  banksOptions: {
    data: {
      options: []
    }
  },
  done: false,
  memberSearchDataGlobal: {
    list: []
  },
  countryRelation: {
    data: {}
  },
  headerSearchBarField: '',
  commissionWeeks: {
    list: []
  },
  websocket: {
    connected: false,
    channels: []
  },
  uploaderFileUploadSetting: {
    data: []
  },
  isProcessingRefreshToken: false,
  acl: {
    schema: [
      {
        path: 'sales.management.list',
        items: [
          {
            action: 'order',
            allowed: [
              'sales.management.new.1.backoffice.create',
              'sales.management.new.2.backoffice.create',
              'sales.management.new.3.backoffice.create',
              'sales.management.new.4.backoffice.create',
              'sales.management.new.5.backoffice.create',
              'sales.management.new.6.backoffice.create',
              'sales.management.new.7.backoffice.create',
              'sales.management.new.8.backoffice.create',
              'sales.management.new.9.backoffice.create',
              'sales.management.new.10.stockist.create',
              'sales.management.new.1.stockist.create',
              'sales.management.new.2.stockist.create',
              'sales.management.new.3.stockist.create',
              'sales.management.new.4.stockist.create',
              'sales.management.new.5.stockist.create',
              'sales.management.new.6.stockist.create',
              'sales.management.new.7.stockist.create',
              'sales.management.new.8.stockist.create',
              'sales.management.new.9.stockist.create',
              'sales.management.new.10.stockist.create'
            ]
          }
        ]
      },
      {
        path: 'invoice',
        items: [
          {
            action: 'download',
            allowed: [
              'invoices.download.1.backoffice.download',
              'invoices.download.2.backoffice.download',
              'invoices.download.3.backoffice.download',
              'invoices.download.4.backoffice.download',
              'invoices.download.5.backoffice.download',
              'invoices.download.6.backoffice.download',
              'invoices.download.7.backoffice.download',
              'invoices.download.8.backoffice.download',
              'invoices.download.9.backoffice.download',
              'invoices.download.10.backoffice.download',
              'invoices.download.1.stockist.download',
              'invoices.download.2.stockist.download',
              'invoices.download.3.stockist.download',
              'invoices.download.4.stockist.download',
              'invoices.download.5.stockist.download',
              'invoices.download.6.stockist.download',
              'invoices.download.7.stockist.download',
              'invoices.download.8.stockist.download',
              'invoices.download.9.stockist.download',
              'invoices.download.10.stockist.download'
            ]
          }
        ]
      },
      {
        path: 'sales',
        items: [
          {
            action: 'cancellation.new',
            allowed: [
              'sales.cancellation.new.1.backoffice.new',
              'sales.cancellation.new.2.backoffice.new',
              'sales.cancellation.new.3.backoffice.new',
              'sales.cancellation.new.4.backoffice.new',
              'sales.cancellation.new.5.backoffice.new',
              'sales.cancellation.new.6.backoffice.new',
              'sales.cancellation.new.7.backoffice.new',
              'sales.cancellation.new.8.backoffice.new',
              'sales.cancellation.new.9.backoffice.new',
              'sales.cancellation.new.10.backoffice.new'
            ]
          }
        ]
      },
      {
        path: 'stockist.funds.list',
        items: [
          {
            action: 'deposit',
            allowed: [
              'stockist.funds.new.1.stockist.create',
              'stockist.funds.new.2.stockist.create',
              'stockist.funds.new.3.stockist.create',
              'stockist.funds.new.4.stockist.create',
              'stockist.funds.new.5.stockist.create',
              'stockist.funds.new.6.stockist.create',
              'stockist.funds.new.7.stockist.create',
              'stockist.funds.new.8.stockist.create',
              'stockist.funds.new.9.stockist.create',
              'stockist.funds.new.10.stockist.create',
              'stockist.funds.new.1.backoffice.create',
              'stockist.funds.new.2.backoffice.create',
              'stockist.funds.new.3.backoffice.create',
              'stockist.funds.new.4.backoffice.create',
              'stockist.funds.new.5.backoffice.create',
              'stockist.funds.new.6.backoffice.create',
              'stockist.funds.new.7.backoffice.create',
              'stockist.funds.new.8.backoffice.create',
              'stockist.funds.new.9.backoffice.create',
              'stockist.funds.new.10.backoffice.create',
              'stockist.funds.new.1.stockist_staff.create',
              'stockist.funds.new.2.stockist_staff.create',
              'stockist.funds.new.3.stockist_staff.create',
              'stockist.funds.new.4.stockist_staff.create',
              'stockist.funds.new.5.stockist_staff.create',
              'stockist.funds.new.6.stockist_staff.create',
              'stockist.funds.new.7.stockist_staff.create',
              'stockist.funds.new.8.stockist_staff.create',
              'stockist.funds.new.9.stockist_staff.create',
              'stockist.funds.new.10.stockist_staff.create'
            ]
          },
          {
            action: 'refund',
            allowed: [
              'stockist.funds.new.1.stockist.create',
              'stockist.funds.new.2.stockist.create',
              'stockist.funds.new.3.stockist.create',
              'stockist.funds.new.4.stockist.create',
              'stockist.funds.new.5.stockist.create',
              'stockist.funds.new.6.stockist.create',
              'stockist.funds.new.7.stockist.create',
              'stockist.funds.new.8.stockist.create',
              'stockist.funds.new.9.stockist.create',
              'stockist.funds.new.10.stockist.create',
              'stockist.funds.new.1.backoffice.create',
              'stockist.funds.new.2.backoffice.create',
              'stockist.funds.new.3.backoffice.create',
              'stockist.funds.new.4.backoffice.create',
              'stockist.funds.new.5.backoffice.create',
              'stockist.funds.new.6.backoffice.create',
              'stockist.funds.new.7.backoffice.create',
              'stockist.funds.new.8.backoffice.create',
              'stockist.funds.new.9.backoffice.create',
              'stockist.funds.new.10.backoffice.create',
              'stockist.funds.new.1.stockist_staff.create',
              'stockist.funds.new.2.stockist_staff.create',
              'stockist.funds.new.3.stockist_staff.create',
              'stockist.funds.new.4.stockist_staff.create',
              'stockist.funds.new.5.stockist_staff.create',
              'stockist.funds.new.6.stockist_staff.create',
              'stockist.funds.new.7.stockist_staff.create',
              'stockist.funds.new.8.stockist_staff.create',
              'stockist.funds.new.9.stockist_staff.create',
              'stockist.funds.new.10.stockist_staff.create'
            ]
          }
        ]
      },
      {
        path: 'stockist.funds.details',
        items: [
          {
            action: 'files',
            allowed: [
              'stockist.funds.files.note.download.1.stockist.download',
              'stockist.funds.files.note.download.2.stockist.download',
              'stockist.funds.files.note.download.3.stockist.download',
              'stockist.funds.files.note.download.4.stockist.download',
              'stockist.funds.files.note.download.5.stockist.download',
              'stockist.funds.files.note.download.6.stockist.download',
              'stockist.funds.files.note.download.7.stockist.download',
              'stockist.funds.files.note.download.8.stockist.download',
              'stockist.funds.files.note.download.9.stockist.download',
              'stockist.funds.files.note.download.10.stockist.download',
              'stockist.funds.files.note.download.1.backoffice.download',
              'stockist.funds.files.note.download.2.backoffice.download',
              'stockist.funds.files.note.download.3.backoffice.download',
              'stockist.funds.files.note.download.4.backoffice.download',
              'stockist.funds.files.note.download.5.backoffice.download',
              'stockist.funds.files.note.download.6.backoffice.download',
              'stockist.funds.files.note.download.7.backoffice.download',
              'stockist.funds.files.note.download.8.backoffice.download',
              'stockist.funds.files.note.download.9.backoffice.download',
              'stockist.funds.files.note.download.10.backoffice.download',
              'stockist.funds.files.note.download.1.stockist_staff.download',
              'stockist.funds.files.note.download.2.stockist_staff.download',
              'stockist.funds.files.note.download.3.stockist_staff.download',
              'stockist.funds.files.note.download.4.stockist_staff.download',
              'stockist.funds.files.note.download.5.stockist_staff.download',
              'stockist.funds.files.note.download.6.stockist_staff.download',
              'stockist.funds.files.note.download.7.stockist_staff.download',
              'stockist.funds.files.note.download.8.stockist_staff.download',
              'stockist.funds.files.note.download.9.stockist_staff.download',
              'stockist.funds.files.note.download.10.stockist_staff.download'
            ]
          }
        ]
      },
      {
        path: 'stockist.transaction.list',
        items: [
          {
            action: 'release',
            allowed: [
              'stockist.transactions.release.update.1.stockist.update',
              'stockist.transactions.release.update.2.stockist.update',
              'stockist.transactions.release.update.3.stockist.update',
              'stockist.transactions.release.update.4.stockist.update',
              'stockist.transactions.release.update.5.stockist.update',
              'stockist.transactions.release.update.6.stockist.update',
              'stockist.transactions.release.update.7.stockist.update',
              'stockist.transactions.release.update.8.stockist.update',
              'stockist.transactions.release.update.9.stockist.update',
              'stockist.transactions.release.update.10.stockist.update',
              'stockist.transactions.release.update.1.backoffice.update',
              'stockist.transactions.release.update.2.backoffice.update',
              'stockist.transactions.release.update.3.backoffice.update',
              'stockist.transactions.release.update.4.backoffice.update',
              'stockist.transactions.release.update.5.backoffice.update',
              'stockist.transactions.release.update.6.backoffice.update',
              'stockist.transactions.release.update.7.backoffice.update',
              'stockist.transactions.release.update.8.backoffice.update',
              'stockist.transactions.release.update.9.backoffice.update',
              'stockist.transactions.release.update.10.backoffice.update',
              'stockist.transactions.release.update.1.stockist_staff.update',
              'stockist.transactions.release.update.2.stockist_staff.update',
              'stockist.transactions.release.update.3.stockist_staff.update',
              'stockist.transactions.release.update.4.stockist_staff.update',
              'stockist.transactions.release.update.5.stockist_staff.update',
              'stockist.transactions.release.update.6.stockist_staff.update',
              'stockist.transactions.release.update.7.stockist_staff.update',
              'stockist.transactions.release.update.8.stockist_staff.update',
              'stockist.transactions.release.update.9.stockist_staff.update',
              'stockist.transactions.release.update.10.stockist_staff.update'
            ]
          }
        ]
      }
    ]
  },
  giroTypes: {
    list: []
  },
  selectedFilters: Object.assign({
    countryID: null,
    countryCode: null,
    countryName: null,
    filterDateRangeFrom: '',
    filterDateRangeTo: '',
    filterChannel: null,
    filterDeliveryStatus: null,
    filterDeliveryMethods: null,
    filterOrderStatus: null,
    filterIcVerifiedStatus: 2,
    filterUserID: '',
    fromCreatedAt: null,
    toCreatedAt: null,
    filterMixedFilters: null
  }, JSON.parse(localStorage.getItem(FILTER_DATA))),
  stockLocations: {
    list: []
  },
  locationTypes: {
    list: []
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
