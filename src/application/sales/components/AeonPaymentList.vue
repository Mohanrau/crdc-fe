<template>
  <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
    <genaral-header genaralTitle="List of Aeon Payments"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-12">
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
                            clearable
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
                            clearable
                            v-model="filterData.filterDateRangeTo"
                            :stack-label="$t('sale.cancellation.list.filter.dateTo')"
                            @input="filterChange"
                />
              </q-field>
            </div>
            <div class="col-lg-2">
              <q-select
                v-model="filterData.filterApprovalStatus"
                :options="masterDataOptionsCreator('aeon_payment_approval_status')"
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
      </div>
    </div>
    <q-table
      :data="serverData"
      :columns="columns"
      :pagination.sync="serverPagination"
      :serverData-per-page-options="appSettings.defaulted.table_serverData_per_page_options"
      :separator="separator"
      :visible-columns="visibleColumns"
      :loading="isProcessingTable"
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
            @input="toggleAllReleaseRows"
          />
          Release
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
            v-if="eligibleForReleaseProcessing(props.row)"
            @input="toggleItemForRelease(props.row)" />
        </q-td>
        <q-td v-for="col in props.cols"  v-if="col.name !== 'check' && col.name !== 'payment_detail.payment_response.agreement_no' && col.name !== 'payment_detail.payment_response.approved_amount'" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
        <q-td key="payment_detail.payment_response.approved_amount" :props="props" v-if="props.row.payment_detail !== null && props.row.payment_detail !== undefined && props.row.payment_detail.payment_response !== null && props.row.payment_detail.payment_response !== undefined"  auto-width>
          <q-input
            color="primary"
            type="number"
            :error="$v.serverData.$each[serverData.indexOf(props.row)].payment_detail.payment_response.approved_amount.$error"
            error-label="Invalid Approved Amount"
            :disable="checkApprovalStatus(props.row)"
            v-model="props.row.payment_detail.payment_response.approved_amount"
          />
        </q-td>
        <q-td key="payment_detail.payment_response.agreement_no" :props="props" v-if="props.row.payment_detail !== null && props.row.payment_detail !== undefined && props.row.payment_detail.payment_response !== null && props.row.payment_detail.payment_response !== undefined"  auto-width>
          <q-input
            color="primary"
            :disable="checkApprovalStatus(props.row)"
            error-label="Invalid Agreement No."
            :error="$v.serverData.$each[serverData.indexOf(props.row)].payment_detail.payment_response.agreement_no.$error"
            v-model="props.row.payment_detail.payment_response.agreement_no"
            :after="[
              {
                icon: checkApprovalStatus(props.row)? 'done' : 'send',
                handler () {
                  submitApprovalCode(props.row)
                }
              }
            ]"
          />
        </q-td>
      </q-tr>
      <template slot="top-left" slot-scope="props">
        <q-btn
          color="primary"
          v-if="selectedItemsForRelease.length > 0"
          @click="processReleases"
        >
          Confirm Release ({{selectedItemsForRelease.length}} selected)
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
    name: "aero-payment-list",
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
        tableList: 'tableDataAeonList',
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
      },
      serverData: {
        $each: {
          payment_detail: {
            payment_response: {
              approved_amount: {
                validateAmount (val, elm) {
                  return val !== '' && val > 0
                }
              },
              agreement_no: {
                validateApprovalNumber (val, elm) {
                  return val !== ''
                }
              }
            }
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
      selectedItemsForRelease: [],
      isSelectedAllProcessRefund: false,
      togglePopupSearch: false,
      userID: '',
      userIDSearchTerm: '',
      invoiceNumber: '',
      invoiceID: '',
      isLegacyMode: false,
      searchByTaxInvoice: false,
      recordToSubmit: {},
      filterData: {
        countryID: 0,
        filterTerms: '',
        filterDateRangeFrom: '',
        filterDateRangeTo: '',
        filterApprovalStatus: '',
        filterChannel: '',
      },
      columns: [
        {
          name: 'check',
          align: 'left',
          label: 'Release',
          // label: Vue.prototype.$t('sale.cancellation.list.DTableLabel.processRefund'),
          field: 'check'
        },
        {
          name: 'sale.channel.name',
          label: 'Channel',
          field: 'sale',
          sortable: true,
          format (element) {
            return element !== null && element !== undefined && element.channel !== null && element.channel !== undefined ? element.channel.name : '-'
          },
          align: 'center'
        },
        {
          name: 'sale.transaction_date',
          label: 'Transaction Date',
          field: 'sale',
          sortable: true,
          format (element) {
            return element !== null && element !== undefined ? element.transaction_date : '-'
          },
          align: 'center'
        },
        {
          name: 'sale.document_number',
          label: 'Sales Doc. No',
          field: 'sale',
          sortable: true,
          format (element) {
            return element !== null && element !== undefined ? element.document_number : '-'
          },
          align: 'center'
        },
        {
          name: 'sale.invoice',
          label: 'Tax Invoice No',
          field: 'sale',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.invoices !== null && element.invoices !== undefined? element.invoices.invoice_number : '-'
          },
          align: 'center'
        },
        {
          name: 'sales.order_status.title',
          label: 'Order Status',
          field: 'sale',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.order_status !== null && element.order_status !== undefined? element.order_status.title : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.docStatus.title',
          label: 'Doc. Status',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.docStatus !== null && element.payment_response.docStatus !== undefined ? element.payment_response.docStatus.title : '-'
          },
          align: 'center'
        },
        {
          name: 'amount',
          label: 'Total Amount',
          field: 'amount',
          sortable: false,
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.approvalStatus.title',
          label: 'Approval Status',
          field: 'payment_detail',
          sortable: true,
          align: 'center',
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.approvalStatus !== null && element.payment_response.approvalStatus !== undefined ? element.payment_response.approvalStatus.title : '-'
          }
        },
        // {
        //   name: 'payment_detail.payment_response.agreement_no',
        //   label: 'Agreement No.',
        //   field: 'payment_detail',
        //   format (element, row) {
        //     return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.agreement_no !== null && element.payment_response.agreement_no !== undefined && element.payment_response.agreement_no !== '' ? element.payment_response.agreement_no : '-'
        //   },
        //   align: 'center'
        // },
        {
          name: 'payment_detail.payment_response.approval_date',
          label: 'Aeon Approval Date',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.approval_date !== null && element.payment_response.approval_date !== undefined && element.payment_response.approval_date !== '' ? element.payment_response.approval_date : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.converted_date',
          label: 'Conversion Date',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.converted_date !== null && element.payment_response.converted_date !== undefined && element.payment_response.converted_date !== '' ? element.payment_response.converted_date : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.convertedBy.name',
          label: 'Converted By',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.convertedBy !== null && element.payment_response.convertedBy !== undefined ? element.payment_response.convertedBy.name : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.approved_amount',
          label: 'Approved Amount',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return  element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined? element.payment_response.approved_amount : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.agreement_no',
          label: 'Agreement No.',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return  element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined? element.payment_response.agreement_no : '-'
          },
          align: 'center'
        }
      ]
    }),
    mounted () {
      this.master.keys = [
        'aeon_payment_approval_status'
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
      this.getCountriesAction().then(() => {
        this.salesCountryChange()
      })
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getAeonPaymentListingSearchAction',
        'getMemberSearchAction',
        'getSalesInvoiceSearchAction',
        'aeonPaymentBatchReleaseAction',
        'submitAeonAgreementNumberAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setNotification: 'SHOW_NOTIFICATION',
        setOrderCancellationData: 'SET_ORDER_CANCELLATION_DATA',
        unSetOrderCancellationData: 'UNSET_ORDER_CANCELLATION_DATA'
      }),
      queryHandler(data) {
        this.query = this.processQueryData(data)
        this.setFilterData({
          countryID: this.filterData.countryID,
          filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
          filterDateRangeTo: this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD'),
          filterTerms: this.filterData.filterTerms,
          filterApprovalStatus: this.filterData.filterApprovalStatus
        })
        this.query.country_id = this.filterData.countryID
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.query.search_text = this.filterData.filterTerms
        if (this.filterData.filterApprovalStatus !== null) {
          this.query.approval_status_id = this.filterData.filterApprovalStatus
        }
        this.getAeonPaymentListingSearchAction(this.query).then(() => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = JSON.parse(JSON.stringify(this.tableList.list.data))
          this.totalEligibleRefund = this.serverData.filter((row) => this.eligibleForReleaseProcessing(row)).length
          Vue.nextTick(() => {
            this.$v.$reset()
          })
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
      filterChange() {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('aeon_listing'))
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
          if (this.selectedItemsForRelease.length === this.totalEligibleRefund) {
            this.checkState = true
          } else {
            this.checkState = null
          }
        }
      },
      eligibleForReleaseProcessing(row) {
        return row.payment_detail.payment_response.approvalStatus.title.toLowerCase() === 'approved'
                && row.payment_detail.payment_response.convertedBy === null
                && row.sale !== null && row.sale !== undefined
                && row.sale.order_status !== null && row.sale.order_status !== undefined
                && row.sale.order_status.title.toLowerCase() !== 'void'
      },
      toggleAllReleaseRows() {
        if (this.selectedItemsForRelease.length > 0) {
          this.selectedItemsForRelease = []
          this.checkState = false
        } else {
          // todo
          this.selectedItemsForRelease = this.serverData.filter((row) => this.eligibleForReleaseProcessing(row))
          this.checkState = true
        }
      },
      processReleases() {
        let refunds = this.selectedItemsForRelease.map(product => product.id)
        let query = {
          sales_payments_ids: refunds,
        }
        this.aeonPaymentBatchReleaseAction(query).then(() => {
          this.selectedItemsForRelease = []
          this.checkState = false
          this.queryHandler(this.setDefaultPaginationAttr('aeon_listing'))
        })
      },
      checkApprovalStatus (row) {
        return row.payment_detail !== null
                && row.payment_detail !== undefined
                &&  row.payment_detail.payment_response !== null
                && row.payment_detail.payment_response !== undefined
                && row.payment_detail.payment_response.approvalStatus !== null
                && row.payment_detail.payment_response.approvalStatus !== undefined
                  ? row.payment_detail.payment_response.approvalStatus.title.toLowerCase() === 'approved'
                     || row.payment_detail.payment_response.approvalStatus.title.toLowerCase() === 'declined'
                     || (row.sale !== null && row.sale !== undefined
                        && row.sale.order_status !== null && row.sale.order_status !== undefined
                        && row.sale.order_status.title.toLowerCase() === 'void')
                  : false
      },
      submitApprovalCode (row) {
        let query = {
          payment_id: row.id,
          agreement_number: row.payment_detail.payment_response.agreement_no,
          approved_amount: row.payment_detail.payment_response.approved_amount
        }
        // row.payment_detail.payment_response.toBeSubmitted = true
        if (this.checkValidationStatus(row)) {
          this.submitAeonAgreementNumberAction(query).then((res) => {
            this.queryHandler(this.setDefaultPaginationAttr('epp_listing'))
          })
        } else {
          this.setNotification({
            title: this.$t('sales.aeonList.submitFailed.errorTitle'),
            message: this.$t('sales.aeonList.submitFailed.errorMessage'),
            type: 'negative'
          })
        }
      },
      checkValidationStatus (row) {
        this.$v.serverData.$each[this.serverData.indexOf(row)].$touch()
        return !this.$v.serverData.$each[this.serverData.indexOf(row)].$error
      }
    }
  }
</script>

<style scoped>

</style>
