import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  smartLibraryList: {
    list: {
      dat: [],
      total: 0
    }
  },
  productSearchData: {
    list: []
  },
  smartLibraryFileTypeData: {
    list: []
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
