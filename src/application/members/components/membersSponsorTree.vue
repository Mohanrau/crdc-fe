<template>
    <div class="general-page-holder">
        <general-header genaralTitle="Sponsor & Placement Tree"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row gutter-xs">
                <div class="col-12">
                    <div class="row gutter-xs items-center">
                        <div class="col-lg-5">
                            <q-search v-model="terms"
                                      inverted-light
                                      class="no-shadow custom-input-border"
                                      color="white text-grey-6"
                                      :placeholder="$t('members.iboIbName.label')"
                                      clearable
                                      @input="resetTree">
                                <q-autocomplete @search="search" @selected="selected"/>
                            </q-search>
                        </div>
                        <div class="col-auto">
                            <q-option-group
                                    inline
                                    color="secondary"
                                    type="radio"
                                    v-model="tree_type"
                                    @input="getMemberMultiFunctionalTree"
                                    :options="[
      { label: $t('members.sponsorTree.title'), value: 'sponsor' },
      { label: $t('members.placementTree.label'), value: 'placement' }
    ]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="data-holder">
            <div class="row gutter-xs">
                <div class="col-12">
                    <div class="row gutter-xs">
                        <div class="col-lg-9 col-md-12 col-sm-12 col-xs-12 q-tree-drag">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 bg-white shadow-1 pd-10">
                                    <q-tabs inverted color="grey-7" align="left">
                                        <q-tab default name="downlines" slot="title"
                                               :label="$t('members.sponsorDownlines.label')"/>
                                        <q-tab name="uplines" slot="title"
                                               :label="$t('members.sponsorUplines.label')"/>
                                        <!-- Tab Content -->
                                        <q-tab-pane name="downlines" class="no-border relative-position">
                                            <!-- Downlines Content-->
                                            <q-scroll-area style="height:75vh; min-height: 75vh;"
                                                           :thumb-style="{
                                                                right: '4px',
                                                                borderRadius: '5px',
                                                                background: '#f263b7',
                                                                width: '5px',
                                                                opacity: 1
                                                              }"
                                                           :delay="1500">
                                                <tree v-if="typeof memberMultiFunctionTreeData !== 'undefined' && Object.keys(memberMultiFunctionTreeData).length > 0 && typeof memberMultiFunctionTreeData.downlines !== 'undefined' &&  memberMultiFunctionTreeData.downlines.length > 0"
                                                      :tree="memberMultiFunctionTreeData"></tree>
                                                <div class="empty-list-holder" v-else="">
                                                    <empty-list></empty-list>
                                                </div>
                                            </q-scroll-area>
                                            <!-- Downlines Content End -->
                                            <q-loader :visible="isProcessingSection"></q-loader>
                                        </q-tab-pane>
                                        <q-tab-pane name="uplines" class="no-border relative-position">
                                            <!-- Uplines Content-->
                                            <q-scroll-area style="height: 75vh; max-height: 75vh;" :thumb-style="{
                                                                right: '4px',
                                                                borderRadius: '5px',
                                                                background: '#f263b7',
                                                                width: '5px',
                                                                opacity: 1
                                                              }"
                                                           :delay="1500">
                                                <tree-table
                                                        v-if="typeof memberMultiFunctionTreeData !== 'undefined' && Object.keys(memberMultiFunctionTreeData).length > 0"
                                                        :list="memberMultiFunctionTreeData.uplines"></tree-table>
                                                <div class="empty-list-holder" v-else="">
                                                    <empty-list></empty-list>
                                                </div>
                                            </q-scroll-area>
                                            <!-- Uplines Content End -->
                                            <q-loader :visible="isProcessingSection"></q-loader>
                                        </q-tab-pane>
                                    </q-tabs>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-3 col-md-12 col-sm-12 col-xs-12">
                            <q-scroll-area style="height: 89vh; min-height: 89vh;"
                                           :thumb-style="{
                                                            right: '4px',
                                                            borderRadius: '5px',
                                                            background: '#f263b7',
                                                            width: '5px',
                                                            opacity: 1
                                                          }"
                                           :delay="1500">
                                <div class="row gutter-xs">
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <personal-info-section class="bg-white shadow-1 pd-10"
                                                               :personalData="memberMultiFunctionTreeData"></personal-info-section>
                                    </div>
                                    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <legend-section class="bg-white shadow-1 pd-10"></legend-section>
                                    </div>
                                </div>
                            </q-scroll-area>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import PersonalInfoSection from 'src/application/global/components/tree/memberTreePersonalInfoSection'
  import LegendSection from 'src/application/global/components/tree/memberSponsorTreeLegendSection'
  import Tree from '../../global/components/tree/memberSponsorTree'
  import TreeTable from '../../global/components/tree/memberSponsorTreeTable'
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import { mapState, mapActions, mapMutations } from 'vuex'

  $(function () {
    var curDown = false,
      curYPos = 0,
      curXPos = 0
    $('.q-tree-drag').mousemove(function (m) {
      if (curDown === true) {
        $('.q-tree').scrollTop($('.q-tree').scrollTop() + (curYPos - m.pageY))
        $('.q-tree').scrollLeft($('.q-tree').scrollLeft() + (curXPos - m.pageX))
      }
    })

    $('.q-tree-drag').mousedown(function (m) {
      curDown = true
      curYPos = m.pageY
      curXPos = m.pageX
    })

    $('.q-tree-drag').mouseup(function () {
      curDown = false
    })
  })

  export default {
    components: {
      generalHeader,
      qLoader,
      PersonalInfoSection,
      LegendSection,
      Tree,
      TreeTable,
      EmptyList
    },
    computed: {
      ...mapState({
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        membersTreeData: state => state.membersCMP.memberTree,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        memberMultiFunctionTreeData: state => state.membersCMP.memberMultiFunctionTreeData.list
      })
    },
    data: () => ({
      user_id: null,
      terms: '',
      selectedLevel: 20,
      tree_type: 'sponsor'
    }),
    methods: {
      ...mapActions([
        'getMemberMultiFunctionalTreeAction',
        'getMemberSearchAction'
      ]),
      ...mapMutations({
        setMemberMultiFunctionTreeData: 'SET_MEMBERS_MULTI_FUNCTIONAL_TREE'
      }),
      search (terms, done) {
        let query = {
          search_text: this.terms,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      selected (item, keyboard) {
        if (!keyboard) {
          this.user_id = item.userID
          this.getMemberMultiFunctionalTree()
        }
      },
      getMemberMultiFunctionalTree () {
        if (this.user_id !== '' && this.user_id !== null && this.user_id > 0) {
          let query = {
            user_id: this.user_id,
            depth: this.selectedLevel,
            tree_type: this.tree_type
          }
          this.getMemberMultiFunctionalTreeAction(query)
        }
      },
      resetTree (val) {
        if (val === '') {
          let list = {}
          this.user_id = null
          this.tree_type = 'sponsor'
          this.setMemberMultiFunctionTreeData(list)
        }
      }
    },
    beforeDestroy () {
      let list = {}
      this.user_id = null
      this.tree_type = 'sponsor'
      this.setMemberMultiFunctionTreeData(list)
    }
  }
</script>
<style lang="stylus">
    .filter-holder
        padding 8px
        margin 10px 0px 10px 0px
</style>
