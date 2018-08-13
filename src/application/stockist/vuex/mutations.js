import {
  SET_STOCKIST_REGISTRATION_DATA,
  UNSET_STOCKIST_REGISTRATION_DATA,
  SET_STOCKIST_REGISTRATION_LIST,
  SET_STOCKIST_DATA,
  SET_STOCKIST_ORDER_RETURN_LIST,
  SET_STOCKIST_DEPOSIT_REFUND_LIST,
  SET_STOCKIST_LIST_SEARCH_DATA,
  SET_STOCKIST_DAILY_TRANSACTION_LIST,
  SET_STOCKIST_DAILY_TRANSACTION_PAYMENTS,
  SET_STOCKIST_SEARCH_PRODUCT,
  SET_STOCKIST_AR_SUMMARY_LIST
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_STOCKIST_REGISTRATION_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.stockistRegistrationData, key, payload[key])
    })
  },
  [UNSET_STOCKIST_REGISTRATION_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.delete(state.stockistRegistrationData, key)
    })
  },
  [SET_STOCKIST_REGISTRATION_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.stockistRegistrationList, 'list', payload.list)
    })
  },
  [SET_STOCKIST_DATA] (state, payload) {
    Vue.set(state.stockistData, 'data', payload.data)
  },
  [SET_STOCKIST_ORDER_RETURN_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.stockistOrderReturnList, 'list', payload.list)
    })
  },
  [SET_STOCKIST_DEPOSIT_REFUND_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.stockistDepositRefundList, 'list', payload.list)
    })
  },
  [SET_STOCKIST_LIST_SEARCH_DATA] (state, payload) {
    Vue.set(state.stockistSearchData, 'list', payload.list)
  },
  [SET_STOCKIST_DAILY_TRANSACTION_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.stockistDailyTransactionList, 'list', payload.list)
    })
  },
  [SET_STOCKIST_DAILY_TRANSACTION_PAYMENTS] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.stockistDailyTransactionPayments, 'list', payload.list)
    })
  },
  [SET_STOCKIST_SEARCH_PRODUCT] (state, payload) {
    Vue.set(state.stockistSearchedProduct, 'data', payload.data)
  },
  [SET_STOCKIST_AR_SUMMARY_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.stockistARSummaryList, 'list', payload.list)
    })
  }
}
