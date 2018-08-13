<template>
    <div class="products-tab">
        <table class="q-table-html cell-separator bordered fit highlight responsive">
            <thead>
            <tr class="bg-grey-2">
                <th class="text-right">{{$t('Common.listingSearch.tableLabel.productCode')}}</th>
                <th class="text-right">{{$t('Common.listingSearch.tableLabel.productName')}}</th>
                <th class="text-right">{{$t('Common.listingSearch.tableLabel.balanceStock')}}</th>
                <th class="text-right" v-if="salesData.is_esac_redemption !== 1">
                    {{$t('Common.listingSearch.tableLabel.unitCV')}}
                </th>
                <th class="text-right">{{$t('Common.listingSearch.tableLabel.unitPrice')}} ({{ currencyLabelByCountry
                    }})
                </th>
                <th class="text-center">{{ $t('Common.tableLabel.Actions') }}</th>
            </tr>
            </thead>
            <tbody>
            <tr class="cursor-pointer"
                v-if="typeof products.data !== 'undefined' && products.data.length > 0 && product.price !== null"
                v-for="product in products.data">
                <td @click="addToCart(product.is_kitting === 0 ? 'product' : 'kitting', product.id)" :data-th="$t('Common.listingSearch.tableLabel.productCode')" class="text-right">{{ product.sku || product.code }}</td>
                <td @click="addToCart(product.is_kitting === 0 ? 'product' : 'kitting', product.id)" :data-th="$t('Common.listingSearch.tableLabel.productName')" class="text-right">{{ product.name }} <q-chip dense :color="product.is_kitting === 0 ? 'amber-3 text-black' : 'lime-3 text-black'">{{ product.is_kitting === 0 ? 'STD' : 'KIT' }}</q-chip></td>
                <td @click="addToCart(product.is_kitting === 0 ? 'product' : 'kitting', product.id)" :data-th="$t('Common.listingSearch.tableLabel.balanceStock')" class="text-right">0</td>
                <td @click="addToCart(product.is_kitting === 0 ? 'product' : 'kitting', product.id)" :data-th="$t('Common.listingSearch.tableLabel.unitCV')" class="text-right" v-if="salesData.is_esac_redemption !== 1">{{ product.price.base_cv }}</td>
                <td @click="addToCart(product.is_kitting === 0 ? 'product' : 'kitting', product.id)" :data-th="$t('Common.listingSearch.tableLabel.unitPrice')" class="text-right">{{ currencyLabelByCountry }} {{ product.price.gmp_price_tax }}</td>
                <td :data-th="$t('Common.tableLabel.Actions')" class="text-center">
                    <q-btn dense color="positive" icon="add" @click="addToCart(product.is_kitting === 0 ? 'product' : 'kitting', product.id)"></q-btn>
                </td>
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
                <simple-pagination :uuid="uuid" :perPage="10" :maxPages="getMaxPages"
                                   :paginationHandler="queryHandler"/>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import {mapState, mapGetters} from 'vuex'

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
      },
      uuid: {
        type: String
      }
    },
    computed: {
      ...mapState({
        products: state => state.salesCMP.salesProductSearchList.list
      }),
      ...mapGetters([
        'currencyLabelByCountry'
      ]),
      getMaxPages() {
        if (typeof this.products.data !== 'undefined' && typeof this.products.total !== 'undefined') {
          return this.products.total
        }
        return 0
      }
    }
  }
</script>
