import Vue from 'vue'

export default {
  tableProductList: (state) => {
    return state.productList
  },
  locationOptions: (state) => {
    if (typeof state.saveData.data !== 'undefined') {
      if (typeof state.saveData.data.location !== 'undefined') {
        let options = state.saveData.data.location.list.map(opt => ({
          label: opt.name,
          value: opt.id
        }))
        return options
      }
    }
    return []
  },
  taxable: (state) => {
    // Check taxable if tax object exist
    if (typeof state.saveData.data !== 'undefined') {
      if (typeof state.saveData.data.tax !== 'undefined') {
        return false
      }
    }
    return true
  },
  taxRate: (state) => {
    // Check taxable if tax object exist
    if (typeof state.saveData.data !== 'undefined') {
      if (typeof state.saveData.data.tax !== 'undefined' && Object.keys(state.saveData.data.tax).length > 0) {
        return state.saveData.data.tax.rate
      }
    }
    return 0.00
  },
  taxLabel: (state) => {
    if (typeof state.saveData.data !== 'undefined') {
      if (typeof state.saveData.data.tax !== 'undefined') {
        if (typeof state.saveData.data.tax.code !== 'undefined') {
          return state.saveData.data.tax.tax_desc + ' ' + Vue.prototype.$t('Common.inclusive.label') + ' (' + state.saveData.data.tax.code + ')'
        }
      }
    }
    return ''
  },
  currencyLabel: (state) => {
    if (typeof state.saveData.data !== 'undefined') {
      if (typeof state.saveData.data.currency !== 'undefined' && state.saveData.data.currency !== null) {
        if (typeof state.saveData.data.currency.code !== 'undefined' && state.saveData.data.currency.code !== null) {
          return state.saveData.data.currency.code
        }
      }
    }
    return ''
  },
  getKittingQualifiedBaseCV: (state) => {
    return state.kittingQualifiedBaseCV.data
  },
  tableKittingList: (state) => {
    return state.kittingList
  },
  tableProductGroupingList: (state) => {
    return state.productGroupingList
  },
  tablePwpFocList: (state) => {
    return state.pwpFocList
  }
}
