<template>
  <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
    <genaral-header genaralTitle="List of Orders"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-9">
          <div class="row gutter-xs generic-margin">
            <div class="col-lg-3 col-md-12 col-xs-12">
              <q-field
                :error="$v.filterData.countryID.$error"
                :error-label="$t('sale.cancellation.list.error.selectCountry')"
                >
              <q-select
                  clearable
                  color="black"
                  :stack-label="$t('sale.cancellation.list.filter.selectCountry')"
                  v-model="filterData.countryID"
                  :options="countriesOptions.options"
                  @input="salesCountryChange"
                />
              </q-field>
            </div>
            <div class="col-lg-3 col-md-12 col-xs-12">
              <q-input v-model.lazy="filterData.filterTerms"
                       :disable="disable"
                       stack-label="Search ..."
                       @input="filterChange">
              </q-input>
            </div>
            <div class="col-lg-2 col-md-12 col-xs-12">
              <q-field
                :error="$v.filterData.filterDateRangeFrom.$error"
                :error-label="$t('sale.cancellation.list.error.dateRangeIncorrect')"
              >
                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                            :disable="disable"
                            v-model="filterData.filterDateRangeFrom"
                            :stack-label="$t('sale.cancellation.list.filter.dateFrom')"
                            @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-lg-2 col-md-12 col-xs-12">
              <q-field
                :error="$v.filterData.filterDateRangeTo.$error"
                :error-label="$t('sale.cancellation.list.error.laterThanCurrentDate')">
                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                            :disable="disable"
                            v-model="filterData.filterDateRangeTo"
                            :stack-label="$t('sale.cancellation.list.filter.dateTo')"
                            @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-lg-2">
              <q-select
                v-model="filterData.filterSalesCancellationStatus"
                :options="masterDataOptionsCreator('sale_cancellation_status')"
                filter
                :disable="disable"
                color="black"
                clearable
                :stack-label="$t('Common.status.label')"
                :filterPlaceholder="$t('sale.cancellation.list.filter.salesCancellationStatus')"
                @input="filterChange"
              ></q-select>
            </div>
          </div>
        </div>
        <div class="col-lg-2">
          <div class="row full-height justify-center gutter-xs">
            <div class="col-lg-1 gt-md">
              <div class="verticle-line"></div>
            </div>
            <div class="col-lg-11 self-center z-absolute">
              <q-btn
                class="full-width"
                :class="{'new-order-btn fit' : togglePopupSearch}"
                color="primary" :icon="!togglePopupSearch ? 'add' : 'close'"
                @click="togglePopupSearchSection(togglePopupSearch)"
                :disable="filterData.countryID < 1"
              >
                {{ !togglePopupSearch ? $t('sale.cancellation.list.filter.newRequest') :$t('sale.cancellation.list.filter.cancel')}}
              </q-btn>
              <q-popover :disable="filterData.countryID < 1"
                         anchor="bottom right"
                         @hide="togglePopupSearchSection(true)"
                         ref="popover"
                         self="top right"
                         fit>
                <div class="row">
                  <div class="col-12 pd-20 custom-width-popover gutter-xs relative-position">
                    <div class="row justify-end">
                      <div class="col-lg-auto">
                        <q-toggle v-model="isLegacyMode"
                                  label="Legacy Invoice"/>
                      </div>
                    </div>
                    <div class="row justify-end" v-if="!isLegacyMode" >
                      <div class="col-lg-auto">
                        <q-toggle v-model="searchByTaxInvoice"
                                  :label="$t('sale.cancellation.list.filter.searchByInvoice')"/>
                      </div>
                    </div>
                    <div v-if="!searchByTaxInvoice">
                      <q-input v-model.trim="userIDSearchTerm"
                               clearable
                               :placeholder="$t('sale.cancellation.list.placeholder.searchIBO')"
                               :after="[{icon: 'chevron_right', handler () { initiateCancellationRequest() }}]"
                               @input="reset">
                        <q-autocomplete @search="(terms, done) => search(terms, done, 'userID')"
                                        @selected="(item, keyboard) => selected(item, 'userID', keyboard)"/>
                      </q-input>
                    </div>
                    <div v-else>
                      <q-input v-model.trim="invoiceNumber"
                               clearable
                               :placeholder="$t('sale.cancellation.list.placeholder.searchInvoice')"
                               :after="[{icon: 'chevron_right', handler () { initiateCancellationRequest() }}]"
                               @input="reset">
                        <q-autocomplete @search="(terms, done) => search(terms, done, 'invoiceNumber')"
                                        @selected="(item, keyboard) => selected(item, 'invoiceNumber', keyboard)"/>
                      </q-input>
                    </div>
                    <q-loader :visible="isProcessingSection"></q-loader>
                  </div>
                </div>
              </q-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <q-table
      :data="serverData"
      :columns="columns"
      :pagination.sync="serverPagination"
      :serverData-per-page-options="appSettings.defaulted.table_serverData_per_page_options"
      :separator="separator"
      :loading="isProcessingTable"
      :visible-columns="visibleColumns"
      @request="queryHandler"
      selection="multiple"
      row-key="id"
      :color="appSettings.defaulted.table_color"
      dense
      class="bg-white shadow-1 relative-position">

      <q-tr slot="header" slot-scope="props" :props="props">
        <q-th key="check" :props="props">
          <q-checkbox
            v-if="props.multipleSelect"
            v-model="checkState"
            toggle-indeterminate
            :disable="totalEligibleRefund === 0"
            @input="toggleAllRefundRow"
          />
          {{$t('sale.cancellation.list.DTableLabel.processRefund')}}
        </q-th>
        <q-th v-if="col.name !== 'check'" v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
      <!-- Custom renderer for "action" column with button for custom action -->
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="loadExistingCancellation(props.row)" class="cursor-pointer">
        <q-td key="check" :props="props" auto-width>
          <q-checkbox
            color="primary"
            :value="selectedItemsForRefund.includes(props.row)"
            v-if="eligibleForRefundProcessing(props.row)"
            @input="toggleItemForRefund(props.row)" />
        </q-td>
        <q-td v-if="col.name !== 'check'" v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
      </q-tr>
      <template slot="top-left" slot-scope="props">
          <q-btn
            color="primary"
            v-if="selectedItemsForRefund.length > 0"
            @click="processRefunds"
          >
            {{$t('sale.cancellation.list.button.batchProcessRefund',{rowcount:selectedItemsForRefund.length})}}
          </q-btn>
      </template>
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
    <q-loader :visible="isProcessingTable"></q-loader>
  </div>
</template>
<script>
  import Vue from 'vue'
  import simplePagination from '../../global/components/common/pagination/simplePagination'
  import genaralHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import {DatesMixin, MasterDataTransformarMixin, PaginationMixin} from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'sales-cancellation-list-table',
    mixins: [MasterDataTransformarMixin, DatesMixin, PaginationMixin],
    components: {
      simplePagination,
      genaralHeader,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        isProcessing: state => state.globalCMP.isProcessing,
        simplePagination: state => state.globalCMP.simplePagination,
        selectedFilters: state => state.globalCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        salesInvoices: state => state.salesCMP.salesInvoiceSearchList
      }),
      ...mapGetters({
        tableList: 'tableDataSalesCancellation',
        paginationQuery: 'pagination'
      })
    },
    validations: {
      filterData: {
        countryID: {
          required
        },
        filterDateRangeFrom: {
          isInRange (val, elm) {
            if (elm && val !== '') {
              let diff = this.getDateDiff(elm.filterDateRangeTo, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        filterDateRangeTo: {
          isInRange (val, elm) {
            if (elm) {
              let diff = this.getDateDiff(this.getCurrentDate(), val, 'days')
              if (diff >= 0) {
                return true
              } else {
                return false
              }
            }
            return false
          }
        }
      }
    },
    data: () => ({
      disable: true,
      show: false,
      checkState: false,
      serverData: [],
      totalEligibleRefund: 0,
      selectedItemsForRefund: [],
      isSelectedAllProcessRefund: false,
      togglePopupSearch: false,
      userID: '',
      userIDSearchTerm: '',
      invoiceNumber: '',
      invoiceID: '',
      isLegacyMode: false,
      isLegacyInvoice: false,
      searchByTaxInvoice: false,
      filterData: {
        countryID: 0,
        filterTerms: '',
        filterDateRangeFrom: '',
        filterDateRangeTo: '',
        filterDeliveryMethods: '',
        filterDeliveryStatus: '',
        filterChannel: '',
        filterSalesCancellationStatus: ''
      },
      columns: [
        {
          name: 'check',
          align: 'left',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.processRefund'),
          field: 'check'
        },
        {
          name: 'transaction_location.code',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.transactionLocation'),
          field: 'transaction_location',
          sortable: true,
          format (element) {
            return element.code
          },
          align: 'center'
        },
        {
          name: 'transaction_location.name',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.locationName'),
          field: 'transaction_location',
          sortable: true,
          format (element) {
            return element.name
          },
          align: 'center'
        },
        {
          name: 'created_at',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.cancellationDate'),
          field: 'created_at',
          sortable: true,
          type: 'date',
          align: 'center'
        },
        {
          name: 'cw.cw_name',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.cancelCW'),
          field: 'cw',
          sortable: true,
          align: 'center',
          format (element, row) {
            return element.cw_name
          }
        },
        {
          name: 'invoice.invoice_number',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.invoiceNumber'),
          field: 'invoice',
          sortable: true,
          align: 'center',
          format (element) {
            return element !== null && element !== undefined ? element.invoice_number : '-'
          }
        },
        {
          name: 'invoice.invoice_date',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.invoiceDate'),
          field: 'invoice',
          sortable: true,
          type: 'date',
          align: 'center',
          format (element) {
            return element !== null && element !== undefined ? element.invoice_date : '-'
          }
        },
        {
          name: 'invoice.cw.cw_name',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.purchaseCW'),
          field: row => row.invoice !== null && row.invoice !== undefined ? row.invoice : row.legacy_invoice,
          sortable: false,
          format (element, row) {
            return element !== null && element !== undefined ? element.cw.cw_name : '-'
          },
          align: 'center'
        },
        {
          name: 'members.id',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.memberID'),
          field: 'member',
          sortable: true,
          format (element, row) {
            return element.country.code_iso_2 + element.user.old_member_id
          },
          align: 'center'
        },
        {
          name: 'members.name',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.memberName'),
          field: 'member',
          sortable: true,
          format (element, row) {
            return element.name
          },
          align: 'center'
        },
        {
          name: 'total_amount',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.totalAmount'),
          field: 'total_amount',
          sortable: true,
          align: 'center'
        },
        {
          name: 'total_buy_back_amount',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.buyBackAmount'),
          field: 'total_buy_back_amount',
          sortable: true,
          align: 'center'
        },
        {
          name: 'cancellation_mode.title',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.cancellationMode'),
          field: 'cancellation_mode',
          sortable: true,
          format (element, row) {
            return element.title
          },
          align: 'center'
        },
        {
          name: 'credit_note.credit_note_number',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.creditNoteNumber'),
          field: 'credit_note',
          sortable: true,
          format (element, row) {
            return  element !== null && element !== undefined ? element.credit_note_number : '-'
          },
          align: 'center'
        },
        {
          name: 'cancellation_status.title',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.cancellationStatus'),
          field: 'cancellation_status',
          sortable: true,
          format (element, row) {
            return element.title
          },
          align: 'center'
        },
        {
          name: 'created_by.name',
          label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.createdBy'),
          field: 'created_by',
          sortable: true,
          format (element, row) {
            return element.name
          },
          align: 'center'
        }
      ]
    }),
    mounted () {
      this.master.keys = [
        'sale_cancellation_status'
      ]
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.setVisibleColumns(this.columns)
      if (this.selectedFilters.filterDateRangeFrom === '') {
        this.$set(this.filterData, 'filterDateRangeFrom', new Date(new Date().setDate(new Date().getDate())))
      }
      if (this.selectedFilters.filterDateRangeTo === '') {
        this.$set(this.filterData, 'filterDateRangeTo', this.getCurrentDate())
      }
      this.getCountriesAction().then( () => {
        this.salesCountryChange()
      })
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getSalesCancellationSearchAction',
        'getMemberSearchAction',
        'getSalesInvoiceSearchAction',
        'salesCancellationBatchProcessRefund'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setOrderCancellationData: 'SET_ORDER_CANCELLATION_DATA',
        unSetOrderCancellationData: 'UNSET_ORDER_CANCELLATION_DATA'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.setFilterData({
          countryID: this.filterData.countryID,
          filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
          filterDateRangeTo: this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD'),
          filterTerms: this.filterData.filterTerms,
          filterSalesCancellationStatus : this.filterData.filterSalesCancellationStatus
        })
        this.query.country_id = this.filterData.countryID
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.query.search_text = this.filterData.filterTerms
        this.query.sale_cancellation_status_id = this.filterData.filterSalesCancellationStatus
        this.getSalesCancellationSearchAction(this.query).then(() => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
          this.totalEligibleRefund = this.serverData.filter((row) => this.eligibleForRefundProcessing(row)).length
        })
      },
      salesCountryChange () {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.filterData.countryID)
        if (getCountryName.length > 0) {
          this.setFilterData({
            countryID: this.filterData.countryID,
            filterCountryName: getCountryName[0].label,
            filterCountryCode: getCountryName[0].code
          })
        }
        if (this.filterData.countryID > 0) {
          this.show = true
          this.disable = false
          this.filterChange()
        } else {
          this.disable = true
        }
      },
      search (terms, done, field) {
        if (field === 'userID') {
          let query = {
            search_text: this.userIDSearchTerm,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        } else if (field === 'invoiceNumber') {
          let query = {
            country_id: this.selectedFilters.countryID,
            search_text: this.invoiceNumber,
            is_sale_cancellation: true,
            limit: 10,
            sort: 'id',
            order: 'desc',
            offset: 0
          }
          this.getSalesInvoiceSearchAction(query).then(res => {
            done(this.salesInvoices.list.data)
          })
        }
      },
      selected (item, field, keyboard) {
        if (!keyboard) {
          this.$refs.popover.show()
          this.togglePopupSearchSection(this.togglePopupSearch)
          if (field === 'userID') {
            this.userID = item.userID
          } else if (field === 'invoiceNumber') {
            this.invoiceID = item.value
            this.userID = item.userID
          }
        }
      },
      reset (action) {
        if (action === 'all') {
          this.uplineUserID = ''
        }
      },
      filterChange () {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('sales_cancellation'))
        }
      },
      actions (row, type) {
        // not used for now
      },
      clearFilterData () {
        // Clearing local filters
        this.filterData.countryID = 0
        // this.memberID = ''
        // Clear datatables
        this.serverData = []
        // Clear vuex filters
        this.setFilterData(this.filterData)
      },
      routePage (data) {
        this.unSetOrderCancellationData({
          userID: '',
          invoiceID: '',
          searchByTaxInvoice: false,
          cancellationID: '',
          searchByCancellationID: false
        })
        this.setOrderCancellationData(data)
        if (!this.isLegacyInvoice && !this.isLegacyMode) {
          if (data.cancellationID !== '') {
            this.$router.push({name: 'Sales Cancellation Detail', params: {cancellationID: data.cancellationID}})
          } else {
            this.$router.push({name: 'New Sales Cancellation'})
          }
        } else {
          if (data.cancellationID !== '') {
            this.$router.push({name: 'Legacy Sales Cancellation Detail', params: {cancellationID: data.cancellationID}})
          } else {
            this.$router.push({name: 'New Legacy Sales Cancellation'})
          }
        }
      },
      togglePopupSearchSection (x) {
        this.togglePopupSearch = !x
      },
      initiateCancellationRequest () {
        if (this.userID !== '' || this.invoiceID !== '') {
          let data = {
            userID: this.userID,
            invoiceID: this.invoiceID,
            searchByTaxInvoice: this.searchByTaxInvoice,
            cancellationID: '',
            searchByCancellationID: false
          }
          this.routePage(data)
        }
      },
      loadExistingCancellation (row) {
        this.isLegacyInvoice = row.legacy_invoice !== null && row.legacy_invoice !== undefined
        let data = {
          cancellationID: row.id,
          searchByCancellationID: true
        }
        this.routePage(data)
      },
      toggleItemForRefund (row) {
        if (this.selectedItemsForRefund.includes(row)) {
          this.selectedItemsForRefund.splice(this.selectedItemsForRefund.indexOf(row), 1)
          if (this.selectedItemsForRefund.length === 0) {
            this.checkState = false
          } else {
            this.checkState = null
          }
        } else {
          this.selectedItemsForRefund.push(row)
          if (this.selectedItemsForRefund.length === this.totalEligibleRefund) {
            this.checkState = true
          } else {
            this.checkState = null
          }
        }
      },
      eligibleForRefundProcessing (row) {
        return row.cancellation_status.title.toLowerCase() === 'pending refund'
      },
      toggleAllRefundRow () {
        if (this.selectedItemsForRefund.length > 0) {
          this.selectedItemsForRefund = []
          this.checkState = false
        } else {
          // todo
          this.selectedItemsForRefund = this.serverData.filter((row) => this.eligibleForRefundProcessing(row))
          this.checkState = true
        }
      },
      processRefunds () {
        let refunds = this.selectedItemsForRefund.map(product => product.id)
        let query = {
          sales_cancellation_ids: refunds,
          remark: ''
        }
        this.salesCancellationBatchProcessRefund(query).then(() => {
          this.selectedItemsForRefund = []
          this.checkState = false
          this.queryHandler(this.setDefaultPaginationAttr('sales_cancellation'))
        })
      }
    }
  }
</script>
<style lang="stylus">
  .new-order-btn
    z-index: 6000

  .custom-width-popover
    min-width 350px !important
</style>
