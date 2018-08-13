<template>
    <div class="kitting-tab">
        <table class="q-table-html cell-separator bordered fit highlight responsive">
            <thead>
            <tr class="bg-grey-2">
                <th class="text-left">Product Code</th>
                <th class="text-right">Product Name</th>
                <th class="text-right">Balance Stock</th>
                <th class="text-right">Unit CV</th>
                <th class="text-right">Unit Price ({{ currencyLabelByCountry }})</th>
            </tr>
            </thead>
            <tbody>
            <tr @click="addToCart('kitting', kitting.id)" class="cursor-pointer" v-if="typeof kittings.data !== 'undefined' && kittings.data.length > 0" v-for="kitting in kittings.data">
                <td class="text-left">{{ kitting.code }}</td>
                <td class="text-right">{{ kitting.name }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ kitting.price.base_cv }}</td>
                <td class="text-right">{{ currencyLabelByCountry }} {{ kitting.price.gmp_price_tax }}</td>
            </tr>
            <tr v-show="typeof kittings === 'undefined' || kittings.total === 0">
                <td colspan="5">
                    <empty-list></empty-list>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="row justify-end generic-margin">
            <div>
                <simple-pagination uuid="sales_kitting_search" :perPage="10" :maxPages="getMaxPages()" :paginationHandler="queryHandler"/>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import { mapState, mapGetters } from 'vuex'

  export default {
    name: 'kitting-tab',
    components: {
      EmptyList,
      qLoader,
      simplePagination
    },
    props: {
      salesData: {
        type: Object,
        required: false
      },
      memberDetails: {
        type: Object,
        required: false
      },
      queryHandler: {
        type: Function,
        required: false
      },
      addToCart: {
        type: Function,
        required: false
      }
    },
    computed: {
      ...mapState({
        kittings: state => state.salesCMP.salesProductSearchList.data.kitting
      }),
      ...mapGetters([
        'currencyLabelByCountry'
      ])
    },
    methods: {
      getMaxPages () {
        if (typeof this.kittings.data !== 'undefined' && typeof this.kittings.total !== 'undefined') {
          return this.kittings.total
        }
        return 0
      }
    }
  }
</script>