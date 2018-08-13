import {
  SET_MODULE_OPTIONS,
  SET_OPERATIONS_DATA,
  SET_MODULE_LIST_DATA,
  SET_ROLE_GROUP_LIST,
  SET_ROLE_GROUP_LIST_WITH_CHILDS,
  SET_MODULE_LIST_DATA_WITH_CHILDS,
  SET_ROLES_LIST,
  SET_MASTER_FORM_DATA,
  SET_MASTER_LIST_DATA,
  SET_MASTER_OPTIONS,
  SET_MASTER_DATA_OPTIONS,
  SET_MASTER_DATA_FORM_DATA,
  SET_MASTER_DATA_LIST_DATA,
  SET_STAFF_LIST_DATA,
  SET_USER_COUNTRY_LOCATIONS_DATA,
  UNSET_USER_COUNTRY_LOCATIONS_DATA
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_MODULE_OPTIONS] (state, options) {
    Vue.set(state.modulesOptions, 'data', options)
  },
  [SET_OPERATIONS_DATA] (state, options) {
    Vue.set(state.operationsOptions, 'data', options)
  },
  [SET_MODULE_LIST_DATA] (state, payload) {
    Vue.set(state.moduleList, 'list', payload.list)
  },
  [SET_ROLE_GROUP_LIST] (state, payload) {
    Vue.set(state.roleGroupList, 'list', payload.list)
  },
  [SET_ROLE_GROUP_LIST_WITH_CHILDS] (state, payload) {
    Vue.set(state.allRoleGroupList, 'list', payload.list)
  },
  [SET_MODULE_LIST_DATA_WITH_CHILDS] (state, payload) {
    Vue.set(state.allModulesList, 'list', payload.list)
  },
  [SET_ROLES_LIST] (state, payload) {
    Vue.set(state.roleList, 'list', payload.list)
  },
  [SET_MASTER_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_MASTER_OPTIONS] (state, options) {
    Vue.set(state.mastersOptions, 'data', options)
  },
  [SET_MASTER_LIST_DATA] (state, payload) {
    Vue.set(state.mastersList, 'list', payload.list)
  },
  [SET_MASTER_DATA_OPTIONS] (state, options) {
    Vue.set(state.mastersDataOptions, 'data', options)
  },
  [SET_MASTER_DATA_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_MASTER_DATA_LIST_DATA] (state, payload) {
    Vue.set(state.mastersDataList, 'list', payload.list)
  },
  [SET_STAFF_LIST_DATA] (state, payload) {
    Vue.set(state.usersList, 'list', payload.list)
  },
  [SET_USER_COUNTRY_LOCATIONS_DATA] (state, payload) {
    Vue.set(state.userCountryLocations, 'data', payload.data)
  },
  [UNSET_USER_COUNTRY_LOCATIONS_DATA] (state, payload) {
    Vue.set(state.userCountryLocations, 'data', [])
  }
}
