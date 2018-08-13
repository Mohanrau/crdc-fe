import _ from 'lodash'
import { logout } from 'src/services/authService'
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      masterData: state => state.globalCMP.masterData.data.list
    })
  },
  methods: {
    ...mapActions([
      'logoutAction'
    ]),
    // to make first letter caps - upper/lower cases
    capitalizeFirst: function (value) {
      if (!value) return ''
      value = value.toString().toLowerCase()
      return value.charAt(0).toUpperCase() + value.slice(1)
    },
    optionsTransformars (data, label, value, sublabel) {
      if (data.length > 0) {
        return data.map(opt => ({
          label: label ? opt[label] : '',
          value: value ? opt[value] : '',
          sublabel: sublabel ? opt[sublabel] : ''
        }))
      }
      return []
    },
    getMasterDataIdByKeyAndTitle (key, title) {
      let data = this.masterData[key]
      if (typeof data !== 'undefined' && data.length > 0) {
        let row = data.find(x => x.title === title)
        if (typeof row !== 'undefined' && Object.keys(row).length > 0) {
          return row.id
        }
      }
      return ''
    },
    keyValueObjectToOptionsGenerator (data) {
      let options = []
      if (data !== undefined && Object.keys(data).length > 0) {
        Object.keys(data).forEach(function (key) {
          let obj = {
            value: key,
            label: data[key]
          }
          options.push(obj)
        })
      }
      return options
    },
    removeFalsyValues (data) {
      return _(data).omitBy(_.isUndefined).omitBy(_.isNull).value()
    },
    isFalsy (value) {
      return Boolean(value)
    },
    decodeJSON (json) {
      json = JSON.parse(json)
      return json
    },
    isDef (value) {
      return value !== undefined && value !== null
    },
    isUndef (value) {
      return value === undefined || value === null
    },
    logoutHandler () {
      logout()
      this.logoutAction().then(() => {
        this.$router.push({name: 'Auth'})
      })
    }
  }
}
