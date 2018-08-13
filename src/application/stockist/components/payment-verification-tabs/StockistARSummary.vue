<template>
  <div class="stockist-ar-summary-tab">
    <div class="row fit">
      <q-table
        :data="serverData"
        :columns="columns"
        :pagination.sync="serverPagination"
        :serverData-per-page-options="appSettings.defaulted.table_serverData_per_page_options"
        :separator="separator"
        :loading="isProcessingTable"
        @request="queryHandler"
        :visible-columns="visibleColumns"
        :color="appSettings.defaulted.table_color"
        dense
        row-key="name"
        class="bg-white col-12 shadow-1 relative-position"
        >
        <template slot="top-right" slot-scope="props">
          <q-table-columns
            label="Settings"
            color="secondary"
            class="q-mr-sm"
            v-model="visibleColumns"
            :columns="columns"
          />
          <q-select
            color="secondary"
            v-model="separator"
            :options="appSettings.defaulted.table_separators.options"
            hide-underline
          />
          <q-btn
            flat round dense
            :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
            @click="props.toggleFullscreen"
          />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import {PaginationMixin} from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: "stockist-a-r-summary",
    mixins: [PaginationMixin],
    props: {
      countryID: {
        required: true
      },
      excludeZeroAR: {
        required: true
      }
    },
    watch: {
      countryID: {
        handler (newVal, oldVal) {
          if (newVal !== oldVal) {
            this.queryHandler(this.setDefaultPaginationAttr('stockist_ar_summary'))
          }
        }
      },
      excludeZeroAR: {
        handler (newVal, oldVal) {
          if (newVal !== oldVal) {
            this.queryHandler(this.setDefaultPaginationAttr('stockist_ar_summary'))
          }
        }
      }
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        simplePagination: state => state.globalCMP.simplePagination
      }),
      ...mapGetters({
        tableList: 'tableDataStockistARSummaryList',
        paginationQuery: 'pagination'
      })
    },
    data: () => ({
      serverData: [],
      columns: [
        {
          label: Vue.prototype.$t('stockist.DTableLabel.stockistID'),
          name: 'stockist_number',
          field: 'stockist_number',
          sortable: true,
          align: 'center',
          type: 'Number'
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.stockistName'),
          name: 'name',
          field: 'name',
          align: 'center',
          sortable: true,
          type: 'String'
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.currentOutstanding'),
          name: 'ar_balance',
          field: 'ar_balance',
          align: 'center',
          sortable: true,
          type: 'Number'
        }
      ]
    }),
    mounted () {
      this.setVisibleColumns(this.columns)
      this.queryHandler(this.setDefaultPaginationAttr('stockist_ar_summary'))
    },
    methods: {
      ...mapActions([
        'getStockistARSummaryAction'
      ]),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.countryID
        this.query.exclude_zero_balance = this.excludeZeroAR ? 1 : 0
        this.getStockistARSummaryAction(this.query).then(() => {
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
    }
  }
</script>

<style scoped>

</style>
