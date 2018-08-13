import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      errors: state => state.globalCMP.errors.data
    })
  },
  methods: {
    ...mapActions([
      'createRoleGroupAction',
      'getUserTypesAction'
    ]),
    // Return error boolean expression
    // Passing name and type
    // Passing name and type
    setError: function (name, type) {
      // Check type and process
      if (type === 'type.exp') {
        // Check this.errors contains name key inside object
        if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
          return true
        } else {
          return false
        }
      }
      // Check type and process
      if (this.errors !== undefined && this.errors.hasOwnProperty(name) && type === 'type.msg') {
        // Check this.errors contains name key inside object
        if (this.errors.hasOwnProperty(name)) {
          return this.errors[name][0]
        } else {
          return ''
        }
      }
    }
  }
}
