import { get, post, del } from '../../../helpers/api'
import { api } from '../api'
import {
  IS_PROCESSING_FORM,
  IS_PROCESSING_TABLE,
  SET_FORM_DATA,
  IS_PROCESSING,
  SET_SMART_LIBRARY_PRODUCT_DATA,
  SET_SMART_LIBRARY_FILE_TYPE_DATA,
  SET_SMART_LIBRARY_LIST_DATA,
  SHOW_NOTIFICATION,
  VALIDATION_FAILED
} from '../../../store/types'

export const getSmartLibraryProductAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.smartLibraryProduct, query)
      .then(response => {
        const json = response.data.data
        commit(SET_SMART_LIBRARY_PRODUCT_DATA, {
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
export const getSmartLibraryFileTypeAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.smartLibraryFileType, query)
      .then(response => {
        const json = response.data.data
        commit(SET_SMART_LIBRARY_FILE_TYPE_DATA, {
          list: json.map(opt => ({label: opt.name, value: opt.code}))
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
export const getSmartLibraryListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.smartLibraryListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_SMART_LIBRARY_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getSmartLibraryAction = ({commit}, id) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    get(api.smartLibrary + '/' + id)
      .then(response => {
        const json = response.data
        // Simple hack to change switch state active or inactive
        // Since element ui v-model expecting true:false but API return 1:0
        // TODO Find optimal solutions
        if (json.new_joiner_essential_tools) {
          json.new_joiner_essential_tools = true
        } else {
          json.new_joiner_essential_tools = false
        }
        if (json.upload_file_data === json.upload_file_link) {
          json.upload_file_user = true
        } else {
          json.upload_file_user = false
        }
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response)
      })
  })
}
export const createSmartLibraryAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.smartLibrary, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create Smart Library', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const updateSmartLibraryAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.smartLibrary, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Smart Library', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const deleteSmartLibraryAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.smartLibrary + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete Smart Library', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
