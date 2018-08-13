<template>
    <div class="general-page-holder">
        <general-header :genaralTitle="$t('products.kitting.list.title')"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-10">
                    <div class="row gutter-xs">
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-select
                                    ref="kitCountrySelector"
                                    inverted-light
                                    color="white"
                                    class="no-shadow custom-input-border"
                                    clearable
                                    v-model="filterData.countryID"
                                    :options="countriesOptions.options"
                                    :title="$t('general.select.country')"
                                    :placeholder="$t('general.select.country')"
                                    @input="kitCountryChange()"
                            />
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-input v-model="kittingCode"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     clearable
                                     :disable="disable"
                                     :placeholder="$t('products.kitting.search.kitCode')"
                                     @input="searchChange()">
                            </q-input>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-input v-model="productCode"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     clearable
                                     :disable="disable"
                                     :placeholder="$t('products.kitting.search.ProductCode')"
                                     @input="searchChange()">
                            </q-input>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-select
                                    :options="masterDataOptionsCreator('sale_types')"
                                    :disable="disable"
                                    inverted-light
                                    color="white text-black"
                                    class="no-shadow custom-input-border"
                                    :display-value="`${salesTypeID.length + ' ' +  $t('products.kitting.search.SaleType') + ' ' + $t('Common.Selected.Text')}`"
                                    clearable
                                    filter
                                    multiple
                                    v-model="salesTypeID"
                                    :filterPlaceholder="$t('products.kitting.search.SaleType.placeholder')"
                                    @input="searchChange()"
                            ></q-select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2">
                    <div class="row full-height justify-end gutter-xs">
                        <div class="col-lg-1">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-auto col-md-12 col-xs-12">
                            <q-btn @click="routePage('new')" :disable="disable" color="primary" glossy icon-right="add" class="fit">
                                {{ $t('Common.Add.Btn') }}
                            </q-btn>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-holder bg-white">
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
                        <span v-if="col.name === 'active'">
                            <q-btn dense size="xs" flat class="no-pointer-events" v-if="col.value" color="positive"
                                   icon="lense"></q-btn>
                            <q-btn dense size="xs" flat class="no-pointer-events" v-else="" color="negative" icon="lense"></q-btn>
                        </span>
                        <span v-else-if="col.name === 'action'">
                            <div class="row justify-center gutter-xs no-wrap">
                            <div class="col-auto">
                                <q-btn dense size="sm" flat @click="actions(props.row,'update')" color="amber">
                                    <q-icon name="mode_edit"/>
                                    <q-tooltip :delay="1000">
                                        Edit
                                    </q-tooltip>
                                </q-btn>
                            </div>
                        </div>
                        </span>
                        <span v-else-if="col.name === 'is_esac'">
                            <q-chip :color="col.value ? 'amber' : 'positive'" dense>
                                {{ col.value ? 'esac kit' : 'kit' }}
                            </q-chip>
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
  // import Vue from 'vue'
  import generalHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import { MasterDataTransformarMixin, PaginationMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'product-kitting-setup-steps',
    components: {
      generalHeader,
      qLoader
    },
    mixins: [MasterDataTransformarMixin, PaginationMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessing: state => state.globalCMP.isProcessing,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        selectedFilters: state => state.globalCMP.selectedFilters,
        masterData: state => state.globalCMP.masterData.data.list
      }),
      ...mapGetters({
        tableList: 'tableKittingList'
      })
    },
    mounted () {
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.kitCountryChange()
      this.master.keys = ['sale_types']
      this.setVisibleColumns(this.columns)
      this.getCountriesAction().then((res) => {
        // check current quickJump country by ID
        if (this.filterData.countryID === 0) {
          this.queryHandler(this.setDefaultPaginationAttr('kittings'))
        }
      })
    },
    data: function () {
      return {
        disable: true,
        show: false,
        serverData: [],
        kittingCode: '',
        productCode: '',
        salesTypeID: [],
        filterData: {
          category: 0,
          countryID: 0
        },
        columns: [
          {
            name: 'is_esac',
            label: this.$t('Common.DTableLabel.Type'),
            field: 'is_esac',
            align: 'center',
            sortable: true
          },
          {
            name: 'code',
            label: this.$t('products.kitting.KitCode.label'),
            field: 'code',
            sortable: true
          },
          {
            name: 'name',
            label: this.$t('products.kitting.KitDesc.label'),
            field: 'name',
            sortable: true
          },
          {
            name: 'active',
            label: this.$t('Common.status.label'),
            field: 'active',
            align: 'center',
            classes: 'text-center',
            sortable: true
          },
          {
            name: 'action',
            label: this.$t('Common.DTableLabel.Action'),
            field: 'action',
            align: 'center'
          }
        ]
      }
    },
    methods: {
      ...mapActions([
        'getMastersWithKey',
        'getCountriesAction',
        'getKittingListingAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      kitCountryChange () {
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
        this.queryHandler(this.setDefaultPaginationAttr('kittings'))
      },
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.filterData.countryID
        this.query.kitting_code = this.kittingCode
        this.query.product_code = this.productCode
        this.query.sale_types = this.salesTypeID
        this.query.active = -1

        this.getKittingListingAction(this.query).then(() => {
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
        // Clear vuex filters
        this.setFilterData(this.filterData)
      },
      routePage (data) {
        this.$router.push({name: 'Kitting Product Setup', params: {id: data.id}})
      }
    }
  }
</script>