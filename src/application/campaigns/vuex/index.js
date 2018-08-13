import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  campaignList: {
    list: {
      data: [],
      total: 0
    }
  },
  esacVoucherTypeList: {
    list: {
      data: [],
      total: 0
    }
  },
  esacVoucherSubTypeList: {
    list: {
      data: [],
      total: 0
    }
  },
  esacPromotionList: {
    list: {
      data: [],
      total: 0
    }
  },
  esacVoucherList: {
    list: {
      data: [],
      total: 0
    }
  },
  esacRedemptionList: {
    list: {
      data: [],
      total: 0
    }
  },
  campaignLocationList: {
    list: {
      data: [],
      total: 0
    }
  },
  teamBonusRankList: {
    list: {
      data: [],
      total: 0
    }
  },
  enrollmentRankList: {
    list: {
      data: [],
      total: 0
    }
  },
  productSearchData: {
    list: []
  },
  orderData: {
    uplineUserID: '',
    downlineUserID: '',
    orderID: '',
    downlineOrder: false
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
