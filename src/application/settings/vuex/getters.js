export default {
  tableModuleList: (state) => {
    return state.moduleList
  },
  tableDataRoleGroup: (state) => {
    return state.roleGroupList
  },
  tableDataRoles: (state) => {
    return state.roleList
  },
  tableMasterList: (state) => {
    return state.mastersList
  },
  tableMasterDataList: (state) => {
    return state.mastersDataList
  },
  tableUsersList: (state) => {
    return state.usersList
  },
  userListSearchResult: (state) => {
    if (typeof state.usersList !== 'undefined') {
      if (typeof state.usersList.list !== 'undefined' && state.usersList.list !== null && typeof state.usersList.list.data !== 'undefined' && state.usersList.list.data !== null) {
        return state.usersList.list.data.map(opt => ({
          label: opt.name,
          value: opt.id,
          user_type_id: opt.user_type_id,
          email: state.email
        }))
      }
    }
    return ''
  }
}
