import * as actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  modulesOptions: {
    data: {
      options: []
    }
  },
  operationsOptions: {
    data: {
      options: []
    }
  },
  moduleList: {
    list: {
      data: [],
      total: 0
    }
  },
  roleGroupList: {
    list: {
      data: [],
      total: 0
    }
  },
  allRoleGroupList: {
    list: {
      data: [],
      total: 0
    }
  },
  allModulesList: {
    list: {
      data: [],
      total: 0
    }
  },
  roleList: {
    list: {
      data: [],
      total: 0
    }
  },
  mastersList: {},
  mastersDataOptions: {
    data: {
      options: []
    }
  },
  mastersDataList: {},
  usersList: {
    list: {
      data: [],
      total: 0
    }
  },
  userCountryLocations: {
    data: []
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
