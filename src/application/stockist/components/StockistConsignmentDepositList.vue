<template>
    <div class="general-page-holder" :class="{'dimmed': toggleDepositPopupSearch || toggleRefundPopupSearch}">
        <genaral-header genaralTitle="List of Orders"></genaral-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between gutter-sm">
                <div class="col-lg-7">
                    <div class="row gutter-sm generic-margin">
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
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-input v-model.lazy="filterData.filterTerms"
                                     :stack-label="$t('stockist.list.filter.stockistSearchTerm')"
                                     :disable="disable"
                                     @input="filterChange">
                                <q-autocomplete @search="(terms, done) => search(terms, done, 'filterTerms')"
                                                @selected="(item) => selected(item, 'filterTerms')"/>
                            </q-input>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.filterDateRangeFrom.$error"
                                    :error-label="$t('stockist.list.errorMessage.dateFrom')">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            :disable="disable"
                                            v-model="filterData.filterDateRangeFrom"
                                            :stack-label="$t('stockist.list.filter.dateFrom')"
                                            @input="filterChange"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.filterDateRangeTo.$error"
                                    :error-label="$t('stockist.list.errorMessage.dateTo')">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            :disable="disable"
                                            v-model="filterData.filterDateRangeTo"
                                            :stack-label="$t('stockist.list.filter.dateTo')"
                                            @input="filterChange"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-12" v-if="showMoreFilter">
                            <div class="row gutter-xs">
                                <div class="col-lg-3">
                                    <q-select
                                            v-model="filterData.filterDepositRefundType"
                                            :options="masterDataOptionsCreator('consignment_deposit_and_refund_type')"
                                            filter
                                            :disable="disable"
                                            color="black"
                                            clearable
                                            :stack-label="$t('stockist.list.filter.depositType')"
                                            :filterPlaceholder="$t('stockist.list.placeholder.depositType')"
                                            @input="filterChange"
                                    ></q-select>
                                </div>
                                <div class="col-lg-3">
                                    <q-select
                                            v-model="filterData.filterDepositRefundStatus"
                                            :options="masterDataOptionsCreator('consignment_deposit_and_refund_status')"
                                            filter
                                            :disable="disable"
                                            color="black"
                                            clearable
                                            :stack-label="$t('stockist.list.filter.depositStatus')"
                                            :filterPlaceholder="$t('stockist.list.placeholder.depositStatus')"
                                    ></q-select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-1 row justify-end">
          <span class="justify-end" @click="toggleMoreFilter(showMoreFilter)">
              <q-icon color="grey-4"
                      :name="!showMoreFilter ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></q-icon>
              <q-tooltip>{{ $t('sales.moreFilters.label') }}</q-tooltip>
          </span>
                </div>
                <!--New setup button section-->
                <div class="col-lg-2">
                    <div class="row full-height justify-center xs-gutter">
                        <div class="col-lg-1 gt-md">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-11 self-center z-absolute" data-schema="stockist.funds.list|deposit">
                            <q-btn class="full-width" :class="{'new-order-btn fit' : toggleDepositPopupSearch}"
                                   color="primary" :icon="!toggleDepositPopupSearch ? 'add' : 'close'"
                                   @click="toggleDepositPopupSearchSection(toggleDepositPopupSearch)"
                                   :disable="disable || !$can($apply('stockist.funds.list|deposit'))"
                            >
                                {{ !toggleDepositPopupSearch ? $t('stockist.list.button.deposit') : $t('stockist.list.button.cancel')}}
                            </q-btn>
                            <q-popover anchor="bottom right"
                                       @hide="toggleDepositPopupSearchSection(toggleDepositPopupSearch, false)"
                                       self="top right"
                                       ref="depositPopover"
                                       :disable="disable || !$can($apply('stockist.funds.list|deposit'))"
                                       fit>
                                <div class="row">
                                    <div class="col-12 pd-20 custom-width-popover relative-position">
                                        <div>
                                            <q-input v-model.trim="userIDDepositSearchTerm"
                                                     clearable
                                                     :placeholder="$t('stockist.list.placeholder.stockistSearchTerm')"
                                                     :after="[{icon: 'chevron_right', handler () { initiateStockistDepositRefund('deposit') }}]"
                                                     @input="reset">
                                                <q-autocomplete
                                                        @search="(terms, done) => search(terms, done, 'userIDDeposit')"
                                                        @selected="(item) => selected(item, 'userIDDeposit')"/>
                                            </q-input>
                                        </div>
                                        <q-loader :visible="isProcessingSection"></q-loader>
                                    </div>
                                </div>
                            </q-popover>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2">
                    <div class="row full-height justify-center xs-gutter">
                        <div class="col-lg-11 self-center z-absolute" data-schema="stockist.funds.list|refund">
                            <q-btn class="full-width" :class="{'new-order-btn fit' : toggleRefundPopupSearch}"
                                   color="primary" :icon="!toggleRefundPopupSearch ? 'add' : 'close'"
                                   @click="toggleRefundPopupSearchSection(toggleRefundPopupSearch)"
                                   :disable="disable || !$can($apply('stockist.funds.list|refund'))"
                            >
                                {{ !toggleDepositPopupSearch ? $t('stockist.list.button.refund') : $t('stockist.list.button.cancel')}}
                            </q-btn>
                            <q-popover anchor="bottom right"
                                       @hide="toggleRefundPopupSearchSection(toggleRefundPopupSearch, false)"
                                       self="top right"
                                       ref="refundPopover"
                                       :disable="disable || !$can($apply('stockist.funds.list|refund'))"
                                       fit>
                                <div class="row">
                                    <div class="col-12 pd-20 custom-width-popover relative-position">
                                        <div>
                                            <q-input v-model.trim="userIDRefundSearchTerm"
                                                     clearable
                                                     :placeholder="$t('stockist.list.placeholder.stockistSearchTerm')"
                                                     :after="[{icon: 'chevron_right', handler () { initiateStockistDepositRefund('refund') }}]"
                                                     @input="reset">
                                                <q-autocomplete
                                                        @search="(terms, done) => search(terms, done, 'userIDRefund')"
                                                        @selected="(item) => selected(item, 'userIDRefund')"/>
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
                :color="appSettings.defaulted.table_color"
                dense
                class="bg-white shadow-1 relative-position mt-20">
            <!-- Custom renderer for "action" column with button for custom action -->
            <q-tr slot="body" slot-scope="props" :props="props" @click.native="handleSelection(props.row)"
                  class="cursor-pointer">
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
        <q-loader :visible="isProcessingTable"></q-loader>
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
    name: 'stockist-list-table',
    mixins: [DatesMixin, PaginationMixin, MasterDataTransformarMixin],
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
        stockistSearchData: state => state.stockistCMP.stockistSearchData
      }),
      ...mapGetters({
        tableList: 'tableDataStockistDepositRefundList',
        paginationQuery: 'pagination'
      })
    },
    validations: {
      filterData: {
        countryID: {
          required
        },
        filterDateRangeFrom: {
          isInRange(val, elm) {
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
          isInRange(val, elm) {
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
        serverData: [],
        show: false,
        total: 20,
        showMoreFilter: false,
        minPages: 1,
        maxPages: 1,
        rows: [],
        toggleStatus: false,
        toggleDepositPopupSearch: false,
        toggleRefundPopupSearch: false,
        userIDDeposit: '',
        userIDRefund: '',
        userIDDepositSearchTerm: '',
        userIDRefundSearchTerm: '',
        filterData: {
          countryID: '',
          filterTerms: '',
          filterUserID: '',
          filterDateRangeFrom: '',
          filterDateRangeTo: '',
          filterDepositRefundType: '',
          filterDepositRefundStatus: ''
        },
        columns: [
          {
            label: this.$t('stockist.DTableLabel.countryCode'),
            name: 'stockist.country.code',
            field: 'stockist',
            sort: false,
            align: 'center',
            format(element) {
              return element !== undefined && element !== null ? element.country.code : 'n/a'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.requestedDate'),
            name: 'transaction_date',
            field: 'transaction_date',
            align: 'center',
            sort: false
          },
          {
            label: this.$t('stockist.DTableLabel.stockistID'),
            name: 'stockist.stockist_number',
            field: 'stockist',
            align: 'center',
            sort: false,
            format(element) {
              return element.stockist_number
            }
          },
          {
            label: this.$t('stockist.DTableLabel.stockistName'),
            name: 'stockist.name',
            field: 'stockist',
            align: 'center',
            sort: false,
            format(element) {
              return element.name
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentReceipt'),
            name: 'document_number',
            field: 'document_number',
            align: 'center',
            sort: false,
            format(element) {
              return element !== null ? element : '-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentType'),
            name: 'consignment_deposit_refund_type.title',
            field: 'consignment_deposit_refund_type',
            align: 'center',
            sort: false,
            format(element) {
              return element.title
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentOrderAmount'),
            name: 'amount',
            field: 'amount',
            align: 'center',
            sort: false
          },
          {
            label: this.$t('stockist.DTableLabel.createdBy'),
            name: 'created_by',
            field: 'created_by',
            align: 'center',
            sort: false,
            format(element, row) {
              return element.name
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentApprovalStatus'),
            name: 'status.title',
            field: 'status',
            align: 'center',
            sort: false,
            format(element, row) {
              return element.title
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentApprovedBy'),
            name: 'action_by.name',
            field: 'action_by',
            align: 'center',
            sort: false,
            format(element, row) {
              return element === null || element === undefined ? '-' : element.name
            }
          }
        ]
      }
    },
    mounted() {
      this.master.keys = [
        'consignment_deposit_and_refund_type',
        'consignment_deposit_and_refund_status'
      ]
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.setVisibleColumns(this.columns)
      if (this.selectedFilters.filterDateRangeFrom === '') {
        this.$set(this.filterData, 'filterDateRangeFrom', this.getCurrentDate())
      }
      if (this.selectedFilters.filterDateRangeTo === '') {
        this.$set(this.filterData, 'filterDateRangeTo', this.getCurrentDate())
      }
      this.getCountriesAction().then(() => {
        this.salesCountryChange()
      })
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getStockistSearchAction',
        'getStockistDepositRefundListAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setRegistrationData: 'SET_STOCKIST_REGISTRATION_DATA',
        unsetRegistrationData: 'UNSET_STOCKIST_REGISTRATION_DATA'
      }),
      queryHandler(data) {
        this.query = this.processQueryData(data)
        this.setFilterData({
          countryID: this.filterData.countryID,
          filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
          filterDateRangeTo: this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD'),
          filterTerms: this.filterData.filterTerms,
          filterDepositRefundType: this.filterData.filterDepositRefundType,
          filterDepositRefundStatus: this.filterData.filterDepositRefundStatus
        })
        this.query.country_id = this.filterData.countryID
        this.query.search_text = this.filterData.filterTerms
        this.query.stockist_type_id = this.filterData.filterDepositRefundType
        this.query.stockist_status_id = this.filterData.filterDepositRefundStatus
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.getStockistDepositRefundListAction(this.query).then(() => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
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
          this.show = true
          this.disable = false
          this.filterChange()
        } else {
          this.disable = true
        }
      },
      search(terms, done, field) {
        if (field === 'userIDDeposit') {
          let query = {
            search_text: this.userIDDepositSearchTerm,
            country_id: this.filterData.countryID,
            limit: 10
          }
          this.getStockistSearchAction(query).then(res => {
            done(this.stockistSearchData.list)
          })
        } else if (field === 'userIDRefund') {
          let query = {
            search_text: this.userIDRefundSearchTerm,
            country_id: this.filterData.countryID,
            limit: 10
          }
          this.getStockistSearchAction(query).then(res => {
            done(this.stockistSearchData.list)
          })
        } else if (field === 'filterTerms') {
          let query = {
            search_text: this.filterData.filterTerms,
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
        if (field === 'userIDDeposit') {
          this.userIDDeposit = item.user_id
          this.userIDDepositSearchTerm = item.label
          this.$refs.depositPopover.show()
          this.toggleDepositPopupSearchSection(this.toggleDepositPopupSearch)
        } else if (field === 'userIDRefund') {
          this.userIDRefund = item.user_id
          this.userIDRefundSearchTerm = item.label
          this.$refs.refundPopover.show()
          this.toggleRefundPopupSearchSection(this.toggleDepositPopupSearch)
        } else if (field === 'filterTerms') {
          this.filterData.filterUserID = item.value
          this.filterData.filterTerms = item.label
        }
      },
      reset(action) {
      },
      filterChange() {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('stockist_list'))
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
      handleSelection(row) {
        // handle table row selection
        this.LoadExistingStockistRegistration(row)
      },
      routePage(data, type) {
        this.unsetRegistrationData({userID: '', registrationID: '', stockistOrderID: '', stockistDepositID: ''})
        this.setRegistrationData(data)
        if (type === 'deposit') {
          if (data.stockistDepositID !== '') {
            this.$router.push({
              name: 'Stockist Consignment Deposit Area',
              params: {
                depositRefundType: type,
                depositRefundID: data.stockistDepositID
              }
            })
          } else {
            this.$router.push({
              name: 'New Stockist Consignment Deposit',
              params: {
                depositRefundType: type
              }
            })
          }
        } else {
          if (data.stockistDepositID !== '') {
            this.$router.push({
              name: 'Stockist Consignment Refund Area',
              params: {
                depositRefundType: type,
                depositRefundID: data.stockistDepositID
              }
            })
          } else {
            this.$router.push({
              name: 'New Stockist Consignment Refund',
              params: {
                depositRefundType: type
              }
            })
          }
        }
      },
      toggleDepositPopupSearchSection(x, status = !x) {
        this.toggleDepositPopupSearch = status
      },
      toggleRefundPopupSearchSection(x, status = !x) {
        this.toggleRefundPopupSearch = status
      },
      initiateStockistDepositRefund(type) {
        if (this.userIDDeposit !== '' || this.userIDRefund !== '') {
          let data = {
            userID: type === 'deposit' ? this.userIDDeposit : this.userIDRefund,
            registrationID: '',
            stockistOrderID: '',
            stockistDepositID: ''
          }
          this.routePage(data, type)
        }
      },
      toggleMoreFilter(x) {
        this.showMoreFilter = !x
      },
      LoadExistingStockistRegistration(row) {
        let data = {
          stockistDepositID: row.id,
          userID: '',
          registrationID: '',
          stockistOrderID: ''
        }
        this.routePage(data, row.consignment_deposit_refund_type.title.toLowerCase())
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
