import {
  SHOW_NOTIFICATION,
  VALIDATION_FAILED,
  CLEAR_VALIDATION,
  // Todo Make processing items as object
  IS_PROCESSING,
  IS_PROCESSING_FORM,
  IS_PROCESSING_TABLE,
  IS_PROCESSING_LIST,
  IS_PROCESSING_SECTION,
  SET_FORM_DATA,
  RESET_ERRORS,
  OPEN_CLOSE_MODAL_FORM,
  CURRENT_UPDATE_ID,
  SET_USER_TYPES,
  SET_SIMPLE_PAGINATION_DATA,
  SET_COUNTRIES,
  SET_CATEGORIES,
  SET_MASTER_DATA,
  SET_LANGUAGES,
  SET_DYNAMIC_CONTENT_DATA,
  SET_COUNTRIES_STATE_CITIES,
  SET_COUNTRIES_STATES,
  SET_TRASH_DATA,
  SET_COUNTRIES_BANKS,
  SET_DONE,
  SET_MEMBER_SEARCH_DATA,
  SET_COUNTRY_RELATION_DATA,
  SET_HEADER_SEARCH_BAR_FIELD,
  SET_COMMISSION_WEEK_SEARCH_DATA,
  SET_USER_INFO,
  IS_PROCESSING_CART,
  UNSET_SIMPLE_PAGINATION_DATA,
  SET_WEBSOCKET_STATUS,
  WRITE_CHANNEL_DATA,
  SET_UPLOADER_FILE_UPLOAD_SETTING,
  UNSET_CHANNEL_DATA,
  SET_COUNTRIES_CALL_CODE,
  IS_PROCESSING_REFRESH_TOKEN,
  SET_FILTER_DATA,
  UNSET_FILTER_DATA,
  SET_GIRO_TYPE,
  SET_STOCK_LOCATIONS,
  SET_LOCATION_TYPES
} from '../../../store/types'
import { FILTER_DATA } from '../../../store/localStorageKeys'
import Vue from 'vue'
import _ from 'lodash'

export default {
  [SHOW_NOTIFICATION] (state, action) {
    state.notification = {...action}
  },
  [VALIDATION_FAILED] (state, {errors}) {
    // Todo Set Array using Vue.set
    Vue.set(state.errors, 'data', errors)
    // state.errors = errors
  },
  [CLEAR_VALIDATION] (state, name) {
    if (typeof state.errors.data[name] !== 'undefined') {
      Vue.delete(state.errors.data, name)
    }
  },
  [RESET_ERRORS] (state) {
    state.errors = []
  },
  [SET_FORM_DATA] (state, payload) {
    Vue.set(state.formData, 'formData', payload.formData)
  },
  [IS_PROCESSING] (state, status) {
    if (status) {
      state.errors = {}
    }
    state.isProcessing = status
  },
  [IS_PROCESSING_FORM] (state, status) {
    if (status) {
      state.errors = {}
    }
    state.isProcessingForm = status
  },
  [IS_PROCESSING_TABLE] (state, status) {
    if (status) {
      state.errors = {}
    }
    state.isProcessingTable = status
  },
  [IS_PROCESSING_LIST] (state, status) {
    if (status) {
      state.errors = {}
    }
    state.isProcessingList = status
  },
  [IS_PROCESSING_SECTION] (state, status) {
    if (status) {
      state.errors = {}
    }
    state.isProcessingSection = status
  },
  [IS_PROCESSING_CART] (state, status) {
    if (status) {
      state.errors = {}
    }
    state.isProcessingCart = status
  },
  [OPEN_CLOSE_MODAL_FORM] (state, payload) {
    // Make global error empty if unrelated errors occurred
    if (!payload.status && state.errors.data) {
      state.errors = {}
    }
    Vue.set(state.openCloseModalForm, 'modalData', payload)
  },
  [CURRENT_UPDATE_ID] (state, id) {
    state.currentUpdateId = id
  },
  [SET_USER_TYPES] (state, options) {
    Vue.set(state.userTypes, 'data', options)
  },
  [SET_SIMPLE_PAGINATION_DATA] (state, payload) {
    // foreach loop set key value using lodash
    // Vue.set used to maintain object reactivity
    if (!payload.unique) {
      _.forOwn(payload, function (value, key) {
        if (key === 'search' && key.value !== '') {
          Vue.set(state.simplePagination, 'offset', 0)
          Vue.set(state.simplePagination, 'search', payload.search)
        } else if (key === 'limit' || key.value === 0) {
          Vue.set(state.simplePagination, 'limit', payload.limit)
        } else if (key === 'currentPage' || key.value === 0) {
          Vue.set(state.simplePagination, 'currentPage', payload.currentPage)
        } else if (key === 'offset' || key.value === 0) {
          Vue.set(state.simplePagination, 'offset', payload.offset)
        }
      })
    } else {
      // custom unique pagination
      let key = Object.keys(payload)[1]
      state.simplePagination[key] = payload[key]
    }
  },
  [UNSET_SIMPLE_PAGINATION_DATA] (state) {
    state.simplePagination = {
      currentPage: 1,
      limit: 10,
      offset: 0,
      search: ''
    }
  },
  [SET_COUNTRIES] (state, options) {
    // state.roles.country
    Vue.set(state.countriesOptions, 'data', options)
  },
  [SET_CATEGORIES] (state, options) {
    Vue.set(state.categoriesOptions, 'data', options)
  },
  [SET_MASTER_DATA] (state, payload) {
    Vue.set(state.masterData, 'data', payload)
  },
  [SET_LANGUAGES] (state, options) {
    Vue.set(state.languagesOptions, 'data', options)
  },
  [SET_DYNAMIC_CONTENT_DATA] (state, payload) {
    Vue.set(state.dynamicContentData, 'data', payload.data)
  },
  [SET_COUNTRIES_STATES] (state, payload) {
    Vue.set(state.statesOptions, 'data', payload)
  },
  [SET_COUNTRIES_STATE_CITIES] (state, payload) {
    Vue.set(state.citiesOptions, 'data', payload)
  },
  [SET_TRASH_DATA] (state, payload) {
    state.trashData.data.push(payload)
  },
  [SET_COUNTRIES_BANKS] (state, payload) {
    Vue.set(state.banksOptions, 'data', payload)
  },
  [SET_DONE] (state, status) {
    state.done = status
  },
  [SET_MEMBER_SEARCH_DATA] (state, payload) {
    Vue.set(state.memberSearchDataGlobal, 'list', payload.list)
  },
  [SET_COUNTRY_RELATION_DATA] (state, payload) {
    Vue.set(state.countryRelation, 'data', payload.data)
  },
  [SET_HEADER_SEARCH_BAR_FIELD] (state, value) {
    state.headerSearchBarField = value
  },
  [SET_COMMISSION_WEEK_SEARCH_DATA] (state, payload) {
    Vue.set(state.commissionWeeks, 'list', payload.list)
  },
  [SET_USER_INFO] (state, payload) {
    Vue.set(state.userInfo, 'data', payload.data)
  },
  [SET_WEBSOCKET_STATUS] (state, status) {
    Vue.set(state.websocket, 'connected', status)
  },
  [WRITE_CHANNEL_DATA] (state, payload) {
    state.websocket.channels.push(payload)
  },
  [SET_COUNTRIES_CALL_CODE] (state, options) {
    Vue.set(state.countriesCallCodeOptions, 'data', options)
  },
  [UNSET_CHANNEL_DATA] (state, payload) {
    let channelIndex = state.websocket.channels.findIndex(x => x.channel === payload)
    state.websocket.channels.splice(channelIndex, 1)
  },
  [SET_UPLOADER_FILE_UPLOAD_SETTING] (state, payload) {
    Vue.set(state.uploaderFileUploadSetting, 'data', payload)
  },
  [IS_PROCESSING_REFRESH_TOKEN] (state, status) {
    if (status) {
      state.errors = {}
    }
    state.isProcessingRefreshToken = status
  },
  [SET_FILTER_DATA] (state, payload) {
    localStorage.setItem(FILTER_DATA, JSON.stringify(payload))
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.selectedFilters, key, payload[key])
    })
  },
  [UNSET_FILTER_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.delete(state.selectedFilters, key)
    })
  },
  [SET_GIRO_TYPE] (state, payload) {
    Vue.set(state.giroTypes, 'list', payload.list)
  },
  [SET_STOCK_LOCATIONS] (state, payload) {
    Vue.set(state.stockLocations, 'list', payload.list)
  },
  [SET_LOCATION_TYPES] (state, payload) {
    Vue.set(state.locationTypes, 'list', payload.list)
  }
}
