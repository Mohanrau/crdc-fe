<template>
  <div class="form-holder relative-position pd-5">
    <div class="row full-width filter-holder bg-white shadow-1">
      <q-datetime v-model="filterData.filterDateRangeFrom" stack-label="Date From" type="date"></q-datetime>
      <q-datetime v-model="filterData.filterDateRangeTo" stack-label="Date To" type="date"></q-datetime>
      <q-btn flat @click="queryHandler(setDefaultPaginationAttr('sales_invoices'))"><q-icon name="search"></q-icon></q-btn>
    </div>
    <q-table
      :data="serverData"
      :columns="columns"
      :pagination.sync="serverPagination"
      :serverData-per-page-options="appSettings.defaulted.table_serverData_per_page_options"
      :separator="separator"
      :loading="isProcessingTable"
      @request="queryHandler"
      :visible-columns="visibleColumns"
      row-key="name"
      :color="appSettings.defaulted.table_color"
      dense
      class="bg-white shadow-1 relative-position mt-20">
      <!-- Custom renderer for "action" column with button for custom action -->
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="handleSelection(props.row)" class="cursor-pointer">
        <q-td v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
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
    <!--<q-data-table-->
      <!--:data="salesInvoices"-->
      <!--:config="config"-->
      <!--:columns="columns"-->
      <!--@refresh="refresh"-->
    <!--&gt;-->
      <!--<template slot='col-action' slot-scope='cell'>-->
        <!--<q-btn small push @click="handleSelection(cell.row)" color="primary">-->
          <!--Select-->
        <!--</q-btn>-->
      <!--</template>-->
    <!--</q-data-table>-->
    <!--<div class="row justify-end generic-margin">-->
      <!--<div>-->
        <!--<simple-pagination :perPage="10" :maxPages="maxPages" :paginationHandler="queryHandler"/>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>

<script>
  // import Vue from 'vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  import {DatesMixin, PaginationMixin} from 'src/application/global/mixins/index'

  export default {
    name: 'tax-invoice-search-form',
    mixins: [DatesMixin, PaginationMixin],
    components: {
      simplePagination
    },
    props: {
      selectInvoice: {
        type: Function,
        required: true
      },
      isSalesCancellation: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      openCloseModalForm: {
        deep: true,
        handler (newData) {
          // Call if modal name match
          if (newData.status && ( newData.name === 'productCancellationModal' || newData.name === 'productExchangeModal')) {
            this.queryHandler(this.setDefaultPaginationAttr('sales_invoices'))
          }
        }
      }
    },
    data: () => ({
      serverData: [],
      filterData: {
        filterDateRangeFrom: new Date(new Date().setDate(new Date().getDate() - 90)),
        filterDateRangeTo: Date.now()
      },
      columns: [
        {
          name: 'invoice_date',
          label: 'Transaction Date',
          field: 'invoice_date',
          align: 'center',
          sortable: true
        },
        {
          name: 'invoice_number',
          label: 'Tax Invoice No',
          field: 'invoice_number',
          align: 'center',
          sortable: false
        }
      ]
    }),
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
        selectedFilters: state => state.globalCMP.selectedFilters,
        memberDetails: state => state.membersCMP.memberData.data,
        salesInvoices: state => state.salesCMP.salesInvoiceListing
      }),
      ...mapGetters({
        paginationQuery: 'pagination'
      })
    },
    mounted () {
      this.setVisibleColumns(this.columns)
      this.queryHandler(this.setDefaultPaginationAttr('sales_invoices'))
    },
    methods: {
      ...mapActions([
        'getSalesInvoiceSearchAction'
      ]),
      ...mapMutations({
            openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      refresh (done) {
        var timer = 5000
        this.queryHandler()
        if (!this.isProcessingTable) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          done()
        }, timer)
      },
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.selectedFilters.countryID
        this.query.user_id = this.memberDetails.details.user_id
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.query.is_sale_cancellation = this.isSalesCancellation
        this.getSalesInvoiceSearchAction(this.query).then(() => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.salesInvoices.list.total
          this.serverData = this.salesInvoices.list.data
        })
      },
      // Complete the form submission and redirect and notify
      resetAndGo (redirect) {
        if (redirect) {
          this.openCloseModal({name: this.openCloseModalForm.name, status: false})
        }
      },
      beforeClose () {
        // redirect true
        this.resetAndGo(true)
      },
      handleSelection (invoice) {
        this.selectInvoice(invoice.id)
        this.resetAndGo(true)
      }
    }
  }
</script>

<style scoped>

</style>
