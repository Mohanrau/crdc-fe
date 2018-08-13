import { get, post, put } from '../../../helpers/api'
import { api } from '../api'
import {
  SET_MEMBER_TREE,
  SET_MEMBERS_TREE,
  SET_MEMBER_TABS_DATA,
  IS_PROCESSING_LIST,
  SET_MEMBER_DATA,
  IS_PROCESSING_FORM,
  SHOW_NOTIFICATION,
  VALIDATION_FAILED,
  SET_MEMBER_LIST_DATA,
  IS_PROCESSING_TABLE,
  IS_PROCESSING,
  SET_MEMBER_LIST_SEARCH_DATA,
  IS_PROCESSING_SECTION,
  SET_MEMBERS_MULTI_FUNCTIONAL_TREE,
  SET_MEMBER_RANK_LIST_DATA,
  SET_MEMBER_HIGHEST_RANK_LIST,
  SET_MEMBER_ENROLLMENT_RANK_LIST,
  SET_MEMBER_MIGRATION_LIST_DATA,
  SET_MEMBERS_STATUS_LIST, SET_MEMBER_TRANSACTION_LIST_DATA
} from '../../../store/types'

export const getMembersTreeAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    get(api.memberPlacementTree, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBERS_TREE, {
          memberTree: json
        })
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const getMemberTabsData = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_LIST, true)
    post(api.memberTabs, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBER_TABS_DATA, {
          data: json
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

export const getMemberByUserIdAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_SECTION, true)
    post(api.memberDetails, query)
      .then(response => {
        const json = response.data.member_data
        commit(SET_MEMBER_DATA, {
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

export const updateMemberAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    // Remove if parent not selected to avoid validation error
    put(api.member + '/' + data.member_data.details.user_id, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Member Data Saving', message: 'operation.success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}

export const getMemberListingAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.members, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBER_LIST_DATA, {
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

export const getMemberTreeAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_SECTION, true)
    post(api.memberPlacementTree, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBER_TREE, {
          memberTree: json
        })
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        commit(SET_MEMBER_TREE, {
          memberTree: {}
        })
        reject(error.response.data)
      })
  })
}

export const sendMemberPassword = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.memberPasswordReset, query)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        // Todo tenp fix remove later after UAT
        commit(SHOW_NOTIFICATION, { title: 'Success', message: 'Password Reset Success', type: 'positive' })
        reject(error)
      })
  })
}

export const getMemberListingSearchAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.members, query)
      .then(response => {
        const json = response.data.data
        commit(SET_MEMBER_LIST_SEARCH_DATA, {
          list: json.map(opt => ({label: opt.name, value: opt.user_id, sublabel: opt.country.code + '-' + opt.user.old_member_id}))
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

export const getMembersOuterTreeAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.memberPlacementOuterTree, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBER_TREE, {
          memberTree: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(SET_MEMBER_TREE, {
          memberTree: {}
        })
        reject(error.response.data)
      })
  })
}

export const getMemberMultiFunctionalTreeAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_SECTION, true)
    post(api.memberTree, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBERS_MULTI_FUNCTIONAL_TREE, {
          list: json
        })
        commit(IS_PROCESSING_SECTION, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_SECTION, false)
        reject(error)
      })
  })
}

export const getMemberRankListDataAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_TABLE, true)
    post(api.memberRankList, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBER_RANK_LIST_DATA, {
          data: json
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

export const updateMemberRankAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.memberRankUpdate, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Member Rank', message: 'Operation success', type: 'positive'})
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

export const getMemberHighestRankAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.memberHighestRank, query)
      .then(response => {
        const json = response.data.data
        commit(SET_MEMBER_HIGHEST_RANK_LIST, {
          list: json.map(opt => ({label: opt.rank_name, value: opt.id}))
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const getMemberEnrollmentRankAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.memberEnrollmentRank, query)
      .then(response => {
        const json = response.data.data
        commit(SET_MEMBER_ENROLLMENT_RANK_LIST, {
          list: json.map(opt => ({label: opt.rank_code, value: opt.id}))
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const getMemberMigrationListAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_FORM, true)
    post(api.memberMigrationList, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBER_MIGRATION_LIST_DATA, {
          data: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const updateMemberMigrationAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.memberMigrationUpdate, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Member Migration', message: 'Operation success', type: 'positive'})
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

export const getMemberStatusListDataAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.memberStatusList, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBERS_STATUS_LIST, {
          data: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}

export const updateMemberStatusAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.memberStatusUpdate, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Member Status', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        commit(IS_PROCESSING_FORM, false)
        reject(error.response.data)
      })
  })
}

export const getMemberTransactionListDataAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    post(api.memberWalletTransactions, query)
      .then(response => {
        const json = response.data
        commit(SET_MEMBER_TRANSACTION_LIST_DATA, {
          data: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, { title: 'error.found', message: error, type: 'negative' })
        reject(error)
      })
  })
}
