<template>
  <div class="general-page-holder">
    <genaral-header genaralTitle="List of Aeon Payments"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-12">
          <div class="row gutter-xs generic-margin">
            <div class="col-lg-2 col-md-12 col-xs-12">
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
            <div class="col-lg-2 col-md-12 col-xs-12">
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
                v-model="filterData.filterEppType"
                :options="masterDataOptionsCreator('epp_mode')"
                filter
                :disable="disable"
                color="black"
                clearable
                stack-label="EPP Type"
                :filterPlaceholder="$t('sale.cancellation.list.filter.salesCancellationStatus')"
                @input="filterChange"
              ></q-select>
            </div>
            <div class="col-lg-2">
              <q-select
                v-model="filterData.filterApprovalStatus"
                :options="masterDataOptionsCreator('epp_payment_approval_status')"
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
        <q-th v-for="col in props.cols" :key="col.name" :props="props">
          {{ col.label }}
        </q-th>
      </q-tr>
      <!-- Custom renderer for "action" column with button for custom action -->
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="routePage(props.row)" class="cursor-pointer">
        <q-td v-for="col in props.cols" v-if="col.name !== 'payment_detail.payment_response.approval_code'" :key="col.name" :props="props">
          {{ col.value }}
        </q-td>
        <q-td key="payment_detail.payment_response.approval_code" :props="props" v-if="props.row.payment_detail !== null && props.row.payment_detail !== undefined && props.row.payment_detail.payment_response !== null && props.row.payment_detail.payment_response !== undefined"  auto-width>
          <q-input
            color="primary"
            :disable="checkApprovalStatus(props.row)"
            v-model="props.row.payment_detail.payment_response.approval_code"
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
      <template slot="top-right"   slot-scope="props">
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
        tableList: 'tableDataEPPList',
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
      serverData: [],
      filterData: {
        countryID: 0,
        filterTerms: '',
        filterDateRangeFrom: '',
        filterDateRangeTo: '',
        filterEppType: '',
        filterApprovalStatus: '',
        filterChannel: '',
      },
      columns: [
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
          type: 'date',
          format (element) {
            return element !== null && element !== undefined ? element.document_number : '-'
          },
          align: 'center'
        },
        {
          name: 'sale.invoices.invoice_number',
          label: 'Tax Invoice No',
          field: 'sale',
          sortable: true,
          format (element) {
            return element !== null && element !== undefined  && element.invoices !== null && element.invoices !== undefined ? element.invoices.invoice_number : '-'
          },
          align: 'center'
        },
        {
          name: 'sale.order_status.title',
          label: 'Order Status',
          field: 'sale',
          sortable: true,
          format (element) {
            return element !== null && element !== undefined  && element.order_status !== null && element.order_status !== undefined ? element.order_status.title : '-'
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
          name: 'sale.member.user.old_member_id',
          label: 'IBO ID',
          field: 'sale',
          sortable: false,
          format (element, row) {
            return element !== null && element !== undefined && element.member !== null && element.member !== undefined && element.member.user !== null && element.member.user !== undefined ? element.member.user.old_member_id : '-'
          },
          align: 'center'
        },
        {
          name: 'sale.member.name',
          label: 'IBO Name',
          field: 'sale',
          sortable: false,
          format (element, row) {
            return element !== null && element !== undefined && element.member !== null && element.member !== undefined ? element.member.name : '-'
          },
          align: 'center'
        },
        {
          name: 'amount',
          label: 'Total Amount',
          field: 'amount',
          sortable: false,
          format (element, row) {
            return element !== null && element !== undefined ? element : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_mode_provider.name',
          label: 'EPP Mode',
          field: 'payment_mode_provider',
          sortable: true,
          align: 'center',
          format (element, row) {
            return element !== null && element !== undefined ? element.name : '-'
          }
        },
        {
          name: 'payment_detail.payment_response.card_type.name',
          label: 'Card Type',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined ? element.payment_response.card_type : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.tenure',
          label: 'Tenure (mths)',
          field: 'payment_detail',
          sortable: true,
          align: 'center',
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined ? element.payment_response.tenure : '-'
          }
        },
        {
          name: 'payment_detail.payment_response.card_holder_name',
          label: 'Cardholder Name',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined ? element.payment_response.card_holder_name : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.approvalStatus.title',
          label: 'Approved Status',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return  element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.approvalStatus !== null && element.payment_response.approvalStatus !== undefined ? element.payment_response.approvalStatus.title : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.approved_by.name',
          label: 'Approved By',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return  element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined && element.payment_response.approvedBy !== null && element.payment_response.approvedBy !== undefined ? element.payment_response.approvedBy.name : '-'
          },
          align: 'center'
        },
        {
          name: 'payment_detail.payment_response.approval_code',
          label: 'App. Code',
          field: 'payment_detail',
          sortable: true,
          format (element, row) {
            return  element !== null && element !== undefined && element.payment_response !== null && element.payment_response !== undefined? element.payment_response.approval_code : '-'
          },
          align: 'center'
        }
      ]
    }),
    mounted () {
      this.master.keys = [
        'epp_payment_approval_status',
        'epp_mode'
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
        'getEppPaymentListSearchAction',
        'getMemberSearchAction',
        'submitEppApprovalAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
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
          filterSalesCancellationStatus: this.filterData.filterSalesCancellationStatus
        })
        this.query.country_id = this.filterData.countryID
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.query.search_text = this.filterData.filterTerms
        if (this.filterData.filterEppType !== null) {
          this.query.epp_mode_id = this.filterData.filterEppType
        }
        if (this.filterData.filterApprovalStatus !== null) {
          this.query.approval_status_id = this.filterData.filterApprovalStatus
        }
        this.getEppPaymentListSearchAction(this.query).then(() => {
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
      checkApprovalStatus (row) {
        return row.payment_detail !== null && row.payment_detail !== undefined
              &&  row.payment_detail.payment_response !== null && row.payment_detail.payment_response !== undefined
              && row.payment_detail.payment_response.approvalStatus !== null && row.payment_detail.payment_response.approvalStatus !== undefined
              ? row.payment_detail.payment_response.approvalStatus.title.toLowerCase() === 'approved'
                || row.payment_detail.payment_response.approvalStatus.title.toLowerCase() === 'declined'
                || (row.sale !== null && row.sale !== undefined
                  && row.sale.order_status !== null && row.sale.order_status !== undefined
                  && row.sale.order_status.title.toLowerCase() === 'void')
                : false
      },
      filterChange() {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('epp_listing'))
        }
      },
      submitApprovalCode (row) {
        let query = {
          payment_id: row.id,
          approve_code: row.payment_detail.payment_response.approval_code
        }
        this.submitEppApprovalAction(query).then((res) => {
          this.queryHandler(this.setDefaultPaginationAttr('epp_listing'))
        })
      },
      async routePage (row) {
        if (row.payment_mode_provider !== null && row.payment_mode_provider !== undefined && row.payment_mode_provider.name === this.$const.eppPaymentProviderType.epp_moto) {
          let saleID = row.sale !== null && row.sale !== undefined ? row.sale.id : ''
          if (saleID !== '') {
            if (await this.routePageInfo(this.$t('Common.modules.sales_order_detail'))) {
              this.$router.push({name: 'View Sales Order', params: {saleID: saleID}})
            }
          }
        }
      },
      async routePageInfo(medium) {
        let confirm = false
        await this.$q.dialog({
          title: this.$t('Common.ActionRequired.Title'),
          ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
          cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel'),
          noBackdropDismiss: true,
          noEscDismiss: true,
          message: this.$t('Common.PageRedirect.Info', {medium: medium})
        }).then(() => {
          confirm = true
        })
        return confirm
      }
    }
  }
</script>

<style scoped>

</style>
