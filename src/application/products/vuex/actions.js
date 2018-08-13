import { post, put, del } from 'src/helpers/api'
import { api } from '../api'
import {
  SET_PRODUCT_LIST_DATA,
  IS_PROCESSING_TABLE,
  IS_PROCESSING,
  SET_PRODUCT_SEARCH_DATA,
  IS_PROCESSING_FORM,
  SHOW_NOTIFICATION,
  VALIDATION_FAILED,
  SET_PRODUCT_DATA,
  SET_KITTING_LIST_DATA,
  SET_PRODUCT_LESS_DATA,
  SET_PRODUCT_KITTING_DATA,
  SET_PRODUCT_GROUPING_LIST_DATA,
  SET_PRODUCT_GROUPING_DATA,
  IS_PROCESSING_SECTION,
  SET_PRODUCT_CATEGORIES_LIST_DATA,
  SET_PWP_FOC_LIST_DATA,
  SET_PWP_FOC_DATA
} from '../../../store/types'

export const getProductByIdAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.productById, query)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_DATA, {
          data: json
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const getProductLessByIdAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.productLessById, query)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_LESS_DATA, {
          data: json
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const updateStandardProductAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    // Remove if parent not selected to avoid validation error
    put(api.productSave + '/' + data.product_id, data)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_DATA, {
          data: json
        })
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'standard.product.setup', message: 'operation.success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const getProductListingAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.products, query)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_LIST_DATA, {
          list: json
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

export const getProductSearchAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.productSearch, query)
      .then(response => {
        const json = response.data.data
        commit(SET_PRODUCT_SEARCH_DATA, {
          list: json.map(opt => ({label: opt.sku, value: opt.id, sublabel: opt.name}))
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const getKittingListingAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.kitting, query)
      .then(response => {
        const json = response.data
        commit(SET_KITTING_LIST_DATA, {
          list: json
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

export const removeUploadedImageAction = ({commit}, image) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    del(api.productRemoveImageById + '/' + image.id)
      .then(response => {
        commit(IS_PROCESSING, false)
        commit(SHOW_NOTIFICATION, {title: 'Deleted', message: 'image.deleted', type: 'positive'})
        resolve(response)
      })
      .catch(error => {
        commit(IS_PROCESSING, false)
        commit(SHOW_NOTIFICATION, {title: 'Error', message: error, type: 'negative'})
        reject(error.response)
      })
  })
}

export const getKittingProductByIdAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.productKittingById, query)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_KITTING_DATA, {
          data: json
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const createKittingProductAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    // Remove if parent not selected to avoid validation error
    post(api.productKittingSave, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'kitting.product.setup', message: 'operation.success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const getProductGroupingListingAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.productGroupingList, query)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_GROUPING_LIST_DATA, {
          list: json
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

export const createProductGroupingAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    // Remove if parent not selected to avoid validation error
    post(api.createProductGrouping, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Product Grouping Setup', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getProductGroupingDetailByIdAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.getProductGroupingDetail, query)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_GROUPING_DATA, {
          data: json
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING, false)
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getProductCategoriesAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_SECTION, true)
    post(api.productCategories, query)
      .then(response => {
        const json = response.data
        commit(SET_PRODUCT_CATEGORIES_LIST_DATA, {
          data: json
        })
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        console.log(error.response)
        if (error !== 'Cancel') {
          commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        }
        reject(error)
      })
  })
}

export const getPwpFocListingAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.pwpFoc, query)
      .then(response => {
        const json = response.data
        commit(SET_PWP_FOC_LIST_DATA, {
          list: json
        })
        resolve(response.data)
        commit(IS_PROCESSING_TABLE, false)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const createPwpFocAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    // Remove if parent not selected to avoid validation error
    post(api.PwpFocSave, data)
      .then(response => {
        const json = response.data
        commit(SET_PWP_FOC_DATA, {
          data: json
        })
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'PWP & FOC Setup', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getKittingSearchAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.kittingSearch, query)
      .then(response => {
        const json = response.data.data
        commit(SET_PRODUCT_SEARCH_DATA, {
          list: json.map(opt => ({label: opt.code, value: opt.id, sublabel: opt.name}))
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getPwpFocByIdAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.pwpFocById, query)
      .then(response => {
        const json = response.data
        commit(SET_PWP_FOC_DATA, {
          data: json
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING, false)
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error)
      })
  })
}
