<template>
    <div class="price-tab">
        <div class="product-tab-content-sections price-basic q-mt-sm q-mb-sm q-pa-sm">
            <div class="row gutter-xs justify-between items-baseline">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 text-grey">
                    <q-field
                            :helper="'* ' + taxLabel"
                            :error="validation.kittingProduct.kitting_price.gmp_price_tax.$error"
                            :error-label="$t('general.price.error.label')"
                    >
                        <q-input :disable="taxable"
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 v-model="kittingProduct.kitting_price.gmp_price_tax"  :min="0"
                                 type="number" align="left"
                                 :prefix="currencyLabel"
                                 :stack-label="$t('products.kitting.price.gmpPrice')"
                                 @input="validation.kittingProduct.kitting_price.gmp_price_tax.$touch"
                        />
                    </q-field>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                    <q-input v-model="kittingProduct.kitting_price.nmp_price"  :min="0"
                             inverted-light
                             color="white"
                             class="no-shadow custom-input-border"
                             type="number" align="left"
                             :prefix="currencyLabel"
                             :stack-label="$t('products.kitting.price.nmpPrice')"
                             @input="automateBasePrice"/>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                    <q-field
                            :helper="'* ' + taxLabel"
                    >
                        <q-input :disable="taxable"
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 v-model="kittingProduct.kitting_price.rp_price_tax"  :min="0"
                                 type="number"
                                 align="left" :prefix="currencyLabel"
                                 :stack-label="$t('products.kitting.price.rpPriceTax')"/>
                    </q-field>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                    <q-input v-model="kittingProduct.kitting_price.rp_price"  :min="0"
                             type="number"
                             inverted-light
                             color="white"
                             class="no-shadow custom-input-border"
                             align="left" :prefix="currencyLabel"
                             :stack-label="$t('products.kitting.price.rpPriceNett')"
                             @input="automateBasePrice"/>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                    <q-field
                            helper="*"
                            :error="validation.kittingProduct.kitting_price.effective_date.$error"
                            :error-label="$t('products.dataRange.errorLabel')"
                    >
                        <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                    inverted-light
                                    color="white"
                                    placeholder="DD-MM-YYYY"
                                    class="no-shadow custom-input-border"
                                    v-model="kittingProduct.kitting_price.effective_date"
                                    :stack-label="$t('products.standard.price.startDate')"
                                    @input="multiCall('kitting_price', 'effective_date')"
                        />
                    </q-field>
                </div>
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                    <q-field
                            helper="*"
                            :error="validation.kittingProduct.kitting_price.expiry_date.$error"
                            error-label="Date range Invalid"
                    >
                        <q-datetime align="left"
                                    inverted-light
                                    :after="[ {icon: 'trending_up', handler () { setFutureDate() }}]"
                                    color="white"
                                    placeholder="DD-MM-YYYY"
                                    class="no-shadow custom-input-border"
                                    monday-first format="DD-MM-YYYY"
                                    v-model="kittingProduct.kitting_price.expiry_date"
                                    :stack-label="$t('products.standard.price.endDate')"
                                    @input="multiCall('kitting_price', 'expiry_date')"
                        />
                        <q-tooltip>
                            <div class="text-weight-light">
                                {{ $t('Common.setFutureDate.tooltip') }}
                                <q-icon name="trending_up"></q-icon>
                            </div>
                        </q-tooltip>
                    </q-field>
                </div>
            </div>
            <div class="row justify-between items-baseline q-mt-xs">
                <div class="col-12">
                    <div class="row gutter-xs items-baseline">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                            <q-field
                                    helper="*"
                                    :error="validation.kittingProduct.kitting_price.base_cv.$error"
                                    error-label="Please Type a value or 0"
                            >
                                <q-input v-model="kittingProduct.kitting_price.base_cv"
                                         disable
                                         type="number"
                                         align="left"
                                         inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.baseCV')"
                                         @input="multiCall(), automateBasePrice()"
                                />
                            </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1">
                            <q-field
                                    helper="*"
                                    :error="validation.kittingProduct.kitting_price.wp_cv.$error"
                                    error-label="Please Type a value or 0"
                            >
                                <q-input v-model="kittingProduct.kitting_price.wp_cv"
                                         type="number"
                                         align="left"
                                         inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wpCV')"
                                         @input="multiCall()"
                                />
                            </q-field>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1">
                            <q-input v-model="kittingProduct.kitting_price.cv_1"
                                     type="number"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.CV1')"/>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                            <q-input v-model="kittingProduct.kitting_price.cv_2"
                                     type="number"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.CV2')"/>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                            <q-input v-model="kittingProduct.kitting_price.cv_3"
                                     type="number"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.CV3')"/>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                            <q-input v-model="kittingProduct.kitting_price.cv_4"
                                     type="number"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.CV4')"/>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1">
                            <q-input v-model="kittingProduct.kitting_price.cv_5"
                                     type="number"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.CV5')"/>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1">
                            <q-input v-model="kittingProduct.kitting_price.cv_6"
                                     type="number"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.CV6')"/>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row gutter-xs">
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                            <q-input v-model="kittingProduct.kitting_price.bonuses.welcome_bonus_1"
                                      :min="0" type="number" align="left"
                                     :prefix="currencyLabel"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.wbL1')"
                            />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                            <q-input v-model="kittingProduct.kitting_price.bonuses.welcome_bonus_2"
                                      :min="0" type="number" align="left"
                                     :prefix="currencyLabel"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.wbL2')"
                            />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                            <q-input v-model="kittingProduct.kitting_price.bonuses.welcome_bonus_3"
                                      :min="0" type="number" align="left"
                                     :prefix="currencyLabel"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.wbL3')"
                            />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                            <q-input v-model="kittingProduct.kitting_price.bonuses.welcome_bonus_4"
                                      :min="0" type="number" align="left"
                                     :prefix="currencyLabel"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.wbL4')"
                            />
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                            <q-input v-model="kittingProduct.kitting_price.bonuses.welcome_bonus_5"
                                      :min="0" type="number" align="left"
                                     :prefix="currencyLabel"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.wbL5')"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="product-tab-content-sections price-table q-mt-sm q-mb-sm q-pa-sm">
            <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <kittingProductsRatioTable :kittingProduct="kittingProduct"></kittingProductsRatioTable>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { date }  from 'quasar'
  import { formatPrice } from 'src/helpers/filters'
  import kittingProductsRatioTable from 'src/application/global/components/tables/kittingProductsRatioTable'
  import { mapState, mapGetters } from 'vuex'

  const zeros = (0.00).toFixed(2)

  export default {
    name: 'price-tab',
    components: {
      qLoader,
      kittingProductsRatioTable
    },
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
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        selectedFilters: state => state.globalCMP.selectedFilters,
        productData: state => state.productsCMP.saveData.data
      }),
      ...mapGetters([
        'locationOptions',
        'taxable',
        'taxRate',
        'taxLabel',
        'currencyLabel',
        'compareCountry',
        'getKittingQualifiedBaseCV'
      ])
    },
    watch: {
      getKittingQualifiedBaseCV: {
        handler () {
          this.kittingProduct.kitting_price.base_cv = this.getKittingQualifiedBaseCV
        },
        deep: true
      }
    },
    data: () => ({
      // Welcome Bonuses Percentage
      wlbPercentage: {
        welcome_bonus_1: 15,
        welcome_bonus_2: 5,
        welcome_bonus_3: 5,
        welcome_bonus_4: 5,
        welcome_bonus_5: 5
      }
    }),
    methods: {
      multiCall (belongsTo, field) {
        if (typeof belongsTo !== 'undefined' && typeof field !== 'undefined') {
          this.validation.kittingProduct[belongsTo][field].$touch()
        }
        // Date reformat
        this.kittingProduct.kitting_price.effective_date = date.formatDate(this.kittingProduct.kitting_price.effective_date, 'YYYY-MM-DD')
        this.kittingProduct.kitting_price.expiry_date = date.formatDate(this.kittingProduct.kitting_price.expiry_date, 'YYYY-MM-DD')
      },
      automateBasePrice () {
        if (this.kittingProduct.kitting_price.nmp_price !== '') {
          this.kittingProduct.kitting_price.gmp_price_tax = formatPrice(parseFloat(this.kittingProduct.kitting_price.nmp_price) * ((100 + parseFloat(this.taxRate)) / 100), true, this.compareCountry(this.kittingProduct.country_id, 'KH') ? 1 : 0)
        }
        if (this.kittingProduct.kitting_price.rp_price !== '') {
            this.kittingProduct.kitting_price.rp_price_tax = formatPrice(parseFloat(this.kittingProduct.kitting_price.rp_price) * ((100 + parseFloat(this.taxRate)) / 100), true, this.compareCountry(this.kittingProduct.country_id, 'KH') ? 1 : 0)
        }
        if (this.kittingProduct.kitting_price.base_cv === 0) {
          this.kittingProduct.kitting_price.wp_cv = 0
          this.kittingProduct.kitting_price.cv_1 = 0
          this.kittingProduct.kitting_price.cv_2 = 0
          Object.keys(this.kittingProduct.kitting_price.bonuses).forEach((key) => {
            this.kittingProduct.kitting_price.bonuses[key] = zeros
          })
        } else {
          Object.keys(this.kittingProduct.kitting_price.bonuses).forEach((key) => {
              this.kittingProduct.kitting_price.bonuses[key] = formatPrice(((parseFloat(this.kittingProduct.kitting_price.nmp_price) / 100) * this.wlbPercentage[key]), true, this.compareCountry(this.kittingProduct.country_id, 'KH') ? 1 : 0)
          })
        }
      },
      setFutureDate () {
        const futureDate = date.formatDate('01-01-2099', 'YYYY-MM-DD')
        this.kittingProduct.kitting_price.expiry_date = futureDate
      }
    }
  }
</script>
