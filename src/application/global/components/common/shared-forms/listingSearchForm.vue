<template>
    <div class="form-holder relative-position pd-5">
        <div class="form-tabs text-black">
            <q-tabs inverted two-lines color="grey-7" align="left">
                <q-tab default name="standardProducts"
                       slot="title"
                       icon="search"
                       :count="getProductCollectionsCount('products')"
                       :label="$t('Common.listingSearch.label.Products')"/>
                <q-tab-pane name="standardProducts" class="no-border">
                    <!-- standardProducts Content-->
                    <products-tab :uuid="itemSearchUUID" :salesData="salesData" :queryHandler="queryHandler"
                                  :addToCart="addToCart"></products-tab>
                    <!-- standardProducts Content End -->
                </q-tab-pane>
            </q-tabs>
        </div>
        <q-loader :visible="isProcessingTable || isProcessing"></q-loader>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {
    GeneralsMixin,
  } from 'src/application/global/mixins/index'
  import {ProductsTab} from 'src/application/global/components/common/shared-forms/listing-tabs/index'
  import {mapActions, mapState, mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'listing-search-form',
    components: {
      qLoader,
      ProductsTab
    },
    mixins: [GeneralsMixin],
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
      },
      isEnrollmentWithoutUserID: {
        type: Boolean,
        default: false
      },
      isRentalSales: {
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
        productsCollection: state => state.salesCMP.salesProductSearchList.list,
        selectedFilters: state => state.globalCMP.selectedFilters
      }),
      ...mapGetters({
        paginationQuery: 'pagination'
      })
    },
    data: () => ({
      terms: '',
      itemSearchUUID: 'sales_item_search'
    }),
    watch: {
      headerSearchBarField: {
        handler(val) {
          this.terms = val
          this.queryHandler()
        }
      },
      openCloseModalForm: {
        handler(newData) {
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
      async queryHandler(type = this.itemSearchUUID) {
        let userID = await !this.isEnrollmentWithoutUserID ? this.memberDetails !== undefined && this.memberDetails.details !== undefined ? this.memberDetails.details.user_id : null : null
        let query = {
          country_id: this.selectedFilters.countryID,
          user_id: userID,
          text: this.terms !== '' ? this.terms : null,
          transaction_location_id: this.salesData.location_id,
          stock_location_id: this.salesData.stock_location_id,
          exclude_kitting_search: this.excludeKittingSearch,
          mixed: true,
          esac_vouchers: this.salesData.is_esac_redemption === 1 ? this.salesData.esac_vouchers : null,
          limit: typeof this.simplePagination[type] !== 'undefined' ? this.simplePagination[type].limit : this.paginationQuery.limit,
          offset: typeof this.simplePagination[type] !== 'undefined' ? this.simplePagination[type].offset : this.paginationQuery.offset
        }
        // Rental sales item sale_types filters applied
        if (this.isRentalSales) {
          let id = this.getMasterDataIdByKeyAndTitle('sale_types', this.$const.masterData.RENTAL)
          if (id !== '') {
            query.sale_types = [id]
          }
        }
        await this.getSalesProductSearchAction(query)
      },
      getProductCollectionsCount(type) {
        if (typeof this.productsCollection !== 'undefined') {
          if (typeof this.productsCollection.data !== 'undefined' && typeof this.productsCollection.total !== 'undefined') {
            return this.productsCollection.total
          }
        }
        return '0'
      },
      // Complete the form submission and redirect and notify
      resetAndGo(redirect) {
        if (redirect) {
          this.openCloseModal({name: this.openCloseModalForm.name, status: false})
        }
      },
      beforeClose() {
        // redirect true
        this.resetAndGo(true)
      }
    }
  }
</script>
