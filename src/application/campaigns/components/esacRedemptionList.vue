<template>
    <div class="general-page-holder" :class="{'dimmed': toggleMainPageDim}">
        <general-header generalTitle="List of eSac Redemption"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-8">
                    <div class="row generic-margin gutter-xs">
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.countryID.$error"
                                    error-label="Please choose country">
                                <q-select
                                        clearable
                                        ref="salesCountrySelector"
                                        color="black"
                                        v-model="filterData.countryID"
                                        :options="countriesOptions.options"
                                        :stack-label="$t('general.select.country')"
                                        @input="countryChange"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-input v-model.lazy="filterData.filterTerms"
                                     clearable
                                     :disable="disable"
                                     :stack-label="$t('Common.search.placeholder')">
                            </q-input>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.filterDateRangeFrom.$error"
                                    error-label="Date range incorrect">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            :disable="disable"
                                            v-model="filterData.filterDateRangeFrom"
                                            :stack-label="$t('general.dataFrom.label')"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.filterDateRangeTo.$error"
                                    error-label="Date must be not more then current date">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            :disable="disable"
                                            v-model="filterData.filterDateRangeTo"
                                            :stack-label="$t('general.dataTo.label')"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-12">
                            <div class="row gutter-xs" v-show="toggleStatus">
                                <div class="col-lg-3">
                                    <q-select clearable
                                              :stack-label="$t('general.Channel.label')"
                                              :disable="disable"
                                              v-model="filterData.filterChannel"
                                              :options="masterDataOptionsCreator('sale_channel')"
                                    />
                                </div>
                                <div class="col-lg-3">
                                    <q-select clearable
                                              :stack-label="$t('general.deliveryMethods.label')"
                                              :disable="disable"
                                              v-model="filterData.filterDeliveryMethods"
                                              :options="masterDataOptionsCreator('sale_delivery_method')"
                                    />
                                </div>
                                <div class="col-lg-3">
                                    <q-select clearable
                                              :stack-label="$t('general.deliveryStatus.label')"
                                              :disable="disable"
                                              v-model="filterData.filterDeliveryStatus"
                                              :options="masterDataOptionsCreator('sale_delivery_status')"
                                    />
                                </div>
                                <div class="col-lg-3">
                                    <q-select clearable
                                              :stack-label="$t('general.orderStatus.label')"
                                              :disable="disable"
                                              v-model="filterData.filterOrderStatus"
                                              :options="masterDataOptionsCreator('sale_order_status')"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-auto self-center">
                                <span class="pd-5" @click="toggle(toggleStatus)">
                                    <q-icon color="grey-4"
                                            :name="!toggleStatus ? 'fas fa-chevron-down' : 'fas fa-chevron-up'"></q-icon>
                                    <q-tooltip>{{ $t('sales.moreFilters.label') }}</q-tooltip>
                                </span>
                </div>
                <div class="col-lg-3">
                    <div class="row full-height justify-center gutter-xs">
                        <div class="col-lg-1 gt-md">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-11 self-center z-absolute">
                            <q-btn class="full-width" glossy :class="{'new-order-btn fit' : toggleMainPageDim}"
                                   color="primary" :icon="!toggleMainPageDim ? 'add' : 'close'"
                                   :disable="disable">
                                {{ !toggleMainPageDim ? $t('campaigns.button.newEsacRedemption') : $t('Common.Cancel.Btn')}}
                                <q-popover :disable="disable"
                                           @show="toggleIBOSearchPopoverSection(toggleMainPageDim)"
                                           @hide="toggleIBOSearchPopoverSection(toggleMainPageDim)"
                                           ref="popover"
                                           anchor="bottom right"
                                           self="top right"
                                           fit>
                                    <div class="row q-pa-md">
                                        <div class="col-lg-12 custom-width-popover relative-position">
                                            <div class="row q-mt-md justify-end">
                                                <div class="col-lg-12 without-downline" novalidate
                                                     @submit.prevent="initiateRedemption()"
                                                     @keyup.enter="initiateRedemption()">
                                                    <q-input v-model.trim="selected_search"
                                                             clearable
                                                             autofocus
                                                             :placeholder="$t('members.iboIbName.placeholder.label')">
                                                        <q-autocomplete
                                                                @search="searchMember"
                                                                @selected="selectedMember"
                                                        />
                                                    </q-input>
                                                    <div class="row items-center justify-end q-mt-md">
                                                        <div class="col-lg-auto">
                                                            <q-btn-group outline>
                                                                <q-btn color="grey-7" outline @click="initiateRedemption()" icon="chevron_right">
                                                                </q-btn>
                                                            </q-btn-group>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <q-loader :visible="isProcessingSection"></q-loader>
                                        </div>
                                    </div>
                                </q-popover>
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <q-table
                :data="serverData"
                :columns="columns"
                :pagination.sync="serverPagination"
                :rows-per-page-options="appSettings.defaulted.table_rows_per_page_options"
                :separator="separator"
                :loading="isProcessingTable"
                @request="queryHandler"
                :visible-columns="visibleColumns"
                row-key="id"
                :color="appSettings.defaulted.table_color"
                dense
                class="bg-white">
            <!-- Custom renderer for "action" column with button for custom action -->
            <q-tr slot="body" slot-scope="props" :props="props" @click.native="actions(props.row, 'update')" class="cursor-pointer">
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
  import Vue from 'vue'
  import * as moment from 'moment'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import {
    DatesMixin,
    MasterDataTransformarMixin,
    PaginationMixin,
    GeneralsMixin
  } from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { Dialog } from 'quasar'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'esac-redemption-list-table',
    mixins: [MasterDataTransformarMixin, DatesMixin, PaginationMixin, GeneralsMixin],
    components: {
      generalHeader,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessing: state => state.globalCMP.isProcessing,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        simplePagination: state => state.globalCMP.simplePagination,
        selectedFilters: state => state.globalCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        esacRedemptionSearchData: state => state.globalCMP.esacRedemptionSearchDataGlobal
      }),
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry',
        tableList: 'tableDataEsacRedemptions'
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
    watch: {
      filterData: {
        handler () {
          this.filterChange()
        },
        deep: true
      }
    },
    data: () => ({
      disable: true,
      show: false,
      serverData: [],
      toggleStatus: false,
      toggleMainPageDim: false,
      selected_search: '',
      selected_user_name: '',
      selected_user_id: '',
      filterData: {
        countryID: null,
        filterTerms: '',
        filterDateRangeFrom: '',
        filterDateRangeTo: '',
        filterDeliveryMethods: '',
        filterDeliveryStatus: '',
        filterChannel: '',
        filterOrderStatus: ''
      },
      columns: [
        {
          name: 'channel_id',
          label: Vue.prototype.$t('campaigns.esacRedemption.Channel'),
          field: 'channel',
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.name
            }
          },
          sortable: true,
          required: true
        },
        {
          name: 'transaction_location_id',
          label: Vue.prototype.$t('campaigns.esacRedemption.transactionLocation'),
          field: 'transaction_location',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.code
            }
          }
        },
        {
          name: 'created_at',
          label: Vue.prototype.$t('campaigns.esacRedemption.transactionDate'),
          field: 'created_at',
          sortable: true
        },
        {
          name: 'document_number',
          label: Vue.prototype.$t('campaigns.esacRedemption.salesDocNo'),
          field: 'document_number',
          sortable: true
        },
        {
          name: 'invoices.invoice_number',
          label: Vue.prototype.$t('campaigns.esacRedemption.salesTaxInvoiceNo'),
          field: 'invoices',
          sortable: false,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.invoice_number
            } else {
              return '-'
            }
          }
        },
        {
          name: 'invoices.created_at',
          label: Vue.prototype.$t('campaigns.esacRedemption.salesTaxInvoiceDate'),
          field: 'invoices',
          sortable: false,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.created_at
            } else {
              return '-'
            }
          }
        },
        {
          name: 'ibo_id',
          label: Vue.prototype.$t('campaigns.esacRedemption.iBOID'),
          field: 'member',
          sortable: false,
          format (value, row) {
            if (value !== null && value.user !== null && typeof value.user !== 'undefined') {
              return value.user.old_member_id
            } else {
              return 'UNKNOWN'
            }
          }
        },
        {
          name: 'member.name',
          label: Vue.prototype.$t('campaigns.esacRedemption.iBOName'),
          field: 'member',
          sortable: false,
          format (value, row) {
            if (value !== null) {
              return value.name
            } else {
              return 'UNKNOWN'
            }
          }
        },
        {
          name: 'total_gmp',
          label: Vue.prototype.$t('campaigns.esacRedemption.TAmount'),
          field: 'total_gmp',
          sortable: true
        },
        {
          name: 'order_status_id',
          label: Vue.prototype.$t('campaigns.esacRedemption.OStatus'),
          field: 'order_status',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.title
            }
          }
        },
        {
          name: 'delivery_status_id',
          label: Vue.prototype.$t('campaigns.esacRedemption.DStatus'),
          field: 'delivery_status',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.title
            }
          }
        },
        {
          name: 'delivery_method_id',
          label: Vue.prototype.$t('campaigns.esacRedemption.deliveryMethod'),
          field: 'delivery_method',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.title
            }
          }
        },
        {
          name: 'created_by',
          label: Vue.prototype.$t('campaigns.esacRedemption.createdBy'),
          field: 'created_by',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.name
            }
          }
        }
      ]
    }),
    created () {
      this.master.keys = [
        'sale_channel',
        'sale_delivery_method',
        'sale_delivery_status',
        'sale_order_status'
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
      if (this.selectedFilters.filterChannel !== null || this.selectedFilters.filterDeliveryStatus !== null || this.selectedFilters.filterDeliveryMethods !== null || this.selectedFilters.filterOrderStatus !== null) {
        this.toggleStatus = true
      }
      this.countryChange()
    },
    methods: {
      ...mapActions([
        'getCountryRelationAction',
        'getEsacRedemptionListAction',
        'getMemberSearchAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setOrderData: 'SET_ORDER_DATA',
        unsetOrderData: 'UNSET_ORDER_DATA'
      }),
      countryChange () {
        if (this.filterData.countryID > 0) {
          let query = {
            country_id: this.filterData.countryID,
            relations: ['currency']
          }
          this.getCountryRelationAction(query).then(() => {
            this.columns.forEach(x => {
              if (x.name === 'total_gmp') {
                x.label = Vue.prototype.$t('campaigns.esacRedemption.TAmount') + ' (' + this.currencyLabelByCountry + ')'
              }
            })
          })
        } else {
           this.columns.forEach(x => {
              if (x.name === 'total_gmp') {
                x.label = Vue.prototype.$t('campaigns.esacRedemption.TAmount')
              }
            })
        }
      },
      queryHandler (data) {
        this.query = this.processQueryData(data)
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.filterData.countryID)
        let countryName = ''
        let countryCode = ''
        if (getCountryName.length > 0) {
          countryName = getCountryName[0].label
          countryCode = getCountryName[0].code
        }
        this.setFilterData({
          countryID: this.filterData.countryID,
          countryName: countryName,
          countryCode: countryCode,
          filterDateRangeFrom: this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD'),
          filterDateRangeTo: this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD'),
          filterTerms: this.filterData.filterTerms,
          filterChannel: this.filterData.filterChannel,
          filterDeliveryMethods: this.filterData.filterDeliveryMethods,
          filterDeliveryStatus: this.filterData.filterDeliveryStatus,
          filterOrderStatus: this.filterData.filterOrderStatus
        })

        this.query.country_id = this.filterData.countryID
        this.query.from_date = this.formatDate(this.filterData.filterDateRangeFrom, 'YYYY-MM-DD')
        this.query.to_date = this.formatDate(this.filterData.filterDateRangeTo, 'YYYY-MM-DD')
        this.query.search_text = this.filterData.filterTerms
        this.query.channel_id = this.filterData.filterChannel !== null ? this.filterData.filterChannel : 0
        this.query.delivery_method_id = this.filterData.filterDeliveryMethods !== null ? this.filterData.filterDeliveryMethods : 0
        this.query.delivery_status_id = this.filterData.filterDeliveryStatus !== null ? this.filterData.filterDeliveryStatus : 0
        this.query.order_status_id = this.filterData.filterOrderStatus !== null ? this.filterData.filterOrderStatus : 0
        this.query.is_esac_redemption = 1
        this.getEsacRedemptionListAction(_(this.query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(() => {
          // Remove observers
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      searchMember (terms, done) {
        let query = {
          search_text: this.selected_search,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      selectedMember (item, keyboard) {
        if (!keyboard) {
          this.$refs.popover.show()
          this.selected_search = item.sublabel
          this.selected_user_name = item.sublabel
          this.selected_user_id = item.userID
        }
      },
      initiateRedemption() {
        if (this.isFalsy(this.selected_user_id)) {
          let data = {
            user_id: this.selected_user_id,
            new_redemption: true
          }
          this.actions(data, 'create')
        }
      },
      filterChange () {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          if (this.filterData.countryID > 0) {
            this.show = true
            this.disable = false
          } else {
            this.serverData = []
            this.disable = true
          }
          this.queryHandler(this.setDefaultPaginationAttr('esac-redemption'))
        }
      },
      clearFilterData () {
        // Clearing local filters
        this.filterData.countryID = 0
        // this.memberID = ''
        // Clear datatables
        this.serverData = []
        // Clear vuex filters
        this.setFilterData(this.filterData)
      },
      toggle (x) {
        this.toggleStatus = !x
      },
      toggleIBOSearchPopoverSection (x) {
        this.toggleMainPageDim = !x
      },
      actions (row, type) {
        if (type === 'create') {
          this.unsetOrderData({uplineUserID: '', downlineUserID: '', orderID: '', downlineOrder: false})
          let data = {
            uplineUserID: '',
            downlineUserID: this.selected_user_id,
            orderID: '',
            downlineOrder: false
          }
          this.setOrderData(data)
          this.$router.push({name: 'New eSac Redemption', params: {referer: 1}})
        } else if (type === 'update') {
          this.unsetOrderData({uplineUserID: '', downlineUserID: '', orderID: '', downlineOrder: false})
          let data = {
            uplineUserID: '',
            downlineUserID: '',
            orderID: row.id,
            downlineOrder: false
          }
          this.setOrderData(data)
          this.$router.push({name: 'Update eSac Redemption', params: {saleID: row.id, referer: 1}})
        }
      }
    }
  }
</script>
<style lang="stylus">
    .new-order-btn
        z-index: 6000

    .custom-width-popover
        min-width 380px !important
</style>
