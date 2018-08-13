import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      appSettings: state => state.globalCMP.appSettings
    })
  },
  data: () => ({
    isDirty: false,
    useDirtyAlert: true,
    skipDirtyAlert: false,
    dirtyCount: 0
  }),
  beforeRouteLeave (to, from, next) {
    this.dirtyCount = 0
    if (this.isDirty && this.useDirtyAlert && !this.skipDirtyAlert) {
      this.$q.dialog({
        title: 'Warning',
        message: 'Do you really want to leave? you have unsaved changes!',
        cancel: {
          glossy: true,
          color: 'negative',
          label: 'No'
        },
        ok: {
          glossy: true,
          color: 'positive',
          label: 'Yes'
        }
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      })
    } else {
      next()
    }
  },
  methods: {
    dirtyChecker () {
      if (this.dirtyCount > 0) {
        this.isDirty = true
      }
      this.dirtyCount += 1
    },
    skipDirtyChecker () {
      this.dirtyCount = 0
      this.skipDirtyAlert = true
      this.isDirty = false
    }
  }
}
