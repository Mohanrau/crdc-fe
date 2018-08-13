import { get, post } from '../../../helpers/api'
import { api } from '../api'
import {
  SET_REPORT_LIST_DATA,
  IS_PROCESSING_TABLE,
  IS_PROCESSING_FORM
} from '../../../store/types'

export const getReportListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    get(api.mailNotification, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_REPORT_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getTaxInvoiceSummaryReportAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.taxInvoiceSummaryReport, query)
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

export const getTaxInvoiceByProductReportAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.taxInvoiceByProductReport, query)
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

export const getProductSalesReportAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.saleProductReport, query)
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
