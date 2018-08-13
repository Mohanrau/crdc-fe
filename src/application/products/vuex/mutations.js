import {
  SET_PRODUCT_PAGE_DATA,
  SET_PRODUCT_LIST_DATA,
  SET_PRODUCT_SEARCH_DATA,
  SET_PRODUCT_DATA,
  UNSET_PRODUCT_DATA,
  SET_KITTING_LIST_DATA,
  SET_PRODUCT_LESS_DATA,
  SET_PRODUCT_KITTING_DATA,
  SET_PRODUCT_GROUPING_LIST_DATA,
  SET_PRODUCT_GROUPING_DATA,
  SET_PRODUCT_CATEGORIES_LIST_DATA,
  SET_PWP_FOC_LIST_DATA,
  SET_PWP_FOC_DATA,
  SET_KITTING_QUALIFIED_BASE_CV
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_PRODUCT_PAGE_DATA] (state, data) {
  },
  [SET_PRODUCT_LIST_DATA] (state, payload) {
    Vue.set(state.productList, 'list', payload.list)
  },
  [SET_PRODUCT_SEARCH_DATA] (state, payload) {
    Vue.set(state.productSearchData, 'list', payload.list)
  },
  [SET_PRODUCT_DATA] (state, payload) {
    Vue.set(state.saveData, 'data', payload.data)
  },
  [UNSET_PRODUCT_DATA] (state) {
    Vue.delete(state.saveData, 'data')
  },
  [SET_KITTING_LIST_DATA] (state, payload) {
    Vue.set(state.kittingList, 'list', payload.list)
  },
  [SET_PRODUCT_LESS_DATA] (state, payload) {
    Vue.set(state.ProductLessData, 'data', payload.data)
  },
  [SET_PRODUCT_KITTING_DATA] (state, payload) {
    Vue.set(state.saveData, 'data', payload.data)
  },
  [SET_PRODUCT_GROUPING_LIST_DATA] (state, payload) {
    Vue.set(state.productGroupingList, 'list', payload.list)
  },
  [SET_PRODUCT_GROUPING_DATA] (state, payload) {
    Vue.set(state.saveData, 'data', payload.data)
  },
  [SET_PRODUCT_CATEGORIES_LIST_DATA] (state, payload) {
    Vue.set(state.productCategories, 'list', payload.data)
  },
  [SET_PWP_FOC_LIST_DATA] (state, payload) {
    Vue.set(state.pwpFocList, 'list', payload.list)
  },
  [SET_PWP_FOC_DATA] (state, payload) {
    Vue.set(state.saveData, 'data', payload.data)
  },
  [SET_KITTING_QUALIFIED_BASE_CV] (state, payload) {
    Vue.set(state.kittingQualifiedBaseCV, 'data', payload)
  }
}
