<template>
    <div class="general-page-holder">
        <general-header generalTitle="List of eSac Voucher Sub Type"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-9">
                    <div class="row generic-margin gutter-xs">
                        <div class="col-lg-4 col-md-12 col-xs-12">
                            <q-select
                                    ref="countrySelector"
                                    color="black"
                                    v-model="filterData.countryID"
                                    :options="countriesOptions.options"
                                    :stack-label="$t('general.select.country')"
                                    @input="countryChange"
                            />
                        </div>
                        <div class="col-lg-4 col-md-12 col-xs-12">
                            <q-select
                                    clearable
                                    ref="esacVoucherTypeSelector"
                                    color="black"
                                    v-model="filterData.voucherTypeID"
                                    :options="esacVoucherTypesOptions"
                                    :stack-label="$t('campaigns.esacVoucherSubType.esacVoucherType')"
                                    @input="filterChange"
                            />
                        </div>
                        <div class="col-lg-4 col-md-12 col-xs-12">
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
        esacVoucherSubTypeSearchData: state => state.globalCMP.esacVoucherSubTypeSearchDataGlobal
      }),
      ...mapGetters({
        tableList: 'tableDataEsacVoucherSubTypes',
        esacVoucherTypeList: 'tableDataEsacVoucherTypes',
        paginationQuery: 'pagination'
      })
    },
    data: () => ({
      disable: true,
      show: false,
      serverData: [],
      esacVoucherTypesOptions: [],
      filterData: {
        countryID: null,
        voucherTypeID: null,
        name: null,
        description: null,
        search: null
      },
      columns: [
        {
          name: 'esac_voucher_type',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucherSubType.esacVoucherType'),
          field: 'esac_voucher_type',
          sortable: true,
          format (value) {
            if (value !== '') {
              for (var i in value) {
                return value['name']
              }
            } else {
              value = '-'
            }
            return value
          }
        },
        {
          name: 'name',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucherSubType.name'),
          field: 'name',
          sortable: true,
          required: true
        },
        {
          name: 'description',
          align: 'left',
          label: Vue.prototype.$t('campaigns.esacVoucherSubType.description'),
          field: 'description',
          sortable: true,
          required: true
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
          align: 'center',
          label: Vue.prototype.$t('Common.DTableLabel.Action'),
          sortable: false,
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
        'getEsacVoucherTypeListAction',
        'getEsacVoucherSubTypeListAction',
        'deleteEsacVoucherSubTypeAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.setFilterData({
          countryID: this.filterData.countryID,
          voucherTypeID: this.filterData.voucherTypeID,
          name: this.filterData.name,
          description: this.filterData.description,
          search: this.filterData.search
        })
        this.query.country_id = this.filterData.countryID
        this.query.voucher_type_id = this.filterData.voucherTypeID
        this.query.name = this.filterData.name
        this.query.description = this.filterData.description
        this.query.search = this.filterData.search
        this.getEsacVoucherSubTypeListAction(_(this.query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(() => {
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
        this.queryHandler(this.setDefaultPaginationAttr('esac-voucher-sub-type'))
      },
      actions (row, type) {
        if (type === 'create') {
          this.$router.push({ name: 'New eSac Voucher Sub Type' })
        } else if (type === 'update') {
          this.$router.push({ name: 'Update eSac Voucher Sub Type', params: { esacVoucherSubTypeId: row.id }})
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
            this.deleteEsacVoucherSubTypeAction(row.id).then(response => {
              this.filterChange()
            }).catch(error => {
              if (typeof error.response !== 'undefined' && error.response.status === 422) {
                if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                  this.setNotification({
                    title: 'eSac Voucher Sub Type Deletion Failed',
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
        this.$router.push({ name: 'Update eSac Voucher Sub Type', params: { esacVoucherSubTypeId: data.id }})
      },
      openForm () {
        this.$router.push({ name: 'New eSac Voucher Sub Type' })
      }
    }
  }
</script>
