import { post } from '../../../helpers/api'
import { api } from '../api'
import {
  SET_STOCKIST_REGISTRATION_LIST,
  IS_PROCESSING_TABLE,
  VALIDATION_FAILED,
  IS_PROCESSING_FORM,
  SET_STOCKIST_DATA,
  SET_STOCKIST_ORDER_RETURN_LIST,
  SET_STOCKIST_DEPOSIT_REFUND_LIST,
  IS_PROCESSING,
  SHOW_NOTIFICATION,
  SET_STOCKIST_LIST_SEARCH_DATA,
  SET_STOCKIST_DAILY_TRANSACTION_LIST,
  SET_STOCKIST_DAILY_TRANSACTION_PAYMENTS,
  IS_PROCESSING_SECTION,
  SET_STOCKIST_SEARCH_PRODUCT, SET_STOCKIST_AR_SUMMARY_LIST
} from '../../../store/types'

export const getStockistListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.stockistListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data.data
        commit(SET_STOCKIST_REGISTRATION_LIST, {
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
export const createUpdateStockist = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.stockistCreateUpdate, query)
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
export const getExistingStockist = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.loadExistingStockist, query)
      .then(response => {
        const json = response.data.stockist_data
        commit(SET_STOCKIST_DATA, {
          data: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}
export const getStockistOrderReturnListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.loadStockistOrderReturnListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data.data
        commit(SET_STOCKIST_ORDER_RETURN_LIST, {
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

export const submitConsignmentOrderReturnAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.stockistConsignmentOrderReturn, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        console.log('error is upon us', Object.keys(error))
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const getExistingConsignmentOrderReturn = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.loadExistingConsignmentOrderReturn, query)
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

export const submitConsignmentDepositAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.stockistConsignmentDeposit, query)
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

export const getStockistDepositSettingsAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.loadStockistDepositSettings, query)
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

export const getStockistDepositRefundListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.stockistDepositReturnListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data.data
        commit(SET_STOCKIST_DEPOSIT_REFUND_LIST, {
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

export const getExistingStockistDepositRefundAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.loadExistingStockistDepositRefund, query)
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

export const submitConsignmentRefundAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.stockistConsignmentRefund, query)
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

export const getStockistSearchAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.stockistListing, query)
      .then(response => {
        const json = response.data.data
        commit(SET_STOCKIST_LIST_SEARCH_DATA, {
          list: json.map(opt => ({
            label: opt.name,
            value: opt.stockist_number.toString(),
            sublabel: opt.stockist_number.toString(),
            user_id: opt.stockist_user_id,
            stockist_id: opt.id
          }))
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getStockistDailyTransactionListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.loadStockistDailyTransactionList, query)
      .then(response => {
        const json = response.data.stockist_data
        commit(SET_STOCKIST_DATA, {
          data: json
        })
        const payments = response.data.payment_mode
        commit(SET_STOCKIST_DAILY_TRANSACTION_PAYMENTS, {
          list: payments
        })
        const invoiceList = response.data.stockist_invoice
        commit(SET_STOCKIST_DAILY_TRANSACTION_LIST, {
          list: {
            data: invoiceList,
            total: invoiceList.length
          }
        })
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const batchReleaseStockistInvoiceAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.batchReleaseStockistInvoice, query)
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

export const downloadConsignmentOrderReturnNoteAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.downloadConsignmentOrderReturnNote, query)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        commit(IS_PROCESSING_SECTION, false)
        reject(error)
      })
  })
}

export const getReturnProductForStockistAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.stockistReturnProductSearch, query)
      .then(response => {
        const json = response.data
        commit(SET_STOCKIST_SEARCH_PRODUCT, {
          data: json
        })
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const checkStockistEligibleReturnAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    post(api.stockistEligibleReturnCheck, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const getStockistARSummaryAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.stockistARSummary, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data.data
        commit(SET_STOCKIST_AR_SUMMARY_LIST, {
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

export const getStockistPaymentVerificationListAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.stockistPaymentVerificationList, query)
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

export const updateStockistPaymentVerificationAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.stockistPaymentVerificationUpdate, query)
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

export const getDailyCollectionReport = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.dailyCollectionReport, query)
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

export const getStockistConsignmentStockReport = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.stockistConsignmentStockReport, query)
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

export const downloadConsignmentDepositRefundNoteAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.consignmentDepositRefundNote, query)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error)
      })
  })
}
