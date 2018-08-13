import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  productList: {
    list: {
      data: [],
      total: 0
    }
  },
  kittingList: {
    list: {
      data: [],
      total: 0
    }
  },
  productGroupingList: {
    list: {
      data: [],
      total: 0
    }
  },
  pwpFocList: {
    list: {
      data: [],
      total: 0
    }
  },
  productSearchData: {
    list: []
  },
  saveData: {},
  ProductLessData: {},
  productCategories: {
    list: []
  },
  kittingQualifiedBaseCV: {
    data: 0
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
