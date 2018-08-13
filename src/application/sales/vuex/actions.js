import { put, post, get } from '../../../helpers/api'
import { api } from '../api'
import {
  SET_SALES_LIST_DATA,
  IS_PROCESSING_TABLE,
  IS_PROCESSING_SECTION,
  SET_SALES_PRODUCTS_LIST_DATA,
  SET_SALES_INVOICE_LIST_DATA,
  SET_ORDER_CANCELLATION_SEARCH_LIST,
  SHOW_NOTIFICATION,
  VALIDATION_FAILED,
  IS_PROCESSING_FORM,
  SET_PAYMENT_OPTIONS,
  SET_SALES_DATA,
  IS_PROCESSING_CART,
  SET_PRODUCT_EXCHANGE_SEARCH_LIST,
  SET_AEON_SEARCH_LIST,
  SET_EPP_SEARCH_LIST,
  SET_SALES_EXCHANGE_DATA,
  SET_TAX_INVOICE_LISTING,
  SET_EPP_MOTO_APPROVAL_RESPONSE_DATA,
  SET_EPP_MOTO_REJECTION_RESPONSE_DATA,
  SET_BACK_OFFICE_ENROLLMENT_TYPE
} from '../../../store/types'

export const getSalesListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.salesListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_SALES_LIST_DATA, {
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

export const getDownlineValidationAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.downlineValidation, query)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error.response)
      })
  })
}

export const getClassicCheckAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.classicCheck, query)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error.response.data)
      })
  })
}

export const getSalesProductSearchAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.salesProductSearch, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_SALES_PRODUCTS_LIST_DATA, {
          data: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getSalesInvoiceSearchAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.taxInvoiceSearch, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data.data
        commit(SET_SALES_INVOICE_LIST_DATA, {
          list: {
            data: json.map(opt => ({
              label: opt.invoice_number,
              value: opt.id,
              sublabel: opt.invoice_number,
              transactionDate: opt.invoice_date,
              userID: opt.sale.user_id
            })),
            total: response.data.total
          }
        })
        const json2 = response.data
        commit(SET_TAX_INVOICE_LISTING, {
          list: json2
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getSalesInvoiceDetail = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.taxInvoiceDetail, query)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error.response.data)
        reject(error)
      })
  })
}

export const getSalesProductEligibleAction = ({commit}, query) => {
  commit(IS_PROCESSING_CART, true)
  return new Promise((resolve, reject) => {
    post(api.salesProductEligible, query)
      .then(response => {
        commit(IS_PROCESSING_CART, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_CART, false)
        reject(error.response.data)
      })
  })
}

export const getSalesCancellationInvoiceDetailAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.salesCancellationInvoiceDetailSearch, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const createUpdateSalesCancellation = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.salesCancellationCreation, query)
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

export const getSalesCancellationSearchAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.salesCancellationListingSearch, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_ORDER_CANCELLATION_SEARCH_LIST, {
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

export const getSalesCancellationDetail = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.salesCancellationDetail, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
        reject(error)
      })
  })
}

export const downloadTaxInvoicePDF = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.retrieveTaxInvoicePDF, query)
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

export const downloadCreditNotePDF = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.retrieveCreditNotePDF, query)
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

export const postSalesAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.sales, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        const json = response.data
        if (json.workflow !== null && json.workflow !== undefined && json.sales_data !== null && json.sales_data !== undefined) {
          json.sales_data.workflow = json.workflow
        }
        commit(SET_SALES_DATA, {
          data: json.sales_data
        })
        commit(SHOW_NOTIFICATION, {title: 'Sales creation', message: 'operation.success', type: 'positive'})
        resolve(response)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        if (typeof error.response !== 'undefined' && typeof error.response.data !== 'undefined') {
          commit(VALIDATION_FAILED, {errors: error.response.data})
        }
        commit(SHOW_NOTIFICATION, {title: 'Sales creation', message: 'operation.failed', type: 'negative'})
        reject(error)
      })
  })
}

export const getSalesDataAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.salesDetails, query)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        const json = response.data
        if (json.workflow !== null && json.workflow !== undefined && json.sales_data !== null && json.sales_data !== undefined) {
          json.sales_data.workflow = json.workflow
        }
        commit(SET_SALES_DATA, {
          data: json.sales_data
        })
        resolve(response)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error)
      })
  })
}

export const getPaymentModesAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.paymentModes, query)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        const json = response.data
        commit(SET_PAYMENT_OPTIONS, {
          list: json
        })
        resolve(response)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error)
      })
  })
}

export const makePaymentAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.makePayment, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Payment', message: 'operation.success', type: 'positive'})
        resolve(response)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        if (typeof error.response !== 'undefined' && typeof error.response.data !== 'undefined') {
          commit(VALIDATION_FAILED, {errors: error.response.data})
        }
        commit(SHOW_NOTIFICATION, {title: 'Payment', message: 'operation.failed', type: 'negative'})
        reject(error)
      })
  })
}

export const getProductExchangeSearchAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.productExchangeListingSearch, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_PRODUCT_EXCHANGE_SEARCH_LIST, {
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

export const getProductExchangeCreationAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.productExchangeCreation, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(VALIDATION_FAILED, {errors: error.response.data})
        reject(error.response.data)
      })
  })
}

export const getProductExchangeDetailAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.productExchangeDetail, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        const json = response.data
        commit(SET_SALES_EXCHANGE_DATA, {
          data: json.sales_exchange_data
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const salesCancellationBatchProcessRefund = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.cancellationBatchProcessRefund, query)
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

export const downloadExchangeBillPDF = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.retriveExchangeBillPDF, query)
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

export const putSalesAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    put(api.sales + '/' + query.sales_data.sale_id, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        const json = response.data
        commit(SET_SALES_DATA, {
          data: json.sales_data
        })
        commit(SHOW_NOTIFICATION, {title: 'Sales update', message: 'operation.success', type: 'positive'})
        resolve(response)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        if (typeof error.response !== 'undefined' && typeof error.response.data !== 'undefined') {
          commit(VALIDATION_FAILED, {errors: error.response.data})
        }
        commit(SHOW_NOTIFICATION, {title: 'Sales update', message: 'operation.failed', type: 'negative'})
        reject(error)
      })
  })
}

export const createUpdateLegacySalesCancellation = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.legacySalesCancellationCreation, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getAeonPaymentListingSearchAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.aeonPaymentList, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_AEON_SEARCH_LIST, {
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

export const aeonPaymentBatchReleaseAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.aeonBatchRelease, query)
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

export const getEppPaymentListSearchAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.eppPaymentList, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_EPP_SEARCH_LIST, {
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

export const getDailySalesReportAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.dailySalesReport, query)
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

export const submitEppApprovalAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.submitEppApproval, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SET_EPP_MOTO_APPROVAL_RESPONSE_DATA, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const submitAeonAgreementNumberAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.submitAeonAgreementNumber, query)
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

export const downloadPreOderNote = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.downloadPreOrderNote, query)
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

export const batchCancelPaymentAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.batchCancelPayment, query)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SET_EPP_MOTO_REJECTION_RESPONSE_DATA, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const convertEppMotoSalesOrderAction = ({commit}, query) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.convertEppMotoSales, query)
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

export const downloadAmpInvoice = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.downloadAmpInvoice, query)
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

export const getEnrollmentTypeByCountryAction = ({commit}, countryID) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    get(api.enrollmentTypeByCountry + countryID)
      .then(response => {
        commit(IS_PROCESSING_SECTION, false)
        commit(SET_BACK_OFFICE_ENROLLMENT_TYPE, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        commit(IS_PROCESSING_SECTION, false)
        reject(error)
      })
  })
}
