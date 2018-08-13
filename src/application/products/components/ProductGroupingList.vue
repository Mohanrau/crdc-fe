<template>
    <div class="general-page-holder">
        <general-header :genaralTitle="$t('products.productGrouping.list.title')"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between gutter-xs">
                <div class="col-lg-3 col-md-12 col-xs-12">
                    <q-select
                            ref="groupingCountrySelector"
                            inverted-light
                            color="white text-black"
                            class="no-shadow custom-input-border"
                            v-model="filterData.countryID"
                            :options="countriesOptions.options"
                            :placeholder="$t('general.select.country')"
                            @input="groupingCountryChange"
                    />
                </div>
                <div class="col-lg-6 col-md-12 col-xs-12">
                    <div class="row gutter-xs">
                        <div class="col-lg-8 col-md-12 col-xs-12">
                            <q-input v-model="terms"
                                     inverted-light
                                     color="white text-black"
                                     class="no-shadow custom-input-border"
                                     :disable="disable"
                                     :placeholder="$t('products.productGrouping.searchProductCode')"
                                     @input="searchChange">
                            </q-input>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-12 col-xs-12">
                    <div class="row full-height justify-end gutter-xs">
                        <div class="col-lg-auto">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-auto col-md-12 col-xs-12">
                            <q-btn @click="routePage('new')" :disable="disable" color="primary" icon-right="add" glossy class="fit">
                                {{$t('Common.Add.Btn')}}
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-holder">
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
                    dense
                    :color="appSettings.defaulted.table_color"
                    class="bg-white">
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
                        {{ col.value }}
                    </q-td>
                </q-tr>
            </q-table>
        </div>
    </div>
</template>
<script>
  import generalHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import { PaginationMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'product-grouping-list',
    components: {
      generalHeader,
      qLoader
    },
    mixins: [PaginationMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessing: state => state.globalCMP.isProcessing,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        selectedFilters: state => state.globalCMP.selectedFilters
      }),
      ...mapGetters({
        tableList: 'tableProductGroupingList'
      })
    },
    mounted () {
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.setVisibleColumns(this.columns)
      this.groupingCountryChange()
      this.getCountriesAction().then((res) => {
        // check current quickJump country by ID
        if (this.filterData.countryID === 0) {
          this.searchChange()
        }
      })
    },
    data: function () {
      return {
        disable: true,
        show: false,
        terms: '',
        serverData: [],
        filterData: {
          categoryID: 0,
          countryID: 0
        },
        columns: [
          {
            name: 'dmy_code',
            label: this.$t('products.standard.ProductCode.label'),
            field: 'dmy_code',
            sort: true
          },
          {
            name: 'dmy_name',
            label: this.$t('products.standard.ProductName.label'),
            field: 'dmy_name',
            sort: true
          }
        ]
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getProductGroupingListingAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      groupingCountryChange () {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.filterData.countryID)
        if (getCountryName.length > 0) {
          this.setFilterData({countryID: this.filterData.countryID, countryName: getCountryName[0].label})
        }
        if (this.filterData.countryID > 0) {
          this.show = true
          this.disable = false
          this.searchChange()
        } else {
          this.serverData = []
          this.disable = true
        }
      },
      searchChange () {
        this.queryHandler(this.setDefaultPaginationAttr('grouping'))
      },
      // Query is optional parameter
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.filterData.countryID
        // TODO change to terms update with jalala
        this.query.dummy_data = this.terms
        this.getProductGroupingListingAction(this.query).then(() => {
          // Remove observers
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      clearFilterData () {
        // Clearing local filters
        this.filterData.countryID = 0
        this.terms = ''
        this.disable = true
        // Clear datatables
        this.rows = []
        // Clear vuex filters
        this.unSetFilterData({countryID: '', categoryID: '', countryName: ''})
      },
      routePage (data) {
        this.$router.push({name: 'Product Grouping Setup', params: {id: data.id}})
      }
    }
  }
</script>
<style>
    .filter-holder {
        padding: 8px;
        margin: 10px 0px 10px 0px;
    }
</style>
