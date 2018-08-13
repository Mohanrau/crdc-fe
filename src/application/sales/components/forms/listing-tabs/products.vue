<template>
    <div class="products-tab">
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
            <tr @click="addToCart('product', product.id)" class="cursor-pointer" v-if="typeof products.data !== 'undefined' && products.data.length > 0" v-for="product in products.data">
                <td class="text-left">{{ product.sku }}</td>
                <td class="text-right">{{ product.name }}</td>
                <td class="text-right">0</td>
                <td class="text-right">{{ product.price.base_cv }}</td>
                <td class="text-right">{{ currencyLabelByCountry }} {{ product.price.gmp_price_tax }}</td>
            </tr>
            <tr v-show="typeof products === 'undefined' || typeof products.total === 'undefined' || products.total === 0">
                <td colspan="5">
                    <empty-list></empty-list>
                </td>
            </tr>
            </tbody>
        </table>
        <div class="row justify-end generic-margin">
            <div>
                <simple-pagination uuid="sales_product_search" :perPage="10" :maxPages="getMaxPages()" :paginationHandler="queryHandler"/>
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
    name: 'products-tab',
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
        products: state => state.salesCMP.salesProductSearchList.data.products
      }),
      ...mapGetters([
        'currencyLabelByCountry'
      ])
    },
    methods: {
      getMaxPages () {
        if (typeof this.products.data !== 'undefined' && typeof this.products.total !== 'undefined') {
          return this.products.total
        }
        return 0
      }
    }
  }
</script>
