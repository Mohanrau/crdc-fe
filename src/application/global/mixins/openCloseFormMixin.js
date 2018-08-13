import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData
    })
  },
  watch: {
    openCloseModalForm: {
      handler (objNew, objOld) {
        if (objNew.status !== objOld.status) {
          let item = {
            [this.openCloseModalForm.name]: ''
          }
          this.open = Object.assign({}, item)
          this.open[this.openCloseModalForm.name] = this.openCloseModalForm.status
        }
      },
      deep: true
    }
  },
  data: () => ({
    open: {}
  }),
  methods: {
    ...mapActions([
      'openCloseModalAction'
    ])
  }
}
