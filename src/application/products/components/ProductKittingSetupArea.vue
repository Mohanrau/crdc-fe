<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SetupForm"
                    v-if="show"
                    :formTitle="$t('products.kitting.setup.title')"
                    :backgroudColor="false"
                    v-bind:formFieldData="kittingProduct"
                    urlResetPathName="Kitting Products List"
                    formAction="createKittingProductAction"
                    :buttonTitleCaption="$t('Common.Save.Btn')"
                    :formSubmit="processForm">
            <template slot="form-title" slot-scope="props">
                <div class="text-grey-7">{{ selectedFilters.countryName }}</div>
                <div class="row items-center">
                    <span v-if="!copied" class="cursor-pointer" @dblclick="doCopy">{{ kittingProduct.code }}</span>
                    <span class="q-body-1 text-positive" v-else="" :class="{'animated flash' : copied}">{{ $t('Common.Copied.Text') }}</span>
                    <span> : {{ kittingProduct.name }} </span>
                </div>
            </template>
            <template slot="form">
                <div class="form-tabs mt-20 text-black bg-white shadow-1">
                    <q-tabs inverted color="grey-4" align="justify">
                        <q-tab :alert="$v.kittingProduct.name.$error || $v.kittingProduct.code.$error"
                               default name="kitting" slot="title" icon="view comfy"
                               :label="$t('products.kitting.tab.price')"/>
                        <q-tab :alert="$v.kittingProduct.kitting_price.$error" name="price" slot="title"
                               icon="attach money" :label="$t('products.standard.tab.price')"/>
                        <q-tab name="location" slot="title" icon="location on"
                               :label="$t('products.standard.tab.location')"/>
                        <q-tab :alert="$v.kittingProduct.general.$error" name="general" slot="title"
                               icon="settings" :label="$t('products.standard.tab.general')"/>
                        <q-tab :alert="$v.kittingProduct.description.$error || $v.kittingProduct.description.$invalid"
                               name="description" slot="title" icon="description"
                               :label="$t('products.standard.tab.description')"/>
                        <q-tab name="image" slot="title" icon="image" :label="$t('products.standard.tab.image')"/>
                        <!-- Tab Content -->
                        <q-tab-pane name="kitting" class="no-border">
                            <!-- Kitting Content-->
                            <div class="pd-10">
                                <kitting-tab :validation="$v"
                                             v-bind:kittingProduct="kittingProduct"
                                ></kitting-tab>
                            </div>
                            <!-- Kitting Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="price" class="no-border">
                            <!-- Price Content-->
                            <price-tab :validation="$v"
                                       v-bind:kittingProduct="kittingProduct"></price-tab>
                            <!-- Price Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="location" class="no-border">
                            <!-- Location Content-->
                            <div class=" mt-10 pd-10">
                                <location-tab v-bind:kittingProduct="kittingProduct"></location-tab>
                            </div>
                            <!-- Location Content End-->
                        </q-tab-pane>
                        <q-tab-pane name="general" class="no-border">
                            <!-- General Content-->
                            <div class="product-tab-content-sections mt-10 pd-10">
                                <general-tab :validation="$v"
                                             v-bind:kittingProduct="kittingProduct"></general-tab>
                            </div>
                            <!-- General Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="description" class="no-border">
                            <!-- Description Content -->
                            <description-tab :validation="$v"
                                             v-bind:kittingProduct="kittingProduct"></description-tab>
                            <!-- Description Content End -->
                        </q-tab-pane>
                        <q-tab-pane name="image" class="no-border">
                            <!-- Images Content -->
                            <div class="product-tab-content-sections mt-10 pd-10">
                                <image-tab v-bind:kittingProduct="kittingProduct"></image-tab>
                            </div>
                            <!-- Images Content End -->
                        </q-tab-pane>
                        <!-- Tab Content End -->
                    </q-tabs>
                </div>
            </template>
        </basic-form>
        <q-placeholder v-else=""></q-placeholder>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>

<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import qPlaceholder from 'src/application/global/components/common/loading/placeholder'
  import {
    KittingTab,
    PriceTab,
    LocationTab,
    GeneralTab,
    DescriptionTab,
    ImageTab
  } from 'src/application/products/components/kitting-tabs/index'
  import {required} from 'vuelidate/lib/validators'
  import {date} from 'quasar'

  // Init kitting_price object for new product
  function initKittingPrice() {
    return {
      gmp_price_tax: 0.00,
      nmp_price: 0.00,
      rp_price: 0.00,
      rp_price_tax: 0.00,
      effective_date: '',
      expiry_date: '',
      base_cv: 0,
      wp_cv: 0,
      cv_1: 0,
      cv_2: 0,
      cv_3: 0,
      cv_4: 0,
      cv_5: 0,
      cv_6: 0,
      bonuses: {
        welcome_bonus_1: 0,
        welcome_bonus_2: 0,
        welcome_bonus_3: 0,
        welcome_bonus_4: 0,
        welcome_bonus_5: 0
      }
    }
  }

  const REQUEST = 'REQUEST'
  const RESPONSE = 'RESPONSE'

  export default {
    name: 'kitting-standard-setup-steps',
    components: {
      generalHeader,
      basicForm,
      qLoader,
      qPlaceholder,
      KittingTab,
      PriceTab,
      LocationTab,
      GeneralTab,
      DescriptionTab,
      ImageTab
    },
    props: ['id'],
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        selectedFilters: state => state.globalCMP.selectedFilters,
        kittingData: state => state.productsCMP.saveData.data
      }),
      ...mapGetters([
        'taxable',
        'taxRate',
        'taxLabel',
        'currencyLabel'
      ])
    },
    mounted() {
      if (!this.selectedFilters.countryID > 0) {
        this.invalidRequest()
      } else {
        this.initSetupArea()
      }
    },
    data: () => ({
      copied: false,
      message: '',
      show: false,
      kittingProduct: {
        name: '',
        code: '',
        active: 0,
        kitting_price: {},
        kitting_products: [],
        description: [],
        location: {
          selected: []
        },
        general: {
          sale_types: [],
          cv_config: [],
          product_additional_requirements: []
        },
        images: {
          list: [],
          selected: []
        }
      },
      floatLabel: 'Product Images',
      color: 'faded',
      extensions: '.gif,.jpg,.jpeg,.png',
      types: [
        {
          label: 'Upload Photo',
          ref: 'productImgModal'
        }
      ],
      defaultText: 'Default',
      defaultImgColor: 'faded',
      defaultImg: false,
      showUpload: false
    }),
    validations: {
      kittingProduct: {
        name: {required},
        code: {required},
        kitting_price: {
          gmp_price_tax: {required},
          effective_date: {
            required,
            isInRange(val, elm) {
              if (elm) {
                if (elm.expiry_date) {
                  let diff = date.getDateDiff(elm.expiry_date, val, 'days')
                  if (diff > 0) {
                    return true
                  } else {
                    return false
                  }
                }
              }
              return false
            }
          },
          expiry_date: {
            required,
            // Custom validation with function
            // val return current input value
            // elm return entire current promotion_prices array
            isInRange(val, elm) {
              if (elm) {
                if (elm.effective_date) {
                  let diff = date.getDateDiff(val, elm.effective_date, 'days')
                  if (diff > 0) {
                    return true
                  } else {
                    return false
                  }
                }
              }
              return false
            }
          },
          base_cv: {required},
          wp_cv: {required}
        },
        //Todo removed might be enable back
//        kitting_products: {
//          required,
//          minLengths (val) {
//            let count = 0
//            val.forEach((item) => {
//              count += item.quantity
//            })
//            if (count > 1) {
//              return true
//            }
//            return false
//          }
//        },
        description: {
          $each: {
            marketing_description: {required}
          }
        },
        general: {
          sale_types: {required}
        }
      }
    },
    methods: {
      ...mapActions([
        'createKittingProductAction',
        'getKittingProductByIdAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        unsetFilterData: 'UNSET_FILTER_DATA',
        unsetProductData: 'UNSET_PRODUCT_DATA',
        setProductKittingData: 'SET_PRODUCT_KITTING_DATA'
      }),
      initSetupArea() {
        let query = {
          country_id: this.selectedFilters.countryID,
          kitting_id: this.id !== undefined ? this.id : ''
        }
        this.getKittingProductByIdAction(query).then(res => {
          this.manipulateSaveData(REQUEST)
        })
      },
      manipulateSaveData(operation, data) {
        if (operation === 'RESPONSE') {
          this.setProductKittingData(data)
        }
        this.kittingProduct = Object.assign({}, JSON.parse(JSON.stringify(this.kittingData)))
        // Initialize missing objects for new kitting setup
        if (this.kittingProduct.kitting_price === null || typeof this.kittingProduct.kitting_price.id === 'undefined') {
          this.kittingProduct.kitting_price = Object.assign({}, initKittingPrice())
        }

        let general = {}
        if (typeof this.kittingProduct.general.sale_types === 'undefined') {
          general.sale_types = []
        } else {
          general.sale_types = this.kittingProduct.general.sale_types
        }
        if (typeof this.kittingProduct.general.cv_config === 'undefined') {
          general.cv_config = []
        } else {
          general.cv_config = this.kittingProduct.general.cv_config
        }
        if (typeof this.kittingProduct.general.product_additional_requirements === 'undefined') {
          general.product_additional_requirements = []
        } else {
          general.product_additional_requirements = this.kittingProduct.general.product_additional_requirements
        }
        // Assign newly constructed general object to local standardProduct object
        if (Object.keys(general).length > 0) {
          this.kittingProduct.general = Object.assign({}, general)
        }
        this.show = true
      },
      invalidRequest() {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Kitting Products List'})
        }, 1500)
      },
      processForm: function (formFieldData) {
        this.$v.kittingProduct.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.kittingProduct.$error) {
            this.createKittingProductAction(formFieldData).then((res) => {
              // Update vuex saveData
              // Wrap response with data {} object to ensure follow API request standard
              this.manipulateSaveData(RESPONSE, {data: res})
              this.$v.$reset()
              resolve(res)
            })
          } else {
            this.setNotification({
              title: 'products.kitting.creation.failed',
              message: 'validation.failed',
              type: 'negative'
            })
            reject(this.$v.kittingProduct.$error)
          }
        })
      },
      doCopy: function () {
        this.$copyText(this.kittingProduct.code).then((e) => {
          this.copied = true
          setTimeout(() => {
            this.copied = false
          }, 1000)
        })
      }
    },
    beforeDestroy: function () {
      this.unsetProductData()
    }
  }
</script>
<style lang="stylus">
    #SetupForm
        .ellipsis
            overflow visible
</style>
