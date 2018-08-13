import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      masterData: state => state.globalCMP.masterData.data.list
    })
  },
  mounted () {
    this.getMastersWithKey(this.master)
  },
  data: () => ({
    master: {
      keys: []
    }
  }),
  methods: {
    ...mapActions([
      'getMastersWithKey'
    ]),
    masterDataOptionsCreator (key, optionalCompressionData) {
      if (typeof this.masterData[key] !== 'undefined') {
        // Special case used when need to compare master data value with user specified
        if (typeof optionalCompressionData !== 'undefined') {
          let union = this.masterData[key].filter(original => optionalCompressionData.find(compare => original.id === compare))
          return union.map(opt => ({label: opt.title, value: opt.id}))
        }
        // Change map value key if needed
        return this.masterData[key].map(opt => ({label: opt.title, value: opt.id}))
      }
      return []
    }
  }
}
