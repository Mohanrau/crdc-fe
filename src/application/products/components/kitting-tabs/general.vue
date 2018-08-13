<template>
    <div class="general-tab">
        <div class="row gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                <div class="general-holder product-name mb-20">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.kitting.search.SaleType') }}</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <q-field helper="*"
                                 :error="validation.kittingProduct.general.sale_types.$error"
                                 error-label="Please choose at least 1"
                        >
                            <q-list link separator>
                                <q-item tag="label" v-for="saleType in saleTypes" :key="saleType.id">
                                    <q-item-side>
                                        <q-checkbox color="grey-6" v-model="kittingProduct.general.sale_types"
                                                    :val="saleType.id"/>
                                    </q-item-side>
                                    <q-item-main>
                                        <q-item-tile label>{{ saleType.title }}</q-item-tile>
                                    </q-item-main>
                                </q-item>
                            </q-list>
                        </q-field>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-6">
                <div class="general-holder product-name mb-20">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.kitting.StatusIBS.label') }}</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <span class="text-positive" v-if="productData.active === 1">
                            <q-icon name="visibility"/> {{$t('products.general.active')}}
                        </span>
                    <span class="text-negative" v-else>
                            <q-icon name="visibility_off"/> {{$t('products.general.inactive')}}
                        </span>
                        <q-list link no-border>
                            <q-item tag="label">
                                <q-item-side>
                                    <q-radio v-model="kittingProduct.active" :val="1" color="grey-6"/>
                                </q-item-side>
                                <q-item-main>
                                    <q-item-tile label>{{ $t('products.general.active') }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label">
                                <q-item-side>
                                    <q-radio v-model="kittingProduct.active" :val="0" color="grey-6"/>
                                </q-item-side>
                                <q-item-main>
                                    <q-item-tile label>{{ $t('products.general.inactive') }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                        </q-list>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
                <div class="general-holder product-name mb-20">
                    <div class="general-label text-grey-5">
                        <div>CV config</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <q-list link no-border>
                            <q-item tag="label" v-for="cvConfig in cvConfigs" :key="cvConfig.id">
                                <q-item-side>
                                    <q-checkbox color="gery-6" v-model="kittingProduct.general.cv_config" :val="cvConfig.id"/>
                                </q-item-side>
                                <q-item-main>
                                    <q-item-tile label>{{ cvConfig.title }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                        </q-list>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
                <div class="general-holder product-name mb-20">
                    <div class="general-label text-grey-5">
                        <div>Product Additional Requirements (Optional)</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <q-option-group
                                color="grey-6"
                                type="checkbox"
                                v-model="kittingProduct.general.product_additional_requirements"
                                :options="masterDataOptionsCreator('product_additional_requirements')"
                        />
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'

  export default {
    name: 'general-tab',
    components: {
      qLoader
    },
    mixins: [masterDataTransformarMixin],
    props: {
      'kittingProduct': {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        selectedFilters: state => state.globalCMP.selectedFilters,
        productData: state => state.productsCMP.saveData.data,
        saleTypes: state => state.globalCMP.masterData.data.list.sale_types,
        cvConfigs: state => state.globalCMP.masterData.data.list.cv_config
      })
    },
    mounted () {
      this.master.keys = [
        'sale_types', 'cv_config', 'product_additional_requirements'
      ]
      if (typeof this.saleTypes !== 'undefined' && this.saleTypes.length > 0) {
        this.checkAllSalesTypeOnInit()
      }
    },
    methods: {
      checkAllSalesTypeOnInit () {
        // Checking new or existing kitting
        if (!this.kittingProduct.kitting_id > 0) {
          // Prevent auto selection if user already make selection before save
          if (this.kittingProduct.general.sale_types.length === 0) {
            // Auto selection on init
            this.saleTypes.forEach((val) => {
              this.kittingProduct.general.sale_types.push(val.id)
            })
          }
        }
      }
    }
  }
</script>
