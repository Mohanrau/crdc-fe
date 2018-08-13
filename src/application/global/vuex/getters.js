export default {
  pagination: (state) => {
    let data = {
      limit: state.simplePagination.limit,
      offset: state.simplePagination.offset
    }
    return data
  },
  paginationQuery: (state) => (uuid) => {
    let query
    if (uuid !== undefined && state.simplePagination[uuid] !== undefined) {
      query = '?limit=' + state.simplePagination[uuid].limit + '&offset=' + state.simplePagination[uuid].offset + '&search=' + state.simplePagination[uuid].search
    } else {
      query = '?limit=' + state.simplePagination.limit + '&offset=' + state.simplePagination.offset + '&search=' + state.simplePagination.search
    }
    return query
  },
  currentUpdateId: (state) => {
    return state.currentUpdateId
  },
  commissionWeeks: (state) => {
    return state.commissionWeeks
  },
  locationsOptionsByCountry: (state) => {
    if (typeof state.countryRelation.data.entity !== 'undefined') {
      if (typeof state.countryRelation.data.entity.locations !== 'undefined' && state.countryRelation.data.entity.locations.length > 0) {
        return state.countryRelation.data.entity.locations.map(opt => ({
          label: opt.code + ' - ' + opt.name,
          value: opt.id,
          type_id: opt.location_types_id,
          country_id: state.countryRelation.data.entity.country_id
        }))
      }
    }
    return []
  },
  stocklocationsOptionsByCountry: (state) => {
    return state.stockLocations.list
  },
  currencyLabelByCountry: (state) => {
    if (typeof state.countryRelation.data !== 'undefined') {
      if (typeof state.countryRelation.data.currency !== 'undefined' && state.countryRelation.data.currency !== null) {
        if (typeof state.countryRelation.data.currency.code !== 'undefined' && state.countryRelation.data.currency.code !== null) {
          return state.countryRelation.data.currency.code
        }
      }
    }
    return ''
  },
  callCodeOptionsByCountry: (state) => {
    return state.countriesCallCodeOptions.data.options
  },
  stockLocationsOptionsByCountry: (state) => {
    if (typeof state.countryRelation.data.stock_location !== 'undefined') {
      return state.countryRelation.data.stock_location.map(opt => ({
        label: opt.code + ' - ' + opt.name,
        value: opt.id,
        sublabel: opt.name,
        country_id: state.countryRelation.data.entity.country_id
      }))
    }
    return []
  },
  formData: (state) => {
    if (Object.keys(state.formData).length > 0) {
      return JSON.parse(JSON.stringify(state.formData.formData))
    }
  },
  giroTypeByCountry: (state) => {
    if (state.giroTypes.list.length > 0) {
      return state.giroTypes.list
    } else {
      return []
    }
  },
  getLocationTypes: (state) => {
    if (state.locationTypes.list.length > 0) {
      return state.locationTypes.list
    } else {
      return []
    }
  },
  getSelectedFilters: (state) => {
    return state.selectedFilters
  },
  getUserType: (state) => {
    let type = ''
    if (state.userInfo.data.user_type !== undefined) {
      type = state.userInfo.data.user_type
    }
    return type
  },
  compareCountry: (state) => (id, code) => {
    let isExist = state.countriesOptions.data.options.findIndex((x) => x.value === id && x.code_iso_2 === code)
    if (isExist !== -1) {
      return true
    }
    return false
  }
}
