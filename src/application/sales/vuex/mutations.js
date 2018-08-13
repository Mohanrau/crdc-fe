import {
  SET_SALES_LIST_DATA,
  SET_ORDER_DATA,
  UNSET_ORDER_DATA,
  SET_SALES_PRODUCTS_LIST_DATA,
  SET_SALES_INVOICE_LIST_DATA,
  SET_ORDER_CANCELLATION_DATA,
  UNSET_ORDER_CANCELLATION_DATA,
  SET_ORDER_CANCELLATION_SEARCH_LIST,
  SET_CART_PWP_VALIDATION_IDS,
  UNSET_CART_PWP_VALIDATION_IDS,
  UNSET_CART_PWP_ITEM_TEMP_LIST,
  SET_CART_PWP_ITEM_TEMP_LIST,
  SET_PAYMENT_OPTIONS,
  SET_SALES_DATA,
  SET_SALES_ADDRESSES_DATA,
  UNSET_SALES_ADDRESSES_DATA,
  SET_PRODUCT_EXCHANGE_DATA,
  UNSET_PRODUCT_EXCHANGE_DATA,
  ADD_UPDATE_PROMOTIONAL_ROW_CURRENT_STATUS,
  UNSET_PROMOTIONAL_ROW_CURRENT_STATUS,
  SET_PRODUCT_EXCHANGE_SEARCH_LIST,
  SET_AEON_SEARCH_LIST,
  SET_EPP_SEARCH_LIST,
  SET_SALES_EXCHANGE_DATA,
  SET_TAX_INVOICE_LISTING,
  SET_EPP_MOTO_APPROVAL_RESPONSE_DATA,
  SET_EPP_MOTO_REJECTION_RESPONSE_DATA,
  SET_BACK_OFFICE_ENROLLMENT_TYPE
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_SALES_LIST_DATA] (state, payload) {
    Vue.set(state.salesList, 'list', payload.list)
  },
  [SET_ORDER_CANCELLATION_SEARCH_LIST] (state, payload) {
    Vue.set(state.salesCancellationList, 'list', payload.list)
  },
  [SET_ORDER_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.orderData, key, payload[key])
    })
  },
  [UNSET_ORDER_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.delete(state.orderData, key)
    })
  },
  [SET_ORDER_CANCELLATION_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.salesCancellationData, key, payload[key])
    })
  },
  [UNSET_ORDER_CANCELLATION_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.delete(state.salesCancellationData, key)
    })
  },
  [SET_PRODUCT_EXCHANGE_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.productExchangeData, key, payload[key])
    })
  },
  [UNSET_PRODUCT_EXCHANGE_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.delete(state.productExchangeData, key)
    })
  },
  [SET_SALES_PRODUCTS_LIST_DATA] (state, payload) {
    Vue.set(state.salesProductSearchList, 'list', payload.data)
  },
  [SET_SALES_INVOICE_LIST_DATA] (state, payload) {
    Vue.set(state.salesInvoiceSearchList, 'list', payload.list)
  },
  [SET_CART_PWP_VALIDATION_IDS] (state, id) {
    state.cartPwpValidationIds.push(id)
  },
  [UNSET_CART_PWP_VALIDATION_IDS] (state, index) {
    if (typeof index !== 'undefined') {
      state.cartPwpValidationIds.splice(index, 1)
    } else {
      state.cartPwpValidationIds.splice(0, state.cartPwpValidationIds.length)
    }
  },
  [SET_CART_PWP_ITEM_TEMP_LIST] (state, payload) {
    state.cartPwpItemsTempList.push(payload)
  },
  [UNSET_CART_PWP_ITEM_TEMP_LIST] (state, index) {
    if (typeof index !== 'undefined') {
      state.cartPwpItemsTempList.splice(index, 1)
    } else {
      state.cartPwpItemsTempList.splice(0, state.cartPwpItemsTempList.length)
    }
  },
  [SET_PAYMENT_OPTIONS] (state, payload) {
    Vue.set(state.paymentOptions, 'list', payload.list)
  },
  [SET_SALES_DATA] (state, payload) {
    Vue.set(state.salesData, 'data', payload.data)
  },
  [SET_SALES_ADDRESSES_DATA] (state, payload) {
    state.salesAddresses = []
    payload.forEach((item) => {
      state.salesAddresses.push(item)
    })
  },
  [UNSET_SALES_ADDRESSES_DATA] (state) {
    state.salesAddresses.splice(0, state.salesAddresses.length)
  },
  [ADD_UPDATE_PROMOTIONAL_ROW_CURRENT_STATUS] (state, payload) {
    let itemIndex = payload.index
    let data = payload.data
    if (itemIndex !== -1) {
      if (state.cartPromotionalRowCurrentStatus[itemIndex].valid !== data.valid) {
        state.cartPromotionalRowCurrentStatus[itemIndex].valid = data.valid
      }
    } else {
      state.cartPromotionalRowCurrentStatus.push(data)
    }
  },
  [UNSET_PROMOTIONAL_ROW_CURRENT_STATUS] (state, payload) {
    if (typeof payload !== 'undefined') {
      let itemIndex = state.cartPromotionalRowCurrentStatus.findIndex(x => x.promoID === payload.promoID)
      state.cartPromotionalRowCurrentStatus.splice(itemIndex, 1)
    } else {
      state.cartPromotionalRowCurrentStatus.splice(0, state.cartPromotionalRowCurrentStatus.length)
    }
  },
  [SET_PRODUCT_EXCHANGE_SEARCH_LIST] (state, payload) {
    Vue.set(state.productExchangeList, 'list', payload.list)
  },
  [SET_AEON_SEARCH_LIST] (state, payload) {
    Vue.set(state.aeonPaymentList, 'list', payload.list)
  },
  [SET_EPP_SEARCH_LIST] (state, payload) {
    Vue.set(state.eppPaymentList, 'list', payload.list)
  },
  [SET_SALES_EXCHANGE_DATA] (state, payload) {
    Vue.set(state.salesExchangeData, 'data', payload.data)
  },
  [SET_TAX_INVOICE_LISTING] (state, payload) {
    Vue.set(state.salesInvoiceListing, 'list', payload.list)
  },
  [SET_EPP_MOTO_APPROVAL_RESPONSE_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.eppMotoApprovalResponse, 'data', payload)
    })
  },
  [SET_EPP_MOTO_REJECTION_RESPONSE_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.eppMotoRejectionResponse, 'data', payload)
    })
  },
  [SET_BACK_OFFICE_ENROLLMENT_TYPE] (state, payload) {
    Vue.set(state.enrollmentTypeList, 'list', payload)
  }
}
