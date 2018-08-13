export default {
  tableMemberList: (state) => {
    return state.memberList
  },
  tableMemberMigrationList: (state) => {
    return state.memberMigrationList
  },
  tableMemberStatusList: (state) => {
    return state.memberStatusList
  },
  getMemberData: (state) => {
    return state.memberData.data
  },
  tableMemberTransactionList: (state) => {
    return state.memberWalletTransactionList
  }
}
