import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  memberList: {
    list: {
      data: [],
      total: 0
    }
  },
  memberTree: {},
  tabsData: {
    data: []
  },
  memberData: {
    data: {}
  },
  memberSearchData: {
    list: []
  },
  memberMultiFunctionTreeData: {},
  memberRankList: {
    list: {
      data: {
        member: {},
        member_rank: []
      }
    }
  },
  highestRankList: {
    list: []
  },
  enrollmentRankList: {
    list: []
  },
  memberMigrationList: {
    list: {
      data: {
        member: {},
        member_migrate: []
      }
    }
  },
  memberStatusList: {
    list: {
      data: {
        member: {},
        member_status: []
      }
    }
  },
  memberWalletTransactionList: {
    list: {
      data: [],
      total: 0
    }
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
