import {lowerThenCapitalize} from 'src/helpers/filters/index'
import {get, post} from '../../../helpers/api'
import {api} from '../api'
import {
  CLEAR_VALIDATION,
  CURRENT_UPDATE_ID,
  IS_PROCESSING,
  IS_PROCESSING_SECTION,
  IS_PROCESSING_LIST,
  OPEN_CLOSE_MODAL_FORM,
  RESET_ERRORS,
  SET_CATEGORIES,
  SET_COMMISSION_WEEK_SEARCH_DATA,
  SET_COUNTRIES,
  SET_COUNTRIES_BANKS,
  SET_COUNTRIES_CALL_CODE,
  SET_COUNTRIES_STATE_CITIES,
  SET_COUNTRIES_STATES,
  SET_COUNTRY_RELATION_DATA,
  SET_DONE,
  SET_DYNAMIC_CONTENT_DATA,
  SET_LANGUAGES,
  SET_MASTER_DATA,
  SET_MEMBER_SEARCH_DATA,
  SET_SIMPLE_PAGINATION_DATA,
  SET_UPLOADER_FILE_UPLOAD_PROCESS,
  SET_UPLOADER_FILE_UPLOAD_SETTING,
  SET_USER_INFO,
  SET_USER_TYPES,
  SHOW_NOTIFICATION,
  SET_GIRO_TYPE,
  SET_STOCK_LOCATIONS,
  SET_LOCATION_TYPES
} from '../../../store/types'
import _ from 'lodash'

export const resetErrorsAction = ({commit}) => {
  commit(RESET_ERRORS)
}

export const clearValidationAction = ({commit}, name) => {
  commit(CLEAR_VALIDATION, name)
}

export const isProcessingAction = ({commit}, status) => {
  commit(IS_PROCESSING, status)
}
export const openCloseModalAction = ({commit}, payload) => {
  commit(OPEN_CLOSE_MODAL_FORM, payload)
}
export const currentUpdateIdAction = ({commit}, payload) => {
  commit(CURRENT_UPDATE_ID, payload)
}
export const getUserTypesAction = ({commit}) => {
  return new Promise((resolve, reject) => {
    get(api.userTypes)
      .then(response => {
        const json = response.data
        commit(SET_USER_TYPES, {
          options: json.map(opt => ({label: lowerThenCapitalize(opt.name), value: opt.id}))
        })
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response.data)
      })
  })
}
export const setSimplePaginationAction = ({commit}, payload) => {
  return new Promise((resolve) => {
    commit(SET_SIMPLE_PAGINATION_DATA, payload)
    resolve(payload)
  })
}

export const getCountriesAction = ({commit}) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    let query = {
      active: 1,
      limit: 100,
      order: 'asc'
    }
    post(api.countries, query)
      .then(response => {
        const json = response.data.data
        commit(SET_COUNTRIES, {
          options: json.map(opt => ({
            label: lowerThenCapitalize(opt.name),
            value: opt.id,
            code: opt.code,
            code_iso_2: opt.code_iso_2
          }))
        })
        commit(SET_COUNTRIES_CALL_CODE, {
          options: json.map(opt => ({
            label: opt.code_iso_2 + ' +' + opt.call_code,
            value: opt.id,
            code: opt.call_code
          }))
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error.response)
        commit(IS_PROCESSING_SECTION, false)
      })
  })
}

export const getCategoriesAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.categories, query)
      .then(response => {
        const json = response.data.data
        commit(SET_CATEGORIES, {
          options: json.map(opt => ({label: lowerThenCapitalize(opt.name), value: opt.id}))
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error.response)
        commit(IS_PROCESSING_SECTION, false)
      })
  })
}

export const getMastersWithKey = ({state, commit}, keys) => {
  commit(IS_PROCESSING_SECTION, true)
  commit(SET_DONE, false)
  return new Promise((resolve, reject) => {
    post(api.mastersKey, keys)
      .then(response => {
        let json = response.data
        // Merge with previous list to to avoid same keys duplication
        if (Object.keys(state.masterData.data.list).length > 0) {
          json = {...json, ...state.masterData.data.list}
        }
        commit(SET_MASTER_DATA, {
          list: json
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
        commit(SET_DONE, true)
      })
      .catch(error => {
        reject(error)
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        commit(IS_PROCESSING_SECTION, false)
        commit(SET_DONE, false)
      })
  })
}

export const uploadSuccessAction = ({commit}) => {
  commit(SHOW_NOTIFICATION, {title: 'Success :', message: 'Images uploaded.', type: 'positive'})
}
export const uploadErrorsAction = ({commit}, payload) => {
  commit(SHOW_NOTIFICATION, {title: 'Upload Error :', message: payload, type: 'warning'})
}

export const getLanguagesAction = ({commit}, query = {}) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.languages, query)
      .then(response => {
        const json = response.data.data
        commit(SET_LANGUAGES, {
          options: json.map(opt => ({label: lowerThenCapitalize(opt.name), value: opt.id, key: opt.key}))
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error.response)
        commit(IS_PROCESSING_SECTION, false)
      })
  })
}

export const getDynamicContentAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_SECTION, true)
    post(api.dynamicContent, query)
      .then(response => {
        const json = response.data
        commit(SET_DYNAMIC_CONTENT_DATA, {
          data: json
        })
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error.response.data)
      })
  })
}

export const getStateAction = ({state, commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.countryRelation, query)
      .then(response => {
        let json = response.data
        let newStates = []
        newStates = json.states.map(opt => ({
          label: lowerThenCapitalize(opt.name),
          value: opt.id,
          country_id: opt.country_id
        }))
        if (Object.keys(state.statesOptions.data.options).length > 0) {
          // Merge options to avoid duplication retain list
          newStates = _.uniqBy([...newStates, ...state.statesOptions.data.options], 'value')
        }
        commit(SET_COUNTRIES_STATES, {
          options: newStates
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error.response)
        commit(IS_PROCESSING_SECTION, false)
      })
  })
}
export const getCitiesAction = ({state, commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    get(api.states + query.state_id)
      .then(response => {
        let json = response.data
        let newCities = json.cities.map(opt => ({
          label: lowerThenCapitalize(opt.name),
          value: opt.id,
          state_id: opt.state_id
        }))
        if (Object.keys(state.citiesOptions.data.options).length > 0) {
          // Merge options to avoid duplication retain list
          newCities = _.uniqBy([...newCities, ...state.citiesOptions.data.options], 'value')
        }
        commit(SET_COUNTRIES_STATE_CITIES, {
          options: newCities
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error.response)
        commit(IS_PROCESSING_SECTION, false)
      })
  })
}

export const getCountriesBankAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    post(api.countryRelation, query)
      .then(response => {
        let json = response.data
        commit(SET_COUNTRIES_BANKS, {
          options: json.banks.map(opt => ({
            label: lowerThenCapitalize(opt.name),
            value: opt.id,
            swift_code: opt.swift_code
          }))
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error.response)
        commit(IS_PROCESSING_SECTION, false)
      })
  })
}
export const getMemberSearchAction = ({commit}, query) => {
  commit(IS_PROCESSING, true)
  return new Promise((resolve, reject) => {
    post(api.searchMember, query)
      .then(response => {
        const json = response.data.data
        commit(SET_MEMBER_SEARCH_DATA, {
          list: json.map(opt => ({
            label: opt.name,
            value: opt.user.old_member_id,
            userID: opt.user_id,
            sublabel: opt.user.old_member_id.toString()
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

export const getCountryRelationAction = ({commit}, query) => {
  commit(IS_PROCESSING, true)
  return new Promise((resolve, reject) => {
    post(api.countryRelation, query)
      .then(response => {
        const json = response.data
        commit(SET_COUNTRY_RELATION_DATA, {
          data: json
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const getCommissionWeekSearchAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.commissionWeek, query)
      .then(response => {
        const json = response.data.data
        commit(SET_COMMISSION_WEEK_SEARCH_DATA, {
          list: json.map(opt => ({label: opt.cw_name, value: opt.id}))
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

export const getUserDetailsAction = ({commit}) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    get(api.userDetails)
      .then(response => {
        const json = response.data
        commit(SET_USER_INFO, {
          data: json
        })
        resolve(response.data)
        commit(IS_PROCESSING_SECTION, false)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Uh oh! An error occured', message: error, type: 'negative'})
        reject(error)
        commit(IS_PROCESSING_SECTION, false)
      })
  })
}

export const updateWorkflowAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.workflowUpdate, query)
      .then(response => {
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getUploaderFileUploadSetting = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.fileUploadSetting, query)
      .then(response => {
        commit(SET_UPLOADER_FILE_UPLOAD_SETTING, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getUploaderFileUploadProcess = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.fileUploadSetting, query)
      .then(response => {
        commit(SET_UPLOADER_FILE_UPLOAD_PROCESS, response.data)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getGiroTypeAction = ({commit}, query) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    get(api.giroType + '/' + query.country_id)
      .then(response => {
        const json = response.data.giro_types
        commit(SET_GIRO_TYPE, {
          list: json.map(opt => ({label: opt, value: opt}))
        })
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getInventoryProcurementSystemAccessTokenAction = ({commit}, query = {}) => {
  commit(IS_PROCESSING, true)
  return new Promise((resolve, reject) => {
    post(api.inventoryProcurementAccessToken, query)
      .then(response => {
        setTimeout(() => {
          commit(IS_PROCESSING, false)
          resolve(response.data)
        }, 1000)
      })
      .catch(error => {
        commit(IS_PROCESSING, false)
        reject(error)
      })
  })
}

export const getStockLocations = ({commit}, query) => {
  commit(IS_PROCESSING_LIST, true)
  return new Promise((resolve, reject) => {
    get(api.stockLocations + '/' + query.location_id)
      .then(response => {
        const json = response.data.stock_locations
        commit(SET_STOCK_LOCATIONS, {
          list: json.map(opt => ({label: opt.code, sublabel: opt.name, value: opt.id}))
        })
        commit(IS_PROCESSING_LIST, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_LIST, false)
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        reject(error)
      })
  })
}

export const getLocationTypeList = ({commit}, query) => {
  commit(IS_PROCESSING_LIST, true)
  return new Promise((resolve, reject) => {
    post(api.getLocationTypes, query)
      .then(response => {
        const json = response.data.data
        commit(SET_LOCATION_TYPES, {
          list: json.map(opt => ({label: opt.name, value: opt.id}))
        })
        commit(IS_PROCESSING_LIST, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_LIST, false)
        commit(SHOW_NOTIFICATION, {title: 'error.found', message: error, type: 'negative'})
        reject(error)
      })
  })
}
