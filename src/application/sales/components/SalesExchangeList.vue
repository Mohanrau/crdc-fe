<template>
  <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
    <genaral-header genaralTitle="List of Sales Exchanges"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-9">
          <div class="row generic-margin gutter-xs">
            <div class="col-lg-3 col-md-12 col-xs-12">
              <q-field
                :error="$v.filterData.countryID.$error"
                :error-label="$t('sale.exchange.list.error.selectCountry')"
              >
                <q-select
                  clearable
                  ref="salesCountrySelector"
                  color="black"
                  v-model="filterData.countryID"
                  :options="countriesOptions.options"
                  :stack-label="$t('sale.exchange.list.filter.selectCountry')"
                  @input="salesCountryChange"
                />
              </q-field>
            </div>
            <div class="col-lg-3 col-md-12 col-xs-12">
              <q-input v-model.lazy="filterData.filterTerms"
                       :disable="disable"
                       :stack-label="$t('Common.search.placeholder')"
                       @input="filterChange">
              </q-input>
            </div>
            <div class="col-lg-2 col-md-12 col-xs-12">
              <q-field
                :error="$v.filterData.filterDateRangeFrom.$error"
                :error-label="$t('sale.exchange.list.error.dateRangeIncorrect')"
              >
                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                            :disable="disable"
                            v-model="filterData.filterDateRangeFrom"
                            :stack-label="$t('sale.exchange.list.filter.dateFrom')"
                            @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-lg-2 col-md-12 col-xs-12">
              <q-field
                :error="$v.filterData.filterDateRangeTo.$error"
                :error-label="$t('sale.exchange.list.error.laterThanCurrentDate')"
              >
                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                            :disable="disable"
                            v-model="filterData.filterDateRangeTo"
                            :stack-label="$t('sale.exchange.list.filter.dateTo')"
                            @input="filterChange"
                />
              </q-field>
            </div>
          </div>
        </div>
        <div class="col-lg-2">
          <div class="row full-height justify-center gutter-xs">
            <div class="col-lg-1 gt-md">
              <div class="verticle-line"></div>
            </div>
            <div class="col-lg-11 self-center z-absolute">
              <q-btn class="full-width" :class="{'new-order-btn fit' : togglePopupSearch}"
                     color="primary" :icon="!togglePopupSearch ? 'add' : 'close'"
                     @click="togglePopupSearchSection(togglePopupSearch)"
                     :disable="disable">
                {{ !togglePopupSearch ? $t('sale.exchange.list.filter.newRequest') : $t('sale.exchange.list.filter.cancel')}}
              </q-btn>
              <q-popover
                @hide="togglePopupSearchSection(true)"
                         anchor="bottom right"
                         ref="popover"
                         self="top right"
                         :disable="disable"
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
                                  :label="$t('sale.exchange.list.filter.searchByInvoice')"/>
                      </div>
                    </div>
                    <div v-if="!searchByTaxInvoice">
                      <q-input v-model.trim="userIDSearchTerm"
                               clearable
                               :placeholder="$t('sale.exchange.list.placeholder.searchIBO')"
                               :after="[{icon: 'chevron_right', handler () { initiateOrder() }}]"
                               @input="reset">
                        <q-autocomplete @search="(terms, done) => search(terms, done, 'userID')"
                                        @selected="(item, keyboard) => selected(item, 'userID', keyboard)"/>
                      </q-input>
                    </div>
                    <div v-else>
                      <q-input v-model.trim="invoiceNumber"
                               clearable
                               :placeholder="$t('sale.exchange.list.placeholder.searchInvoice')"
                               :after="[{icon: 'chevron_right', handler () { initiateOrder() }}]"
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
      @request="queryHandler"
      :visible-columns="visibleColumns"
      row-key="name"
      :color="appSettings.defaulted.table_color"
      dense
      class="bg-white shadow-1 relative-position">
      <!-- Custom renderer for "action" column with button for custom action -->
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="loadExistingCancellation(props.row)" class="cursor-pointer">
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
  </div>
</template>
<script>
  // import Vue from 'vue'
  import Vue from 'vue'
  import * as moment from 'moment'
  import simplePagination from '../../global/components/common/pagination/simplePagination'
  import genaralHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import {DatesMixin, PaginationMixin} from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'sales-exchange-list-table',
    mixins: [DatesMixin, PaginationMixin],
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
        tableList: 'tableDataProductExchange',
        paginationQuery: 'pagination',
        currencyLabelByCountry: 'currencyLabelByCountry'
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
    data: function () {
      return {
        disable: true,
        show: true,
        serverData: [],
        total: 20,
        minPages: 1,
        maxPages: 1,
        isLegacyMode: false,
        rows: [],
        toggleStatus: false,
        togglePopupSearch: false,
        userID: '',
        userIDSearchTerm: '',
        invoiceNumber: '',
        invoiceID: '',
        searchByTaxInvoice: false,
        terms1: '',
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
        columns: []
      }
    },
    mounted () {
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.setColumns()
      this.setVisibleColumns(this.columns)
      this.$set(this.filterData, 'filterDateRangeFrom', this.getCurrentDate())
      this.$set(this.filterData, 'filterDateRangeTo', this.getCurrentDate())
      this.getCountriesAction().then(()=> {
        this.salesCountryChange()
      })
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getClassicCheckAction',
        'getSalesInvoiceSearchAction',
        'getProductExchangeSearchAction',
        'getCountryRelationAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setExchangeData: 'SET_PRODUCT_EXCHANGE_DATA',
        unsetExchangeData: 'UNSET_PRODUCT_EXCHANGE_DATA'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.setFilterData({
          countryID: this.filterData.countryID,
          filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
          filterDateRangeTo: this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD'),
          filterTerms: this.filterData.filterTerms
        })
        this.query.country_id = this.filterData.countryID
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.query.search_text = this.filterData.filterTerms
        this.getProductExchangeSearchAction(this.query).then(() => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
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
        let query1 = {
          country_id: this.filterData.countryID,
          relations: ['entity.locations', 'currency', 'taxes', 'stockLocation']
        }
        if (this.filterData.countryID > 0) {
          this.getCountryRelationAction(query1).then(() => {
            this.setColumns()
            this.setVisibleColumns(this.columns)
            this.disable = false
            this.filterChange()
          })
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
            Vue.nextTick(() => {
              this.invoiceNumber = item.label
              this.invoiceID = item.value
              this.userID = item.userID
            })
          }
          this.togglePopupSearch = true
        }
      },
      reset (action) {
      },
      filterChange () {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('product_exchange'))
        }
      },
      actions (row, type) {
        if (type === 'info') {
          Dialog.create({
            title: '<strong>To</strong> : ' + row.row.to,
            message: '<strong>Subject</strong> : ' + row.row.subject + '<br/><br/><strong>Date / Time</strong> : ' + row.row.created_at + ' (' + moment(row.row.created_at).fromNow() + ')'
          })
        }
      },
      routePage (data) {
        this.unsetExchangeData({uplineUserID: ''})
        this.setExchangeData(data)
        if (!this.isLegacyMode) {
          if (data.exchangeID !== '') {
            this.$router.push({name: 'Sales Exchange Detail', params: {exchangeID: data.exchangeID}})
          } else {
            this.$router.push({name: 'New Sales Exchange'})
          }
        } else {
          if (data.exchangeID !== '') {
            this.$router.push({name: 'Legacy Product Exchange Detail', params: {exchangeID: data.exchangeID}})
          } else {
            this.$router.push({name: 'New Legacy Product Exchange'})
          }
        }
      },
      toggle (x) {
        this.toggleStatus = !x
      },
      togglePopupSearchSection (x) {
        this.togglePopupSearch = !x
      },
      initiateOrder () {
        if (this.userID !== '' || this.invoiceID !== '') {
          let data = {
            userID: this.userID,
            invoiceID: this.invoiceID,
            searchByTaxInvoice: this.searchByTaxInvoice,
            exchangeID: '',
            searchByExchangeID: false
          }
          this.routePage(data)
        }
      },
      loadExistingCancellation (row) {
        this.isLegacyMode = row.legacy_invoice_id !== null && row.legacy_invoice_id !== undefined
        let data = {
          userID: '',
          invoiceID: '',
          searchByTaxInvoice: false,
          exchangeID: row.id,
          searchByExchangeID: true
        }
        this.routePage(data)
      },
      setColumns () {
        this.columns = [
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.transactionLocation'),
            field: 'transaction_location',
            name: 'transaction_location.code',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element.code
            }
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.locationName'),
            field: 'transaction_location',
            name: 'transaction_location.name',
            sort: false,
            align: 'center',
            format(element, row) {
              return element.name
            }
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.memberID'),
            field: 'member',
            name: 'member.ibo_id',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element.country.code_iso_2 + element.user.old_member_id
            }
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.memberName'),
            field: 'member',
            name: 'member.name',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element.name
            }
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.originalTaxInvoice'),
            field: row => row.parent_sale !== null && row.parent_sale !== undefined ? row.parent_sale.invoices : row.legacy_invoice,
            name: 'parent_sale.invoices.invoice_number',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element !== null && element !== undefined ? element.invoice_number : '-'
            }
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.exchangeDate'),
            field: 'transaction_date',
            name: 'transaction_date',
            sortable: true,
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.exchangeBillNumber'),
            field: 'sale_exchange_bill',
            name: 'sale_exchange_bill.exchange_bill_number',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element !== null && element !== undefined ? element.exchange_bill_number : '-'
            }
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.creditNoteNumber'),
            field: 'credit_note',
            name: 'credit_note.credit_note_number',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element !== null && element !== undefined ? element.credit_note_number : '-'
            }
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.newTaxInvoice'),
            field: 'sale',
            name: 'sale.invoices.invoice_number',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element !== null && element !== undefined && element.invoices !== undefined && element.invoices !== null ? element.invoices.invoice_number : '-'
            }
          },
          {
            label: this.currencyLabelByCountry !== undefined && this.currencyLabelByCountry !== null && this.currencyLabelByCountry !== '' ? Vue.prototype.$t('sale.exchange.list.DTableLabel.totalReturn') + ' (' +  this.currencyLabelByCountry + ')': Vue.prototype.$t('sale.exchange.list.DTableLabel.totalReturn'),
            field: 'return_amount_total',
            name: 'return_amount_total',
            sortable: true,
            align: 'center'
          },
          {
            label: this.currencyLabelByCountry !== undefined && this.currencyLabelByCountry !== null && this.currencyLabelByCountry !== '' ? Vue.prototype.$t('sale.exchange.list.DTableLabel.totalExchange') + ' (' + this.currencyLabelByCountry + ')' : Vue.prototype.$t('sale.exchange.list.DTableLabel.totalExchange'),
            field: 'exchange_amount_total',
            name: 'exchange_amount_total',
            sortable: true,
            align: 'center'
          },
          {
            label: this.currencyLabelByCountry !== undefined && this.currencyLabelByCountry !== null && this.currencyLabelByCountry !== '' ? Vue.prototype.$t('sale.exchange.list.DTableLabel.balanceToPay') + ' (' + this.currencyLabelByCountry + ')' : Vue.prototype.$t('sale.exchange.list.DTableLabel.balanceToPay'),
            field: 'balance',
            name: 'balance',
            sortable: true,
            align: 'center'
          },
          {
            label: Vue.prototype.$t('sale.exchange.list.DTableLabel.createdBy'),
            field: 'created_by',
            name: 'created_by.name',
            sortable: false,
            align: 'center',
            format(element, row) {
              return element.name
            }
          }]
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
