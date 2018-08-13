import {
  SET_SMART_LIBRARY_OPTIONS,
  SET_SMART_LIBRARY_FORM_DATA,
  SET_SMART_LIBRARY_LIST_DATA,
  SET_SMART_LIBRARY_PRODUCT_DATA,
  SET_SMART_LIBRARY_FILE_TYPE_DATA
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_SMART_LIBRARY_PRODUCT_DATA] (state, payload) {
    Vue.set(state.productSearchData, 'list', payload.list)
  },
  [SET_SMART_LIBRARY_FILE_TYPE_DATA] (state, payload) {
    Vue.set(state.smartLibraryFileTypeData, 'list', payload.list)
  },
  [SET_SMART_LIBRARY_OPTIONS] (state, options) {
    Vue.set(state.smartLibraryOptions, 'data', options)
  },
  [SET_SMART_LIBRARY_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_SMART_LIBRARY_LIST_DATA] (state, payload) {
    Vue.set(state.smartLibraryList, 'list', payload.list)
  }
}
