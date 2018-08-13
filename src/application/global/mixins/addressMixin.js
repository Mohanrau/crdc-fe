import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      masterData: state => state.globalCMP.masterData.data.list,
      countriesOptions: state => state.globalCMP.countriesOptions.data,
      fields: state => state.globalCMP.dynamicContentData.data,
      statesOptions: state => state.globalCMP.statesOptions.data,
      citiesOptions: state => state.globalCMP.citiesOptions.data,
      storeAddresses: state => state.salesCMP.salesAddresses
    })
  },
  data: () => ({
    selectedAddress: '',
    selectedCountry: '',
    selectedCountryByIndex: [],
    // Enable or disable preload states and city on load
    enableMixinInitCheck: true,
    addresses: []
  }),
  created () {
    if (this.storeAddresses.length > 0) {
      this.$set(this.addresses, this.storeAddresses)
    }
  },
  mounted () {
    this.initMixin(this.enableMixinInitCheck)
  },
  methods: {
    ...mapActions([
      'getDynamicContentAction',
      'getStateAction',
      'getCitiesAction'

    ]),
    initMixin (status) {
      let statesRequested = []
      let citiesRequested = []
      if (this.addresses.length > 0 && status) {
        this.addresses.forEach(obj => {
          Object.entries(obj).forEach((entry) => {
            const [key, value] = entry
            if (key === 'fields') {
              value.forEach(item => {
                if (item.key === 'countries') {
                  if (!statesRequested.includes(item.value)) {
                    if (item.value !== '' && item.value !== null) {
                      statesRequested.push(item.value)
                      this.setStates(item.value)
                    }
                  }
                }
                if (item.key === 'states') {
                  if (!citiesRequested.includes(item.value)) {
                    if (item.value !== '' && item.value !== null) {
                      citiesRequested.push(item.value)
                      this.setCities(item.value)
                    }
                  }
                }
              })
            }
          })
        })
      }
    },
    setSelectedAddress (index) {
      this.selectedAddress = index
      this.selectedCountry = ''
    },
    sortDynamicFields (fields) {
      return _.orderBy(fields, 'order', 'asc')
    },
    // Return back current index after sorting based on order to make sure inline with original array
    setDynamicFieldIndex (fields, index) {
      return fields.findIndex(x => x.index === index)
    },
    setDynamicFieldKeyOptionsData (key, identifier, index1, index2) {
      let name = key + 'Options'
      if (typeof this[name] !== 'undefined') {
        if (key === 'states') {
          let country = this.addresses[this.selectedAddress].fields.find(x => x.key === 'countries')
          return this[name].options.filter((item) => item.country_id === country.value)
        }
        if (key === 'cities') {
          let stateFieldIndex = this.addresses[index1].fields.findIndex(x => x.key === 'states')
          return this[name].options.filter((item) => item.state_id === this.addresses[index1].fields[stateFieldIndex].value)
        }
        return this[name].options
      } else {
        return []
      }
    },
    setAddressFormat () {
      if (this.addresses[this.selectedAddress].fields.length < 1) {
        let query = {
          country_id: this.getSelectedAddressCountryId(),
          types: ['address']
        }
        this.getDynamicContentAction(query).then((res) => {
          if (typeof this.fields.address !== 'undefined' && this.fields.address.length > 0) {
            JSON.parse(this.fields.address).forEach((items) => {
              items.fields.forEach((field) => {
                if (field.type === 'select') {
                  this.setSelectDataValue(field.value, field.type)
                }
                if (field.key === 'countries') {
                  field.value = this.selectedCountry
                  this.setStates(this.selectedCountry)
                }
                this.addresses[this.selectedAddress].fields.push(field)
              })
            })
          }
        })
      }
    },
    setSelectDataValue (id, key, type) {
      let name = key + 'Options'
      if (typeof this[name] !== 'undefined') {
        if (typeof this[name].options !== 'undefined') {
          let value = this[name].options.find(x => x.value === id)
          if (typeof value !== 'undefined') {
            return value.label
          }
        }
      }
      return ''
    },
    setCountrySelectionOnSelectedAddress () {
      let selectedIndex = this.selectedCountryByIndex.findIndex(item => item.index === this.selectedAddress)
      if (selectedIndex !== -1) {
        this.selectedCountryByIndex.pop(selectedIndex)
      }
      this.selectedCountryByIndex.push({index: this.selectedAddress, country_id: this.selectedCountry})
      this.setAddressFormat()
    },
    getSelectedAddressCountryId () {
      if (typeof this.selectedCountryByIndex !== 'undefined') {
        let id = this.selectedCountryByIndex.filter(item => item.index === this.selectedAddress)
        if (id.length > 0) {
          return id[0].country_id
        }
      }
      return 0
    },
    setStates (id) {
      if (id !== null) {
        let query = {
          country_id: id,
          relations: ['states']
        }
        this.getStateAction(query)
      }
    },
    setCities (id, index1) {
      if (index1 !== undefined) {
        let fieldIndex = this.addresses[index1].fields.findIndex((x) => x.key === 'cities')
        if (fieldIndex !== -1) {
          this.addresses[index1].fields[fieldIndex].value = ''
        }
      }
      if (typeof id !== 'undefined' && id !== null && id !== '') {
        let query = {
          state_id: id
        }
        this.getCitiesAction(query)
      }
    },
    setAddressFields (copyFrom, copyTo) {
      let copyFromData = this.addresses[copyFrom].fields
      if (copyFromData.length > 0) {
        this.addresses[copyTo].fields = JSON.parse(JSON.stringify(copyFromData))
      }
    },
    removeLastComma (str) {
      return str.replace(/,(\s+)?$/, '')
    }
  }
}
