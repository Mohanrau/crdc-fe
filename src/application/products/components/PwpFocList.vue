<template>
    <div class="general-page-holder">
        <general-header genaralTitle="Promotion Free Items List From ERP system"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between gutter-xs">
                <div class="col-lg-3 col-md-12 col-xs-12">
                    <q-select
                            dense
                            clearable
                            ref="CountrySelector"
                            placeholder="Choose ..."
                            inverted-light
                            color="white"
                            class="no-shadow custom-input-border"
                            v-model="filterData.countryID"
                            :options="countriesOptions.options"
                            :title="$t('general.select.country')"
                            :placeholder="$t('general.select.country')"
                            @input="CountryChange"
                    />
                </div>
                <div class="col-lg-9 col-md-12 col-xs-12">
                    <div class="row full-height justify-end gutter-xs">
                        <div class="col-lg-auto">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-auto col-md-12 col-xs-12">
                            <q-btn @click="routePage('new')" :disable="disable" color="primary" icon-right="add" glossy
                                   class="fit">
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
                        <span v-if="col.name === 'action'">
                            <div class="row justify-center gutter-xs no-wrap">
                            <div class="col-auto">
                                <q-btn dense size="sm" flat @click="routePage(props.row)" color="amber">
                                    <q-icon name="mode_edit"/>
                                    <q-tooltip :delay="1000">
                                        Edit
                                    </q-tooltip>
                                </q-btn>
                            </div>
                        </div>
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
  import generalHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import {PaginationMixin} from 'src/application/global/mixins/index'
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'pwp-foc-list',
    components: {
      generalHeader,
      qLoader
    },
    mixins: [PaginationMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        selectedFilters: state => state.globalCMP.selectedFilters
      }),
      ...mapGetters({
        tableList: 'tablePwpFocList'
      })
    },
    mounted() {
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.setVisibleColumns(this.columns)
      this.CountryChange()
      this.getCountriesAction().then((res) => {
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
          category: 0,
          countryID: 0
        },
        columns: [
          {
            name: 'id',
            label: this.$t('Common.DTableLabel.No'),
            field: 'id',
            width: '50px',
            sortable: true
          },
          {
            name: 'name',
            label: 'Name',
            field: 'name',
            width: '200px',
            sortable: true
          },
          {
            name: 'promotion_type',
            label: this.$t('Common.DTableLabel.Type'),
            field: 'promotion_type',
            width: '70px',
            sortable: true,
            format(value) {
              if (value) {
                for (var i in value) {
                  return value['title']
                }
              }
              return value
            }
          },
          {
            name: 'start_date',
            label: this.$t('Common.DTableLabel.StartDate'),
            field: 'start_date',
            width: '100px',
            sortable: true
          },
          {
            name: 'end_date',
            label: this.$t('Common.DTableLabel.EndDate'),
            field: 'end_date',
            width: '100px',
            sortable: true
          },
          {
            name: 'categories',
            label: this.$t('Common.DTableLabel.ByCategory'),
            field: 'categories',
            width: '140px',
            sortable: true,
            format(value) {
              let cats = []
              if (value) {
                value.forEach((item) => {
                  cats.push(item.name)
                })
              }
              return cats.toString()
            }
          },
          {
            name: 'from_cv_range',
            label: this.$t('Common.DTableLabel.CvFrom'),
            field: 'from_cv_range',
            width: '100px',
            align: 'center'
          },
          {
            name: 'to_cv_range',
            label: this.$t('Common.DTableLabel.CvTo'),
            field: 'to_cv_range',
            width: '100px',
            align: 'center'
          },
          {
            name: 'action',
            label: this.$t('Common.DTableLabel.Action'),
            field: 'action',
            align: 'center'
          }
        ],
        productsShowing: false
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getPwpFocListingAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      CountryChange() {
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
          this.searchChange()
        } else {
          this.serverData = []
          this.disable = true
        }
      },
      searchChange() {
        this.queryHandler(this.setDefaultPaginationAttr('pwp'))
      },
      // Query is optional parameter
      queryHandler(data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.filterData.countryID
        this.getPwpFocListingAction(this.query).then(() => {
          // Remove observers
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      clearFilterData() {
        // Clearing local filters
        this.filterData.countryID = ''
        this.terms = ''
        this.disable = true
        // Clear datatables
        this.rows = []
        // Clear vuex filters
        this.unSetFilterData({countryID: '', categoryID: '', countryName: ''})
      },
      routePage(data) {
        this.$router.push({name: 'PWP and FOC Setup', params: {id: data.id}})
      }
    }
  }
</script>
