<template>
    <div class="general-page-holder relative-position">
        <general-header :genaralTitle="TitleLabel"></general-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row gutter-xs justify-between items-center">
                <div class="col-lg-3 col-md-12 col-xs-12 col-sm-12">
                    <q-search v-model="terms"
                              inverted-light
                              color="white text-black"
                              class="no-shadow custom-input-border"
                              :placeholder="$t('members.iboIbName.label')">
                        <q-autocomplete
                                :min-characters="2"
                                :max-results="7"
                                :debounce="1000"
                                @search="search"
                                @selected="selected"/>
                    </q-search>
                </div>
                <div class="col-lg-2 col-md-12 col-xs-12 col-sm-12" v-show="treeSearchFunctions">
                    <q-select
                            :placeholder="$t('Common.display.label')"
                            v-model="selectLevel"
                            inverted-light
                            color="white text-grey-6"
                            class="no-shadow custom-input-border"
                            :options="appSettings.placement.levels"
                            separator
                            @input="getMemberTreeData"
                    />
                </div>
                <div class="col-lg-3 col-md-12 col-xs-12 col-sm-12"
                     v-if="treeSearchFunctions && membersTreeData.member">
                    <q-input
                            no-parent-field
                            :value="$t('members.currentView.label') + ' : ' + membersTreeData.member[0].user.old_member_id"
                            :before="[
                                        {
                                          icon: treeMore ? 'arrow_back' : ' ',
                                          content: true,
                                          handler () {
                                            if (treeMore) {
                                              backToRootData()
                                            }
                                          }
                                        }
                                      ]"
                            readonly
                            inverted-light
                            :disable="!treeMore"
                            color="white text-black"
                            class="no-shadow custom-input-border relative-position">
                    </q-input>
                </div>
                <div class="col-lg-4 col-md-12 col-xs-12 col-sm-12" v-show="treeSearchFunctions">
                    <q-btn-group class="fit no-shadow">
                        <q-btn :icon-right="outerType === 'left' ? 'done' : ''" class="fit"
                               color="primary text-white" @click="getLOuterMembers">
                            {{ $t('Common.outerLeft.Btn') }}
                        </q-btn>
                        <q-btn :icon-right="outerType === 'right' ? 'done' : ''" class="fit"
                               color="primary text-white" @click="getROuterMembers">
                            {{ $t('Common.outerRight.Btn') }}
                        </q-btn>
                    </q-btn-group>
                </div>
            </div>
        </div>
        <div class="row justify-end">
            <div class="chart shadow-1 fit bg-white" id="memberTreeDiagram" v-show="treeDiagram"></div>
            <div class="col-12 justify-center empty-list bg-white shadow-1" v-if="!treeDiagram">
                <empty-list></empty-list>
            </div>
        </div>
        <q-loader :visible="isProcessingSection"></q-loader>
    </div>
</template>
<script>
  /* eslint-disable indent */

  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import * as d3 from 'd3'
  import {mapState, mapActions, mapMutations} from 'vuex'

  export default {
    components: {
      generalHeader,
      EmptyList,
      qLoader
    },
    data() {
      return {
        TitleLabel: 'Placement Tree Diagram',
        treeSearchFunctions: false,
        treeDiagram: false,
        nodesLDisplay: false,
        nodesRDisplay: false,
        treeMore: false,
        memberIboId: '',
        outerSearch: '',
        rootTreeData: {},
        outerType: '',
        terms: '',
        name: '',
        iboId: '',
        selectLevel: 5,
        userId: '',
        treeData: {}
      }
    },
    computed: {
      ...mapState({
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        simplePagination: state => state.globalCMP.simplePagination,
        membersTreeData: state => state.membersCMP.memberTree,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        appSettings: state => state.globalCMP.appSettings
      })
    },
    watch: {
      rootTreeData: function (val) {
        d3.selectAll('svg').remove()
        d3.select('.tooltip').remove()
        this.renderTreeGraph(val)
      }
    },
    methods: {
      // Declare vuex actions
      ...mapActions(['getMembersTreeAction', 'getMemberTreeAction', 'getMemberListingAction', 'getMemberSearchAction', 'getMembersOuterTreeAction']),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION'
      }),
      search(terms, done) {
        let query = {
          search_text: this.terms,
          verified: 3,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      // selected search member
      selected(item, keyboard) {
        if (!keyboard) {
          this.name = item.label
          this.iboId = item.value
          this.userId = item.userID
          this.getMemberTreeData()
        }
      },
      // tree data
      getMemberTreeData() {
        this.outerType = ''
        let query = {
          user_id: this.userId,
          depth: this.selectLevel
        }
        this.getMemberTreeAction(query).then(res => {
          this.treeSearchFunctions = true
          this.treeDiagram = true
          this.rootTreeData = this.membersTreeData
        })
      },
      // draw tree diagram
      renderTreeGraph: function (data) {
        // assign data to root value
        let vm = this

        var root = JSON.parse(JSON.stringify(data))
        var level = this.selectLevel

        var getRootUpdate = this.getMoreTreeData

        var zm
        var margin = {top: 20, right: 120, bottom: 20, left: 120},
          width = 960 - margin.right - margin.left,
          height = 800 - margin.top - margin.bottom,
          duration = 750,
          rectW = 200, rectH = 80

        var w = window,
          d = document,
          e = d.documentElement,
          g = d.getElementsByTagName('#memberTreeDiagram')[0],
          x = w.innerWidth || e.clientWidth || g.clientWidth,
          y = w.innerHeight || e.clientHeight || g.clientHeight

        var tree = d3.layout.tree()
          .nodeSize([200, 75])
          .separation(function separation(a, b) {
            return a.parent === b.parent ? 1 : 1
          })
        var svg = d3.select('#memberTreeDiagram').append('svg')
          .attr('preserveAspectRatio', 'xMinYMin meet')
          .attr('viewBox', '0 0 960 400')
          .call(zm = d3.behavior.zoom().scaleExtent([0.25, 2.5]).on('zoom', redraw))
          .append('g')
          .attr('transform', 'translate(' + 400 + ',' + 40 + ')' + 'scale(' + 1.00 + ')')

        // necessary so that zoom knows where to zoom and un zoom from
        zm.translate([400, 40])

        // Define the div for the tooltip
        var div = d3
          .select('#memberTreeDiagram')
          .append('div')
          .attr('class', 'tooltip')
          .style('opacity', 0)

        d3.select('#memberTreeDiagram').style('height', '800px')

        update(root)

        // update sources
        function update(source) {
          // Compute the new tree layout.
          var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes)

          // Normalize for fixed-depth.
          nodes.forEach(function (d) {
            d.y = d.depth * 100
          })

          // Update the nodes…
          var node = svg.selectAll('g.node')
            .data(nodes)

          // Enter any new nodes at the parent's previous position.
          var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .style('fill', 'whitesmoke')
            .on('mousemove', (d) => {
              if (typeof d.member !== 'undefined' && d.member !== null) {
                const mData = d.member[0]
                let html = vm.getHoverDetailsHtml(mData)
                var left = d3.event.pageX + 30
                var screenWidth = document.documentElement.clientWidth
                if ((left + 240) > screenWidth) {
                  left = screenWidth - 240 - 20
                }
                div.transition().duration(200).style('opacity', 0.9)
                div.html(html)
                  .style('left', (left) + 'px')
                  .style('top', (d3.event.pageY - 20) + 'px')
              }
            })
            .on('mouseout', function () {
              // Remove the info text on mouse out.
              div.transition()
                .duration(200)
                .style('opacity', 0)
            })

          nodeEnter.append('rect')
            .attr('width', rectW)
            .attr('height', rectH)
            .attr('x', function (d) {
              return d.children || d._children ? 0 : 0
            })
            .attr('y', function (d) {
              return d.children || d._children ? 10 : 10
            })
            .attr('rx', 10)
            .attr('ry', 10)
            .attr('class', function (d) {
              if (typeof d.member === 'undefined' || d.member === '') {
                return 'emptyNodeIcn'
              }
            })
            .style('position', 'absolute')
            .style('z-index', 1)

          nodeEnter.append('image')
            .attr('x', 70)
            .attr('y', 15)
            .attr('width', 60)
            .attr('height', 45)
            .attr('class', function (d) {
              if (typeof d.member === 'undefined' || d.member === '') {
                return 'emptyNodeIcn'
              }
            })
            .attr('xlink:href', function (d) {
              if (d.depth === level) {
                this.icon = 'arrow-down'
              } else {
                this.icon = 'add-enrol'
              }

              if (typeof d.member !== 'undefined' && d.member.length > 0) {
                const rankData = d.member[0]
                this.erIcon = ''
                if (rankData.highest_rank !== null) {
                  if (rankData.highest_rank.rank_code !== null || rankData.enrollment_rank.rank_code !== null) {
                    switch (rankData.highest_rank.rank_code) {
                      case 'BA':
                        this.icon = 'rnk_ba'
                        break
                      case 'EC':
                        this.icon = 'rnk_ec'
                        break
                      case 'ED':
                        this.icon = 'rnk_ed'
                        break
                      case 'EF':
                        this.icon = 'rnk_ef'
                        break
                      case 'PRE':
                        this.icon = 'rnk_pre'
                        break
                      case 'RC':
                        this.icon = 'rnk_rc'
                        break
                      case 'SC':
                        this.icon = 'rnk_sc'
                        break
                      case 'SD':
                        this.icon = 'rnk_sd'
                        break
                      case 'RF':
                        this.icon = 'rnk_rf'
                        break
                      case 'SF':
                        this.icon = 'rnk_sf'
                        break
                      default:
                        this.icon = 'icn_watermark-x2'
                    }
                    switch (rankData.enrollment_rank.rank_code) {
                      case 'DIAMOND':
                        this.erIcon = '-diamond-x2'
                        break
                      case 'PLATINUM':
                        this.erIcon = '-platinum-x2'
                        break
                      case 'GOLD':
                        this.erIcon = '-gold-x2'
                        break
                      case 'SILVER':
                        this.erIcon = '-silver-x2'
                        break
                      case 'PREMIER':
                        this.erIcon = '-premier-x2'
                        break
                      case 'MEMBER':
                        this.erIcon = '-member-x2'
                        break
                      default:
                        this.erIcon = ''
                    }
                  }
                } else {
                  this.icon = 'icn_watermark-x2'
                  this.erIcon = ''
                }

                if (this.icon === 'icn_watermark-x2') {
                  this.erIcon = ''
                } else if (this.erIcon === '') {
                  this.erIcon = ''
                }

                if (this.icon && this.erIcon === '') {
                  this.icon = 'icn_watermark-x2'
                  this.erIcon = ''
                }

                if (this.icon && this.erIcon === '-member-x2') {
                  this.icon = 'icn_watermark-x2'
                  this.erIcon = ''
                }

                if (this.icon && this.erIcon === '-premier-x2') {
                  this.icon = 'icn_watermark-x2'
                  this.erIcon = ''
                }

                return require('assets/tree/icons/' + this.icon + this.erIcon + '.png')
              } else {
                return require('assets/tree/icons/' + this.icon + '.png')
              }
            })
            .on('click', function (d) {
              if (typeof d.parent.member !== 'undefined' && d.parent.member !== null) {
                if (d.depth === level) {
                  getRootUpdate(d)
                }
              }
            })

          nodeEnter.append('text')
            .attr('font-size', '11px')
            .attr('x', 100)
            .attr('y', 80)
            .attr('dy', '.35em')
            .attr('class', 'about name')
            .attr('text-anchor', 'middle')
            .text(function (d) {
              if (typeof d.member !== 'undefined' && d.member !== null) {
                return d.member[0].name
              } else {
                return ''
              }
            })

          nodeEnter.append('text')
            .attr('x', 20)
            .attr('y', 25)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('class', 'flag')
            .attr('fill', '#ff992d')
            .text(function (d) {
              if (typeof d.children !== 'undefined' && d.children.length > 0) {
                for (var i in d.children) {
                  if (d.children[i]['auto_maintenance'] === 1) {
                    return 'AMT'
                  }
                }
              }
            })

          nodeEnter.append('text')
            .attr('x', 42)
            .attr('y', 25)
            .attr('dy', '.35em')
            .attr('text-anchor', 'middle')
            .attr('class', 'flag')
            .attr('fill', '#ff2d99')
            .text(function (d) {
              if (typeof d.children !== 'undefined' && d.children.length > 0) {
                for (var i in d.children) {
                  if (d.children[i]['autoship'] === 1) {
                    return 'AS'
                  }
                }
              }
            })

          nodeEnter.append('text')
            .attr('x', 100)
            .attr('y', 65)
            .attr('dy', '.35em')
            .attr('class', 'about code')
            .attr('text-anchor', 'middle')
            .text(function (d) {
              if (typeof d.member !== 'undefined' && d.member.length > 0) {
                return d.member[0].country.code + '-' + d.member[0].user.old_member_id
              } else {
                return ''
              }
            })

          // Transition nodes to their new position.
          var nodeUpdate = node.transition()
            .duration(duration)
            .attr('transform', function (d) {
              return 'translate(' + d.x + ',' + d.y + ')'
            })

          nodeUpdate.select('rect')
            .attr('width', function (d) {
              if (typeof d.member !== 'undefined' && d.member !== '') {
                return rectW
              } else {
                return '0'
              }
            })
            .attr('height', function (d) {
              if (typeof d.member !== 'undefined' && d.member !== '') {
                return rectH
              } else {
                return '0'
              }
            })
            .attr('stroke', 'white')
            .attr('stroke-width', function (d) {
              if (typeof d.member !== 'undefined' && d.member !== '') {
                return '1'
              } else {
                return '0'
              }
            })

          nodeUpdate.select('text')
            .style('fill-opacity', 1)

          // Transition exiting nodes to the parent's new position.
          var nodeExit = node.exit().transition()
            .duration(duration)
            .attr('transform', function (d) {
              return 'translate(' + source.x + ',' + source.y + ')'
            })
            .remove()

          nodeExit.select('rect')
            .attr('width', rectW)
            .attr('height', rectH)
            .attr('stroke', 'white')
            .attr('stroke-width', function (d) {
              if (typeof d.member !== 'undefined' && d.member !== '') {
                return '1'
              } else {
                return '0'
              }
            })

          nodeExit.select('text')

          // Update the links
          var link = svg.selectAll('path.link')
            .data(links)

          // Enter any new links at the parent's previous position.
          link.enter().insert('path', 'g')
            .attr('class', 'link')
            .attr('fill', 'transparent')
            .attr('stroke', 'gray')
            .attr('stroke-width', 1)
            .attr('x', rectW / 2)
            .attr('y', rectH / 2)
            .attr('d', elbow)
            .attr('rx', function (d) {
              return Math.abs(d.target.x - d.source.x) / 2
            })

          // Transition links to their new position.
          link.transition()
            .duration(duration)
            .attr('d', elbow)

          // Transition exiting nodes to the parent's new position.
          link.exit().transition()
            .duration(duration)
            .attr('d', elbow)
            .remove()
        }
        // Redraw for zoom
        function redraw() {
          svg.attr('transform',
            'translate(' + d3.event.translate + ')' + ' scale(' + d3.event.scale + ')')
        }

        function elbow(d, i) {
          return 'M' + (d.source.x + 100) + ',' + d.source.y + 'V' + d.target.y + 'H' + (d.target.x + 100) + (d.target.children ? '' : ('v' + 15))
        }

        function updateWindow() {
          x = w.innerWidth || e.clientWidth || g.clientWidth
          y = w.innerHeight || e.clientHeight || g.clientHeight
          svg.attr('width', x).attr('height', y)
        }

        window.onresize = updateWindow
      },
      // left nodes updates here
      getLOuterMembers() {
        this.outerType = 'left'
        let query = {
          user_id: this.userId,
          depth: this.selectLevel,
          outer: this.outerType
        }
        this.getMembersOuterTreeAction(query).then(res => {
          this.treeSearchFunctions = true
          this.treeDiagram = true
          this.treeMore = true
          this.rootTreeData = this.membersTreeData
        })
      },
      getROuterMembers() {
        this.outerType = 'right'
        let query = {
          user_id: this.userId,
          depth: this.selectLevel,
          outer: this.outerType
        }
        this.getMembersOuterTreeAction(query).then(res => {
          this.treeSearchFunctions = true
          this.treeDiagram = true
          this.treeMore = true
          this.rootTreeData = this.membersTreeData
        })
      },
      // get more tree data from last depth level
      getMoreTreeData(d) {
        this.outerType = ''
        let query = {
          user_id: d.parent.user_id,
          depth: this.selectLevel
        }
        this.getMemberTreeAction(query).then(res => {
          this.treeSearchFunctions = true
          this.treeDiagram = true
          this.treeMore = true
          this.rootTreeData = this.membersTreeData
        })
      },
      backToRootData() {
        this.outerType = ''
        let query = {
          user_id: this.userId,
          depth: this.selectLevel
        }
        this.getMemberTreeAction(query).then(res => {
          this.treeSearchFunctions = true
          this.treeDiagram = true
          this.treeMore = false
          this.rootTreeData = this.membersTreeData
        })
      },
      getHoverDetailsHtml (mData) {
        return `<div class="member-details">
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.MemberShipStatus.Text') }</span><span class="member-label-data">${mData.status.title}</span>
                    </div>
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.JoinDate.Text') }</span><span class="member-label-data">${mData.join_date}</span>
                    </div>
                    <div class="member-hover-details-group bg-green-1 q-py-xs">
                        <div class="member-hover-details q-ma-xs">
                            <span class="member-label">${ this.$t('Common.Member.CW.Text') } ${mData.sale_activity_status_cw.current_cw.cw_name}</span><span class="member-label-data">${mData.sale_activity_status_cw.current_cw.status.title}</span>
                        </div>
                        <div class="member-hover-details q-ma-xs">
                            <span class="member-label">${ this.$t('Common.Member.CW.Text') } ${mData.sale_activity_status_cw.previous_cw.cw_name}</span><span class="member-label-data">${mData.sale_activity_status_cw.current_cw.status.title}</span>
                        </div>
                    </div>
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.MembershipType.Text') }</span><span class="member-label-data">${mData.enrollment_rank !== null ? mData.enrollment_rank.rank_name: '-'}</span>
                    </div>
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.HighestRank.Text') }</span><span class="member-label-data">${mData.highest_rank !== null ? mData.highest_rank.rank_name : '-'}</span>
                    </div>
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.EffectiveRank.Text') }</span><span class="member-label-data">${mData.effective_rank !== null ? mData.effective_rank.rank_name : '-'}</span>
                    </div>
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.PersonalSales.Text') }</span><span class="member-label-data">${mData.personal_sales_cv}</span>
                    </div>
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.PowerLegGCV.Text') }</span><span class="member-label-data">${mData.power_leg_gcv}</span>
                    </div>
                    <div class="member-hover-details">
                        <span class="member-label">${ this.$t('Common.Member.PayLegGCV.Text') }</span><span class="member-label-data">${mData.pay_leg_gcv}</span>
                    </div>
                </div>`
      }
    },
    mounted() {
      d3.select('.tooltip').remove()
      this.renderTreeGraph(this.rootTreeData)
    }
  }
</script>
<style lang="stylus">
    .filter-holder
        padding 8px
        margin 10px 0px 10px 0px

    .node
        cursor pointer
        border 0px
        border-radius 8px
        z-index 999
        stroke-width 1.5px

    .node rect
        z-index: 1099

    .node rect:hover
        fill #fff
        stroke steelblue
        stroke-width 1px
        border 1px solid steelblue

    .node circle
        stroke steelblue
        stroke-width 1.5px

    .node text
        font 10px sans-serif
        font-weight 600

    .link
        fill none
        stroke #ccc
        stroke-width 1px

    .about.name
        fill #a0a0a0
        font 10px sans-serif
        font-weight 500

    .about.code
        fill: #181919
        font: 11px sans-serif
        font-weight: bold

    .tooltip
        opacity 0
        position fixed
        text-align left
        width 250px
        padding 10px
        font 11px sans-serif
        background #fff
        border-radius 7px
        box-shadow 0 0 6px #ccc
        border 1px solid #d6d6d6 !important
        pointer-events none
        z-index 1099

    .tooltip .member-details
        width 100%
        float left

    .tooltip .member-details div
        margin-bottom: 15px

    div.tooltip span.member-label
        width 52%
        text-align: left
        padding-right: 10px

    div.tooltip span.member-label-data
        width 46%
        float right
        font-weight bold
        text-transform uppercase

    .tooltip .member-hover-details-group .member-hover-details
        margin-bottom 3px

    .node .flag
        background #cccccc !important
        color #ffffff !important
</style>
