import {
  SET_WALLET_DATA,
  UNSET_WALLET_DATA,
  SET_WALLET_ADJUSTMENT_LIST,
  SET_WALLET_GIRO_PAYMENT_LIST,
  SET_WALLET_GIRO_REJECTED_PAYMENT_LIST,
  SET_WALLET_GIRO_REJECTED_PAYMENT_RESPONSE
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_WALLET_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.walletData, key, payload[key])
    })
  },
  [UNSET_WALLET_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.delete(state.walletData, key)
    })
  },
  [SET_WALLET_ADJUSTMENT_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.walletAdjustmentList, 'list', payload.list)
    })
  },
  [SET_WALLET_GIRO_PAYMENT_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.walletGiroPaymentList, 'list', payload.list)
    })
  },
  [SET_WALLET_GIRO_REJECTED_PAYMENT_LIST] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.walletGiroRejectedPaymentList, 'list', payload.list)
    })
  },
  [SET_WALLET_GIRO_REJECTED_PAYMENT_RESPONSE] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.walletRejectedPaymentResponse, 'response', payload)
    })
  }
}
