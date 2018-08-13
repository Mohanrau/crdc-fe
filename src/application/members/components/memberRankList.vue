<template>
    <div class="general-page-holder" :class="{'dimmed': toggleNewUpdatePopover}">
        <general-header :genaralTitle="pageTitle"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center gutter-xs justify-between">
                <div class="col-lg-10">
                    <div class="row gutter-xs items-center">
                        <div class="col-lg-4 col-md-12 col-xs-12">
                            <q-search v-model.trim="terms1"
                                      clearable
                                      inverted-light
                                      class="no-shadow custom-input-border"
                                      color="white text-black"
                                      :placeholder="$t('members.iboIbName.label')"
                                      @clear="reset">
                                <q-autocomplete
                                        :min-characters="1"
                                        :max-results="7"
                                        :debounce="appSettings.debounceDelay"
                                        @search="(terms, done) => search(terms, done, 'terms1')"
                                        @selected="(item, keyboard) => selected(item, 'terms1', keyboard)"
                                />
                            </q-search>
                        </div>
                    </div>
                </div>
                <div class="col-lg-2">
                    <div class="row full-height justify-center gutter-xs">
                        <div class="col-lg-1 gt-md">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-11 self-center z-absolute">
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
        <div class="table-holder">
            <q-table
                    :data="memberRankListData.member_rank"
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
                     v-if="typeof memberRankListData !== 'undefined' && Object.keys(memberRankListData.member).length > 0">
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">{{ memberRankListData.member.country.code
                            }}
                        </q-chip>
                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">
                            {{ memberRankListData.member.user.old_member_id }}
                        </q-chip>
                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">{{ memberRankListData.member.user.name }}
                        </q-chip>

                    </div>
                    <div class="col-lg-auto col-md-12 col-sm-12 col-xs-12 text-center">
                        <q-chip square class="fit" color="grey-1 text-light">{{ memberRankListData.member.join_date }}
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
                <q-tr slot="top-row" slot-scope="props">
                    <q-td class="bg-grey-1" align="center" colspan="2">
                        <strong>Enrollment Rank</strong>
                    </q-td>
                    <q-td class="bg-grey-1" align="center" colspan="2">
                        <strong>Highest Rank</strong>
                    </q-td>
                    <q-td class="bg-grey-1" align="center" colspan="3">
                        <strong>Details</strong>
                    </q-td>
                </q-tr>
                <q-tr slot="header" slot-scope="props" :props="props">
                    <q-th scope='col' v-for="col in props.cols" :key="col.name" :props="props">
                        {{ col.label }}
                    </q-th>
                </q-tr>
            </q-table>
        </div>
    </div>
</template>
<script>
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {PaginationMixin, DatesMixin} from 'src/application/global/mixins/index'
  import {mapState, mapActions, mapMutations} from 'vuex'

  export default {
    name: 'member-rank-list',
    components: {
      generalHeader,
      EmptyList,
      qLoader
    },
    mixins: [PaginationMixin, DatesMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessing: state => state.globalCMP.isProcessing,
        simplePagination: state => state.globalCMP.simplePagination,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        memberRankListData: state => state.membersCMP.memberRankList.list.data,
        selectedFilters: state => state.globalCMP.selectedFilters,
        appSettings: state => state.globalCMP.appSettings
      })
    },
    mounted() {
      this.setVisibleColumns(this.columns)
      if (this.selectedFilters.userID > 0 && typeof this.memberRankListData !== 'undefined') {
        this.getRankList(this.selectedFilters.userID)
      }
    },
    data: function () {
      return {
        pageTitle: 'Rank Update',
        disable: true,
        show: false,
        toggleNewUpdatePopover: false,
        terms1: '',
        terms2: '',
        localPagination: {rowsPerPage: 10, page: 1},
        columns: [
          {
            name: 'en_before',
            label: 'Before',
            field: 'previous_enrollment_rank',
            sortable: false,
            align: 'center',
            required: true,
            format(value) {
              if (value !== null) {
                return value.rank_name
              } else {
                return '-'
              }
            }
          },
          {
            name: 'en_after',
            label: 'After',
            field: 'enrollment_rank',
            align: 'center',
            sortable: false,
            required: true,
            format(value) {
              if (value !== null) {
                return value.rank_name
              } else {
                return '-'
              }
            }
          },
          {
            name: 'hg_before',
            label: 'Before',
            field: 'previous_highest_rank',
            align: 'center',
            required: true,
            sortable: false,
            format(value) {
              if (value !== null) {
                return value.rank_name
              } else {
                return '-'
              }
            }
          },
          {
            name: 'hg_after',
            label: 'After',
            field: 'highest_rank',
            sortable: false,
            align: 'center',
            required: true,
            format(value) {
              if (value !== null) {
                return value.rank_name
              } else {
                return '-'
              }
            }
          },
          {
            name: 'effective_cw',
            label: 'Effective CW',
            field: 'cw_schedule',
            sortable: false,
            align: 'center',
            required: true,
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
            label: 'Created Date',
            field: 'created_at',
            sortable: true,
            align: 'left',
            format(value) {
              if (value !== null) {
                return value
              } else {
                return '-'
              }
            }
          },
          {
            name: 'created_by',
            label: 'Created By',
            field: 'created_by',
            sortable: false,
            align: 'left',
            format(value) {
              if (value !== null) {
                return value.name
              } else {
                return '-'
              }
            }
          }
        ],
        userId: '',
        showing: false
      }
    },
    methods: {
      ...mapActions([
        'getMemberSearchAction',
        'getMemberRankListDataAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        resetRankList: 'SET_MEMBER_RANK_LIST_DATA'
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
            this.getRankList()
          } else if (field === 'terms2') {
            this.$refs.popover.show()
          }
        }
      },
      getRankList(id) {
        let query = {
          user_id: id ? this.selectedFilters.userID : this.userId,
          order: 'desc'
        }
        this.getMemberRankListDataAction(query)
      },
      reset() {
        let clear = {
          data: {
            data: {
              member: {},
              member_rank: []
            }
          }
        }
        this.resetRankList(clear)
        this.terms2 = ''
        this.unSetFilterData({userID: ''})
      },
      toggleNewUpdatePopoverSection(x) {
        this.toggleNewUpdatePopover = !x
      },
      routePage(data) {
        this.unSetFilterData({userID: ''})
        if (data === 'update' && this.userId !== '' && this.terms2 !== '') {
          this.setFilterData({userID: this.userId})
          this.$router.push({name: 'Member Rank Update'})
        }
      }
    }
  }
</script>