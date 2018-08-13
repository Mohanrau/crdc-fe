<template>
  <div class="general-page-holder" :class="{'dimmed': togglePopupSearch}">
    <genaral-header genaralTitle="List of Stockists"></genaral-header>
    <div class="filter-holder bg-white shadow-1">
      <div class="row items-center justify-between">
        <div class="col-lg-10">
          <div class="row generic-margin gutter-xs">
            <div class="col-lg-3 col-md-12 col-xs-12">
              <q-field
                :error="$v.filterData.countryID.$error"
                :error-label="$t('general.select.country.error')">
                <q-select
                  clearable
                  ref="salesCountrySelector"
                  color="black"
                  v-model="filterData.countryID"
                  :options="countriesOptions.options"
                  :ok-label="$t('Common.Choose.Btn')"
                  :cancel-label="$t('Common.Close.Btn')"
                  :title="$t('general.select.country')"
                  :stack-label="$t('general.select.country')"
                  :message="$t('general.select.country.text')"
                  @input="salesCountryChange"
                />
              </q-field>
            </div>
            <div class="col-lg-3 col-md-12 col-xs-12">
              <q-input v-model.lazy="filterData.filterTerms"
                       :stack-label="$t('stockist.list.filter.stockistSearchTerm')"
                       :disable="disable"
                       @input="filterChange">
                <q-autocomplete @search="(terms, done) => search(terms, done, 'filterTerms')"
                                @selected="(item, keyboard) => selected(item, 'filterTerms', keyboard)"/>
              </q-input>
            </div>
            <div class="col-lg-3">
              <q-select
                v-model="filterData.filterStockistType"
                :options="masterDataOptionsCreator('stockist_type')"
                filter
                color="black"
                :disable="disable"
                clearable
                :stack-label="$t('stockist.list.filter.stockistType')"
                filterPlaceholder="Sales Cancellation Status"
                @input="filterChange"
              ></q-select>
            </div>
            <div class="col-lg-3">
              <q-select
                v-model="filterData.filterStockistStatus"
                :options="masterDataOptionsCreator('stockist_status')"
                filter
                :disable="disable"
                color="black"
                clearable
                :stack-label="$t('stockist.list.filter.stockistStatus')"
                filterPlaceholder="Sales Cancellation Status"
                @input="filterChange"
              ></q-select>
            </div>
          </div>
        </div>
        <!--New setup button section-->
        <div class="col-lg-2">
          <div class="row full-height justify-center gutter-xs">
            <div class="col-lg-1 gt-md">
              <div class="verticle-line"></div>
            </div>
            <div class="col-lg-11 self-center z-absolute">
              <q-btn class="full-width" :class="{'new-order-btn fit' : togglePopupSearch}"
                     color="primary" :icon="!togglePopupSearch ? 'add' : 'close'"
                     @click="togglePopupSearchSection(togglePopupSearch)"
                     :disable="disable"
              >
                {{ !togglePopupSearch ? 'New Setup' : 'Cancel'}}
              </q-btn>
              <q-popover anchor="bottom right"
                         @hide="togglePopupSearchSection(togglePopupSearch, false)"
                         self="top right"
                         ref="popover"
                         :disable="disable"
                         fit>
                <div class="row">
                  <div class="col-12 pd-20 custom-width-popover relative-position">
                    <div>
                      <q-input v-model.trim="userIDSearchTerm"
                               clearable
                               placeholder="Search IBO ID / Name / IC"
                               :after="[{icon: 'chevron_right', handler () { initiateStockistRegistration() }}]"
                               @input="reset">
                        <q-autocomplete @search="(terms, done) => search(terms, done, 'userID')"
                                        @selected="(item, keyboard) => selected(item, 'userID', keyboard)"/>
                      </q-input>
                    </div>
                    <q-loader :visible="isProcessingSection"></q-loader>
                  </div>
                </div>
              </q-popover>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--v-if="rows.length > 1 || this.filterData.filterTerms === ''"-->
    <q-table
      :data="serverData"
      :columns="columns"
      :pagination.sync="serverPagination"
      :serverData-per-page-options="appSettings.defaulted.table_serverData_per_page_options"
      :separator="separator"
      :loading="isProcessingTable"
      @request="queryHandler"
      :visible-columns="visibleColumns"
      row-key="name"
      :color="appSettings.defaulted.table_color"
      dense
      class="bg-white shadow-1 relative-position mt-20">
      <!-- Custom renderer for "action" column with button for custom action -->
      <q-tr slot="body" slot-scope="props" :props="props" @click.native="handleSelection(props.row)" class="cursor-pointer">
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
    <q-loader :visible="isProcessingTable"></q-loader>
  </div>
</template>
<script>
  import Vue from 'vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {DatesMixin, PaginationMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'stockist-list-table',
    mixins: [DatesMixin, PaginationMixin, MasterDataTransformarMixin],
    components: {
      simplePagination,
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
        tableList: 'tableDataStockistRegistration',
        paginationQuery: 'pagination'
      })
    },
    validations: {
      filterData: {
        countryID: {
          required
        }
      }
    },
    data: function () {
      return {
        disable: true,
        serverData: [],
        show: false,
        total: 20,
        minPages: 1,
        maxPages: 1,
        rows: [],
        toggleStatus: false,
        togglePopupSearch: false,
        userID: '',
        userIDSearchTerm: '',
        filterData: {
          countryID: '',
          filterTerms: '',
          filterUserID: '',
          filterStockistStatus: 0,
          filterStockistType: 0
        },
        columns: [
          {
            label: this.$t('stockist.DTableLabel.countryCode'),
            name: 'country.code',
            field: 'country',
            sort: false,
            align: 'center',
            format (element) {
              return element !== null && element !== undefined ? element.code : '-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.stockistID'),
            name: 'stockist_number',
            field: 'stockist_number',
            align: 'center',
            sort: false
          },
          {
            label: this.$t('stockist.DTableLabel.stockistName'),
            name: 'name',
            field: 'name',
            align: 'center',
            sort: false,
            type: 'String'
          },
          {
            label: this.$t('stockist.DTableLabel.iboID'),
            name: 'member.user.old_member_id',
            field: 'member',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.country.code_iso_2 + element.user.old_member_id : '-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.iboName'),
            name: 'member.user.name',
            field: 'member',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.user.name : '-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.stockistType'),
            name: 'stockist_type',
            field: 'stockist_type',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.title : '-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.stockistStatus'),
            name: 'status',
            field: 'status',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.title : '-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.createdBy'),
            name: 'created_by.name',
            field: 'created_by',
            align: 'center',
            sort: false,
            format (element, row) {
              return element !== null && element !== undefined ? element.name : '-'
            }
          },
          {
            label: this.$t('stockist.DTableLabel.createdOn'),
            name: 'created_by.created_at',
            field: 'created_by',
            align: 'center',
            sort: false,
            type: 'Date',
            format (element, row) {
              return element !== null && element !== undefined ? element.created_at : '-'
            }
          }
        ]
      }
    },
    mounted () {
      this.master.keys = [
        'stockist_type',
        'stockist_status'
      ]
      // Clone vuex filterData to local object
      this.filterData = Object.assign({}, this.selectedFilters)
      this.setVisibleColumns(this.columns)
      this.getCountriesAction().then(() => {
        this.salesCountryChange()
      })
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getStockistListAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setRegistrationData: 'SET_STOCKIST_REGISTRATION_DATA',
        unsetRegistrationData: 'UNSET_STOCKIST_REGISTRATION_DATA'
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.filterData.countryID
        this.query.search_text = this.filterData.filterTerms
        this.query.stockist_type_id = this.filterData.filterStockistType !== null && this.filterData.filterStockistType !== '' ? this.filterData.filterStockistType : 0
        this.query.stockist_status_id = this.filterData.filterStockistStatus !== null && this.filterData.filterStockistStatus !== '' ? this.filterData.filterStockistStatus : 0
        this.getStockistListAction(this.query).then(() => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      salesCountryChange () {
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
          this.filterChange()
        } else {
          this.disable = true
        }
      },
      search (terms, done, field) {
        if (field === 'userID') {
          let query = {
            country_id: this.filterData.countryID,
            search_text: this.userIDSearchTerm,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        } else if (field === 'filterTerms') {
          let query = {
            search_text: this.filterData.filterTerms,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        }
      },
      selected (item, field, keyboard) {
        if (!keyboard) {
          this[field] = item.sublabel
          if (field === 'userID') {
            this.userID = item.userID
            this.userIDSearchTerm = item.label
            this.$refs.popover.show()
            this.togglePopupSearchSection(this.togglePopupSearch)
          } else if (field === 'filterTerms') {
            this.filterData.filterUserID = item.userID
            this.filterData.filterTerms = item.label
          }
        }
      },
      reset (action) {
      },
      filterChange () {
        this.$v.filterData.$touch()
        if (!this.$v.filterData.$error) {
          this.queryHandler(this.setDefaultPaginationAttr('stockist_list'))
        }
      },
      // Refresh table data form store state
      setUpdateTableData () {
        // tableData set by Vue.set() sp JSON.stringify is used to remove array observer the append by Vue.set()
        if (this.tableList !== null && this.tableList !== undefined) {
          this.rows = JSON.parse(JSON.stringify(this.tableList.list.data))
          this.maxPages = this.tableList.list.total
        } else {
          this.rows = []
          this.maxPages = 1
        }
      },
      handleSelection (row) {
        // handle table row selection
        this.LoadExistingStockistRegistration(row)
      },
      routePage (data) {
        this.unsetRegistrationData({userID: '', registrationID: ''})
        this.setRegistrationData(data)
        if (data.registrationID !== '') {
          this.$router.push({name: 'Stockist Update', params: {stockistUserID: data.registrationID}})
        } else {
          this.$router.push({name: 'Stockist Registration'})
        }
      },
      togglePopupSearchSection (x, status=!x) {
        this.togglePopupSearch = status
      },
      initiateStockistRegistration () {
        if (this.userID !== '' || this.invoiceID !== '') {
          let data = {
            userID: this.userID,
            registrationID: ''
          }
          this.routePage(data)
        }
      },
      LoadExistingStockistRegistration (row) {
        let data = {
          registrationID: row.stockist_user_id,
          userID: ''
        }
        this.routePage(data)
      }
    }
  }
</script>
<style lang="stylus">
  .new-order-btn
    z-index: 6000

  .custom-width-popover
    min-width 350px !important
</style>
