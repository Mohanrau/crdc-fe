<template>
    <li class="q-tree-item tree-li">
        <div class="member-info-holder row inline items-center"
             :class="{'q-tree-link': isExpandable}">
            <div class="q-tree-label relative-position row items-center" @click="tap" v-ripple.mat="isExpandable">
                    <span v-if="isExpandable" class="on-right">
                        <i class="material-icons">{{ open ? 'remove' : 'add' }}</i>
                    </span>
                <span class="on-right" v-else="">
                        <i class="material-icons">&nbsp;&nbsp;&nbsp;&nbsp;</i>
                    </span>
                <span :title="model.sales_activity_status.title" v-if="model.depth !== null && model.depth > 0"
                      class="text-white text-center status-rounded"
                      v-bind:style="{ backgroundColor: model.sales_activity_status.title === 'ACTIVE' ? '#57d816' : model.sales_activity_status.title === 'INACTIVE' ? '#e8373a' : '#726a63'}">
                        {{ model.depth !== '' || model.depth !== null ? model.depth : 0}}</span>
                <span v-else="" class="text-white text-center status-rounded bg-blue-10"><q-icon
                        name="person"></q-icon></span>
                <span>{{ model.ibo_id }}</span>&nbsp;<span>({{ model.ibo_name }})</span>
            </div>
            <div class="member-extra-info-holder">
                <div class="row text-white text-center" @click="tap">
                    <div :title="colorCodes[0].title" v-bind:style="{ backgroundColor: colorCodes[0].color}"
                         class="pd-5 col-auto">
                        {{ typeof model.total_direct_downlines !== 'undefined' ? model.total_direct_downlines : 0 }}
                    </div>
                    <div :title="colorCodes[1].title" v-bind:style="{ backgroundColor: colorCodes[1].color}"
                         class="pd-5 col-auto">
                        {{ typeof model.total_downlines !== 'undefined' ? model.total_downlines : 0 }}
                    </div>
                    <div :title="colorCodes[2].title" v-bind:style="{ backgroundColor: colorCodes[2].color}"
                         class="pd-5 uppercase">
                        {{ model.highest_rank !== null && model.highest_rank.rank_name !== null ? model.highest_rank.rank_name : '-- No Rank --'
                        }}
                    </div>
                    <div :title="colorCodes[3].title" v-bind:style="{ backgroundColor: colorCodes[3].color}"
                         class="pd-5 col-auto">
                        {{ typeof model.expiry_date !== 'undefined' ? model.expiry_date : 'YYYY-MM-DD' }}
                    </div>
                    <div :title="colorCodes[4].title" v-bind:style="{ backgroundColor: colorCodes[4].color}"
                         class="pd-5 col-auto">
                        {{ typeof model.total_active_left_downlines !== 'undefined' ? model.total_active_left_downlines : 0
                        }}
                    </div>
                    <div :title="colorCodes[5].title" v-bind:style="{ backgroundColor: colorCodes[5].color}"
                         class="pd-5 col-auto">
                        {{ typeof model.total_active_right_downlines !== 'undefined' ? model.total_active_right_downlines : 0
                        }}
                    </div>
                </div>
            </div>
        </div>
        <q-slide-transition>
            <ul v-show="isExpandable && open">
                <item v-for="(model, index) in model.children"
                      :key="index"
                      :model="model">
                </item>
            </ul>
        </q-slide-transition>
    </li>
</template>
<script>
  import { extend } from 'quasar'

  export default {
    name: 'item',
    props: {
      model: Object
    },
    data () {
      return {
        item: extend({
          expanded: false,
          children: []
        }, this.model),
        open: false,
        colorCodes: [
          {color: '#f2528d', title: 'Number of Direct Downline'},
          {color: '#029dd6', title: 'Number of Total Downline'},
          {color: '#0892a0', title: 'Highest Rank'},
          {color: '#08b363', title: 'Expiry Date'},
          {color: '#ff7900', title: 'Total Active Left Downlines'},
          {color: '#726a63', title: 'Total Active Right Downlines'}
        ]
      }
    },
    watch: {
      model (value) {
        this.item = extend({
          expanded: false,
          children: []
        }, value)
      }
    },
    computed: {
      isExpandable () {
        return this.item.children && this.item.children.length > 0
      }
    },
    methods: {
      tap () {
        this.toggle()
      },
      toggle () {
        this.open = !this.open
      }
    }
  }
</script>
<style lang="stylus">
    .status-rounded
        background-color inherit
        width 25px
        height 25px
        margin 5px
        border-radius 25px
        line-height 25px
        display inline-block

    .tree-li
        cursor pointer !important
        padding 0px 0px 0px 0px !important

    .q-tree li:hover::before
        border-left 1px solid red

    .q-tree li:hover::after
        border-top: 1px solid red
</style>