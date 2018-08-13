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
              <q-input v-model.lazy="filterData.filterTerms"
                       :disable="disable"
                       stack-label="Search ..."
                       @input="filterChange">
              </q-input>
            </div>
            <div class="col-3">
              <q-field
                :error="$v.filterData.filterDateRangeTo.$error"
                :error-label="$t('sale.cancellation.list.error.dateRangeIncorrect')"
              >
                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                            :disable="disable"
                            v-model="filterData.filterDateRangeTo"
                            stack-label="Date"
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
                     :disable="disable"
              >
                {{ !togglePopupSearch ? $t('wallet.adjustment.label.newAdjustment') : $t('wallet.adjustment.label.cancel')}}
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
                               :placeholder="$t('wallet.adjustment.searchMember.placeholder')"
                               :after="[{icon: 'chevron_right', handler () { initiateEWalletAdjustment() }}]"
                               @input="reset">
                        <q-autocomplete @search="(terms, done) => search(terms, done, 'userID')"
                                        @selected="(item, keyboard) => selected(item, 'userID', keyboard)"/>
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
  import simplePagination from '../../global/components/common/pagination/simplePagination'
  import genaralHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import {DatesMixin, MasterDataTransformarMixin, PaginationMixin} from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: "e-wallet-adjustment",
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
        tableList: 'tableDataWalletAdjustment',
        paginationQuery: 'pagination'
      })
    },
    validations: {
      filterData: {
        countryID: {
          required
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
        userIDSearchTerm: '',
        total: 20,
        showMoreFilter: false,
        minPages: 1,
        maxPages: 1,
        rows: [],
        toggleStatus: false,
        togglePopupSearch: false,
        userIDDeposit: '',
        userIDRefund: '',
        userIDDepositSearchTerm: '',
        userIDRefundSearchTerm: '',
        filterData: {
          countryID: '',
          filterTerms: '',
          filterUserID: '',
          filterDateRangeTo: ''
        },
        columns: [
          {
            label: 'Date',
            name: 'created_at',
            field: 'created_at',
            sort: false,
            align: 'center'
          },
          {
            label: 'IBO ID',
            name: 'user.old_member_id',
            field: 'user',
            align: 'center',
            sort: false,
            format (element) {
              return element !== null && element !== undefined ? element.old_member_id : '-'
            }
          },
          {
            label: 'IBO Name',
            name: 'user.name',
            field: 'user',
            align: 'center',
            sort: false,
            format (element) {
              return element !== null && element !== undefined ? element.name : '-'
            }
          },
          {
            label: 'Balance Before Adjustment',
            name: 'transaction.before_balance',
            field: 'transaction',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined && element.before_balance !== null && element.before_balance !== undefined ? element.before_balance : '-'
            }
          },
          {
            label: 'Debit',
            name: 'amount_detail.debit_amount',
            field: 'amount_detail',
            align: 'center',
            sort: false,
            format (element) {
              return element !== null && element !== undefined && element.debit_amount !== null && element.debit_amount !== undefined && element.debit_amount !== 0 ? element.debit_amount : '-'
            }
          },
          {
            label: 'Credit',
            name: 'amount_detail',
            field: 'amount_detail',
            align: 'center',
            sort: false,
            format (element) {
              return element !== null && element !== undefined && element.credit_amount !== null && element.credit_amount !== undefined && element.credit_amount !== 0 ? element.credit_amount : '-'
            }
          },
          {
            label: 'Balance After Adjustment',
            name: 'transaction.after_balance',
            field: 'transaction',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined && element.after_balance !== null && element.after_balance !== undefined ? element.after_balance : '-'
            }
          },
          {
            label: 'Reason',
            name: 'reason.title',
            field: 'reason',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.title : '-'
            }
          },
          {
            label: 'Created By',
            name: 'created_by.name',
            field: 'created_by',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.name : ''
            }
          }
        ]
      }
    },
    mounted () {
      this.master.keys = [
        'consignment_deposit_and_refund_type',
        'consignment_deposit_and_refund_status'
      ]
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.setVisibleColumns(this.columns)
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
        'getWalletAdjustmentListAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setWalletData: 'SET_WALLET_DATA',
        unsetWalletData: 'UNSET_WALLET_DATA'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.filterData.countryID
        this.query.search_text = this.filterData.filterTerms
        this.query.filterDateRangeTo = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.getWalletAdjustmentListAction(this.query).then(() => {
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
          this.filterChange()
        } else {
          this.disable = true
        }
      },
      search (terms, done, field) {
        let query = {
          search_text: this.userIDSearchTerm,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      selected (item, field, keyboard) {
        if (!keyboard) {
          this[field] = item.sublabel
          if (field === 'userID') {
            this.$refs.popover.show()
            this.filterData.filterUserID = item.userID
            this.userIDSearchTerm = item.label
          }
        }
      },
      reset (action) {
      },
      filterChange () {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('wallet_adjustment'))
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
        this.LoadExistingEWalletAdjustment(row)
      },
      routePage (data) {
        this.unsetWalletData({userID: '', walletAdjustmentID: ''})
        this.setWalletData(data)
        if (data.walletAdjustmentID !== '') {
          this.$router.push({
            name: 'e-Wallet Adjustment Detail',
            params: {
              adjustmentID: data.walletAdjustmentID
            }
          })
        } else {
          this.$router.push({
            name: 'New e-Wallet Adjustment'
          })
        }
      },
      togglePopupSearchSection (x, status=!x) {
        this.togglePopupSearch = status
      },
      initiateEWalletAdjustment (type) {
        let data = {
          userID: this.filterData.filterUserID,
          walletAdjustmentID: ''
        }
        this.routePage(data, type)
      },
      toggleMoreFilter (x) {
        this.showMoreFilter = !x
      },
      LoadExistingEWalletAdjustment (row) {
        let data = {
          walletAdjustmentID: row.id,
          userID: ''
        }
        this.routePage(data)
      }
    }
  }
</script>

<style scoped>

</style>
