<template>
    <div class="form-holder relative-position pd-5">
        <div class="form-tabs text-black">
            <q-tabs inverted two-lines color="grey-7" align="left">
                <q-tab default name="standardProducts"
                       slot="title"
                       icon="search"
                       :count="getProductCollectionsCount('products')"
                       label="Standard Products"/>
                <q-tab name="kittingProducts"
                       slot="title"
                       icon="search"
                       :count="getProductCollectionsCount('kitting')"
                       v-if="!excludeKittingSearch"
                       label="Kitting Products"/>
                <!-- Tab Content -->
                <q-tab-pane name="standardProducts" class="no-border">
                    <!-- standardProducts Content-->
                    <products-tab :queryHandler="queryHandler" :addToCart="addToCart"></products-tab>
                    <!-- standardProducts Content End -->
                </q-tab-pane>
                <q-tab-pane name="kittingProducts" v-if="!excludeKittingSearch" class="no-border">
                    <!-- kittingProducts Content-->
                    <kitting-tab :queryHandler="queryHandler" :addToCart="addToCart"></kitting-tab>
                    <!-- kittingProducts Content End -->
                </q-tab-pane>
            </q-tabs>
        </div>
        <q-loader :visible="isProcessingTable || isProcessing"></q-loader>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { ProductsTab, KittingTab } from 'src/application/sales/components/forms/listing-tabs/index'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'listing-search-form',
    components: {
      qLoader,
      ProductsTab,
      KittingTab
    },
    props: {
      salesData: {
        type: Object,
        required: true
      },
      memberDetails: {
        type: Object,
        required: false
      },
      addToCart: {
        type: Function,
        required: false
      },
      excludeKittingSearch: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        headerSearchBarField: state => state.globalCMP.headerSearchBarField,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessing: state => state.globalCMP.isProcessing,
        simplePagination: state => state.globalCMP.simplePagination,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
        productsCollection: state => state.salesCMP.salesProductSearchList.data,
        selectedFilters: state => state.globalCMP.selectedFilters
      }),
      ...mapGetters({
        paginationQuery: 'pagination'
      })
    },
    data: () => ({
      terms: ''
    }),
    watch: {
      headerSearchBarField: {
        handler (val) {
          this.terms = val
          this.queryHandler()
        }
      },
      openCloseModalForm: {
        handler (newData) {
          // Call if modal name match
          if (newData.status && newData.name === 'productListingModal') {
            this.queryHandler()
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'getSalesProductSearchAction'
      ]),
      ...mapMutations({
        unsetSimplePaginationData: 'UNSET_SIMPLE_PAGINATION_DATA'
      }),
      queryHandler (type) {
        if (typeof type === 'undefined') {
          this.unsetSimplePaginationData()
        }
        if (typeof this.memberDetails !== 'undefined') {
          let query = {
            country_id: this.selectedFilters.countryID,
            user_id: this.memberDetails.details.user_id,
            text: this.terms !== '' ? this.terms : null,
            transaction_location_id: this.salesData.location_id,
            stock_location_id: this.salesData.stock_location_id,
            limit: typeof this.simplePagination[type] !== 'undefined' ? this.simplePagination[type].limit : this.paginationQuery.limit,
            offset: typeof this.simplePagination[type] !== 'undefined' ? this.simplePagination[type].offset : this.paginationQuery.offset
          }
          this.getSalesProductSearchAction(query)
        }
      },
      getProductCollectionsCount (type) {
        if (typeof this.productsCollection !== 'undefined') {
          if (type === 'products') {
            if (typeof this.productsCollection.products !== 'undefined' && typeof this.productsCollection.products.total !== 'undefined') {
              return this.productsCollection.products.total
            }
          } else {
            if (typeof this.productsCollection.kitting !== 'undefined' && typeof this.productsCollection.kitting.total !== 'undefined') {
              return this.productsCollection.kitting.total
            }
          }
        }
        return '0'
      },
      // Complete the form submission and redirect and notify
      resetAndGo (redirect) {
        if (redirect) {
          this.openCloseModal({name: this.openCloseModalForm.name, status: false})
        }
      },
      beforeClose () {
        // redirect true
        this.resetAndGo(true)
      }
    }
  }
</script>
