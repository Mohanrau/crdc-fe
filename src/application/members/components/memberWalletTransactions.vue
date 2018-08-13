<template>
  <div class="general-page-holder">
    <genaral-header genaralTitle="List of Orders"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row justify-between gutter-xs">
        <div class="col-lg-3 col-md-12 col-xs-12">
          <q-field
            :error="$v.filterData.countryID.$error"
            :error-label="$t('general.select.country.error')">
            <q-select
              clearable
              inverted-light
              class="no-shadow custom-input-border"
              color="white text-black"
              v-model="filterData.countryID"
              :options="countriesOptions.options"
              :placeholder="$t('general.select.country')"
              @input="salesCountryChange"
            />
          </q-field>
        </div>
        <div class="col-lg-3 col-md-12 col-xs-12">
          <q-field
            :error="$v.filterData.filterUserID.$error"
            :error-label="$t('member.wallet.transaction.errorMessage.pleaseSelectMember')"
          >
            <q-input v-model.trim="filterData.filterTerms"
                     clearable
                     autofocus
                     inverted-light
                     class="no-shadow custom-input-border"
                     color="white text-black"
                     @clear="reset('filterTerms')"
                     :placeholder="$t('members.iboIbName.placeholder.label')"
            >
              <q-autocomplete
                @search="(terms, done) => search(terms, done, 'filterTerms')"
                @selected="(item, keyboard) => selected(item, 'filterTerms', keyboard)"
              />
            </q-input>
          </q-field>
        </div>
        <div class="col-lg-3 col-md-12 col-xs-12">
          <q-field
            :error="$v.filterData.filterDateRangeFrom.$error"
            :error-label="$t('member.wallet.transaction.errorMessage.invalidDateRange')">
            <q-datetime align="left" monday-first format="DD-MM-YYYY"
                        :disable="disable"
                        v-model="filterData.filterDateRangeFrom"
                        :placeholder="$t('member.wallet.transaction.fromDate')"
                        inverted-light
                        class="no-shadow custom-input-border"
                        color="white text-black"
                        @input="filterChange"
            />
          </q-field>
        </div>
        <div class="col-lg-3 col-md-12 col-xs-12">
          <q-field
            :error="$v.filterData.filterDateRangeTo.$error"
            :error-label="$t('member.wallet.transaction.errorMessage.invalidDateRange')">
            <q-datetime align="left" monday-first format="DD-MM-YYYY"
                        inverted-light
                        class="no-shadow custom-input-border"
                        color="white text-black"
                        :disable="disable"
                        v-model="filterData.filterDateRangeTo"
                        :placeholder="$t('member.wallet.transaction.toDate')"
                        @input="filterChange"
            />
          </q-field>
        </div>
      </div>
    </div>
    <!--v-if="rows.length > 1 || this.filterData.filterTerms === ''"-->
    <q-table
      :data="serverData"
      :columns="columns"
      :pagination.sync="serverPagination"
      :serverData-per-page-options="appSettings.defaulted.table_rows_per_page_options"
      :separator="separator"
      :loading="isProcessingTable"
      @request="queryHandler"
      :visible-columns="visibleColumns"
      row-key="name"
      :color="appSettings.defaulted.table_color"
      dense
      class="bg-white shadow-1 relative-position mt-20">
      <!-- Custom renderer for "action" column with button for custom action -->
      <q-tr slot="body" slot-scope="props" :props="props"
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
    name: "member-wallet-transactions",
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
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal
      }),
      ...mapGetters({
        tableList: 'tableMemberTransactionList',
        paginationQuery: 'pagination'
      })
    },
    validations: {
      filterData: {
        countryID: {
          required
        },
        filterUserID: {
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
        minPages: 1,
        maxPages: 1,
        rows: [],
        toggleStatus: false,
        filterData: {
          countryID: '',
          filterTerms: '',
          filterUserID: '',
          filterDateRangeFrom: '',
          filterDateRangeTo: ''
        },
        columns: [
          {
            label: this.$t('member.wallet.transaction.transactionDate'),
            name: 'transaction_date',
            field: 'transaction_date',
            sort: false,
            align: 'center'
          },
          {
            label: this.$t('member.wallet.transaction.transactionType'),
            name: 'transaction_type',
            field: 'transaction_type',
            align: 'center',
            sort: false,
            format(element) {
              return element !== null && element !== undefined ? element.title : '-'
            }
          },
          {
            label: this.$t('member.wallet.transaction.transferRecipient'),
            name: 'transfer_to_user',
            field: 'transfer_to_user',
            align: 'center',
            sort: false,
            format(element) {
              return element !== null && element !== undefined ? element.name : '-'
            }
          },
          {
            label: this.$t('member.wallet.transaction.transactionDetail'),
            name: 'transaction_details',
            field: 'transaction_details',
            align: 'center',
            sort: false
          },
          {
            label: this.$t('member.wallet.transaction.currency'),
            name: 'currency.code',
            field: 'currency',
            align: 'center',
            sort: false,
            format(element) {
              return element !== null && element !== undefined ? element.code : '-'
            }
          },
          {
            label: this.$t('member.wallet.transaction.credit'),
            name: 'credit',
            field: 'credit_amount',
            align: 'center',
            sort: false,
            format(element, row) {
              return element !== undefined && element !== null ? element : '-'
            }
          },
          {
            label: this.$t('member.wallet.transaction.debit'),
            name: 'debit',
            field: 'debit_amount',
            align: 'center',
            sort: false,
            format(element, row) {
              return element !== undefined && element !== null ? element : '-'
            }
          },
          {
            label: this.$t('member.wallet.transaction.balance'),
            name: 'after_balance',
            field: 'after_balance',
            align: 'center',
            sort: false
          }
        ]
      }
    },
    mounted() {
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
        'getMemberSearchAction',
        'getMemberTransactionListDataAction'
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
          filterDepositRefundStatus: this.filterData.filterDepositRefundStatus,
          filterUserID: this.filterData.filterUserID
        })
        this.query.country_id = this.filterData.countryID
        this.query.user_id = this.filterData.filterUserID
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.getMemberTransactionListDataAction(this.query).then(() => {
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
        if (field === 'filterTerms') {
          let query = {
            search_text: this.filterData.filterTerms,
            country_id: this.filterData.countryID,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        }
      },
      selected(item, field, keyboard) {
        if (!keyboard) {
          if (field === 'filterTerms') {
            this.filterData.filterUserID = item.userID
            this.filterData.filterTerms = item.value
            this.filterChange()
          }
        }
      },
      reset(action) {
        if (action === 'filterTerms') {
          this.filterData.filterUserID = ''
          this.serverPagination.rowsNumber = 0
          this.serverData= []
        }
      },
      filterChange() {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('member_transaction_list'))
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
      }
    }
  }
</script>

<style scoped>

</style>
