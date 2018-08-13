import { post } from '../../../helpers/api'
import { api } from '../api'
import {
  SET_WALLET_ADJUSTMENT_LIST,
  IS_PROCESSING_TABLE,
  VALIDATION_FAILED,
  IS_PROCESSING_FORM,
  SET_WALLET_GIRO_PAYMENT_LIST,
  SET_WALLET_GIRO_REJECTED_PAYMENT_LIST
} from '../../../store/types'

export const getWalletAdjustmentListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.walletAdjustmentList, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data.data
        commit(SET_WALLET_ADJUSTMENT_LIST, {
          list: {
            data: json,
            total: response.data.total
          }
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const createWalletAdjustmentAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.createWalletAdjustment, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const loadExistingWalletAdjustmentAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.loadWalletAdjustment, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        console.error(error)
        // commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const loadGiroPaymentHistoryAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.giroPaymentHistory, query)
      .then(response => {
        const json = response.data
        json.forEach(item => {
          item.data = JSON.parse(item.data)
        })
        commit(SET_WALLET_GIRO_PAYMENT_LIST, {
          list: {
            data: json,
            total: response.data.length
          }
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        // commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const retrieveGiroPaymentDetailAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.giroPaymentDetail, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        // commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const generateGiroPaymentBatchAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.giroPaymentGenerate, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        // commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const getGiroRejectedPaymentListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.giroRejectedPaymentList, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data.data
        commit(SET_WALLET_GIRO_REJECTED_PAYMENT_LIST, {
          list: {
            data: json,
            total: response.data.total
          }
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const submitGiroRejectedPaymentAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.giroRejectedPaymentSubmit, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const submitGiroRejectedLevelOneAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.submitGiroRejectedLevelOne, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const submitGiroRejectedLevelTwoAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.submitGiroRejectedLevelTwo, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}
