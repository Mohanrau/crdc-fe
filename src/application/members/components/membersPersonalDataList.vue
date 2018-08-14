<template>
    <div class="general-page-holder">
        <general-header></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row gutter-xs items-baseline">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="row gutter-xs">
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-input clearable
                                     v-model="filterData.filterTerms"
                                     inverted-light
                                     class="no-shadow custom-input-border"
                                     color="white text-black"
                                     placeholder="User Filters">
                            </q-input>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-select
                                    clearable
                                    :options="[
                                      {value: 0,label: $t('Common.Filters.Failed.Text')},
                                      {value: 1,label: $t('Common.Filters.Passed.Text')},
                                      {value: 2,label: $t('Common.Filters.Pending.Text')}
                                    ]"
                                    v-model="filterData.filterIcVerifiedStatus"
                                    inverted-light
                                    class="no-shadow custom-input-border"
                                    color="white text-black"
                                    :placeholder="$t('members.IC.verificationStatus')"
                            />
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
                <!-- Custom renderer for "action" column with button for custom action -->
                <q-tr slot="body" slot-scope="props" :props="props" @click.native="routePage(props.row)"
                      class="cursor-pointer">
                    <q-td v-for="col in props.cols" :key="col.name" :props="props">
                        <span v-if="col.name === 'sponsor.code'">
                            {{ objectDeepKeyChecker(props.row, 'sponsor.parent.member.user.old_member_id', '-') }}
                        </span>
                        <span v-else-if="col.name === 'sponsor.name'">
                            {{ objectDeepKeyChecker(props.row, 'sponsor.parent.member.user.name', '-') }}
                        </span>
                        <span v-else-if="col.name === 'sponsor.name'">
                            {{ objectDeepKeyChecker(props.row, 'sponsor.parent.member.user.name', '-') }}
                        </span>
                        <span v-else-if="col.name === 'status'">
                            <span :class="col.value[0]">{{ col.value[1] }}</span>
                        </span>
                        <span v-else-if="col.name === 'ic_pass_verified'">
                            <span :class="col.value[0]">{{ col.value[1] }}</span>
                        </span>
                        <span v-else-if="col.name === 'enroll_from_received'">
                            <span :class="col.value[0]">{{ col.value[1] }}</span>
                        </span>
                        <span v-else="">
                            {{ col.value }}
                        </span>
                    </q-td>
                </q-tr>
                <template slot="top-right" slot-scope="props">
                    <q-table-columns
                            label="Settings"
                            class="q-mr-sm"
                            v-model="visibleColumns"
                            :columns="columns"
                    />
                    <q-select
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
    </div>
</template>
<script>
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {PaginationMixin, MasterDataTransformarMixin, GeneralsMixin} from 'src/application/global/mixins/index'
  import _ from 'lodash'
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'member-personal-data-list',
    components: {
      generalHeader,
      qLoader
    },
    mixins: [PaginationMixin, MasterDataTransformarMixin, GeneralsMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessing: state => state.globalCMP.isProcessing,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        selectedFilters: state => state.globalCMP.selectedFilters
      }),
      ...mapGetters({
        tableList: 'tableMemberList',
        compareCountry: 'compareCountry'
      })
    },
    watch: {
      filterData: {
        handler() {
          this.searchChange()
        },
        deep: true
      }
    },
    created() {
      this.filterData = Object.assign({}, this.selectedFilters)
    },
    mounted() {
      // Clone vuex filterData to local object
      this.setVisibleColumns(this.columns)
      this.getCountriesAction().then(() => {
        this.filterCountryOptions()
      })
    },
    data: function () {
      return {
        statusValue: '',
        serverData: [],
        mixedFilterOptions: [
          {value: 1, label: this.$t('Common.Filters.WithoutSponsor.Text')},
          {value: 2, label: this.$t('Common.Filters.WithoutPlacement.Text')},
          {value: 3, label: this.$t('Common.Filters.WithoutSponsorAndPlacement.Text')}
        ],
        filterData: {
          countryID: '',
          filterTerms: '',
          filterIcVerifiedStatus: 2,
          filterMixedFilters: null
        },
        columns: [
          {
            name: 'country',
            label: this.$t('members.DTableLabel.countryCode'),
            field: 'country',
            classes: 'text-center',
            sortable: true,
            format(value) {
              if (value !== '') {
                for (var i in value) {
                  return value['code']
                }
              } else {
                value = '-'
              }
              return value
            }
          },
          {
            name: 'user',
            label: this.$t('members.iboId.label'),
            field: 'user',
            classes: 'text-center',
            sortable: true,
            format(value) {
              if (value !== '') {
                for (var i in value) {
                  return value['old_member_id']
                }
              } else {
                value = '-'
              }
              return value
            }
          },
          {
            name: 'name',
            label: this.$t('members.iboName.label'),
            field: 'name',
            sortable: true
          },
          {
            name: 'sponsor.code',
            label: this.$t('members.DTableLabel.sponsorCode'),
            field: 'sponsor',
            sortable: true
          },
          {
            name: 'sponsor.name',
            label: this.$t('members.DTableLabel.sponsorName'),
            field: 'sponsor'
          },
          {
            name: 'enrollment_rank',
            label: this.$t('members.DTableLabel.memberType'),
            field: 'enrollment_rank',
            classes: 'text-center',
            sortable: true,
            format(value) {
              if (value !== '') {
                for (var i in value) {
                  return value['rank_name']
                }
              } else {
                value = '-'
              }
              return value
            }
          },
          {
            name: 'status',
            label: this.$t('members.DTableLabel.memberValidity'),
            field: 'status',
            classes: 'text-center',
            sortable: true,
            format(value) {
              if (value !== '' && value !== null) {
                switch (value['title']) {
                  case 'Active':
                    this.statusValue = 'text-positive.' + value['title']
                    break
                  case 'Inactive':
                    this.statusValue = 'text-negative.' + value['title']
                    break
                  case 'Resign':
                    this.statusValue = 'text-warning.' + value['title']
                    break
                  case 'Terminate':
                    this.statusValue = 'text-faded.' + value['title']
                    break
                  case 'Suspend':
                    this.statusValue = 'text-red.' + value['title']
                    break
                  case 'Expire':
                    this.statusValue = 'text-negative.' + value['title']
                    break
                  default:
                    this.statusValue = 'text-warning.' + value['title']
                }
                return this.statusValue.split('.')
              } else {
                return '-'
              }
            }
          },
          {
            name: 'ic_pass_verified',
            label: this.$t('members.DTableLabel.icVerfication'),
            field: 'ic_pass_verified',
            classes: 'text-center',
            sortable: true,
            format(value) {
              if (value !== null && value === 0) {
                return 'text-negative.Failed'.split('.')
              } else if (value !== null && value === 1) {
                return 'text-positive.Passed'.split('.')
              } else if (value !== null && value === 2) {
                return 'text-warning.Pending'.split('.')
              } else {
                return 'text-warning.Pending'.split('.')
              }
            }
          },
          {
            name: 'enroll_from_received',
            label: this.$t('members.DTableLabel.EnrolFormReceived'),
            field: 'enroll_from_received',
            classes: 'text-center',
            sortable: true,
            format(value) {
              if (value !== null && value === 1) {
                return 'text-positive.Yes'.split('.')
              } else {
                return 'text-negative.No'.split('.')
              }
            }
          },
          {
            name: 'created_by',
            label: this.$t('Common.DTableLabel.CreatedBy'),
            field: 'created_by',
            classes: 'text-center',
            sortable: true,
            format(value) {
              if (value !== '') {
                for (var i in value) {
                  return value['name']
                }
              } else {
                value = ''
              }
              return value
            }
          }
        ]
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getMemberListingAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      objectDeepKeyChecker(obj, val, defaultVal) {
        return _.get(obj, val, defaultVal)
      },
      searchChange() {
        this.setFilterData({
          countryID: this.filterData.countryID,
          filterTerms: this.filterData.filterTerms,
          filterIcVerifiedStatus: this.filterData.filterIcVerifiedStatus,
          filterMixedFilters: this.filterData.filterMixedFilters
        })
        this.filterCountryOptions()
        this.queryHandler(this.setDefaultPaginationAttr('members'))
      },
      // Query is optional parameterIC
      queryHandler(data) {
        this.query = this.processQueryData(data)
        this.query.country_id = this.filterData.countryID
        this.query.search_text = this.filterData.filterTerms
        this.query.verified = this.filterData.filterIcVerifiedStatus
        this.query.active = -1
        this.query.mixed_filters = this.filterData.filterMixedFilters
        // using lodash to remove null and undefined att
        this.getMemberListingAction(this.removeFalsyValues(this.query)).then(() => {
          // Remove observers
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      clearFilterData() {
        // Clearing local filters
        this.filterData.countryID = 0
        // Clear vuex filters
        this.setFilterData(this.filterData)
      },
      routePage(data) {
        this.$router.push({name: 'Member Setup', params: {memberID: data.user_id}})
      },
      filterCountryOptions() {
        if (this.compareCountry(this.filterData.countryID, 'TW')) {
          let checkMixedFilterIndex = this.mixedFilterOptions.findIndex((x) => x.value === 0)
          if (checkMixedFilterIndex === -1) {
            this.mixedFilterOptions.push({value: 0, label: this.$t('Common.Filters.WithoutEnrolForm.Text')})
          }
        } else {
          let removeMixedFilterIndex = this.mixedFilterOptions.findIndex((x) => x.value === 0)
          if (removeMixedFilterIndex !== -1) {
            if (this.filterData.filterMixedFilters === 0) {
              this.filterData.filterMixedFilters = null
            }
            this.mixedFilterOptions.splice(removeMixedFilterIndex, 1)
          }
        }
      }
    }
  }
</script>