<template>
  <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
    <genaral-header genaralTitle="e-Wallet Adjustment List"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-10">
          <div class="row generic-margin gutter-xs">
            <div class="col-3">
              <q-field
              >
                <q-select
                  color="black"
                  :stack-label="$t('sale.cancellation.list.filter.selectCountry')"
                  v-model="filterData.filterCountryID"
                  :options="countriesOptions.options"
                  @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-3">
              <q-field
              >
                <q-input
                  stack-label="Search Member"
                  v-model="filterData.filterIboName"
                         clearable
                         :placeholder="$t('bonus.yearlyIncome.placeholder.searchMember')"
                         @input="filterChange"
                >
                  <q-autocomplete
                    @search="(terms, done) => search(terms, done, 'user_id')"
                    @selected="(item, keyboard) => selected(item, 'user_id', keyboard)"
                  />
                </q-input>
              </q-field>
            </div>
            <div class="col-2">
              <q-field
              >
                <q-select
                  v-model="filterData.filterYear"
                  :options="years"
                  filter
                  color="black"
                  stack-label="Year"
                  clearable
                  @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-2">
              <q-field
              >
                <q-select
                  v-model="filterData.filterLvlOneApproval"
                  :options="masterDataOptionsCreator(this.$const.masterKey.REJECTED_GIRO_APPROVAL_STATUS)"
                  filter
                  color="black"
                  stack-label="Level 1 Approval Status"
                  clearable
                  @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-2">
              <q-field
              >
                <q-select
                  v-model="filterData.filterLvlOneApproval"
                  :options="masterDataOptionsCreator(this.$const.masterKey.REJECTED_GIRO_APPROVAL_STATUS)"
                  filter
                  color="black"
                  stack-label="Level 2 Approval Status"
                  clearable
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
              <q-uploader
                :url="url"
                color="primary"
                inverted
                stack-label="Upload rejects"
                :headers="headers"
                :method="method"
                :error="uploadFailed"
                extensions=".xls"
                auto-expand
                @uploaded="uploaded"
                />
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
      <!--top row custom layout for checkbox-->
      <q-tr slot="top-row" slot-scope="props" v-if="levelOneApprovalCount > 0 || levelTwoApprovalCount > 0">
        <q-td colspan="7" />
        <q-td>
          <div
            class="row gutter-xs q-px-sm justify-center"
            v-if="levelOneApprovalCount > 0"
          >
            <div class="col-auto">
              <q-checkbox v-model="approveAllLvl1" @input="batchProcessLevelOneApproval(1)">
                <q-icon name="done" color="green" />
              </q-checkbox>
            </div>
            <div class="col-auto">
              <q-checkbox v-model="rejectAllLvl1" @input="batchProcessLevelOneApproval(0)">
                <q-icon name="close" color="red" />
              </q-checkbox>
            </div>
            <div class="col-auto">
              <q-btn
                size="sm"
                flat
                text-color="blue"
                @click="submitLevelOneApproval()"
              >
                Confirm
              </q-btn>
            </div>
          </div>
        </q-td>
        <q-td>
          <div
            class="row gutter-xs q-px-sm justify-center"
            v-if="levelTwoApprovalCount > 0"
          >
            <div class="col-auto">
              <q-checkbox v-model="approveAllLvl2" @input="batchProcessLevelTwoApproval(1)">
                <q-icon name="done" color="green" />
              </q-checkbox>
            </div>
            <div class="col-auto">
              <q-checkbox v-model="rejectAllLvl2" @input="batchProcessLevelTwoApproval(0)">
                <q-icon name="close" color="red" />
              </q-checkbox>
            </div>
            <div class="col-auto">
              <q-btn
                size="sm"
                flat
                text-color="blue"
                @click="submitLevelTwoApproval"
              >
                Confirm
              </q-btn>
            </div>
          </div>

        </q-td>
      </q-tr>
      <!-- Custom renderer for "action" column with button for custom action -->
      <template slot="body" slot-scope="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name" :props="props"
            v-if="col.name !== 'level_one_status' && col.name !== 'level_two_status' && col.name !== 'expand'">
            {{ col.value }}
          </q-td>
          <q-td :props="props" key="expand">
            <q-checkbox v-if="props.row.level_one_by !== null" color="primary" v-model="props.expand" checked-icon="remove" unchecked-icon="add" class="q-mr-md" />
          </q-td>
          <q-td :props="props" key="level_one_status" >
            <q-btn-toggle
              flat
              :disable="props.row.level_one_by !== null"
              v-model="props.row.level_one_status"
              @input="processLevelOneApproval(props.row)"
              :toggle-color="props.row.level_one_status ? 'positive' : 'negative'"
              :options="[
                {label: 'Approve', value: 1},
                {label: 'Reject', value: 0}
              ]"
            />
          </q-td>
          <q-td :props="props" key="level_two_status">
            <q-btn-toggle
              v-show="props.row.level_one_by !== null && props.row.level_one_status !== 0"
              flat
              :disable="props.row.level_two_by !== null"
              @input="processLevelTwoApproval(props.row)"
              v-model="props.row.level_two_status"
              :toggle-color="props.row.level_two_status ? 'positive' : 'negative'"
              :options="[
                {label: 'Approve', value: 1},
                {label: 'Reject', value: 0}
              ]"
            />
          </q-td>
        </q-tr>
        <!--additional detail for rejected/approved details-->
        <q-tr v-if="props.expand">
          <q-td colspan="7" align="right">Approval details:</q-td>
          <q-td>
            <p v-if="props.row.level_one_status === 1" class="text-green q-ma-none q-px-xs">Approved by {{props.row.level_one_user.name}}</p>
            <div v-else class="text-red q-px-xs">
              <p class="q-ma-none">Rejected by {{props.row.level_one_user.name}}</p>
              <p class="q-ma-none">Reason: {{props.row.level_one_reason}}</p>
            </div>
          </q-td>
          <q-td>
            <p v-if="props.row.level_two_status === 1" class="text-green q-ma-none q-px-xs">Approved by {{props.row.level_two_user.name}}</p>
            <div v-if="props.row.level_two_status === 0" class="text-red q-px-xs">
              <p class="q-ma-none">Rejected by {{props.row.level_two_user.name}}</p>
              <p class="q-ma-none">Reason: {{props.row.level_two_reason}}</p>
            </div>
          </q-td>
        </q-tr>
        <!--additional row for approved or reject status-->
        <q-tr v-if="props.row.level_one_by === null && props.row.level_one_status !== null && !props.row.level_one_status" :props="props"  class="q-pa-none">
          <q-td colspan="6"/>
          <q-td colspan="3" class="justify-start">
                <q-field
                  label="L1 Rejection Reason"
                  :label-width="3"
                  :error="getL1Validation(props.row)"
                  error-label="'Rejection reason is required"
                >
                  <q-input
                    v-model="props.row.level_one_reason"
                    :disable="props.row.level_one_by !== null"
                  />
                </q-field>
              <p v-if="props.row.level_one_by !== null" class="q-pt-xs text-grey">Rejected By {{props.row.level_one_by}}</p>
          </q-td>
        </q-tr>
        <q-tr v-if="props.row.level_two_by === null && props.row.level_two_status !== null && !props.row.level_two_status" :props="props"  class="q-pa-none">
          <q-td colspan="6" />
          <q-td colspan="3" class="justify-start">
            <q-field
              class="text-black"
              label="Lvl 2 Rejection Reason"
              :label-width="3"
              :error="getL2Validation(props.row)"
              error-label="'Rejection reason is required"
            >
              <q-input v-model="props.row.level_two_reason" />
            </q-field>
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
  import { api } from '../api'
  import {DatesMixin, PaginationMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
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
        tableList: 'tableDataWalletGiroRejectedPayment',
        paginationQuery: 'pagination'
      })
    },
    data: function () {
      return {
        disable: true,
        serverData: [],
        years: [],
        approveAllLvl1: false,
        rejectAllLvl1: false,
        approveAllLvl2: false,
        rejectAllLvl2: false,
        levelOneApprovalList: [],
        levelTwoApprovalList: [],
        url: api.giroRejectedPaymentUploadExcel,
        headers: {
          Accept: 'form-data',
          Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
        },
        method: 'POST',
        show: false,
        total: 20,
        levelOneApprovalCount: 0,
        levelTwoApprovalCount: 0,
        minPages: 1,
        maxPages: 1,
        rows: [],
        togglePopupSearch: false,
        uploadFailed: false,
        giroType: [],
        filterData: {
          filterCountryID: '',
          filterIboName: '',
          filterIboID: '',
          filterYear: '',
          filterLvlOneApproval: '',
          filterLvlTwoApproval: ''
        },
        columns: [
          {
            label: 'IBO ID',
            name: 'user.old_member_id',
            field: 'user',
            sort: false,
            align: 'center',
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
            label: 'Rejected Amount',
            name: 'rejected_amount',
            field: 'rejected_amount',
            align: 'center',
            sort: false
          },
          {
            label: 'Remark',
            name: 'remarks',
            field: 'remarks',
            align: 'center',
            sort: false
          },
          {
            label: 'Created By',
            name: 'created_by',
            field: 'created_by',
            align: 'center',
            sort: true,
            format (element) {
              return element !== null && element !== undefined ? element.name : '-'
            }
          },
          {
            label: 'Created Date',
            name: 'created_at',
            field: 'created_at',
            align: 'center',
            sort: true
          },
          {
            name: 'expand',
            field: 'expand',
            align: 'center'
          },
          {
            label: 'Lvl 1 Approval',
            name: 'level_one_status',
            field: 'level_one_status',
            align: 'center',
            sort: true
          },
          {
            label: 'Lvl 2 Approval',
            name: 'level_two_status',
            field: 'level_two_status',
            align: 'center',
            sort: true
          }
        ]
      }
    },
    validations: {
      levelOneApprovalList: {
        $each: {
          level_one_reason: {
            reason_validation (val, elm) {
              return elm.level_one_status === 1 || ( val !== '' && val !== null )
            }
          }
        }
      },
      levelTwoApprovalList: {
        $each: {
          level_two_reason: {
            reason_validation (val, elm) {
              return elm.level_two_status === 1 || ( val !== '' && val !== null )
            }
          }
        }
      }
    },
    mounted () {
      this.master.keys = [
        this.$const.masterKey.REJECTED_GIRO_APPROVAL_STATUS
      ]
      this.filterData.filterCountryID = this.selectedFilters.countryID
      // Clone vuex filterData to local object
      this.generateYearSelection()
      this.setVisibleColumns(this.columns)
      this.getCountriesAction()
      this.queryHandler(this.setDefaultPaginationAttr('giro_rejected_payment'))
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getGiroRejectedPaymentListAction',
        'uploadGiroRejectedPaymentAction',
        'submitGiroRejectedLevelOneAction',
        'submitGiroRejectedLevelTwoAction'
      ]),
      ...mapMutations({
        setResponseData: 'SET_WALLET_GIRO_REJECTED_PAYMENT_RESPONSE'
      }),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.country_id = undefined
        this.query.user_id = undefined
        this.query.year = undefined
        this.query.level_one_status = undefined
        this.query.level_two_status = undefined
        if (this.filterData.countryID !== '') {
          this.query.country_id = this.filterData.countryID
        }
        if (this.filterData.filterUserID !== '') {
          this.query.user_id = this.filterData.filterUserID
        }
        if (this.filterData.filterYear !== '') {
          this.query.year = this.filterData.filterYear
        }
        if (this.filterData.filterLvlOneApproval !== '') {
          this.query.level_one_status = this.filterData.filterLvlOneApproval
        }
        if (this.filterData.filterLvlTwoApproval !== '') {
          this.query.level_two_status = this.filterData.filterLvlTwoApproval
        }
        this.getGiroRejectedPaymentListAction(this.query).then(() => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = JSON.parse(JSON.stringify(this.tableList.list.data))
          let levelOneApprovalList = this.tableList.list.data.filter(data => {
            return data.level_one_by === null
          })
          this.levelOneApprovalCount = levelOneApprovalList !== undefined ? levelOneApprovalList.length : 0
          let levelTwoApprovalList = this.tableList.list.data.filter(data => {
            return data.level_one_by !== null && data.level_one_status === 1 &&  data.level_two_by === null
          })
          this.levelTwoApprovalCount = levelTwoApprovalList !== undefined ? levelTwoApprovalList.length : 0
        })
      },
      reset (action) {
      },
      filterChange () {
        this.queryHandler(this.setDefaultPaginationAttr('giro_rejected_payment'))
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
      routePage (data) {
        this.$router.push({
          name: 'e-Wallet GIRO Payment Generation'
        })
      },
      togglePopupSearchSection (x, status=!x) {
        this.togglePopupSearch = status
      },
      debugConsoleLog (props) {
        console.log(props)
      },
      generateYearSelection () {
        // this will be changed to be fetched from backend later, like CW
        let currentYear = new Date().getFullYear()
        let startYear = 2010
        while (startYear <= currentYear) {
          let year = currentYear--
          this.years.push({value: year, label: year.toString()})
        }
      },
      search (terms, done, field) {
        if (field === 'user_id') {
          let query = {
            search_text: this.filterData.filterIboName,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        }
      },
      selected (item, field, keyboard) {
        if (!keyboard) {
          if (field === 'user_id') {
            this.filterData.filterIboID = item.userID
            this.filterData.filterIboName = item.label
          }
        }
      },
      uploaded (file, res) {
        if (res !== undefined && res !== null && res.status !== undefined && res.status !== null && res.status === 200) {
          this.setResponseData(JSON.parse(res.response)[0])
          this.$router.push({name: 'e-Wallet GIRO Rejected Upload Review'})
        } else {
          this.setNotification({
            title: 'GIRO Rejected Payment Upload Failed',
            message: 'Something went wrong with the upload. Please check your internet connection and excel formatting',
            type: 'negative'
          })
        }
      },
      batchProcessLevelOneApproval (approvalResult) {
        if (this.rejectAllLvl1 || this.approveAllLvl1) {
          // if either one of the checkbox is selected
          this.levelOneApprovalList = this.serverData.filter(data => {
            return data.level_one_by === null
          })
          this.levelOneApprovalList.forEach(data => {
            data.level_one_status = approvalResult
          })
          if (approvalResult === 1) {
            this.rejectAllLvl1 = false
          } else {
            this.approveAllLvl1 = false
          }
        } else {
          this.levelOneApprovalList.forEach(data => {
            data.level_one_status = null
          })
          this.levelOneApprovalList = []
        }
      },
      batchProcessLevelTwoApproval (approvalResult) {
        if (this.rejectAllLvl2 || this.approveAllLvl2) {
          // if either one of the checkbox is selected
          this.levelTwoApprovalList = this.serverData.filter(data => {
            return data.level_one_by !== null && data.level_one_status === 1 &&  data.level_two_by === null
          })
          this.levelTwoApprovalList.forEach(data => {
            data.level_two_status = approvalResult
          })
          if (approvalResult === 1) {
            this.rejectAllLvl2 = false
          } else {
            this.approveAllLvl2 = false
          }
        } else {
          this.levelTwoApprovalList.forEach(data => {
            data.level_two_status = null
          })
          this.levelTwoApprovalList = []
        }
      },
      submitLevelOneApproval () {
        this.$v.levelOneApprovalList.$touch()
        if (!this.$v.levelOneApprovalList.$error) {
          this.levelOneApprovalList.forEach(data => {
            data.level_one_status = data.level_one_status === 1
          })
          this.submitGiroRejectedLevelOneAction({data: this.levelOneApprovalList}).then(res => {
            this.queryHandler(this.setDefaultPaginationAttr('giro_rejected_payment'))
          })
        } else {
          this.setNotification({
            title: 'Level 1 Approval Submission failed',
            message: 'Please make sure rejection reason for all rejected records are entered',
            type: 'negative'
          })
        }
      },
      submitLevelTwoApproval () {
        this.$v.levelTwoApprovalList.$touch()
        if (!this.$v.levelTwoApprovalList.$error) {
          this.levelTwoApprovalList.forEach(data => {
            data.level_two_status = data.level_two_status === 1
          })
          this.submitGiroRejectedLevelTwoAction({data: this.levelTwoApprovalList}).then(res => {
            this.queryHandler(this.setDefaultPaginationAttr('giro_rejected_payment'))
          })
        } else {
          this.setNotification({
            title: 'Level 2 Approval Submission failed',
            message: 'Please make sure rejection reason for all rejected records are entered',
            type: 'negative'
          })
        }
      },
      processLevelOneApproval (row) {
        let exists = this.levelOneApprovalList.includes(row)
        if (!exists) {
          this.levelOneApprovalList.push(row)
        }
        row.level_one_reason = ''
      },
      processLevelTwoApproval (row) {
        let exists = this.levelTwoApprovalList.includes(row)
        if (!exists) {
          this.levelTwoApprovalList.push(row)
        }
      },
      getL1Validation (row) {
        let index = this.levelOneApprovalList.indexOf(row)
        if (index < 0) {
          return true
        } else {
          return this.$v.levelOneApprovalList.$each[index].$error
        }
      },
      getL2Validation (row) {
        let index = this.levelTwoApprovalList.indexOf(row)
        if (index < 0) {
          return true
        } else {
          return this.$v.levelTwoApprovalList.$each[index].$error
        }
      }
    }
  }
</script>

<style lang="stylus">
</style>
