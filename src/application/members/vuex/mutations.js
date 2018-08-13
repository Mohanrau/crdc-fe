import {
  SET_MEMBER_LIST_DATA,
  SET_MEMBER_TREE,
  SET_MEMBER_TABS_DATA,
  SET_MEMBERS_TREE,
  SET_MEMBER_DATA,
  SET_MEMBER_LIST_SEARCH_DATA,
  SET_MEMBERS_MULTI_FUNCTIONAL_TREE,
  SET_MEMBER_RANK_LIST_DATA,
  SET_MEMBER_HIGHEST_RANK_LIST,
  SET_MEMBER_ENROLLMENT_RANK_LIST,
  SET_MEMBER_MIGRATION_LIST_DATA,
  SET_MEMBERS_STATUS_LIST,
  UNSET_MEMBER_DATA,
  SET_MEMBER_TRANSACTION_LIST_DATA
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_MEMBER_LIST_DATA] (state, payload) {
    Vue.set(state.memberList, 'list', payload.list)
  },
  [SET_MEMBER_TREE] (state, payload) {
    Vue.set(state, 'memberTree', payload.memberTree)
  },
  [SET_MEMBER_TABS_DATA] (state, payload) {
    Vue.set(state.tabsData, 'data', payload.list)
  },
  [SET_MEMBERS_TREE] (state, payload) {
    Vue.set(state, 'memberTree', payload.memberTree)
  },
  [SET_MEMBER_DATA] (state, payload) {
    Vue.set(state.memberData, 'data', payload.data)
  },
  [UNSET_MEMBER_DATA] (state, payload) {
    state.memberData = {
      data: {}
    }
  },
  [SET_MEMBER_LIST_SEARCH_DATA] (state, payload) {
    Vue.set(state.memberSearchData, 'list', payload.list)
  },
  [SET_MEMBERS_MULTI_FUNCTIONAL_TREE] (state, payload) {
    Vue.set(state.memberMultiFunctionTreeData, 'list', payload.list)
  },
  [SET_MEMBER_RANK_LIST_DATA] (state, payload) {
    Vue.set(state.memberRankList, 'list', payload.data)
  },
  [SET_MEMBER_HIGHEST_RANK_LIST] (state, payload) {
    Vue.set(state.highestRankList, 'list', payload.list)
  },
  [SET_MEMBER_ENROLLMENT_RANK_LIST] (state, payload) {
    Vue.set(state.enrollmentRankList, 'list', payload.list)
  },
  [SET_MEMBER_MIGRATION_LIST_DATA] (state, payload) {
    Vue.set(state.memberMigrationList, 'list', payload.data)
  },
  [SET_MEMBERS_STATUS_LIST] (state, payload) {
    Vue.set(state.memberStatusList, 'list', payload.data)
  },
  [SET_MEMBER_TRANSACTION_LIST_DATA] (state, payload) {
    Vue.set(state.memberWalletTransactionList, 'list', payload.data)
  }
}
