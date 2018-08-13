import { post } from 'src/helpers/api'
import { api } from '../api'
import {
  IS_PROCESSING_FORM,
  VALIDATION_FAILED
} from '../../../store/types'

export const getCWIncomeStatementAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    post(api.cwIncomeStatement, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(VALIDATION_FAILED, {errors: error.response.data})
        reject(error)
      })
  })
}

export const getYearlyIncomeReportAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    post(api.yearlyIncomeReport, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(VALIDATION_FAILED, {errors: error.response.data})
        reject(error)
      })
  })
}

export const getStockistCommissionReportAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    post(api.stockistCommission, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(VALIDATION_FAILED, {errors: error.response.data})
        reject(error)
      })
  })
}

export const getCWBonusReportAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    post(api.cwBonusReport, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(VALIDATION_FAILED, {errors: error.response.data})
        reject(error)
      })
  })
}
