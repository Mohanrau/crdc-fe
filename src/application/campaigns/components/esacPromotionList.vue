<template>
    <div class="general-page-holder">
        <general-header generalTitle="List of eSac Promotion"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-9">
                    <div class="row generic-margin gutter-xs">
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-select
                                    ref="countrySelector"
                                    color="black"
                                    v-model="filterData.countryID"
                                    :options="countriesOptions.options"
                                    :stack-label="$t('general.select.country')"
                                    @input="countryChange"
                            />
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-select
                                    clearable
                                    ref="campaignSelector"
                                    color="black"
                                    :disable="disable"
                                    v-model="filterData.campaignID"
                                    :options="campaignsOptions"
                                    :stack-label="$t('campaigns.esacPromotion.campaign')"
                                    @input="filterChange"
                            />
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-select
                                    clearable
                                    ref="esacVoucherTypeSelector"
                                    color="black"
                                    :disable="disable"
                                    v-model="filterData.voucherTypeID"
                                    :options="esacVoucherTypesOptions"
                                    :stack-label="$t('campaigns.esacPromotion.esacVoucherType')"
                                    @input="filterChange"
                            />
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-input clearable
                                     v-model="filterData.search"
                                     color="black"
                                     :disable="disable"
                                     :stack-label="$t('Common.search.label')"
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
  import { PaginationMixin } from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { Dialog } from 'quasar'
  import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'esac-voucher-type-list-table',
    mixins: [PaginationMixin],
    components: {
      generalHeader,
      qLoader
    },
    computed: {
      ...mapState({
        websocket: state => state.globalCMP.websocket,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessing: state => state.globalCMP.isProcessing,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        simplePagination: state => state.globalCMP.simplePagination,
        selectedFilters: state => state.globalCMP.selectedFilters,
        esacPromotionSearchData: state => state.globalCMP.esacPromotionSearchDataGlobal
      }),
      ...mapGetters({
        tableList: 'tableDataEsacPromotions',
        esacVoucherTypeList: 'tableDataEsacVoucherTypes',
        campaignList: 'tableDataCampaigns',
        paginationQuery: 'pagination'
      })
    },
    data: () => ({
      disable: true,
      show: false,
      serverData: [],
      campaignsOptions: [],
      esacVoucherTypesOptions: [],
      filterData: {
        countryID: null,
        campaignID: null,
        voucherTypeID: null,
        name: null,
        description: null,
        search: null
      },
      columns: [
        {
          name: 'created_at',
          align: 'center',
          label: Vue.prototype.$t('campaigns.esacPromotion.setupDate'),
          field: 'created_at',
          sortable: true,
          format (value) {
            if (value !== null) {
              return value.split(' ')[0]
            }
            return value
          }
        },
        {
          name: 'id',
          label: Vue.prototype.$t('campaigns.esacPromotion.id'),
          field: 'id',
          sortable: true,
          required: true
        },
        {
          name: 'country',
          label: Vue.prototype.$t('campaigns.esacPromotion.country'),
          field: 'country',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              if (typeof value['name'] !== 'undefined' && value['name'] !== null) {
                return value['name']
              }
            }
            return '-'
          }
        },
        {
          name: 'esac_voucher_type',
          label: Vue.prototype.$t('campaigns.esacPromotion.esacVoucherType'),
          field: 'esac_voucher_type',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              if (typeof value['name'] !== 'undefined' && value['name'] !== null) {
                return value['name']
              }
            }
            return '-'
          }
        },
        {
          name: 'campaign',
          label: Vue.prototype.$t('campaigns.esacPromotion.campaign'),
          field: 'campaign',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              if (typeof value['name'] !== 'undefined' && value['name'] !== null) {
                return value['name']
              }
            }
            return '-'
          }
        },
        {
          name: 'campaign.from_cw_schedule.date_from',
          label: Vue.prototype.$t('campaigns.esacPromotion.startDate'),
          field: 'campaign',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              if (typeof value['from_cw_schedule'] !== 'undefined' && value['from_cw_schedule'] !== null) {
                if (typeof value['from_cw_schedule']['date_from'] !== 'undefined' && value['from_cw_schedule']['date_from']!== null) {
                  return value['from_cw_schedule']['date_from']
                }
              }
            }
            return '-'
          }
        },
        {
          name: 'campaign.to_cw_schedule.date_to',
          label: Vue.prototype.$t('campaigns.esacPromotion.endDate'),
          field: 'campaign',
          sortable: true,
          format (value) {
            if (typeof value !== 'undefined' && value !== null) {
              if (typeof value['from_cw_schedule'] !== 'undefined' && value['from_cw_schedule'] !== null) {
                if (typeof value['from_cw_schedule']['date_to'] !== 'undefined' && value['from_cw_schedule']['date_to']!== null) {
                  return value['from_cw_schedule']['date_to']
                }
              }
            }
            return '-'
          }
        },
        {
          name: 'last_modified_by',
          align: 'left',
          label: Vue.prototype.$t('Common.DTableLabel.lastModifiedBy'),
          field: 'last_modified_by',
          sortable: true
        },
        {
          name: 'last_modified_at',
          align: 'left',
          label: Vue.prototype.$t('Common.DTableLabel.lastModifiedAt'),
          field: 'last_modified_at',
          sortable: true
        },
        {
          name: 'action',
          label: Vue.prototype.$t('Common.DTableLabel.Action'),
          sortable: false,
          align: 'center',
          required: true
        }
      ]
    }),
    mounted () {
      this.getCountriesAction()
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.countryChange()
      this.setVisibleColumns(this.columns)
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getCampaignListAction',
        'getEsacVoucherTypeListAction',
        'getEsacVoucherSubTypeListAction',
        'getEsacPromotionListAction',
        'deleteEsacPromotionAction'
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
          campaignID: this.filterData.campaignID,
          voucherTypeID: this.filterData.voucherTypeID,
          search: this.filterData.search
        })
        query.country_id = this.filterData.countryID
        query.campaign_id = this.filterData.campaignID
        query.voucher_type_id = this.filterData.voucherTypeID
        query.search = this.filterData.search
        this.getEsacPromotionListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(() => {
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
        } else {
          this.serverData = []
          this.disable = true
        }
      },
      filterChange () {
        this.queryHandler(this.setDefaultPaginationAttr('esac-promotion'))
      },
      actions (row, type) {
        if (type === 'create') {
          this.$router.push({name: 'New eSac Promotion'})
        } else if (type === 'update') {
          this.$router.push({name: 'Update eSac Promotion', params: {esacPromotionId: row.id}})
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
            this.deleteEsacPromotionAction(row.id).then(response => {
              this.filterChange()
            }).catch(error => {
              if (typeof error.response !== 'undefined' && error.response.status === 422) {
                if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                  this.setNotification({
                    title: 'eSac Promotion Deletion Failed',
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
        this.$router.push({name: 'Update eSac Promotion', params: {esacPromotionId: data.id}})
      },
      openForm () {
        this.$router.push({name: 'New eSac Promotion'})
      }
    }
  }
</script>
