<template>
    <div class="general-page-holder">
        <general-header generalTitle="List of Smart Libraries"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-9">
                    <div class="row generic-margin gutter-xs">
                        <div class="col-lg-5 col-md-12 col-xs-12">
                            <q-select
                                    clearable
                                    ref="smartLibraryCountrySelector"
                                    color="black"
                                    v-model="filterData.countryID"
                                    :options="countriesOptions.options"
                                    :stack-label="$t('general.select.country')"
                                    @input="smartLibraryCountryChange"
                            />
                        </div>
                        <div class="col-lg-7 col-md-12 col-xs-12">
                            <q-input clearable
                                     v-model="filterData.filterTitle"
                                     color="black"
                                     :disable="disable"
                                     :stack-label="$t('smartLibrary.title.label')"
                                     @input="filterChange">
                            </q-input>
                        </div>
                        <div class="col-lg-12">
                            <div class="row gutter-xs" v-show="toggleStatus">
                                <div class="col-lg-4 col-md-12 col-xs-12">
                                    <q-select
                                            clearable
                                            :options="fileTypeOptions"
                                            v-model="filterData.filterFileType"
                                            :disable="disable"
                                            :stack-label="$t('smartLibrary.fileType.label')"
                                            :filterPlaceholder="$t('smartLibrary.fileType.label')"
                                            @input="filterChange"
                                    />
                                </div>
                                <div class="col-lg-4 col-md-12 col-xs-12">
                                    <q-select
                                            clearable
                                            :options="categoriesOptions.options"
                                            v-model="filterData.filterProductCategoryId"
                                            filter
                                            :disable="disable"
                                            :stack-label="$t('general.select.category')"
                                            :filterPlaceholder="$t('general.search.category.placeholder')"
                                            @input="filterChange"
                                    />
                                </div>
                                <div class="col-lg-4 col-md-12 col-xs-12">
                                    <q-select
                                            clearable
                                            :options="statusOptions"
                                            v-model="filterData.filterStatus"
                                            :disable="disable"
                                            :stack-label="$t('smartLibrary.status.label')"
                                            :filterPlaceholder="$t('smartLibrary.status.label')"
                                            @input="filterChange"
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
    name: 'smart-library-list-table',
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
        categoriesOptions: state => state.globalCMP.categoriesOptions.data,
        simplePagination: state => state.globalCMP.simplePagination,
        selectedFilters: state => state.globalCMP.selectedFilters,
        smartLibraryFileTypeData: state => state.smartLibraryCMP.smartLibraryFileTypeData,
        smartLibrarySearchData: state => state.globalCMP.smartLibrarySearchDataGlobal
      }),
      ...mapGetters({
        tableList: 'tableDataSmartLibraries',
        paginationQuery: 'pagination'
      })
    },
    data: () => ({
      disable: true,
      show: false,
      serverData: [],
      toggleStatus: false,
      fileTypeOptions: [],
      statusOptions: [
        {
          label: 'All',
          value: 2
        },
        {
          label: 'Published',
          value: 1
        },
        {
          label: 'Yet to Published',
          value: 0
        }
      ],
      filterData: {
        countryID: null,
        filterTitle: '',
        filterFileType: null,
        filterSaleTypeId: null,
        filterProductCategoryId: null,
        filterProductId: null,
        filterStatus: null
      },
      columns: [
        {
          name: 'sequence_priority',
          label: Vue.prototype.$t('smartLibrary.sequencePriority.label'),
          field: 'sequence_priority',
          sortable: true
        },
        {
          name: 'title',
          label: Vue.prototype.$t('smartLibrary.title.label'),
          field: 'title',
          sortable: true,
          required: true
        },
        {
          name: 'upload_file_type',
          label: Vue.prototype.$t('smartLibrary.fileType.label'),
          field: 'upload_file_type',
          sortable: true,
          format (value) {
            if (value === 'A') {
              return 'Audio'
            } else if (value === 'I') {
              return 'Image'
            } else if (value === 'V') {
              return 'Video'
            } else if (value === 'P') {
              return 'PDF'
            } else if (value === 'L') {
              return 'Link'
            } else {
              return ''
            }
          }
        },
        {
          name: 'product_category',
          label: Vue.prototype.$t('smartLibrary.productCategory.label'),
          field: 'product_category',
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
          name: 'product',
          label: Vue.prototype.$t('smartLibrary.product.label'),
          field: 'product',
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
          name: 'created_at',
          label: Vue.prototype.$t('Common.DTableLabel.CreatedAt'),
          field: 'created_at',
          sortable: true,
          format (value) {
            return new Date(value).toLocaleString()
          }
        },
        {
          name: 'status',
          label: Vue.prototype.$t('smartLibrary.status.label'),
          field: 'status',
          sortable: true,
          format (value) {
            if (value === 1) {
              return 'Published'
            } else {
              return 'Yet to Published'
            }
          }
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
    created () {
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.smartLibraryCountryChange()
      let query = {
        for_marketing: true,
        active: true,
        limit: 0
      }
      this.getCategoriesAction(query)
      this.getCountriesAction()
      this.getSmartLibraryFileTypeAction({}).then(() => {
        this.fileTypeOptions = JSON.parse(JSON.stringify(this.smartLibraryFileTypeData.list))
        this.fileTypeOptions.unshift({label: 'All', value: ''})
      })
      this.setVisibleColumns(this.columns)
      let filterSelected = false
      if ((typeof this.selectedFilters.filterFileType !== 'undefined') && this.selectedFilters.filterFileType !== null) {
        filterSelected = true
      } else if ((typeof this.selectedFilters.filterProductCategoryId !== 'undefined') && this.selectedFilters.filterProductCategoryId !== null) {
        filterSelected = true
      } else if ((typeof this.selectedFilters.filterStatus !== 'undefined') && this.selectedFilters.filterStatus !== null) {
        filterSelected = true
      }
      if (filterSelected) {
        this.toggleStatus = true
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getCategoriesAction',
        'getSmartLibraryFileTypeAction',
        'getSmartLibraryListAction',
        'deleteSmartLibraryAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
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
          filterCountryName: countryName,
          filterCountryCode: countryCode,
          filterTitle: this.filterData.filterTitle,
          filterFileType: this.filterData.filterFileType,
          filterSaleTypeId: this.filterData.filterSaleTypeId,
          filterProductCategoryId: this.filterData.filterProductCategoryId,
          filterProductId: this.filterData.filterProductId,
          filterStatus: this.filterData.filterStatus
        })

        this.query.country_id = this.filterData.countryID
        this.query.title = this.filterData.filterTitle !== null ? this.filterData.filterTitle : ''
        this.query.file_type = this.filterData.filterFileType !== null ? this.filterData.filterFileType : ''
        this.query.sale_type_id = this.filterData.filterSaleTypeId !== null ? this.filterData.filterSaleTypeId : 0
        this.query.product_category_id = this.filterData.filterProductCategoryId !== null ? this.filterData.filterProductCategoryId : 0
        this.query.product_id = this.filterData.filterProductId !== null ? this.filterData.filterProductId : 0
        this.query.status = this.filterData.filterStatus !== null ? this.filterData.filterStatus : 2

        this.getSmartLibraryListAction(_(this.query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(() => {
          // Remove observers
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      smartLibraryCountryChange () {
        if (this.filterData.countryID > 0) {
          this.show = true
          this.disable = false
          this.filterChange()
        } else {
          this.serverData = []
          this.disable = true
        }
      },
      filterChange () {
        this.queryHandler(this.setDefaultPaginationAttr('smart-library'))
      },
      actions (row, type) {
        if (type === 'create') {
          this.$router.push({name: 'New Smart Library'})
        } else if (type === 'update') {
          this.$router.push({name: 'Update Smart Library', params: {smartLibraryId: row.id}})
        } else if (type === 'delete') {
          Dialog.create({
            title: 'Warning',
            message: Vue.prototype.$t('Common.DeleteAlert.Text') + ' ' + row.title,
            noEscDismiss: true,
            noBackdropDismiss: true,
            position: 'top',
            ok: Vue.prototype.$t('Common.DeleteAlert.Btn'),
            cancel: Vue.prototype.$t('Common.DeleteCancel.Btn')
          }).then(() => {
            this.deleteSmartLibraryAction(row.id).then(response => {
              this.filterChange()
            })
          })
        }
      },
      routePage (data) {
        this.$router.push({name: 'Update Smart Library', params: {smartLibraryId: data.id}})
      },
      toggle (x) {
        this.toggleStatus = !x
      },
      openForm () {
        this.$router.push({name: 'New Smart Library'})
      }
    }
  }
</script>
