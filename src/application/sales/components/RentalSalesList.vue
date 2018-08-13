<template>
    <div class="general-page-holder" :class="{'dimmed': toggleMainPageDim}">
        <genaral-header genaralTitle="List of Orders"></genaral-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-9">
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
                                              :options="getLocationTypes"
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
                <div class="col-lg-2">
                    <div class="row full-height justify-center gutter-xs">
                        <div class="col-lg-1 gt-md">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-11 self-center z-absolute" data-schema="sales.management.list|order">
                            <q-btn class="full-width" glossy :class="{'new-order-btn fit' : toggleMainPageDim}"
                                   color="primary" :icon="!toggleMainPageDim ? 'add' : 'close'"
                                   :disable="filterData.countryID < 1 || !$can($apply('sales.management.list|order'))">
                                {{ !toggleMainPageDim ? $t('sales.newOrder.Btn') : $t('Common.Cancel.Btn')}}
                              <q-popover :disable="filterData.countryID < 1 || !$can($apply('sales.management.list|order'))"
                                         @show="toggleIBOSearchPopoverSection(toggleMainPageDim)"
                                         @hide="toggleIBOSearchPopoverSection(toggleMainPageDim)"
                                         ref="popover"
                                         anchor="bottom right"
                                         self="top right"
                                         fit>
                                <div class="row q-pa-md">
                                  <div class="col-lg-12 custom-width-popover relative-position">
                                    <div class="row justify-end gutter-sm">
                                      <div class="col-lg-auto q-mb-xs">
                                        <q-toggle v-model="downlineOrder"
                                                  @input="resetClassicCheck"
                                                  :disable="corporateOrder"
                                                  :label="$t('sales.orderDownLine.text')"/>
                                      </div>
                                      <div class="col-lg-auto q-mb-xs">
                                        <q-toggle v-model="corporateOrder"
                                                  @input="resetClassicCheck"
                                                  :label="$t('sales.corporateSales.text')"/>
                                      </div>
                                    </div>
                                    <div class="row q-mt-md justify-end items-end">
                                      <div class="col-lg-12 without-downline" v-if="!downlineOrder" novalidate
                                           @submit.prevent="initiateOrder()"
                                           @keyup.enter="initiateOrder()">
                                        <q-input v-model.trim="terms1"
                                                 clearable
                                                 autofocus
                                                 :placeholder="$t('members.iboIbName.placeholder.label')"
                                                 @input="reset(), resetClassicCheck()">
                                          <q-autocomplete
                                            @search="(terms, done) => search(terms, done, 'terms1')"
                                            @selected="(item) => selected(item, 'terms1')"
                                          />
                                        </q-input>
                                        <div class="row items-center justify-end q-mt-md">
                                          <div class="col-lg-auto">
                                            <q-btn-group outline>
                                              <q-btn color="grey-7" outline @click="initiateOrder()" icon="chevron_right">
                                              </q-btn>
                                            </q-btn-group>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-lg-12 with-downline" v-else="" novalidate
                                           @submit.prevent="initiateOrder()"
                                           @keyup.enter="initiateOrder()">
                                        <q-input v-model.trim="terms2"
                                                 class="q-mb-md"
                                                 :placeholder="$t('sales.sponsorIBO.placeholder')"
                                                 :suffix="terms2 !== '' ? 'Sponsor' : ''"
                                                 @input="reset(), resetClassicCheck()">
                                          <q-autocomplete
                                            @search="(terms, done) => search(terms, done, 'terms2')"
                                            @selected="(item) => selected(item, 'terms2')"></q-autocomplete>
                                        </q-input>
                                        <q-input v-model.trim="terms3"
                                                 class="q-mb-md"
                                                 :disable="skipDownline || !uplineUserID > 0"
                                                 :suffix="terms3 !== '' ? 'Downline' : ''"
                                                 :placeholder="$t('sales.downLineIBO.placeholder')"
                                                 @input="reset, resetClassicCheck()">
                                          <q-autocomplete
                                            @search="(terms, done) => search(terms, done, 'terms3')"
                                            @selected="(item) => selected(item, 'terms3')"/>
                                        </q-input>
                                        <q-checkbox v-if="isFalsy(uplineUserID)" v-model="skipDownline"
                                                    @input="skipDownlineValidator"
                                                    :label="$t('sales.skipDownline.text')"/>
                                      </div>
                                      <div class="row justify-end fit">
                                        <div class="col-lg-12" v-if="!downlineValidity">
                                                        <span class="q-caption text-negative">
                                                            {{ $t('sales.invalid.downLine.ID') }}
                                                        </span>
                                        </div>
                                        <div class="col-lg-auto" v-if="downlineOrder">
                                          <q-btn-group outline>
                                            <q-btn color="grey-7" outline @click="reset('all')" icon="refresh">
                                            </q-btn>
                                            <q-btn color="grey-7" outline @click="initiateOrder()" icon="chevron_right">
                                            </q-btn>
                                          </q-btn-group>
                                        </div>
                                      </div>
                                    </div>
                                    <div class="row q-mt-md" v-if="this.classic.terms">
                                      <div class="col-lg-12 text-center">
                                        <div class="error q-pa-xs bg-grey-1">
                                          <div class="q-headline">
                                            <q-icon name="error_outline"></q-icon>
                                          </div>
                                          <div class="q-headline q-ma-xs text-dark-2">
                                            Record Not Found
                                          </div>
                                          <div class="q-caption q-ma-xs text-grey-7">
                                            Looks like we couldn't finy any matches.Try with classic check.
                                          </div>
                                          <q-btn icon="search"
                                                 outline
                                                 color="grey-7" @click="classicCheck">
                                          </q-btn>
                                        </div>
                                        <div class="result q-mt-sm" v-if="this.classic.result !== null">
                                          <div class="message q-pa-sm bg-grey-1">
                                            <div v-if="this.classic.result"
                                                 class="q-subheading text-success">
                                              <q-icon name="done"></q-icon>
                                              This account belongs to classic
                                            </div>
                                            <div v-else="" class="q-subheading text-warning">
                                              <q-icon name="close"></q-icon>
                                              This account dose not belongs to classic
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div class="col-lg-12 q-mt-md">
                                        <div class="row justify-end">
                                          <div class="col-lg-12">
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
                row-key="name"
                :color="appSettings.defaulted.table_color"
                dense
                class="bg-white">
            <!-- Custom renderer for "action" column with button for custom action -->
            <q-tr slot="body" slot-scope="props" :props="props" @click.native="routePage(props.row)"
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
    </div>
</template>
<script>
  import Vue from 'vue'
  import * as moment from 'moment'
  import genaralHeader from '../../global/components/common/header/generalHeader'
  import {
    DatesMixin,
    MasterDataTransformarMixin,
    PaginationMixin,
    GeneralsMixin
  } from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import qLoader from '../../global/components/common/loading/loader'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'sales-list-table',
    mixins: [MasterDataTransformarMixin, DatesMixin, PaginationMixin, GeneralsMixin],
    components: {
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
        tableList: 'tableDataSales',
        getLocationTypes: 'getLocationTypes'
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
      downlineOrder: false,
      corporateOrder: false,
      downlineValidity: true,
      skipDownline: false,
      classic: {
        terms: '',
        result: null
      },
      toggleStatus: false,
      toggleMainPageDim: false,
      terms1: '',
      terms2: '',
      terms3: '',
      uplineUserID: null,
      downlineUserID: null,
      filterData: {
        countryID: 0,
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
          label: Vue.prototype.$t('sales.DTableLabel.Channel'),
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
          label: Vue.prototype.$t('sales.DTableLabel.TLocation'),
          field: 'transaction_location',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.code
            }
          }
        },
        {
          name: 'transaction_date',
          label: Vue.prototype.$t('sales.DTableLabel.TDate'),
          field: 'transaction_date',
          sortable: true
        },
        {
          name: 'document_number',
          label: Vue.prototype.$t('sales.DTableLabel.salesDocNo'),
          field: 'document_number',
          sortable: true,
          format (value) {
            if (value !== null) {
              return value
            } else {
              return '-'
            }
          }
        },
        {
          name: 'created_at',
          label: Vue.prototype.$t('sales.DTableLabel.InvoiceDate'),
          field: 'invoices',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.created_at
            } else {
              return '-'
            }
          }
        },
        {
          name: 'tax_invoice_number',
          label: Vue.prototype.$t('sales.DTableLabel.salesTaxInvoiceNo'),
          field: 'invoices',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              return value.invoice_number
            } else {
              return '-'
            }
          }
        },
        {
          name: 'ibo_id',
          label: Vue.prototype.$t('sales.DTableLabel.iboId'),
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
          name: 'members.name',
          label: Vue.prototype.$t('sales.DTableLabel.iboName'),
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
          name: 'total_cv',
          label: Vue.prototype.$t('sales.DTableLabel.TCV'),
          field: 'total_cv',
          sortable: true
        },
        {
          name: 'total_gmp',
          label: Vue.prototype.$t('sales.DTableLabel.TAmount'),
          field: 'total_gmp',
          sortable: true
        },
        {
          name: 'order_status_id',
          label: Vue.prototype.$t('sales.DTableLabel.OStatus'),
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
          label: Vue.prototype.$t('sales.DTableLabel.DStatus'),
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
          label: Vue.prototype.$t('sales.DTableLabel.DMethod'),
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
          label: Vue.prototype.$t('Common.DTableLabel.CreatedBy'),
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
    },
    mounted () {
      this.getLocationTypeList({})
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getSalesListAction',
        'getMemberSearchAction',
        'getDownlineValidationAction',
        'getClassicCheckAction',
        'getLocationTypeList'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setOrderData: 'SET_ORDER_DATA',
        unSetOrderData: 'UNSET_ORDER_DATA'
      }),
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
        this.query.is_rental_sale_order = 1
        this.getSalesListAction(this.query).then(async () => {
          // Remove observers
          data = JSON.parse(JSON.stringify(await data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      search (terms, done, field) {
        let query = {
          search_text: this[field],
          limit: 10
        }
        if (this.uplineUserID) {
          query.sponsor_id = this.uplineUserID
        }
        this.getMemberSearchAction(this.removeFalsyValues(query)).then(() => {
          if (this.membersSearchData.list.length < 1) {
            this.classic.terms = this[field]
          }
          done(this.membersSearchData.list)
        })
      },
      selected (item, field) {
        // Reopen popover after user selection using mouse click event
        this.$refs.popover.show()
        this[field] = item.sublabel
        // set downlineID if terms3 available
        if (field === 'terms2') {
          this.uplineUserID = item.userID
        } else {
          this.downlineUserID = item.userID
        }
      },
      reset (action) {
        if (action === 'all') {
          this.terms2 = ''
          this.terms3 = ''
          this.uplineUserID = ''
          this.downlineUserID = ''
        } else {
          this.uplineUserID = ''
          this.downlineUserID = ''
        }
        this.resetClassicCheck()
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
          this.queryHandler(this.setDefaultPaginationAttr('sales'))
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
      routePage (data) {
        this.unSetOrderData({uplineUserID: '', downlineUserID: ''})
        let saleID = data.id
        let esacRedemption = data.is_esac_redemption
        let productExchangeID = data.sale_exchange !== null && data.sale_exchange !== undefined ? data.sale_exchange.id : -1
        if (!data.newOrder) {
          data = {
            uplineUserID: data.sponsor_id !== 0 ? data.sponsor_id : '',
            downlineUserID: data.user_id,
            downlineOrder: false,
            skipDownline: data.skipDownline,
            saleID: saleID,
            corporateOrder: data.corporateOrder
          }
          this.setOrderData(data)
          this.$router.push({name: 'View Rental Sales Order', params: {saleID: saleID}})
        } else {
          this.setOrderData(data)
          this.$router.push({name: 'New Rental Sales Order'})
        }
      },
      toggle (x) {
        this.toggleStatus = !x
      },
      toggleIBOSearchPopoverSection (x) {
        this.toggleMainPageDim = !x
      },
      initiateOrder () {
        if (this.isFalsy(this.uplineUserID) || this.isFalsy(this.downlineUserID)) {
          let data = {
            uplineUserID: this.uplineUserID,
            downlineUserID: this.downlineUserID,
            downlineOrder: this.downlineOrder,
            skipDownline: this.skipDownline,
            corporateOrder: this.corporateOrder,
            newOrder: true
          }
          this.routePage(data)
        }
      },
      classicCheck () {
        if (this.classic.terms) {
          let query = {
            national_id: this.classic.terms
          }
          this.getClassicCheckAction(query).then(res => {
            this.classic.result = res.result
          })
        }
      },
      resetClassicCheck () {
        this.classic.terms = ''
        this.classic.result = null
        // reset order for downline when cooperate sales is selected
        if (this.corporateOrder) {
          this.downlineOrder = false
        }
      },
      skipDownlineValidator () {
        if (this.skipDownline) {
          this.downlineUserID = this.uplineUserID
          this.terms3 = this.terms2
        } else {
          this.downlineUserID = ''
          this.terms3 = ''
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
