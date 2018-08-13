<template>
    <div class="sales-history-tab">
        <div class="content" v-if="memberData.sales_history.length > 0">
            <div class="row gutter-sm">
                <div class="col-lg-12 relative-position">
                    <table class="q-table bordered cell-separator fit responsive">
                        <thead>
                        <th v-for="th in tableTh">{{ th }}</th>
                        </thead>
                        <tbody>
                        <tr v-for="row in memberData.sales_history">
                            <td :data-th="tableTh[0]">{{ row }}</td>
                            <td :data-th="tableTh[1]">{{ row }}</td>
                            <td :data-th="tableTh[2]">{{ row }}</td>
                            <td :data-th="tableTh[3]">{{ row }}</td>
                            <td :data-th="tableTh[4]">{{ row }}</td>
                            <td :data-th="tableTh[5]">{{ row }}</td>
                            <td :data-th="tableTh[6]">{{ row }}</td>
                            <td :data-th="tableTh[7]">{{ row }}</td>
                            <td :data-th="tableTh[8]">{{ row }}</td>
                            <td :data-th="tableTh[9]">{{ row }}</td>
                            <td :data-th="tableTh[10]">{{ row }}</td>
                            <td :data-th="tableTh[11]">{{ row }}</td>
                        </tr>
                        </tbody>
                    </table>
                    <q-loader :visible="isProcessingList"></q-loader>
                </div>
            </div>
        </div>
        <div class="empty">
            <empty-list></empty-list>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'sales-history-tab',
    components: {
      EmptyList,
      qLoader
    },
    props: {
      memberData: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingList: state => state.globalCMP.isProcessingList,
        tabsData: state => state.membersCMP.memberTabs.data
      })
    },
    mounted () {
      let query = [
        'sales_history'
      ]
      this.getMemberTabsData(query).then(res => {
        if (typeof this.tabsData.sales_history !== 'undefined') {
          Object.assign(this.memberData.sales_history, this.tabsData.sales_history)
        }
      })
    },
    methods: {
      ...mapActions([
        'getMemberTabsData'
      ])
    },
    data: () => ({
      tableTh: [
        'Country',
        'Invoice No.',
        'Ref No.',
        'Bonus Month',
        'Invoice Date',
        'Order Status',
        'Type',
        'CV',
        'Currency',
        'Amount',
        'Logistics',
        'Tracking NO.'
      ]
    })
  }
</script>