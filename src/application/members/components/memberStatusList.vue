<template>
    <div class="general-page-holder" :class="{'dimmed': toggleNewUpdatePopover}">
        <general-header :genaralTitle="pageTitle"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center gutter-xs justify-between">
                <div class="col-lg-10 col-md-12 col-sm-12 col-xs-12">
                    <div class="row gutter-xs">
                        <div class="col-lg-4 col-md-12 col-xs-12">
                            <q-search v-model.trim="terms1"
                                      clearable
                                      :placeholder="$t('members.iboIbName.label')"
                                      inverted-light
                                      class="no-shadow custom-input-border"
                                      color="white text-black"
                                      @clear="reset">
                                <q-autocomplete
                                        :min-characters="1"
                                        :max-results="7"
                                        :debounce="1000"
                                        @search="(terms, done) => search(terms, done, 'terms1')"
                                        @selected="(item, keyboard) => selected(item, 'terms1', keyboard)"
                                />
                            </q-search>
                        </div>
                        <div class="col-lg-3 col-md-12 col-xs-12">
                            <q-select
                                    :disable="terms1 === ''"
                                    clearable
                                    :options="masterDataOptionsCreator('member_status')"
                                    v-model="statusType"
                                    :placeholder="$t('members.search.byStatus')"
                                    inverted-light
                                    class="no-shadow custom-input-border"
                                    color="white text-black"
                                    :filterPlaceholder="$t('members.search.byStatus.placeholder')"
                                    @input="searchChange"
                            ></q-select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2 col-md-12 col-xs-12">
                    <div class="row full-height justify-center gutter-xs">
                        <div class="col-lg-1 gt-md">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-11 col-md-12 col-sm-12 col-xs-12 self-center z-absolute">
                            <q-btn class="full-width" :class="{'new-update-btn fit' : toggleNewUpdatePopover}"
                                   color="primary" :icon="!toggleNewUpdatePopover ? 'add' : 'close'">
                                {{ !toggleNewUpdatePopover ? $t('Common.NewUpdate.Btn') : $t('Common.Cancel.Btn')}}
                            </q-btn>
                            <q-popover ref="popover"
                                       @show="toggleNewUpdatePopoverSection(toggleNewUpdatePopover)"
                                       @hide="toggleNewUpdatePopoverSection(toggleNewUpdatePopover)"
                                       anchor="bottom right"
                                       self="top right"
                                       fit>
                                <div class="row">
                                    <div class="col-12 pd-20 custom-width-popover relative-position">
                                        <div>
                                            <q-input v-model.trim="terms2"
                                                     clearable
                                                     @keyup.enter="routePage('update')"
                                                     inverted-light
                                                     class="no-shadow custom-input-border"
                                                     color="white text-black"
                                                     :placeholder="$t('members.iboIbName.placeholder.label')"
                                                     :after="[{icon: 'chevron_right', handler () { routePage('update') }}]"
                                            >
                                                <q-autocomplete
                                                        @search="(terms, done) => search(terms, done, 'terms2')"
                                                        @selected="(item, keyboard) => selected(item, 'terms2', keyboard)"/>
                                            </q-input>
                                        </div>
                                    </div>
                                </div>
                            </q-popover>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-holder" v-if="memberStatusListData.member_status !== 'undefined'">
            <q-table
                    :data="memberStatusListData.member_status"
                    :columns="columns"
                    :separator="separator"
                    :loading="isProcessingTable"
                    :pagination.sync="localPagination"
                    :visible-columns="visibleColumns"
                    :color="appSettings.defaulted.table_color"
                    :rows-per-page-options="appSettings.defaulted.table_rows_per_page_options"
                    row-key="name"
                    dense
                    class="bg-white"
            >
                <div slot="top-left" slot-scope="props" class="row gutter-xs"
                     v-if="typeof memberStatusListData !== 'undefined' && Object.keys(memberStatusListData.member).length > 0">
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">{{ memberStatusListData.member.country.code
                            }}
                        </q-chip>
                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">
                            {{ memberStatusListData.member.user.old_member_id }}
                        </q-chip>
                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">{{ memberStatusListData.member.user.name }}
                        </q-chip>

                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">{{ memberStatusListData.member.join_date }}
                        </q-chip>
                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-btn color="negative" icon="close" @click="reset"></q-btn>
                    </div>
                </div>
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
    </div>
</template>
<script>
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import generalHeader from '../../global/components/common/header/generalHeader'
  import {MasterDataTransformarMixin, PaginationMixin} from 'src/application/global/mixins/index'
  import {mapState, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'member-rank-list',
    mixins: [MasterDataTransformarMixin, PaginationMixin],
    components: {
      generalHeader,
      EmptyList
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessing: state => state.globalCMP.isProcessing,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        memberStatusListData: state => state.membersCMP.memberStatusList.list.data,
        appSettings: state => state.globalCMP.appSettings,
        selectedFilters: state => state.globalCMP.selectedFilters
      })
    },
    data: () => ({
      pageTitle: 'Status Update',
      disable: true,
      terms1: '',
      terms2: '',
      statusType: '',
      localPagination: {rowsPerPage: 10, page: 1},
      columns: [
        {
          name: 'previous_status',
          label: 'Previous Status',
          field: 'previous_status',
          sortable: false,
          align: 'center',
          required: true,
          format(value) {
            if (value !== null) {
              return value.title
            } else {
              return '-'
            }
          }
        },
        {
          name: 'status',
          label: 'Current Status',
          field: 'status',
          sortable: false,
          align: 'center',
          required: true,
          format(value) {
            if (value !== null) {
              return value.title
            } else {
              return '-'
            }
          }
        },
        {
          name: 'suspended_duration',
          label: 'Suspended Duration',
          field: 'suspend',
          sortable: false,
          align: 'center',
          required: false,
          format(value) {
            if (value !== null) {
              return value
            } else {
              return '-'
            }
          }
        },
        {
          name: 'effective_date',
          label: 'Effective Date',
          field: 'effective_date',
          sortable: false,
          align: 'center',
          required: true,
          format(value) {
            if (value !== null) {
              return value
            } else {
              return '-'
            }
          }
        },
        {
          name: 'effective_cw_date',
          label: 'Effective CW',
          field: 'effective_date_cw_schedule',
          sortable: false,
          align: 'center',
          required: false,
          format(value) {
            if (value !== null) {
              return value.cw_name
            } else {
              return '-'
            }
          }
        },
        {
          name: 'created_at',
          label: 'Created At',
          field: 'created_at',
          sortable: true,
          align: 'center',
          required: false
        },
        {
          name: 'created_by',
          label: 'Created By',
          field: 'created_by',
          sortable: false,
          align: 'center',
          required: false,
          format(value) {
            if (value !== null) {
              return value.name
            } else {
              return '-'
            }
          }
        },
      ],
      toggleNewUpdatePopover: false
    }),
    mounted() {
      this.master.keys = ['member_status']
      this.setVisibleColumns(this.columns)
      if (this.selectedFilters.userID > 0 && typeof this.memberStatusListData.member !== 'undefined') {
        this.queryHandler()
      }
    },
    methods: {
      ...mapActions([
        'getmemberStatusingListAction', 'getMemberSearchAction', 'getMemberStatusListDataAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        resetStatusList: 'SET_MEMBERS_STATUS_LIST'
      }),
      search(terms, done, field) {
        let query = {
          search_text: this[field],
          verified: 3,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      // selected search member
      selected(item, field, keyboard) {
        if (!keyboard) {
          this.setFilterData({
            userID: item.userID
          })
          this.name = item.label
          this.iboId = item.value
          this.userId = item.userID
          if (field === 'terms1') {
            this.terms2 = item.sublabel
            this.searchChange()
          } else if (field === 'terms2') {
            this.$refs.popover.show()
          }
        }
      },
      queryHandler() {
        let query = {
          user_id: this.selectedFilters.userID,
          status_id: this.statusType,
          order: 'desc'
        }
        this.getMemberStatusListDataAction(query)
      },
      searchChange() {
        this.queryHandler()
      },
      reset() {
        let clear = {
          data: {
            data: {
              member: {},
              member_status: []
            }
          }
        }
        this.resetStatusList(clear)
        this.terms2 = ''
        this.statusType = ''
        this.unSetFilterData({userID: ''})
      },
      toggleNewUpdatePopoverSection(x) {
        this.toggleNewUpdatePopover = !x
      },
      routePage(data) {
        if (data === 'update' && this.terms2 !== '') {
          this.$router.push({name: 'Member Status Update'})
        }
      }
    }
  }
</script>