import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      appSettings: state => state.globalCMP.appSettings
    })
  },
  data: () => ({
    query: {},
    visibleColumns: [],
    separator: 'horizontal',
    initialPagination: {
      pagination: {
        rowsPerPage: 0
      },
      filter: ''
    },
    serverPagination: {
    }
  }),
  mounted () {
    this.separator = this.appSettings.defaulted.table_separators.selection
  },
  methods: {
    /**
     * Process user query then return
     * @param data
     * @returns {*}
     */
    processQueryData: function (data) {
      let globalQuery = {}
      let pagination = {}
      let filter = ''
      if (data.pagination !== 'undefined') {
        pagination = data.pagination
      }
      if (data.filter !== 'undefined') {
        filter = data.filter
      }
      if (Object.keys(data).length > 0) {
        globalQuery = {
          search: filter,
          sort: typeof pagination !== 'undefined' && typeof pagination.sortBy !== 'undefined' && pagination.sortBy !== null ? pagination.sortBy : undefined,
          order: typeof pagination !== 'undefined' && typeof pagination.descending !== 'undefined' && pagination.descending ? 'asc' : 'desc',
          limit: typeof pagination !== 'undefined' && typeof pagination.rowsPerPage !== 'undefined' && pagination.rowsPerPage !== null ? pagination.rowsPerPage : this.appSettings.fallback.table_rows_per_page,
          offset: typeof pagination !== 'undefined' && pagination.page ? (pagination.page - 1) * (pagination.rowsPerPage) : 0
        }
      }
      return globalQuery
    },
    /**
     * Set default table seting
     * @param table
     * @returns {initialPagination|{pagination, filter}}
     */
    setDefaultPaginationAttr: function (table) {
      this.initialPagination.pagination.rowsPerPage =
        typeof this.appSettings.tables[table] !== 'undefined' &&
        typeof this.appSettings.tables[table].table_rows_per_page !== 'undefined' ? this.appSettings.tables[table].table_rows_per_page : this.appSettings.fallback.table_rows_per_page
      return this.initialPagination
    },
    /**
     * Set column visibility on load
     * @param data
     */
    setVisibleColumns: function (data) {
      if (data.length > 0) {
        data.forEach(x => {
          if (typeof x.visible === 'undefined' || x.visible === true) {
            this.visibleColumns.push(x.name)
          }
        })
      }
    }
  }
}
