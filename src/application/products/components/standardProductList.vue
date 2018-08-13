<template>
    <div class="general-page-holder">
        <general-header :genaralTitle="$t('products.standard.list.title')">
        </general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row gutter-xs items-end">
                <div class="col-lg-2 col-md-12 col-xs-12">
                    <q-select
                            inverted-light
                            color="white"
                            class="no-shadow custom-input-border"
                            clearable
                            ref="countrySelector"
                            placeholder="Choose ..."
                            v-model="filterData.countryID"
                            :options="countriesOptions.options"
                            :placeholder="$t('general.select.country')"
                            @input="countryChange"
                    />
                </div>

                <div class="col-lg-3 col-md-12 col-xs-12">
                    <q-select
                            inverted-light
                            color="white"
                            class="no-shadow custom-input-border"
                            clearable
                            v-model="filterData.categoryID"
                            :options="categoriesOptions.options"
                            placeholder="Choose ..."
                            filter
                            :disable="disable"
                            :placeholder="$t('general.select.category')"
                            :filterPlaceholder="$t('general.search.category.placeholder')"
                            @input="setFilterData({categoryID: filterData.categoryID})"
                    ></q-select>
                </div>
                <div class="col-lg-4 col-md-12 col-xs-12">
                    <q-input v-model="normalSearch"
                             :disable="disable"
                             inverted-light
                             color="white"
                             class="no-shadow custom-input-border"
                             clearable
                             :placeholder="$t('products.quickjump.name')"
                             v-on:keyup.enter="search(normalSearch, null , 'quick')">
                    </q-input>
                </div>
                <div class="col-lg-3 col-md-12 col-xs-12">
                    <q-input v-model="quickjump" :disable="disable"
                             inverted-light
                             color="white"
                             class="no-shadow custom-input-border"
                             :placeholder="$t('products.search.name')">
                        <q-autocomplete
                                @search="search"
                                :min-characters="1"
                                :debounce="appSettings.debounceDelay"
                                @selected="selected"
                        />
                    </q-input>
                </div>
            </div>
        </div>
        <div class="table-holder bg-white shadow-1">
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
                <!-- Custom Slots -->
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
                <q-tr slot="body" slot-scope="props" :props="props" @click.native="routePage(props.row)"
                      class="cursor-pointer">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        <span v-if="col.name === 'yy_active'">
                            <q-btn dense size="xs" flat class="no-pointer-events" v-if="props.row.yy_active" color="positive"
                                   icon="lense"></q-btn>
                            <q-btn dense size="xs" flat class="no-pointer-events" v-else="" color="negative" icon="lense"></q-btn>
                        </span>
                        <span v-else-if="col.name === 'ibs_active'">
                            <q-btn dense size="xs" flat class="no-pointer-events" v-if="props.row.ibs_active" color="positive"
                                   icon="lense"></q-btn>
                            <q-btn dense size="xs" flat class="no-pointer-events" v-else="" color="negative" icon="lense"></q-btn>
                        </span>
                        <span v-else="">
                            {{ col.value }}
                        </span>
                    </q-td>
                </q-tr>
            </q-table>
        </div>
    </div>
</template>
<script>
  import simplePagination from '../../global/components/common/pagination/simplePagination'
  import generalHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import { PaginationMixin, GeneralsMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'ProductListTable',
    components: {
      simplePagination,
      generalHeader,
      qLoader
    },
    mixins: [PaginationMixin, GeneralsMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessing: state => state.globalCMP.isProcessing,
        openCloseModelForm: state => state.globalCMP.openCloseModelForm,
        simplePagination: state => state.globalCMP.simplePagination,
        currentUpdateId: state => state.globalCMP.currentUpdateId,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        categoriesOptions: state => state.globalCMP.categoriesOptions.data,
        productSearchData: state => state.productsCMP.productSearchData,
        selectedFilters: state => state.globalCMP.selectedFilters,
        appSettings: state => state.globalCMP.appSettings
      }),
      ...mapGetters({
        tableList: 'tableProductList',
        paginationQuery: 'paginationQuery'
      })
    },
    mounted () {
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.countryChange()
      let query = {
        for_sales: true,
        active: true,
        limit: 0
      }
      this.getCategoriesAction(query)
      this.getCountriesAction()
      this.setVisibleColumns(this.columns)
      if (this.filterData.countryID === 0) {
        this.queryHandler(this.setDefaultPaginationAttr('products'))
      }
    },
    data: function () {
      return {
        disable: true,
        show: false,
        quickjump: '',
        normalSearch: '',
        filterData: {
          categoryID: null,
          countryID: null
        },
        serverData: [],
        columns: [
          {
            name: 'sku',
            label: this.$t('products.standard.ProductCode.label'),
            field: 'sku',
            sortable: true,
            required: true
          },
          {
            name: 'name',
            label: this.$t('products.standard.ProductName.label'),
            field: 'name',
            sortable: true,
            required: true
          },
          {
            name: 'yy_active',
            label: this.$t('products.standard.StatusYY.label'),
            field: 'yy_active',
            align: 'center',
            classes: 'text-center',
            sortable: true
          },
          {
            name: 'ibs_active',
            label: this.$t('products.standard.StatusIBS.label'),
            field: 'ibs_active',
            align: 'center',
            classes: 'text-center',
            sortable: true
          }
        ]
      }
    },
    watch: {
      filterData: {
        handler () {
          this.queryHandler(this.setDefaultPaginationAttr('products'))
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'openCloseModalAction',
        'getProductListingAction',
        'getCountriesAction',
        'getCategoriesAction',
        'getProductSearchAction',
        'setProductPageData'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA'
      }),
      countryChange () {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.filterData.countryID)
        if (getCountryName.length > 0) {
          this.setFilterData({countryID: this.filterData.countryID, countryName: getCountryName[0].label})
        }
        if (this.filterData.countryID > 0) {
          this.show = true
          this.disable = false
        }
      },
      // Query is optional parameter
      queryHandler (data) {
        this.query = this.processQueryData(data)
        if (this.filterData.countryID > 0) {
          this.query.country_id = this.filterData.countryID
          this.query.category_id = this.filterData.categoryID
          this.query.active = -1

          this.getProductListingAction(this.removeFalsyValues(this.query)).then(() => {
            // Remove observers
            data = JSON.parse(JSON.stringify(data))
            this.serverPagination = data.pagination
            this.serverPagination.rowsNumber = this.tableList.list.total
            this.serverData = this.tableList.list.data
          })
        }
      },
      search (terms, done, type) {
        let query = {
          country_id: this.filterData.countryID,
          category_id: this.filterData.categoryID,
          text: terms,
          active: -1,
          limit: type === 'quick' ? 1 : null,
          exact_search : type === 'quick' ? 1 : 0
        }
        this.getProductSearchAction(this.removeFalsyValues(query)).then(res => {
          if (type === 'quick') {
            if (this.productSearchData.list.length > 0) {
              this.routePage(this.productSearchData.list[0])
            }
          } else {
            done(this.productSearchData.list)
          }
        })
      },
      selected (item) {
        this.routePage(item)
      },
      clearFilterData () {
        // Clearing local filters
        this.filterData.countryID = null
        this.filterData.categoryID = null
        // Clear datatables
        this.rows = []
        // Clear vuex filters
        this.setFilterData(this.filterData)
      },
      routePage (data) {
        this.$router.push({name: 'Standard Product Setup', params: {id: data.id || data.value}})
      }
    }
  }
</script>