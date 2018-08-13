import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  salesList: {
    list: {
      data: [],
      total: 0
    }
  },
  orderData: {
    uplineUserID: '',
    downlineUserID: '',
    orderID: '',
    downlineOrder: false,
    corporateOrder: false
  },
  salesCancellationData: {
    userID: '',
    invoiceID: '',
    searchByTaxInvoice: false,
    cancellationID: '',
    searchByCancellationID: false
  },
  productExchangeData: {
    userID: '',
    invoiceID: '',
    searchByTaxInvoice: false,
    exchangeID: '',
    searchByExchangeID: false
  },
  selectedFilters: {
    countryID: '',
    filterCountryName: '',
    filterCountryCode: '',
    filterDateRangeFrom: '',
    filterDateRangeTo: '',
    filterTerms: '',
    filterDeliveryMethods: null,
    filterDeliveryStatus: null,
    filterChannel: null,
    filterOrderStatus: null,
    filterDepositRefundType: '',
    filterDepositRefundStatus: ''
  },
  salesProductSearchList: {
    list: {
      data: [],
      total: '0'
    }
  },
  salesInvoiceSearchList: {
    list: []
  },
  salesInvoiceListing: {
    list: {
      data: [],
      total: 0
    }
  },
  salesCancellationList: {
    list: {
      data: [],
      total: 0
    }
  },
  productExchangeList: {
    list: {
      data: [],
      total: 0
    }
  },
  cartPwpItemsTempList: [],
  cartPwpValidationIds: [],
  paymentOptions: {
    list: []
  },
  salesData: {},
  salesAddresses: [],
  cartPromotionalRowCurrentStatus: [],
  aeonPaymentList: {
    list: {
      data: [],
      total: 0
    }
  },
  eppPaymentList: {
    list: {
      data: [],
      total: 0
    }
  },
  salesExchangeData: {
    data: {}
  },
  eppMotoApprovalResponse: {
    data: {}
  },
  eppMotoRejectionResponse: {
    data: {}
  },
  enrollmentTypeList: {
    list: []
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
