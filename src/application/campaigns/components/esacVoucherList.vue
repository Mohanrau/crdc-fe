<template>
    <div class="general-page-holder">
        <general-header generalTitle="List of eSac Voucher"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-9">
                    <div class="row generic-margin gutter-xs">
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.countryID.$error"
                                    error-label="Please choose country">
                                <q-select
                                        ref="countrySelector"
                                        color="black"
                                        v-model="filterData.countryID"
                                        :options="countriesOptions.options"
                                        :stack-label="$t('general.select.country')"
                                        @input="countryChange"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-input clearable
                                     v-model="filterData.search"
                                     color="black"
                                     :disable="disable"
                                     :stack-label="$t('Common.search.label')">
                            </q-input>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.fromCreatedAt.$error"
                                    error-label="Date range incorrect">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            :disable="disable"
                                            v-model="filterData.fromCreatedAt"
                                            :stack-label="$t('general.dataFrom.label')"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-field
                                    :error="$v.filterData.toCreatedAt.$error"
                                    error-label="Date must be not more then current date">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            :disable="disable"
                                            v-model="filterData.toCreatedAt"
                                            :stack-label="$t('general.dataTo.label')"
                                />
                            </q-field>
                        </div>
                        <div class="col-lg-12">
                            <div class="row gutter-xs" v-show="toggleStatus">
                                <div class="col-lg-3">
                                    <q-select
                                        clearable
                                        ref="campaignSelector"
                                        color="black"
                                        v-model="filterData.campaignID"
                                        :options="campaignsOptions"
                                        :stack-label="$t('campaigns.esacVoucher.campaign')"
                                    />
                                </div>
                                <div class="col-lg-3">
                                    <q-select
                                        clearable
                                        ref="esacVoucherTypeSelector"
                                        color="black"
                                        v-model="filterData.voucherTypeID"
                                        :options="esacVoucherTypesOptions"
                                        :stack-label="$t('campaigns.esacVoucher.esacVoucherType')"
                                    />
                                </div>
                                <div class="col-lg-3">
                                    <q-select
                                        clearable
                                        color="black"
                                        v-model="filterData.fromCampaignCwScheduleId"
                                        :options="commissionWeeks"
                                        :stack-label="$t('campaigns.esacVoucher.campaignStartCw')"
                                    />
                                </div>
                                <div class="col-lg-3">
                                    <q-select
                                        clearable
                                        color="black"
                                        v-model="filterData.voucherStatus"
                                        :options="esacVoucherStatusOptions"
                                        :stack-label="$t('campaigns.esacVoucher.voucherStatus')"
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
                        <div class="col-lg-11 self-center z-absolute">
                            <q-btn class="full-width"
                                   :disable="disable"
                                   color="primary" icon="add"
                                   @click="openForm()">
                                {{ $t('Common.Add.Btn') }}
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
            <q-tr slot="body" slot-scope="props" :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="col.name === 'action'">
                        <q-btn dense size="sm" flat @click="actions(props.row,'update')" color="amber">
                            <q-icon name="mode_edit"/>
                            <q-tooltip :delay="1000">
                                Edit
                            </q-tooltip>
                        </q-btn>
                        <q-btn dense size="sm" flat @click="actions(props.row,'delete')" color="negative">
                            <q-icon name="delete"/>
                            <q-tooltip :delay="1000">
                                Delete
                            </q-tooltip>
                        </q-btn>
                    </span>
                    <span v-else="">
                        {{ col.value }}
                    </span>
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
  import { DatesMixin, PaginationMixin } from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { Dialog } from 'quasar'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'esac-voucher-type-list-table',
    mixins: [PaginationMixin, DatesMixin],
    components: {
      generalHeader,
      qLoader
    },
    computed: {
      ...mapState({
        websocket: state => state.globalCMP.websocket,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessing: state => state.globalCMP.isProcessing,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        simplePagination: state => state.globalCMP.simplePagination,
        selectedFilters: state => state.globalCMP.selectedFilters,
        esacVoucherSearchData: state => state.globalCMP.esacVoucherSearchDataGlobal
      }),
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry',
        tableList: 'tableDataEsacVouchers',
        campaignList: 'tableDataCampaigns',
        esacVoucherTypeList: 'tableDataEsacVoucherTypes',
        paginationQuery: 'pagination'
      })
    },
    validations: {
      filterData: {
        countryID: {
          required
        },
        fromCreatedAt: {
          isInRange (val, elm) {
            if (elm && val !== '') {
              let diff = this.getDateDiff(elm.toCreatedAt, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        toCreatedAt: {
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
      campaignsOptions: [],
      esacVoucherTypesOptions: [],
      esacVoucherStatusOptions: [
        {label: Vue.prototype.$t('campaigns.esacVoucher.voucherStatusNew'), value: 'N'},
        {label: Vue.prototype.$t('campaigns.esacVoucher.voucherStatusProcessed'), value: 'P'},
        {label: Vue.prototype.$t('campaigns.esacVoucher.voucherStatusVoid'), value: 'V'}
      ],
      filterData: {
        countryID: null,
        campaignID: null,
        voucherTypeID: null,
        voucherStatus: null,
        fromCampaignCwScheduleId: null,
        fromCreatedAt: null,
        toCreatedAt: null,
        name: null,
        description: null,
        search: null,
        active: null
      },
      columns: [
        {
          name: 'campaign.name',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucher.campaignName'),
          field: 'campaign',
          sortable: true,
          format (value) {
            if (value !== null) {
              if (typeof value.name !== 'undefined' && value.name !== null) {
                return value.name
              }
            }
            return '-'
          },
          visible: false
        },
        {
          name: 'voucher_number',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucher.voucherNumber'),
          field: 'voucher_number',
          sortable: true
        },
        {
          name: 'esac_voucher_type.name',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucher.esacVoucherType'),
          field: 'esac_voucher_type',
          sortable: true,
          format (value) {
            if (value !== null) {
              if (typeof value.name !== 'undefined' && value.name !== null) {
                return value.name
              }
            }
            return '-'
          }
        },
        {
          name: 'esac_voucher_sub_type.name',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucher.esacVoucherSubType'),
          field: 'esac_voucher_sub_type',
          sortable: true,
          format (value) {
            if (value !== null) {
              if (typeof value.name !== 'undefined' && value.name !== null) {
                return value.name
              }
            }
            return '-'
          },
          visible: false
        },
        {
          name: 'voucher_status',
          align: 'center',
          label: Vue.prototype.$t('campaigns.esacVoucher.voucherStatus'),
          field: 'voucher_status',
          sortable: true,
          format (value) {
            if (value === 'N') {
              return Vue.prototype.$t('campaigns.esacVoucher.voucherStatusNew')
            } else if (value === 'P') {
              return Vue.prototype.$t('campaigns.esacVoucher.voucherStatusProcessed')
            } else if (value === 'V') {
              return Vue.prototype.$t('campaigns.esacVoucher.voucherStatusVoid')
            } else {
              return '-'
            }
          }
        },
        {
          name: 'voucher_value',
          align: 'right',
          label: Vue.prototype.$t('campaigns.esacVoucher.voucherValue'),
          field: 'voucher_value',
          sortable: true
        },
        {
          name: 'campaign.from_cw_schedule.cw_name',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucher.campaignStartCw'),
          field: 'campaign',
          sortable: true,
          format (value) {
            if (value !== null) {
              if (typeof value.from_cw_schedule !== 'undefined' && value.from_cw_schedule !== null) {
                if (typeof value.from_cw_schedule.cw_name !== 'undefined' && value.from_cw_schedule.cw_name !== null) {
                  return value.from_cw_schedule.cw_name
                }
              }
            }
            return '-'
          },
          visible: false
        },
        {
          name: 'user.old_member_id',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucher.iboId'),
          field: 'user',
          sortable: true,
          format (value) {
            if (value !== null) {
              if (typeof value.old_member_id !== 'undefined' && value.old_member_id !== null) {
                return value.old_member_id
              }
            }
            return '-'
          }
        },
        {
          name: 'user.member.name',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucher.iboName'),
          field: 'user',
          sortable: true,
          format (value) {
            if (value !== null) {
              if (typeof value.member !== 'undefined' && value.member !== null) {
                if (typeof value.member.name !== 'undefined' && value.member.name !== null) {
                  return value.member.name
                }
              }
            }
            return '-'
          }
        },
        {
          name: 'issued_date',
          align: 'center',
          label: Vue.prototype.$t('campaigns.esacVoucher.voucherIssuedDate'),
          field: 'issued_date',
          sortable: true
        },
        {
          name: 'expiry_date',
          align: 'center',
          label: Vue.prototype.$t('campaigns.esacVoucher.voucherExpiryDate'),
          field: 'expiry_date',
          sortable: true
        },
        {
          name: 'redeem_date',
          align: 'center',
          label: Vue.prototype.$t('campaigns.esacVoucher.voucherRedeemDate'),
          field: 'redeem_date',
          sortable: true
        },
        {
          name: 'last_modified_by',
          align: 'left',
          label: Vue.prototype.$t('Common.DTableLabel.lastModifiedBy'),
          field: 'last_modified_by',
          sortable: true,
          visible: false
        },
        {
          name: 'last_modified_at',
          align: 'left',
          label: Vue.prototype.$t('Common.DTableLabel.lastModifiedAt'),
          field: 'last_modified_at',
          sortable: true,
          visible: false
        },
        {
          name: 'action',
          align: 'center',
          label: Vue.prototype.$t('Common.DTableLabel.Action'),
          sortable: false,
          required: true
        }
      ]
    }),
    created () {
      this.getCountriesAction()
      this.setVisibleColumns(this.columns)
      let query = {
        filter_type: 'past',
        limit: 100
      }
      this.getCommissionWeekSearchAction(query)
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      if (typeof this.filterData.fromCreatedAt === 'undefined' || this.filterData.fromCreatedAt === null) {
        this.filterData.fromCreatedAt = this.getFirstDayOfCurrentYear()
      }
      if (typeof this.filterData.toCreatedAt === 'undefined' || this.filterData.toCreatedAt === null) {
        this.filterData.toCreatedAt = this.getCurrentDate()
      }
      if (typeof this.filterData.campaignID === 'undefined') {
        this.filterData.campaignID = null
      }
      if (typeof this.filterData.voucherTypeID === 'undefined') {
        this.filterData.voucherTypeID = null
      }
      if (typeof this.filterData.fromCampaignCwScheduleId === 'undefined') {
        this.filterData.fromCampaignCwScheduleId = null
      }
      if (typeof this.filterData.voucherStatus === 'undefined') {
        this.filterData.voucherStatus = null
      }
      if (this.filterData.campaignID !== null || this.filterData.voucherTypeID !== null || this.filterData.fromCampaignCwScheduleId !== null || this.filterData.voucherStatus !== null) {
        this.toggleStatus = true
      }
      this.countryChange()
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getCountryRelationAction',
        'getCampaignListAction',
        'getCommissionWeekSearchAction',
        'getEsacVoucherTypeListAction',
        'getEsacVoucherSubTypeListAction',
        'getEsacVoucherListAction',
        'deleteEsacVoucherAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      queryHandler (data) {
        let query = this.processQueryData(data)
        this.setFilterData({
          countryID: this.filterData.countryID,
          search: this.filterData.search,
          fromCreatedAt: this.formatDate(this.filterData.fromCreatedAt, 'YYYY-MM-DD'),
          toCreatedAt: this.formatDate(this.filterData.toCreatedAt, 'YYYY-MM-DD'),
          campaignID: this.filterData.campaignID,
          voucherTypeID: this.filterData.voucherTypeID,
          fromCampaignCwScheduleId: this.filterData.fromCampaignCwScheduleId,
          voucherStatus: this.filterData.voucherStatus,
          active: this.filterData.active
        })
        query.country_id = this.filterData.countryID
        query.search = this.filterData.search
        query.from_created_at = this.formatDate(this.filterData.fromCreatedAt, 'YYYY-MM-DD')
        query.to_created_at = this.formatDate(this.filterData.toCreatedAt, 'YYYY-MM-DD')
        query.campaign_id = this.filterData.campaignID
        query.voucher_type_id = this.filterData.voucherTypeID
        query.from_campaign_cw_schedule_id = this.filterData.fromCampaignCwScheduleId
        query.voucher_status = this.filterData.voucherStatus
        query.active = this.filterData.active
        this.getEsacVoucherListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(() => {
          // Remove observers
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      countryChange () {
        if (this.filterData.countryID > 0) {
          this.show = true
          this.disable = false
          this.filterChange()
          let query = {}
          query.country_id = this.filterData.countryID
          this.getCampaignListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
            this.campaignsOptions = []
            if (res.data.length > 0) {
              res.data.forEach(x => {
                this.campaignsOptions.push({
                  label: x.name,
                  value: x.id
                })
              })
            }
          })
          this.getEsacVoucherTypeListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
            this.esacVoucherTypesOptions = []
            if (res.data.length > 0) {
              res.data.forEach(x => {
                this.esacVoucherTypesOptions.push({
                  label: x.name,
                  value: x.id
                })
              })
            }
          })
          query = {
            country_id: this.filterData.countryID,
            relations: ['currency']
          }
          this.getCountryRelationAction(query).then(() => {
            this.columns.forEach(x => {
              if (x.name === 'voucher_value') {
                x.label = Vue.prototype.$t('campaigns.esacVoucher.voucherValue') + ' (' + this.currencyLabelByCountry + ')'
              }
            })
          })
        } else {
          this.serverData = []
          this.disable = true
          this.columns.forEach(x => {
            if (x.name === 'voucher_value') {
              x.label = Vue.prototype.$t('campaigns.esacVoucher.voucherValue')
            }
          })
        }
      },
      filterChange () {
        this.queryHandler(this.setDefaultPaginationAttr('esac-voucher'))
      },
      toggle (x) {
        this.toggleStatus = !x
      },
      actions (row, type) {
        if (type === 'create') {
          this.$router.push({ name: 'New eSac Voucher' })
        } else if (type === 'update') {
          this.$router.push({ name: 'Update eSac Voucher', params: { esacVoucherId: row.id }})
        } else if (type === 'delete') {
          Dialog.create({
            title: 'Warning',
            message: Vue.prototype.$t('Common.DeleteAlert.Text') + ' ' + row.name,
            noEscDismiss: true,
            noBackdropDismiss: true,
            position: 'top',
            ok: Vue.prototype.$t('Common.DeleteAlert.Btn'),
            cancel: Vue.prototype.$t('Common.DeleteCancel.Btn')
          }).then(() => {
            this.deleteEsacVoucherAction(row.id).then(response => {
              this.filterChange()
            }).catch(error => {
              if (typeof error.response !== 'undefined' && error.response.status === 422) {
                if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                  this.setNotification({
                    title: 'eSac Voucher Deletion Failed',
                    message: error.response.data.id[0],
                    type: 'negative'
                  })
                }
              }
            })
          })
        }
      },
      routePage (data) {
        this.$router.push({ name: 'Update eSac Voucher', params: { esacVoucherId: data.id }})
      },
      openForm () {
        this.$router.push({ name: 'New eSac Voucher' })
      }
    }
  }
</script>
