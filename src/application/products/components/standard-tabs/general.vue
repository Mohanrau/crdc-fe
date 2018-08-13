<template>
    <div class="general-tab">
        <div class="row gutter-sm">
            <div class="col-lg-6">
                <div class="general-holder product-code">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.ProductCode.label') }}</div>
                    </div>
                    <div class="general-item text-bold">
                        <span>{{ standardProduct.sku }}</span>
                    </div>
                </div>
                <div class="general-holder product-name">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.ProductName.label') }}</div>
                    </div>
                    <div class="general-item text-bold">
                        <span>{{ standardProduct.name }}</span>
                    </div>
                </div>
                <div class="general-holder product-category">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.Category.label') }}</div>
                    </div>
                    <div class="general-item text-bold">
                        <span v-if="productData.categories.hierarchy.length > 0" v-for="category in productData.categories.hierarchy"> {{ category }} <q-icon v-if="!$last(category, productData.categories.hierarchy)"
                                name="keyboard_arrow_right"/> </span>
                        <span v-else="">-</span>
                    </div>
                </div>
                <div class="general-holder product-status-yy">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.StatusERP.label') }}</div>
                    </div>
                    <div class="general-item text-bold">
                       <span class="text-positive" v-if="productData.yy_active === 1">
                           <q-icon name="visibility"/> {{$t('products.general.active')}}
                       </span>
                        <span class="text-negative" v-else>
                            <q-icon name="visibility_off"/> {{$t('products.general.inactive')}}
                        </span>
                    </div>
                </div>
                <div class="general-holder product-name">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.StatusIBS.label') }}</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <span class="text-positive" v-if="productData.ibs_active === 1">
                           <q-icon name="visibility"/> {{$t('products.general.active')}}
                       </span>
                        <span class="text-negative" v-else>
                            <q-icon name="visibility_off"/> {{$t('products.general.inactive')}}
                        </span>
                        <q-list link no-border>
                            <q-item tag="label">
                                <q-item-side>
                                    <q-radio color="white text-grey-6" v-model="standardProduct.ibs_active" :val="1"/>
                                </q-item-side>
                                <q-item-main>
                                    <q-item-tile label>{{ $t('products.general.followEffectiveDate') }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label">
                                <q-item-side>
                                    <q-radio color="white text-grey-6" v-model="standardProduct.ibs_active" :val="0"/>
                                </q-item-side>
                                <q-item-main>
                                    <q-item-tile label>{{ $t('products.general.inactive') }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                        </q-list>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
                <div class="general-holder product-name">
                    <div class="general-label text-grey-5">
                        <div>Product Additional Requirements (Optional)</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <q-option-group
                                color="white text-grey-6"
                                type="checkbox"
                                v-model="standardProduct.general.product_additional_requirements"
                                :options="masterDataOptionsCreator('product_additional_requirements')"
                        />
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="general-holder product-name">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.general.pickAPack.label') }}</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <q-list link>
                            <q-item tag="label" v-for="saleType in saleTypes" :key="saleType.id">
                                <q-item-side>
                                    <q-checkbox color="white text-grey-6" v-model="standardProduct.general.sale_types"
                                                :val="saleType.id"/>
                                </q-item-side>
                                <q-item-main>
                                    <q-item-tile label>{{ saleType.title }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                        </q-list>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
                <div class="general-holder product-name">
                    <div class="general-label text-grey-5">
                        <div>{{ $t('products.standard.general.CVConfig.label') }}</div>
                    </div>
                    <div class="general-item text-bold relative-position">
                        <q-list link>
                            <q-item tag="label" v-for="cvConfig in cvConfigs" :key="cvConfig.id">
                                <q-item-side>
                                    <q-checkbox color="white text-grey-6" v-model="standardProduct.general.cv_config"
                                                :val="cvConfig.id"/>
                                </q-item-side>
                                <q-item-main>
                                    <q-item-tile label>{{ cvConfig.title }}</q-item-tile>
                                </q-item-main>
                            </q-item>
                        </q-list>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import qLoader from 'src/application/global/components/common/loading/loader'

  export default {
    name: 'general-tab',
    components: {
      qLoader
    },
    mixins: [masterDataTransformarMixin],
    props: {
      'standardProduct': {
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
    created() {
      this.master.keys = [
        'sale_types', 'cv_config', 'product_additional_requirements'
      ]
    },
    data: () => ({}),
    methods: {
      ...mapActions([
        'getMastersWithKey'
      ])
    }
  }
</script>
