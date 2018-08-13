import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  stockistRegistrationList: {
    list: {
      data: [],
      total: 0
    }
  },
  stockistRegistrationData: {
    userID: '',
    registrationID: '',
    stockistOrderID: '',
    stockistDepositID: ''
  },
  stockistConsignmentDepositList: {
    list: {
      data: [],
      total: 0
    }
  },
  stockistSearchData: {
    list: []
  },
  stockistData: {
  },
  stockistOrderReturnList: {
    list: {
      data: [],
      total: 0
    }
  },
  stockistDepositRefundList: {
    list: {
      data: [],
      total: 0
    }
  },
  stockistDailyTransactionList: {
    list: {
      data: [],
      total: 0
    }
  },
  stockistDailyTransactionPayments: {
    list: []
  },
  stockistSearchedProduct: {},
  stockistARSummaryList: {
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
