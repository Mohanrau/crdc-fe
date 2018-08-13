<template>
  <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
    <genaral-header genaralTitle="e-Wallet Adjustment List"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-10">
          <div class="row generic-margin gutter-xs">
            <div class="col-3">
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
            <div class="col-3">
              <q-field
                :error="$v.filterData.filterGiroType.$error"
                error-label="Please select GIRO type"
              >
                <q-select
                  color="black"
                  :disable="disable"
                  stack-label="Giro Type"
                  v-model="filterData.filterGiroType"
                  :options="giroTypeByCountry"
                  @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-3">
              <q-input v-model.lazy="filterData.filterBatchIDFrom"
                       :disable="disable"
                       stack-label="Batch ID From"
                       @input="filterChange">
              </q-input>
            </div>
            <div class="col-3">
              <q-input v-model.lazy="filterData.filterBatchIDTo"
                       :disable="disable"
                       stack-label="Batch ID To"
                       @input="filterChange">
              </q-input>
            </div>
          </div>
        </div>
        <div class="col-lg-2">
          <div class="row full-height justify-center gutter-xs">
            <div class="col-lg-1 gt-md">
              <div class="verticle-line"></div>
            </div>
            <div class="col-lg-11 self-center z-absolute">
              <q-btn class="full-width"
                     color="primary" icon="add"
                     @click="initiateGiroPaymentBatchGeneration"
                     :disable="disable"
              >
                Generate New Batch
              </q-btn>
            </div>
          </div>
        </div>
        <q-loader :visible="isProcessingSection"></q-loader>
      </div>
    </div>
    <q-table
      :data="serverData"
      :columns="columns"
      :pagination.sync="serverPagination"
      :serverData-per-page-options="appSettings.defaulted.table_serverData_per_page_options"
      :separator="separator"
      dense
      :loading="isProcessingTable"
      @request="queryHandler"
      :visible-columns="visibleColumns"
      row-key="id"
      :color="appSettings.defaulted.table_color"
      class="bg-white shadow-1 relative-position mt-20">
      <!-- Custom renderer for "action" column with button for custom action -->
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            <q-checkbox
              v-if="col.name === 'batch_id'"
              color="primary"
              v-model="props.expand"
              checked-icon="remove"
              unchecked-icon="add" class="q-mr-xs"
            />
            {{ col.value }}
          </q-td>
        </q-tr>
        <!--&& props.row.data !== null &&  props.row.data !== undefined &&  props.row.data.column_names !== undefined &&  props.row.data !== null &&  props.row.data.length > 0-->
        <q-tr v-show="props.expand" :props="props"  class="q-pa-none">
          <q-td colspan="100%" class="q-td-no-padding">
            <table
                   class="q-table-html bordered cell-separator fit responsive q-pa-none">
              <thead>
              <tr class="bg-grey-6">
                <th v-for="headerName in props.row.data.column_names" class="text-grey-1">{{headerName}}</th>
              </tr>
              </thead>
              <tbody class="bg-grey-3">
              <tr v-for="row in props.row.data.data">
                <td :data-th="props.row.data.column_names[0]">{{row.payment_mode}}</td>
                <td :data-th="props.row.data.column_names[1]">{{row.beneficiary_name}}</td>
                <td :data-th="props.row.data.column_names[2]">{{row.beneficiary_account}}</td>
                <td :data-th="props.row.data.column_names[3]">{{row.beneficiary_bank_code}}</td>
                <td :data-th="props.row.data.column_names[4]">{{row.amount | formatPriceDouble}}</td>
                <td :data-th="props.row.data.column_names[5]">{{row.payment_description }}
                <td :data-th="props.row.data.column_names[6]">{{row.beneficiary_account}}</td>
                <td :data-th="props.row.data.column_names[7]">{{row.payment_reference}}</td>
                <td :data-th="props.row.data.column_names[8]">{{row.beneficiary_new_ic_no}}</td>
                <td :data-th="props.row.data.column_names[9]">{{row.beneficiary_old_ic_no}}</td>
                <td :data-th="props.row.data.column_names[10]">{{row.beneficiary_business_registration}}</td>
                <td :data-th="props.row.data.column_names[11]">{{row.beneficiary_others}}</td>
              </tr>
              </tbody>
            </table>
          </q-td>
        </q-tr>
      </template>
    </q-table>
    <!--<pre>{{filterData}}</pre>-->
    <q-loader :visible="isProcessingTable"></q-loader>
  </div>
</template>

<script>
  import Vue from 'vue'
  import simplePagination from '../../global/components/common/pagination/simplePagination'
  import genaralHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import {DatesMixin, PaginationMixin} from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: "e-wallet-adjustment",
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
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal
      }),
      ...mapGetters({
        tableList: 'tableDataWalletGiroPayment',
        paginationQuery: 'pagination',
        giroTypeByCountry: 'giroTypeByCountry'
      })
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
        togglePopupSearch: false,
        giroType: [],
        filterData: {
          countryID: '',
          filterGiroType: '',
          filterBatchIDFrom: '',
          filterBatchIDTo: ''
        },
        columns: [
          {
            label: 'Batch ID',
            name: 'batch_id',
            field: 'batch_id',
            sort: false,
            align: 'center'
          },
          {
            label: 'Registered Country',
            name: 'country',
            field: 'country',
            align: 'center',
            sort: false,
            format (element) {
              return element !== null && element !== undefined ? element.code : '-'
            }
          },
          {
            label: 'GIRO Type',
            name: 'giro_type',
            field: 'giro_type',
            align: 'center',
            sort: false
          },
          {
            label: 'Created By',
            name: 'created.name',
            field: 'created',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.name : '-'
            }
          },
          {
            label: 'Created At',
            name: 'created_at',
            field: 'created_at',
            align: 'center',
            sort: true
          }
        ]
      }
    },
    validations: {
      filterData: {
        countryID: {
          required
        },
        filterGiroType: {
          required
        }
      }
    },
    mounted () {
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.salesCountryChange()
      this.setVisibleColumns(this.columns)
      this.getCountriesAction()
      if (this.filterData.countryID !== '' && this.filterData.countryID !== null && this.filterData.countryID !== undefined
          && this.filterData.giroType !== '' && this.filterData.giroType !== null && this.filterData.giroType !== undefined) {
        this.queryHandler(this.setDefaultPaginationAttr('giro_payment'))
      }
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getGiroTypeAction',
        'loadGiroPaymentHistoryAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setWalletData: 'SET_WALLET_DATA',
        unsetWalletData: 'UNSET_WALLET_DATA'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        // this.setFilterData({
        //   registered_country_id: this.filterData.countryID,
        //   giro_type: this.filterData.filterGiroType,
        //   batch_id_from: this.filterData.filterBatchIDFrom,
        //   batch_id_to: this.filterData.filterBatchIDTo
        // })
        this.query.registered_country_id = this.filterData.countryID
        this.query.giro_type = this.filterData.filterGiroType
        this.query.batch_id_from = this.filterData.filterBatchIDFrom
        this.query.batch_id_to = this.filterData.filterBatchIDTo
        this.loadGiroPaymentHistoryAction(this.query).then(() => {
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
        if (this.filterData.countryID > 0) {
          this.show = true
          this.disable = false
          // fetch GIRO options here
          let query = {
            country_id: this.filterData.countryID
          }
          this.getGiroTypeAction(query).then(res => {
            if (this.giroTypeByCountry.length > 0) {
              this.filterData.filterGiroType = this.giroTypeByCountry[0].value
              this.filterChange()
            } else {
              this.filterData.filterGiroType = ''
            }
          })
        } else {
          this.disable = true
        }
      },
      reset (action) {
      },
      filterChange () {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('giro_payment'))
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
        // no detail screen needed here
        // this.LoadExistingEWalletAdjustment(row)
      },
      routePage (data) {
        this.unsetWalletData({userID: '', walletAdjustmentID: '', filterGiroType: ''})
        this.setWalletData(data)
        this.$router.push({
          name: 'e-Wallet GIRO Payment Generation'
        })
      },
      togglePopupSearchSection (x, status=!x) {
        this.togglePopupSearch = status
      },
      initiateGiroPaymentBatchGeneration (type) {
        let data = {
          userID: this.filterData.filterUserID,
          filterGiroType: this.filterData.filterGiroType
        }
        this.routePage(data, type)
      },
      debugConsoleLog (props) {
        console.log(props)
      }
    }
  }
</script>

<style lang="stylus">
  q-td-no-padding
    padding 0px
</style>
