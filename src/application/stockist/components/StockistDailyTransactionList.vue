<template>
    <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
        <genaral-header genaralTitle="List of Orders"></genaral-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-12">
                    <div class="row generic-margin gutter-xs">
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.countryID.$error"
                                    :error-label="$t('general.select.country.error')">
                                <q-select
                                        clearable
                                        ref="salesCountrySelector"
                                        color="black"
                                        v-model="filterData.countryID"
                                        :options="countriesOptions.options"
                                        :ok-label="$t('Common.Choose.Btn')"
                                        :cancel-label="$t('Common.Close.Btn')"
                                        :title="$t('general.select.country')"
                                        :stack-label="$t('general.select.country')"
                                        :message="$t('general.select.country.text')"
                                        @input="salesCountryChange"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-4 col-md-12 col-xs-12">
                            <q-input v-model.lazy="filterData.filterDataStockistNumber"
                                     :disable="disable"
                                     :stack-label="$t('stockist.list.filter.stockistSearchTerm')"
                                     @input="isStockistSelected = false, filterChange">
                                <q-autocomplete @search="(terms, done) => search(terms, done, 'filterTerms')"
                                                @selected="(item) => selected(item, 'stockistNumber')"/>
                            </q-input>
                        </div>
                        <div class="col-lg-2 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.filterDateRangeFrom.$error"
                                    :error-label="$t('stockist.list.errorMessage.date')">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            :disable="disable"
                                            v-model="filterData.filterDateRangeFrom"
                                            :stack-label="$t('stockist.list.button.date')"
                                            @input="filterChange"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-3">
                            <q-select
                                    :disable="disable"
                                    v-model="filterData.filterDataDailyTransactionStatus"
                                    :options="masterDataOptionsCreator('stockist_daily_transaction_release_status')"
                                    filter
                                    color="black"
                                    clearable
                                    :stack-label="$t('stockist.list.filter.approvalStatus')"
                                    :filterPlaceholder="$t('stockist.list.placeholder.approvalStatus')"
                                    @input="filterChange"
                            ></q-select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--v-if="rows.length > 1 || this.filterData.filterTerms === ''"-->
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
                selection="multiple"
                :color="appSettings.defaulted.table_color"
                dense
                class="bg-white shadow-1">
            <q-tr slot="header" slot-scope="props" :props="props">
                <q-th key="check" :props="props">
                    <q-checkbox
                            data-schema="stockist.transaction.list|release"
                            ref="headerCheckbox"
                            :disable="totalEligibleRelease <= 0"
                            v-if="props.multipleSelect && $can($apply('stockist.transaction.list|release'))"
                            v-model="checkState"
                            toggle-indeterminate
                            @input="toggleAllReleaseRow"
                    />
                </q-th>
                <q-th v-if="col.name !== 'check'" v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.label }}
                </q-th>
            </q-tr>
            <!-- Custom renderer for "action" column with button for custom action -->
            <q-tr slot="body" slot-scope="props" :props="props" class="cursor-pointer">
                <q-td key="check" :props="props" auto-width>
                    <q-checkbox
                            color="primary"
                            :value="selectedItemsForRelease.includes(props.row)"
                            v-if="eligibleForReleaseProcessing(props.row) && $can($apply('stockist.transaction.list|release'))"
                            @input="toggleItemForRelease(props.row)"/>
                </q-td>
                <q-td v-if="col.name !== 'check'" v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                </q-td>
            </q-tr>
            <template slot="top-left" slot-scope="props">
                <div class="row gutter-sm">
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center"
                         v-if="showStockistInfo && stockistData !== null && stockistData !== undefined">
                        <q-chip square class="fit" color="grey-1 text-light">
                            {{stockistData.details.stockist_number + ' - ' + stockistData.details.name}}
                        </q-chip>
                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center"
                         data-schema="stockist.transaction.list|release"
                         v-if="$can($apply('stockist.transaction.list|release'))">
                        <q-btn
                                color="primary"
                                glossy
                                v-if="selectedItemsForRelease.length > 0"
                                @click="processRelease"
                        >
                            {{$t('stockist.dailyTransaction.list.button.processRelease', {rowcount: selectedItemsForRelease.length})}}
                        </q-btn>
                    </div>
                </div>
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
    </div>
</template>

<script>
  import Vue from 'vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {DatesMixin, PaginationMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
  import {required} from 'vuelidate/lib/validators'
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    name: "stockist-daily-transaction-list",
    mixins: [DatesMixin, PaginationMixin, MasterDataTransformarMixin],
    components: {
      simplePagination,
      genaralHeader,
      qLoader
    },
    props: ['stockistID'],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        isProcessing: state => state.globalCMP.isProcessing,
        simplePagination: state => state.globalCMP.simplePagination,
        selectedFilters: state => state.globalCMP.selectedFilters,
        stockistData: state => state.stockistCMP.stockistData.data,
        stockistSearchData: state => state.stockistCMP.stockistSearchData,
        stockistPaymentTypes: state => state.stockistCMP.stockistDailyTransactionPayments.list,
        route: state => state.route
      }),
      ...mapGetters({
        tableList: 'tableDataStockistDailyTransactionList',
        paginationQuery: 'pagination'
      })
    },
    data: function () {
      return {
        showTable: false,
        disable: true,
        serverData: [],
        total: 20,
        minPages: 1,
        maxPages: 1,
        rows: [],
        totalEligibleRelease: 0,
        selectedItemsForRelease: [],
        toggleStatus: false,
        togglePopupSearch: false,
        isStockistSelected: false,
        showStockistInfo: false,
        checkState: false,
        userID: '',
        userIDSearchTerm: '',
        filterData: {
          countryID: '',
          filterDataStockistNumber: '',
          filterDataDailyTransactionStatus: '',
          filterDateRangeFrom: ''
        },
        columns: [],
        leftColumns: [
          {
            label: 'Check',
            name: 'check',
            sort: false,
            align: 'left'
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.transaction_date'),
            name: 'sale.transaction_date',
            field: 'sale',
            align: 'center',
            sort: false,
            format(element, row) {
              return element !== null && element !== undefined ? element.transaction_date : '-'
            }
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.iboID'),
            name: 'sale.member.old_member_id',
            field: 'sale',
            align: 'center',
            sort: false,
            format(elm) {
              return elm !== null && elm !== undefined && elm.user !== undefined && elm.user !== null ? elm.user.old_member_id : '-'
            }
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.iboName'),
            name: 'sale.member.name',
            field: 'sale',
            align: 'center',
            sort: false,
            format(elm) {
              return elm !== null && elm !== undefined && elm.member !== undefined && elm.member !== null ? elm.member.name : '-'
            }
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.taxInvoiceNumber'),
            name: 'invoice_number',
            field: 'invoice_number',
            align: 'center',
            sort: false
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.releaseStatus'),
            name: 'stockist_daily_transaction_status.title',
            field: 'stockist_daily_transaction_status',
            align: 'center',
            sort: false,
            format(element) {
              return element !== null && element !== undefined ? element.title : '-'
            }
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.releaseDate'),
            name: 'released_date',
            field: 'released_date',
            align: 'center',
            sort: false,
            format(element, row) {
              return element !== null ? element : '-'
            }
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.deliveryStage'),
            name: 'status.updated_by',
            field: 'status',
            align: 'center',
            sort: false,
            format(element, row) {
              return element !== null && element !== undefined ? element.updated_by : '-'
            }
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.CV'),
            name: 'sale.total_cv',
            field: 'sale',
            align: 'center',
            sort: false,
            format(element, row) {
              return element !== null && element !== undefined ? element.total_cv : '-'
            }
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.approvalCode'),
            name: 'placeholder',
            field: 'placeholder',
            align: 'center',
            sort: false,
            format(element) {
              return element !== null && element !== undefined ? element : '-'
            }
          }
        ],
        rightColumns: [
          // {
          //   label: 'Contra',
          //   name: 'country.code',
          //   field: 'country',
          //   sort: false,
          //   align: 'center',
          //   format (element) {
          //     return element !== undefined && element !== null ? element.code : 'n/a'
          //   }
          // },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.amountPayable'),
            name: 'transaction_date',
            field: 'transaction_date',
            align: 'center',
            sort: false
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.amountReceive'),
            name: 'document_number',
            field: 'document_number',
            align: 'center',
            sort: false
          },
          {
            label: Vue.prototype.$t('stockist.DTableLabel.total'),
            name: 'sale.total_gmp',
            field: 'sale',
            align: 'center',
            sort: false,
            format(element, row) {
              return element !== null && element !== undefined ? element.total_gmp : '-'
            }
          }
        ]
      }
    },
    validations: {
      filterData: {
        countryID: {
          required
        },
        filterDataStockistNumber: {
          required
        },
        filterDateRangeFrom: {
          isInRange(val, elm) {
            if (elm) {
              let diff = this.getDateDiff(this.getCurrentDate(), val, 'days')
              if (diff >= 1) {
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
    mounted() {
      this.master.keys = [
        'stockist_daily_transaction_release_status'
      ]
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      let defaultDate = new Date()
      this.$set(this.filterData, 'filterDateRangeFrom', defaultDate.setDate((new Date()).getDate() - 1))
      if (this.filterData.countryID > 0) {
        if (this.filterData.filterDataStockistNumber !== '') {
          this.isStockistSelected = true
          this.queryHandler(this.setDefaultPaginationAttr('stockist_transaction_list'))
        }
        this.disable = false
      }
      this.salesCountryChange()
      this.getCountriesAction()
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getExistingStockist',
        'getCountriesAction',
        'getStockistSearchAction',
        'getStockistOrderReturnListAction',
        'getStockistDailyTransactionListAction',
        'batchReleaseStockistInvoiceAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setRegistrationData: 'SET_STOCKIST_REGISTRATION_DATA',
        unsetRegistrationData: 'UNSET_STOCKIST_REGISTRATION_DATA'
      }),
      queryHandler(data) {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error && this.isStockistSelected) {
          this.query = this.processQueryData(data)
          this.query.filter_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
          this.query.stockist_number = this.filterData.filterDataStockistNumber
          this.query.stockist_daily_transaction_status_id = this.filterData.filterDataDailyTransactionStatus !== null && this.filterData.filterDataDailyTransactionStatus !== '' ? this.filterData.filterDataDailyTransactionStatus : 0
          this.setFilterData({
            filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
            filterTerms: this.filterData.filterTerms,
            filterDataStockistNumber: this.filterData.filterDataStockistNumber,
            filterDataDailyTransactionStatus: this.filterData.filterDataDailyTransactionStatus !== null && this.filterData.filterDataDailyTransactionStatus !== '' ? this.filterData.filterDataDailyTransactionStatus : 0
          })
          this.getStockistDailyTransactionListAction(this.query).then(() => {
            let paymentColumns = []
            this.stockistPaymentTypes.forEach((payment) => {
              paymentColumns.push({
                label: payment.name,
                name: 'paymentMode.' + payment.code + '.total_amount',
                field: 'paymentMode',
                align: 'center',
                sort: false,
                format(elm) {
                  return elm[payment.code] !== null && elm[payment.code] !== undefined ? elm[payment.code].total_amount : '-'
                }
              })
            })
            this.columns = this.leftColumns.concat(paymentColumns.concat(this.rightColumns))
            this.setVisibleColumns(this.columns)
            this.serverPagination = data.pagination
            this.serverPagination.rowsNumber = this.tableList.list.total
            this.serverData = this.tableList.list.data
            this.totalEligibleRelease = this.serverData.filter((row) => this.eligibleForReleaseProcessing(row)).length
            this.showStockistInfo = true
            this.selectedItemsForRelease = []
            this.checkState = false
          })
        }
      },
      search(terms, done, field) {
        if (field === 'filterTerms') {
          let query = {
            search_text: this.filterData.filterDataStockistNumber,
            country_id: this.filterData.countryID,
            limit: 10
          }
          this.getStockistSearchAction(query).then(res => {
            done(this.stockistSearchData.list)
          })
        }
      },
      selected(item, field) {
        this[field] = item.sublabel
        if (field === 'stockistNumber') {
          // trigger stockist search after stockist is selected
          this.isStockistSelected = true
          this.showStockistInfo = true
          if (this.stockistID !== item.stockist_id) {
            this.setFilterData({
              filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
              filterTerms: this.filterData.filterTerms,
              filterDataStockistNumber: this.filterData.filterDataStockistNumber,
              filterDataDailyTransactionStatus: this.filterData.filterDataDailyTransactionStatus !== '' ? this.filterData.filterDataDailyTransactionStatus : 0
            })
            this.selectedItemsForRelease = []
            this.checkState = false
            this.queryHandler(this.setDefaultPaginationAttr('stockist_transaction_list'))
          }
        }
      },
      filterChange() {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('stockist_transaction_list'))
        }
      },
      // Refresh table data form store state
      setUpdateTableData() {
        // tableData set by Vue.set() sp JSON.stringify is used to remove array observer the append by Vue.set()
        if (this.tableList !== null && this.tableList !== undefined) {
          this.rows = JSON.parse(JSON.stringify(this.tableList.list.data))
          this.maxPages = this.tableList.list.total
        } else {
          this.rows = []
          this.maxPages = 1
        }
      },
      salesCountryChange() {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.filterData.countryID)
        if (getCountryName.length > 0) {
          this.setFilterData({
            countryID: this.filterData.countryID,
            filterCountryName: getCountryName[0].label,
            filterCountryCode: getCountryName[0].code
          })
        }
        if (this.filterData.countryID > 0) {
          this.disable = false
          this.filterChange()
        } else {
          this.disable = true
        }
      },
      toggleAllReleaseRow() {
        if (this.selectedItemsForRelease.length > 0) {
          this.selectedItemsForRelease = []
          this.checkState = false
        } else {
          this.selectedItemsForRelease = this.serverData.filter((row) => this.eligibleForReleaseProcessing(row))
          this.checkState = true
        }
      },
      toggleItemForRelease(row) {
        if (this.selectedItemsForRelease.includes(row)) {
          this.selectedItemsForRelease.splice(this.selectedItemsForRelease.indexOf(row), 1)
          if (this.selectedItemsForRelease.length === 0) {
            this.checkState = false
          } else {
            this.checkState = null
          }
        } else {
          this.selectedItemsForRelease.push(row)
          if (this.selectedItemsForRelease.length === this.totalEligibleRelease) {
            this.checkState = true
          } else {
            this.checkState = null
          }
        }
      },
      eligibleForReleaseProcessing(row) {
        return row.stockist_daily_transaction_status !== undefined && row.stockist_daily_transaction_status !== null && row.stockist_daily_transaction_status.title.toLowerCase() === 'pending'
      },
      processRelease() {
        let refunds = this.selectedItemsForRelease.map(product => product.id)
        let query = {
          stockist_invoices: refunds,
        }
        this.batchReleaseStockistInvoiceAction(query).then(() => {
          this.selectedItemsForRelease = []
          this.checkState = false
          this.queryHandler(this.setDefaultPaginationAttr('stockist_transaction_list'))
        })
      }
    }
  }
</script>

<style scoped>

</style>
