import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  walletAdjustmentList: {
    list: {
      data: [],
      total: 0
    }
  },
  walletGiroPaymentList: {
    list: {
      data: [],
      total: 0
    }
  },
  walletGiroRejectedPaymentList: {
    list: {
      data: [],
      total: 0
    }
  },
  walletData: {
    userID: '',
    adjustmentID: '',
    filterGiroType: ''
  },
  walletRejectedPaymentResponse: {
    response: ''
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
