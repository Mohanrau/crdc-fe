<template>
  <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
    <genaral-header genaralTitle="List of Orders"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-10">
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
            <div class="col-lg-2 col-md-12 col-xs-12">
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
            <div class="col-lg-2 col-md-12 col-xs-12">
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
            <div class="col-lg-2">
              <q-select
                v-model="filterData.filterDataOrderStatus"
                :options="masterDataOptionsCreator(this.$const.masterKey.CONSIGNMENT_ORDER_STATUS)"
                filter
                :disable="disable"
                color="black"
                clearable
                :stack-label="$t('stockist.list.filter.approvalStatus')"
                :filterPlaceholder="$t('stockist.list.placeholder.approvalStatus')"
                @input="filterChange"
              ></q-select>
            </div>
          </div>
        </div>
        <!--New setup button section-->
        <div class="col-lg-2">
          <div class="row full-height justify-center xs-gutter">
            <div class="col-lg-1 gt-md">
              <div class="verticle-line"></div>
            </div>
            <div class="col-lg-11 self-center z-absolute">
              <q-btn class="full-width" :class="{'new-order-btn fit' : togglePopupSearch}"
                     color="primary" :icon="!togglePopupSearch ? 'add' : 'close'"
                     @click="togglePopupSearchSection(togglePopupSearch)"
                     :disable="disable"
              >
                {{ !togglePopupSearch ? $t('stockist.list.button.newOrder') : $t('stockist.list.button.cancel')}}
              </q-btn>
              <q-popover anchor="bottom right"
                         @hide="togglePopupSearchSection(togglePopupSearch, false)"
                         self="top right"
                         ref="popover"
                         :disable="disable"
                         fit>
                <div class="row">
                  <div class="col-12 pd-20 custom-width-popover relative-position">
                    <div>
                      <q-input v-model.trim="userIDSearchTerm"
                               clearable
                               :placeholder="$t('stockist.list.placeholder.stockistSearchTerm')"
                               :after="[{icon: 'chevron_right', handler () { initiateStockistOrder() }}]"
                               @input="reset">
                        <q-autocomplete @search="(terms, done) => search(terms, done, 'userID')"
                                        @selected="(item) => selected(item, 'userID')"/>
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
    <q-loader :visible="isProcessingTable"></q-loader>
  </div>
</template>

<script>
  import Vue from 'vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {DatesMixin, PaginationMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'stockist-consignment-order-list',
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
        tableList: 'tableDataStockistOrderReturnList',
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
    data: function () {
      return {
        disable: true,
        serverData: [],
        show: false,
        total: 20,
        minPages: 1,
        maxPages: 1,
        rows: [],
        toggleStatus: false,
        togglePopupSearch: false,
        userID: '',
        userIDSearchTerm: '',
        filterData: {
          countryID: '',
          filterTerms: '',
          filterUserID: '',
          filterDataOrderStatus: 0,
          filterDateRangeFrom: '',
          filterDateRangeTo: ''
        },
        columns: [
          {
            label: this.$t('stockist.DTableLabel.countryCode'),
            name: 'stockist.country.code',
            field: 'stockist',
            sort: false,
            align: 'center',
            format (element) {
              return element !== undefined && element !== null ? element.country.code : 'n/a'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.transaction_date'),
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
            format (element) {
              return element.stockist_number
            }
          },
          {
            label: this.$t('stockist.DTableLabel.stockistName'),
            name: 'stockist.name',
            field: 'stockist',
            align: 'center',
            sort: false,
            format (element) {
              return element.name
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentNote'),
            name: 'document_number',
            field: 'document_number',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined && element !== '' ? element :'-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentOrderAmount'),
            name: 'total_gmp.name',
            field: 'total_gmp',
            align: 'center',
            sort: false
          },
          {
            label: this.$t('stockist.DTableLabel.createdBy'),
            name: 'created_by',
            field: 'created_by',
            align: 'center',
            sort: false,
            format (element, row) {
              return element.name
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentApprovalStatus'),
            name: 'status.title',
            field: 'status',
            align: 'center',
            sort: false,
            format (element, row) {
              return element.title
            }
          },
          {
            label: this.$t('stockist.DTableLabel.consignmentApprovedBy'),
            name: 'action_by.name',
            field: 'action_by',
            align: 'center',
            sort: false,
            format (element, row) {
              return element === null || element === undefined ? '-' : element.name
            }
          }
        ]
      }
    },
    mounted () {
      this.master.keys = [
        'stockist_type',
        this.$const.masterKey.CONSIGNMENT_ORDER_STATUS
      ]
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      if (this.selectedFilters.filterDateRangeFrom === '') {
        this.$set(this.filterData, 'filterDateRangeFrom', this.getCurrentDate())
      }
      if (this.selectedFilters.filterDateRangeTo === '') {
        this.$set(this.filterData, 'filterDateRangeTo', this.getCurrentDate())
      }
      this.setVisibleColumns(this.columns)
      this.getCountriesAction().then(() => {
        this.salesCountryChange()
      })
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getStockistSearchAction',
        'getStockistOrderReturnListAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setRegistrationData: 'SET_STOCKIST_REGISTRATION_DATA',
        unsetRegistrationData: 'UNSET_STOCKIST_REGISTRATION_DATA'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.type = 'order'
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.query.country_id = this.filterData.countryID
        this.query.search_text = this.filterData.filterTerms
        this.query.status_id = this.filterData.filterDataOrderStatus !== null && this.filterData.filterDataOrderStatus !== '' ? this.filterData.filterDataOrderStatus : 0
        this.setFilterData({
          countryID: this.filterData.countryID,
          filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
          filterDateRangeTo: this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD'),
          filterTerms: this.filterData.filterTerms,
          filterDataOrderStatus : this.filterData.filterDataOrderStatus
        })
        this.getStockistOrderReturnListAction(this.query).then(() => {
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
      selected (item, field) {
        this[field] = item.sublabel
        if (field === 'userID') {
          this.userID = item.user_id
          this.userIDSearchTerm = item.label
          this.$refs.popover.show()
          this.togglePopupSearchSection(this.togglePopupSearch)
        } else if (field === 'filterTerms') {
          this.filterData.filterUserID = item.value
          this.filterData.filterTerms = item.label
        }
      },
      reset (action) {
      },
      filterChange () {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('stockist_list'))
        }
      },
      // Refresh table data form store state
      setUpdateTableData () {
        // tableData set by Vue.set() sp JSON.stringify is used to remove array observer the append by Vue.set()
        if (this.tableList !== null && this.tableList !== undefined) {
          this.rows = JSON.parse(JSON.stringify(this.tableList.list.data))
          this.maxPages = this.tableList.list.total
        } else {
          this.rows = []
          this.maxPages = 1
        }
      },
      handleSelection (row) {
        // handle table row selection
        this.LoadExistingStockistConsignmentOrder(row)
      },
      routePage (data) {
        this.unsetRegistrationData({userID: '', registrationID: ''})
        this.setRegistrationData(data)
        if (data.stockistOrderID !== '') {
          this.$router.push({
            name: 'Stockist Consignment Order Area',
            params: {consignmentType: 'order', consignmentID: data.stockistOrderID}
          })
        } else {
          this.$router.push({
            name: 'New Stockist Consignment Order',
            params: {consignmentType: 'order'}
          })
        }
      },
      togglePopupSearchSection (x, status=!x) {
        this.togglePopupSearch = status
      },
      initiateStockistOrder () {
        if (this.userID !== '' || this.invoiceID !== '') {
          let data = {
            userID: this.userID,
            registrationID: '',
            stockistOrderID: ''
          }
          this.routePage(data)
        }
      },
      LoadExistingStockistConsignmentOrder (row) {
        let data = {
          stockistOrderID: row.id,
          registrationID: '',
          userID: ''
        }
        this.routePage(data)
      }
    }
  }
</script>

<style scoped>

</style>
