import { get, post, put, del, patch } from '../../../helpers/api'
import { api } from '../api'
import {
  SET_MODULE_OPTIONS,
  VALIDATION_FAILED,
  IS_PROCESSING_FORM,
  IS_PROCESSING_TABLE,
  SET_OPERATIONS_DATA,
  SET_FORM_DATA,
  SET_MODULE_LIST_DATA,
  SHOW_NOTIFICATION,
  IS_PROCESSING_LIST,
  SET_ROLE_GROUP_LIST,
  IS_PROCESSING_SECTION,
  SET_ROLE_GROUP_LIST_WITH_CHILDS,
  SET_MODULE_LIST_DATA_WITH_CHILDS,
  SET_ROLES_LIST,
  SET_MASTER_LIST_DATA,
  SET_MASTER_DATA_OPTIONS,
  SET_MASTER_DATA_LIST_DATA,
  SET_STAFF_LIST_DATA,
  SET_USER_COUNTRY_LOCATIONS_DATA
} from '../../../store/types'
import _ from 'lodash'

export const loadModuleDataByIdAction = ({commit}, id) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    get(api.modules + '/' + id)
      .then(response => {
        const json = response.data
        // Simple hack to change switch state active or inactive
        // Since element ui v-model expecting true:false but API return 1:0
        // TODO Find optimal solutions
        if (json.active) {
          json.active = true
        } else {
          json.active = false
        }
        if (json.parent_id === 0) {
          json.parent_id = ''
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

export const createModuleAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    // Remove if parent not selected to avoid validation error
    if (data.parent_id === '') { delete data.parent_id }
    post(api.modules, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create Module', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const updateModuleAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    // Replace parent_id to 0 before save reason field set as NULL no UNSIGNED
    if (data.parent_id === '') { data.parent_id = 0 }
    patch(api.modules + '/' + data.id, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Module', message: 'Operation success', type: 'positive'})
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

export const deleteModuleAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.modules + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete Module', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getOptionsAction = ({commit}) => {
  return new Promise((resolve, reject) => {
    get(api.modules)
      .then(response => {
        const json = response.data.data
        commit(SET_MODULE_OPTIONS, {
          options: json.map(opt => ({label: opt.label, value: opt.id}))
        })
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response.data)
      })
  })
}

export const getOperationsAction = ({commit}) => {
  return new Promise((resolve, reject) => {
    get(api.operations)
      .then(response => {
        const json = response.data.data
        commit(SET_OPERATIONS_DATA, {
          options: json.map(opt => ({label: opt.name, value: opt.id}))
        })
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response.data)
      })
  })
}

export const getModuleListAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.modulesList, query)
      .then(response => {
        const json = response.data
        commit(SET_MODULE_LIST_DATA, {
          list: json
        })
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const loadRoleGroupDataByIdAction = ({commit}, id) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    get(api.rolesGroup + '/' + id)
      .then(response => {
        const json = response.data
        // Simple hack to change switch state active or inactive
        // Since element ui v-model expecting true:false but API return 1:0
        // TODO Find optimal solutions
        if (json.active) {
          json.active = true
        } else {
          json.active = false
        }
        if (json.parent_id === 0) {
          json.parent_id = ''
        }
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const createRoleGroupAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.rolesGroup, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create Role Group', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const updateRoleGroupAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    put(api.rolesGroup + '/' + data.id, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Role Group', message: 'Operation success', type: 'positive'})
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

export const deleteRoleGroupAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.rolesGroup + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete Role Group', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getRoleGroupListAction = ({commit}, query = '') => {
  commit(IS_PROCESSING_LIST, true)
  return new Promise((resolve, reject) => {
    get(api.rolesGroup + query)
      .then(response => {
        const json = response.data
        commit(SET_ROLE_GROUP_LIST, {
          list: json
        })
        commit(IS_PROCESSING_LIST, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_LIST, false)
        reject(error.response.data)
      })
  })
}

export const getAllRoleGroupAction = ({commit}) => {
  commit(IS_PROCESSING_SECTION, true)
  return new Promise((resolve, reject) => {
    get(api.rolesGroup)
      .then(response => {
        let groupByUserType = _.chain(response.data.data)
          .groupBy(function (item) { return item.user_type.name })
          .toPairs()
          .map(item => _.zipObject(['label', 'options'], item)).value()
        commit(SET_ROLE_GROUP_LIST_WITH_CHILDS, {
          list: groupByUserType
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

export const getAllModuleListAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_SECTION, true)
    get(api.modules)
      .then(response => {
        const json = response.data
        commit(SET_MODULE_LIST_DATA_WITH_CHILDS, {
          list: json
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

export const getRolesListAction = ({commit}, query = '') => {
  commit(IS_PROCESSING_LIST, true)
  return new Promise((resolve, reject) => {
    get(api.roles + query)
      .then(response => {
        const json = response.data
        commit(SET_ROLES_LIST, {
          list: json
        })
        commit(IS_PROCESSING_LIST, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_LIST, false)
        reject(error.response.data)
      })
  })
}

export const roleBuilderAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.roles, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create Role', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const roleBuilderUpdateAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    put(api.roles + '/' + data.id, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Update Role', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const loadRoleDataByIdAction = ({commit}, id) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    get(api.roles + '/' + id)
      .then(response => {
        const json = response.data
        // Simple hack to change switch state active or inactive
        // Since element ui v-model expecting true:false but API return 1:0
        // TODO Find optimal solutions
        if (json.active) {
          json.active = true
        } else {
          json.active = false
        }
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

// Master
export const loadMasterByIdAction = ({commit}, id) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    get(api.masters + '/' + id)
      .then(response => {
        const json = response.data
        // Simple hack to change switch state active or inactive
        // Since element ui v-model expecting true:false but API return 1:0
        json.active = Boolean(Number(json.active))
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const createMasterAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.masters, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create Master', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const updateMasterAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    put(api.masters + '/' + data.id, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Master', message: 'Operation success', type: 'positive'})
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

export const deleteMasterAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.masters + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete Master', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getMasterListAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    get(api.masters + '?' + query)
      .then(response => {
        const json = response.data
        commit(SET_MASTER_LIST_DATA, {
          list: json
        })
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

// Master Data
export const getMasterDataListAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    get(api.mastersData + '?' + query)
      .then(response => {
        const json = response.data
        commit(SET_MASTER_DATA_LIST_DATA, {
          list: json
        })
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const getMasterDataOptionsAction = ({commit}) => {
  return new Promise((resolve, reject) => {
    get(api.masters)
      .then(response => {
        const json = response.data.data
        commit(SET_MASTER_DATA_OPTIONS, {
          options: json.map(opt => ({label: opt.title, value: opt.id}))
        })
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response.data)
      })
  })
}

export const loadMasterDataByIdAction = ({commit}, id) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    get(api.mastersData + '/' + id)
      .then(response => {
        const json = response.data
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}
export const createMasterDataAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.mastersData, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create Master Data', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}
export const updateMasterDataAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    put(api.mastersData + '/' + data.id, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Master Data', message: 'Operation success', type: 'positive'})
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

export const deleteMasterDataAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.mastersData + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete Master Data', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const createStaffAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.staff, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create User', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Create User', message: 'User creation failed', type: 'negative'})
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const updateUserAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.userPrivileges, data)
      .then(response => {
        const json = response.data
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(SHOW_NOTIFICATION, {title: 'Update User', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(SHOW_NOTIFICATION, {title: 'Update User', message: 'User update failed', type: 'negative'})
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const loadUserByIdAction = ({commit}, id) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    get(api.userPrivileges + '/' + id)
      .then(response => {
        const json = response.data
        if (json.active) {
          json.active = true
        } else {
          json.active = false
        }
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Oops something went wrong', message: error.message, type: 'warning'})
        reject(error.response.data)
      })
  })
}

export const getUsersListAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.usersList, query)
      .then(response => {
        const json = response.data
        commit(SET_STAFF_LIST_DATA, {
          list: json
        })
        commit(IS_PROCESSING_TABLE, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error.response.data)
      })
  })
}

export const loadUserLocationsByIdAction = ({commit}, id) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_LIST, true)
    get(api.userLocations + '/' + id)
      .then(response => {
        const json = response.data
        commit(SET_USER_COUNTRY_LOCATIONS_DATA, {
          data: json.data
        })
        commit(IS_PROCESSING_LIST, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_LIST, false)
        commit(SHOW_NOTIFICATION, {title: 'Oops something went wrong', message: error.message, type: 'warning'})
        reject(error.response.data)
      })
  })
}
