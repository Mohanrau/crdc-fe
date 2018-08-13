<template>
    <div class="price-tab">
        <div class="section">
            <div v-if="standardProduct.base_price !== null"
                 class="product-tab-content-sections price-basic mt-10 mb-20 pd-10">
                <div class="row gutter-xs justify-between items-baseline">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 text-grey">
                        <q-field
                                :helper="'* ' + taxLabel"
                                :error="validation.standardProduct.base_price.gmp_price_tax.$error"
                                :error-label="$t('products.inputPrice.errorLabel')"
                        >
                            <q-input :disable="taxable"
                                     disable
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     v-model="standardProduct.base_price.gmp_price_tax"
                                     type="number" align="left"
                                     :prefix="currencyLabel"
                                     :stack-label="$t('products.standard.price.gmp')"
                                     @input="validation.standardProduct.base_price.gmp_price_tax.$touch"
                            />
                        </q-field>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-input v-model="standardProduct.base_price.nmp_price"
                                 type="number" align="left"
                                 disable
                                 :prefix="currencyLabel"
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 :stack-label="$t('products.standard.price.nmp')"
                                 @input="automateBasePrice"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-field
                                :helper="'* ' + taxLabel"
                        >
                            <q-input disable
                                     v-model="standardProduct.base_price.rp_price_tax"
                                     type="number"
                                     align="left" :prefix="currencyLabel"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.rpTax')"/>
                        </q-field>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-input v-model="standardProduct.base_price.rp_price"
                                 type="number"
                                 disable
                                 align="left" :prefix="currencyLabel" inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 :stack-label="$t('products.standard.price.rpNet')"
                                 @input="automateBasePrice"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-field
                                helper="*"
                                :error="validation.standardProduct.base_price.effective_date.$error"
                                :error-label="$t('products.dataRange.errorLabel')"
                        >
                            <q-datetime align="left" inverted-light
                                        color="white"
                                        class="no-shadow custom-input-border" monday-first format="DD-MM-YYYY"
                                        placeholder="DD-MM-YYYY"
                                        v-model="standardProduct.base_price.effective_date"
                                        :stack-label="$t('products.standard.price.startDate')"
                                        @input="multiCall(null, 'base_price', 'effective_date')"
                            />
                        </q-field>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-field
                                helper="*"
                                :error="validation.standardProduct.base_price.expiry_date.$error"
                                :error-label="$t('products.dataRange.errorLabel')"
                        >
                            <q-datetime align="left" inverted-light
                                        color="white"
                                        :after="[ {icon: 'trending_up', handler () { setFutureDate() }}]"
                                        class="no-shadow custom-input-border" monday-first format="DD-MM-YYYY"
                                        placeholder="DD-MM-YYYY"
                                        v-model="standardProduct.base_price.expiry_date"
                                        :stack-label="$t('products.standard.price.endDate')"
                                        @input="multiCall(null, 'base_price', 'expiry_date')"
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
                <div class="row gutter-xs justify-between q-mt-xs">
                    <div class="col-12">
                        <div class="row gutter-xs items-baseline">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-field
                                        helper="*"
                                        :error="validation.standardProduct.base_price.base_cv.$error"
                                        :error-label="$t('products.typeValue.errorLabel')"
                                >
                                    <q-input v-model="standardProduct.base_price.base_cv"
                                             type="number"
                                             align="left" inverted-light
                                             color="white"
                                             class="no-shadow custom-input-border"
                                             :stack-label="$t('products.standard.price.baseCV')"
                                             @input="multiCall(null)"
                                    />
                                </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-field
                                        helper="*"
                                        :error="validation.standardProduct.base_price.wp_cv.$error"
                                        :error-label="$t('products.typeValue.errorLabel')"
                                >
                                    <q-input v-model="standardProduct.base_price.wp_cv"
                                             align="left" inverted-light
                                             color="white"
                                             class="no-shadow custom-input-border"
                                             :stack-label="$t('products.standard.price.wpCV')"
                                             @input="multiCall(null)"
                                    />
                                </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-input v-model="standardProduct.base_price.cv_1"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV1')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-input v-model="standardProduct.base_price.cv_2"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV2')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-input v-model="standardProduct.base_price.cv_3"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV3')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-input v-model="standardProduct.base_price.cv_4"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV4')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-input v-model="standardProduct.base_price.cv_5"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV5')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-input v-model="standardProduct.base_price.cv_6"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV6')"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="row gutter-xs">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="standardProduct.base_price.bonuses.welcome_bonus_1"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL1')"
                                         @input="automateBasePrice"
                                />
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="standardProduct.base_price.bonuses.welcome_bonus_2"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL2')"
                                         @input="automateBasePrice"
                                />
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="standardProduct.base_price.bonuses.welcome_bonus_3"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL3')"
                                         @input="automateBasePrice"
                                />
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="standardProduct.base_price.bonuses.welcome_bonus_4"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL4')"
                                         @input="automateBasePrice"
                                />
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="standardProduct.base_price.bonuses.welcome_bonus_5"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL5')"
                                         @input="automateBasePrice"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else="">
                <empty-list :message="$t('products.standard.priceError.info')"></empty-list>
            </div>
            <hr>
            <div class="price-action mt-20 pd-10">
                <div class="row items-baseline gutter-sm">
                    <div class="col-auto">
                        <div>{{ $t('products.standard.Promotion.Price') }}</div>
                    </div>
                    <div class="col-auto">
                        <q-btn @click="addNewPromotionPrice" round outline icon="add" color="black"
                               small>
                        </q-btn>
                    </div>
                </div>
            </div>
            <div class="product-tab-content-sections price-promotions mt-10 pd-10"
                 v-for="(promotionPriceTemp, index) in standardProduct.promotion_prices">
                <div class="row items-center justify-between q-mb-lg">
                    <div class="col-lg-4">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="location-search">
                                    <!--TODO Select All Feature-->
                                    <q-select
                                            v-if="standardProduct.promotion_prices[index].location_ids"
                                            multiple
                                            filter
                                            placeholder="Choose ..."
                                            :filter-placeholder="$t('products.standard.Search.locations.placeholder')"
                                            :float-label="$t('products.standard.select.locations')"
                                            chips
                                            inverted-light
                                            color="white text-grey-6"
                                            class="no-shadow custom-input-border"
                                            v-model="promotionPriceTemp.location_ids"
                                            :options="locationOptions"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-8">
                        <div class="row justify-end">
                            <div class="col-auto">
                                <div class="col-auto pull-right">
                                    <q-btn v-if="!standardProduct.promotion_prices[index].id"
                                           @click="removePromotionPrice(index)" flat round small
                                           icon="close"
                                           color="negative" small>
                                    </q-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row gutter-xs justify-between items-baseline">
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-field
                                :helper="taxLabel"
                                :error="validation.standardProduct.promotion_prices.$each[index].gmp_price_tax.$error"
                                :error-label="$t('products.inputPrice.errorLabel')"
                        >
                            <q-input :disable="taxable" v-model="promotionPriceTemp.gmp_price_tax"

                                     type="number" align="left"
                                     :prefix="currencyLabel" inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.gmp')"
                                     @input="multiCall(index, 'promotion_prices', 'gmp_price_tax')"/>
                        </q-field>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-input v-model="promotionPriceTemp.nmp_price"
                                 type="number" align="left"
                                 :prefix="currencyLabel" inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 :stack-label="$t('products.standard.price.nmp')"
                                 @input="multiCall(index, 'promotion_prices', 'nmp_price')"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-field
                                :helper="taxLabel">
                            <q-input :disable="taxable" v-model="promotionPriceTemp.rp_price_tax"

                                     type="number"
                                     align="left" :prefix="currencyLabel" inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :stack-label="$t('products.standard.price.rpTax')"
                                     @input="multiCall(index, 'promotion_prices', 'rp_price_tax')"/>
                        </q-field>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-input v-model="promotionPriceTemp.rp_price"
                                 type="number"
                                 align="left" :prefix="currencyLabel" inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 :stack-label="$t('products.standard.price.rpNet')"
                                 @input="multiCall(index, 'promotion_prices', 'rp_price')"/>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-field
                                helper="*"
                                :error="validation.standardProduct.promotion_prices.$each[index].effective_date.$error"
                                :error-label="$t('products.dataRange.errorLabel')"
                        >
                            <q-datetime align="left" inverted-light
                                        color="white"
                                        class="no-shadow custom-input-border" monday-first format="DD-MM-YYYY"
                                        placeholder="DD-MM-YYYY"
                                        v-model="promotionPriceTemp.effective_date"
                                        :stack-label="$t('products.standard.price.startDate')"
                                        @input="multiCall(index, 'promotion_prices', 'effective_date')"/>
                        </q-field>
                    </div>
                    <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2">
                        <q-field
                                helper="*"
                                :error="validation.standardProduct.promotion_prices.$each[index].expiry_date.$error"
                                :error-label="$t('products.dataRange.errorLabel')"
                        >
                            <q-datetime align="left" inverted-light
                                        color="white"
                                        :after="[ {icon: 'trending_up', handler () { setFutureDate(index) }}]"
                                        class="no-shadow custom-input-border" monday-first format="DD-MM-YYYY"
                                        placeholder="DD-MM-YYYY"
                                        v-model="promotionPriceTemp.expiry_date"
                                        :stack-label="$t('products.standard.price.endDate')"
                                        @input="multiCall(index, 'promotion_prices', 'expiry_date')"/>
                            <q-tooltip>
                                <div class="text-weight-light">
                                    {{ $t('Common.setFutureDate.tooltip') }}
                                    <q-icon name="trending_up"></q-icon>
                                </div>
                            </q-tooltip>
                        </q-field>
                    </div>
                </div>
                <div class="row gutter-xs justify-between items-baseline q-mt-xs">
                    <div class="col-12">
                        <div class="row gutter-sm items-baseline">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-field
                                        helper="*"
                                        :error="validation.standardProduct.promotion_prices.$each[index].base_cv.$error"
                                        :error-label="$t('products.typeValue.errorLabel')"
                                >
                                    <q-input v-model="promotionPriceTemp.base_cv"
                                             type="number"
                                             align="left" inverted-light
                                             color="white"
                                             class="no-shadow custom-input-border"
                                             :stack-label="$t('products.standard.price.baseCV')"
                                             @input="multiCall(index, 'promotion_prices', 'base_cv')"/>
                                </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-field
                                        helper="*"
                                        :error="validation.standardProduct.promotion_prices.$each[index].wp_cv.$error"
                                        :error-label="$t('products.typeValue.errorLabel')"
                                >
                                    <q-input v-model="promotionPriceTemp.wp_cv"
                                             type="number"
                                             align="left" inverted-light
                                             color="white"
                                             class="no-shadow custom-input-border"
                                             :stack-label="$t('products.standard.price.wpCV')"
                                             @input="multiCall(index, 'promotion_prices', 'wp_cv')"
                                    />
                                </q-field>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-input v-model="promotionPriceTemp.cv_1"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV1')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-input v-model="promotionPriceTemp.cv_2"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV2')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-input v-model="promotionPriceTemp.cv_3"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV3')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 short-inp">
                                <q-input v-model="promotionPriceTemp.cv_4"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV4')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-input v-model="promotionPriceTemp.cv_5"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV5')"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-1 short-inp">
                                <q-input v-model="promotionPriceTemp.cv_6"
                                         type="number"
                                         align="left" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.CV6')"/>
                            </div>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="row gutter-xs items-baseline">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="promotionPriceTemp.bonuses.welcome_bonus_1"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL1')"
                                         @input="automatePromotionPrice(index)"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="promotionPriceTemp.bonuses.welcome_bonus_2"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL2')"
                                         @input="automatePromotionPrice(index)"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="promotionPriceTemp.bonuses.welcome_bonus_3"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL3')"
                                         @input="automatePromotionPrice(index)"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="promotionPriceTemp.bonuses.welcome_bonus_4"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL4')"
                                         @input="automatePromotionPrice(index)"/>
                            </div>
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-2 long-inp">
                                <q-input v-model="promotionPriceTemp.bonuses.welcome_bonus_5"
                                         type="number" align="left"
                                         :prefix="currencyLabel" inverted-light
                                         color="white"
                                         class="no-shadow custom-input-border"
                                         :stack-label="$t('products.standard.price.wbL5')"
                                         @input="automatePromotionPrice(index)"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import {date} from 'quasar'
  import {formatPrice} from 'src/helpers/filters'
  import Vue from 'vue'
  import {mapState, mapGetters} from 'vuex'

  const zeros = (0.00).toFixed(2)

  export default {
    name: 'price-tab',
    components: {
      qLoader,
      EmptyList
    },
    props: {
      'standardProduct': {
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
        'compareCountry'
      ])
    },
    mounted() {
      if (this.standardProduct.base_price !== null) {
        this.automateBasePrice()
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
      },
      promotionPriceTemp: {
        promo_id: '',
        location_ids: [],
        gmp_price_tax: '',
        nmp_price: '',
        rp_price: '',
        rp_price_tax: '',
        effective_date: '',
        expiry_date: '',
        base_cv: '',
        wp_cv: '',
        cv_1: '',
        cv_2: '',
        cv_3: '',
        cv_4: '',
        cv_5: '',
        cv_6: '',
        bonuses: {
          welcome_bonus_1: '',
          welcome_bonus_2: '',
          welcome_bonus_3: '',
          welcome_bonus_4: '',
          welcome_bonus_5: ''
        }
      }
    }),
    methods: {
      multiCall(index, belongsTo, field) {
        this.reverseCal = false
        if (index === null) {
          if (typeof belongsTo !== 'undefined' && typeof field !== 'undefined') {
            this.validation.standardProduct[belongsTo][field].$touch()
          }
          // Date reformat
          this.standardProduct.base_price.effective_date = date.formatDate(this.standardProduct.base_price.effective_date, 'YYYY-MM-DD')
          this.standardProduct.base_price.expiry_date = date.formatDate(this.standardProduct.base_price.expiry_date, 'YYYY-MM-DD')
          this.automateBasePrice()
        } else {
          if (field === 'gmp_price_tax' || field === 'rp_price_tax') {
            this.reverseCal = true
          }
          this.automatePromotionPrice(index)
          if (this.validation.standardProduct[belongsTo].$each[index][field]) {
            this.validation.standardProduct[belongsTo].$each[index][field].$touch()
          }
          // Date reformat
          this.standardProduct.promotion_prices[index].effective_date = date.formatDate(this.standardProduct.promotion_prices[index].effective_date, 'YYYY-MM-DD')
          this.standardProduct.promotion_prices[index].expiry_date = date.formatDate(this.standardProduct.promotion_prices[index].expiry_date, 'YYYY-MM-DD')
        }
      },
      automateBasePrice() {
        if (this.standardProduct.base_price.nmp_price !== '') {
          this.standardProduct.base_price.gmp_price_tax = formatPrice(parseFloat(this.standardProduct.base_price.nmp_price) * ((100 + parseFloat(this.taxRate)) / 100), true, this.compareCountry(this.standardProduct.country_id, 'KH') ? 1 : 0)
          if (parseFloat(this.standardProduct.base_price.base_cv) !== 0) {
            Object.keys(this.standardProduct.base_price.bonuses).forEach((key) => {
              if (parseFloat(this.standardProduct.base_price.bonuses[key]) === 0.00 || this.standardProduct.base_price.bonuses[key] === '' || this.standardProduct.base_price.bonuses[key] === null) {
                this.standardProduct.base_price.bonuses[key] = formatPrice(((parseFloat(this.standardProduct.base_price.nmp_price) / 100) * this.wlbPercentage[key]), true, this.compareCountry(this.standardProduct.country_id, 'KH') ? 1 : 0)
              }
            })
          }
        }
        if (this.standardProduct.base_price.rp_price !== '') {
          this.standardProduct.base_price.rp_price_tax = formatPrice(parseFloat(this.standardProduct.base_price.rp_price) * ((100 + parseFloat(this.taxRate)) / 100), true, this.compareCountry(this.standardProduct.country_id, 'KH') ? 1 : 0)
        }
        if (this.standardProduct.base_price.base_cv === 0) {
          this.standardProduct.base_price.wp_cv = 0
          this.standardProduct.base_price.cv_1 = 0
          this.standardProduct.base_price.cv_2 = 0
          Object.keys(this.standardProduct.base_price.bonuses).forEach((key) => {
            this.standardProduct.base_price.bonuses[key] = zeros
          })
        }
      },
      automatePromotionPrice(index) {
        if (parseInt(this.standardProduct.promotion_prices[index].base_cv) === 0) {
          this.standardProduct.promotion_prices[index].wp_cv = 0
          this.standardProduct.promotion_prices[index].cv_1 = 0
          this.standardProduct.promotion_prices[index].cv_2 = 0
          Object.keys(this.standardProduct.promotion_prices[index].bonuses).forEach((key) => {
            this.standardProduct.promotion_prices[index].bonuses[key] = zeros
          })
        }
        if (this.standardProduct.promotion_prices[index].nmp_price !== '') {
          if (!this.reverseCal) {
            this.standardProduct.promotion_prices[index].gmp_price_tax = formatPrice(parseFloat(this.standardProduct.promotion_prices[index].nmp_price) * ((100 + parseFloat(this.taxRate)) / 100), true, this.compareCountry(this.standardProduct.country_id, 'KH') ? 1 : 0)
          } else {
            this.standardProduct.promotion_prices[index].nmp_price = formatPrice(parseFloat(this.standardProduct.promotion_prices[index].gmp_price_tax) / ((100 + parseFloat(this.taxRate)) / 100), true)
          }

          if (parseFloat(this.standardProduct.promotion_prices[index].base_cv) !== parseFloat(0.00)) {
            Object.keys(this.standardProduct.promotion_prices[index].bonuses).forEach((key) => {
              this.standardProduct.promotion_prices[index].bonuses[key] = formatPrice(((parseFloat(this.standardProduct.promotion_prices[index].nmp_price) / 100) * this.wlbPercentage[key]), true, this.compareCountry(this.standardProduct.country_id, 'KH') ? 1 : 0)
            })
          }
        }

        if (this.standardProduct.promotion_prices[index].rp_price !== '') {
          if (!this.reverseCal) {
            this.standardProduct.promotion_prices[index].rp_price_tax = formatPrice(parseFloat(this.standardProduct.promotion_prices[index].rp_price) * ((100 + parseFloat(this.taxRate)) / 100))
          } else {
            this.standardProduct.promotion_prices[index].rp_price = formatPrice(parseFloat(this.standardProduct.promotion_prices[index].rp_price_tax) / ((100 + parseFloat(this.taxRate)) / 100))
          }
        }
      },
      addNewPromotionPrice() {
        // Copy base_price values to promotion_price values
        this.promotionPriceTemp.nmp_price = this.standardProduct.base_price !== null ? this.standardProduct.base_price.nmp_price : 0.00
        this.promotionPriceTemp.rp_price = this.standardProduct.base_price !== null ? this.standardProduct.base_price.rp_price : 0.00
        this.promotionPriceTemp.base_cv = this.standardProduct.base_price !== null ? this.standardProduct.base_price.base_cv : 0
        // Add new object into standardProduct.promotion_prices by cloning promotionPriceTemp object
        this.standardProduct.promotion_prices.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.promotionPriceTemp))))
        this.triggerPromotionPriceAutomation()
      },
      removePromotionPrice(index) {
        Vue.delete(this.standardProduct.promotion_prices, index)
      },
      triggerPromotionPriceAutomation() {
        const plength = Object.keys(this.standardProduct.promotion_prices).length
        for (var index = 0; index < plength; index++) {
          this.automatePromotionPrice(index)
        }
      },
      setFutureDate(index) {
        const futureDate = date.formatDate('01-01-2099', 'YYYY-MM-DD')
        if (index === undefined) {
          this.standardProduct.base_price.expiry_date = futureDate
        } else {
          this.standardProduct.promotion_prices[index].expiry_date = futureDate
        }
      }
    }
  }
</script>