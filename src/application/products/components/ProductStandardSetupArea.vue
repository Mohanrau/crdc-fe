<template>
  <div class="general-page-holder relative-position">
    <basic-form formName="SetupForm"
                v-if="show"
                :backgroudColor="false"
                :formTitle="$t('products.standard.setup.title')"
                v-bind:formFieldData="standardProduct"
                urlResetPathName="Standard Products List"
                formAction="createStandardProductAction"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm">
      <template slot="form-title" slot-scope="props">
        <div class="text-grey-7">{{ selectedFilters.countryName }}</div>
        <div class="row items-center">
          <span v-if="!copied" class="cursor-pointer" @dblclick="doCopy">{{ standardProduct.sku }}</span>
          <span class="q-body-1 text-positive" v-else="" :class="{'animated flash' : copied}">{{ $t('Common.Copied.Text') }}</span>
          <span> : {{ standardProduct.name}} </span>
        </div>
      </template>
      <template slot="form">
        <div class="form-tabs mt-20 text-black bg-white shadow-1">
          <q-tabs inverted color="grey-4" align="justify">
            <q-tab :alert="$v.standardProduct.base_price.$error || $v.standardProduct.promotion_prices.$invalid"
                   default name="price" slot="title" icon="attach money" :label="$t('products.standard.tab.price')"/>
            <q-tab name="location" slot="title" icon="location on" :label="$t('products.standard.tab.location')"/>
            <q-tab name="general" slot="title" icon="settings" :label="$t('products.standard.tab.general')"/>
            <q-tab :alert="$v.standardProduct.description.$error || $v.standardProduct.description.$invalid"
                   name="description" slot="title" icon="description" :label="$t('products.standard.tab.description')"/>
            <q-tab name="image" slot="title" icon="image" :label="$t('products.standard.tab.image')"/>
            <!-- Tab Content -->
            <q-tab-pane name="price" class="no-border">
              <!-- Price Content-->
              <div class="product-tab-content-sections mt-10 pd-10">
                <price-tab v-if="show" :validation="$v"
                           v-bind:standardProduct="standardProduct"></price-tab>
              </div>
              <!-- Price Content Emd -->
            </q-tab-pane>
            <q-tab-pane name="location" class="no-border">
              <!-- Location Content-->
              <div class="product-tab-content-sections mt-10 pd-10">
                <location-tab v-if="show" v-bind:standardProduct="standardProduct"></location-tab>
              </div>
              <!-- Location Content End-->
            </q-tab-pane>
            <q-tab-pane name="general" class="no-border">
              <!-- General Content-->
              <div class="product-tab-content-sections mt-10 pd-10">
                <general-tab v-if="show" v-bind:standardProduct="standardProduct"></general-tab>
              </div>
              <!-- General Content End -->
            </q-tab-pane>
            <q-tab-pane name="description" class="no-border">
              <!-- Description Content -->
              <div class="product-tab-content-sections mt-10 pd-10">
                <description-tab v-if="show" :validation="$v"
                                 v-bind:standardProduct="standardProduct"></description-tab>
              </div>
              <!-- Description Content End -->
            </q-tab-pane>
            <q-tab-pane name="image" class="no-border">
              <!-- Images Content -->
              <div class="product-tab-content-sections mt-10 pd-10">
                <image-tab v-if="show" v-bind:standardProduct="standardProduct"></image-tab>
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
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import qPlaceholder from 'src/application/global/components/common/loading/placeholder'
  import {date} from 'quasar'
  import {
    DescriptionTab,
    GeneralTab,
    ImageTab,
    LocationTab,
    PriceTab
  } from 'src/application/products/components/standard-tabs/index'
  import {DirtyAlertMixin} from 'src/application/global/mixins/index'
  import {required} from 'vuelidate/lib/validators'
  
  export default {
    name: 'product-standard-setup-steps',
    components: {
      generalHeader,
      basicForm,
      qLoader,
      qPlaceholder,
      PriceTab,
      LocationTab,
      GeneralTab,
      DescriptionTab,
      ImageTab
    },
    mixins: [DirtyAlertMixin],
    props: ['id'],
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessing: state => state.globalCMP.isProcessing,
        selectedFilters: state => state.globalCMP.selectedFilters,
        productData: state => state.productsCMP.saveData.data
      }),
      ...mapGetters([
        'locationOptions',
        'taxable',
        'taxRate',
        'taxLabel',
        'currencyLabel'
      ])
    },
    watch: {
      standardProduct: {
        handler () {
          this.dirtyChecker()
        },
        deep: true
      }
    },
    mounted () {
      this.initSetupArea()
    },
    data: () => ({
      copied: false,
      message: '',
      show: false,
      reverseCal: false,
      standardProduct: {
        product_id: '',
        country_id: '',
        categories: [],
        languages: [],
        ibs_active: '',
        base_price: {
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
          bonuses: {
            welcome_bonus_1: '',
            welcome_bonus_2: '',
            welcome_bonus_3: '',
            welcome_bonus_4: '',
            welcome_bonus_5: ''
          }
        },
        promotion_prices: [],
        location: {
          selected: []
        },
        general: {
          sale_types: [],
          cv_config: [],
          product_additional_requirements: []
        },
        description: [],
        images: {
          list: [],
          selected: []
        }
      }
    }),
    // Todo Backend validation and dates overlap validation need to be done in next sprint
    validations: {
      standardProduct: {
        base_price: {
          gmp_price_tax: {required},
          effective_date: {
            required,
            isInRange (val, elm) {
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
            isInRange (val, elm) {
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
        promotion_prices: {
          $each: {
            gmp_price_tax: {required},
            base_cv: {required},
            wp_cv: {required},
            effective_date: {
              required,
              isInRange (val, elm) {
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
              // elm return current promotion_prices array
              isInRange (val, elm) {
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
            }
          }
        },
        description: {
          $each: {
            marketing_description: {required},
            benefits: {required}
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'updateStandardProductAction',
        'getProductByIdAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        unsetProductData: 'UNSET_PRODUCT_DATA'
      }),
      initSetupArea () {
        if (this.selectedFilters.productID === '' || this.selectedFilters.countryID === '') {
          this.invalidRequest()
        } else {
          let query = {
            country_id: this.selectedFilters.countryID,
            product_id: this.id
          }
          this.getProductByIdAction(query).then(() => {
            this.show = true
            this.manipulateSaveData()
          })
        }
      },
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Standard Products List'})
        }, 1500)
      },
      manipulateSaveData () {
        // Clone vuex object into local object
        this.standardProduct = Object.assign({}, JSON.parse(JSON.stringify(this.productData)))
        // Static object
        let general = {}
        if (typeof this.standardProduct.general.sale_types === 'undefined') {
          general.sale_types = []
        } else {
          general.sale_types = this.standardProduct.general.sale_types
        }
        if (typeof this.standardProduct.general.cv_config === 'undefined') {
          general.cv_config = []
        } else {
          general.cv_config = this.standardProduct.general.cv_config
        }
        if (typeof this.standardProduct.general.product_additional_requirements === 'undefined') {
          general.product_additional_requirements = []
        } else {
          general.product_additional_requirements = this.standardProduct.general.product_additional_requirements
        }
        // Assign newly constructed general object to local standardProduct object
        if (Object.keys(general).length > 0) {
          this.standardProduct.general = Object.assign({}, general)
        }
      },
      processForm: function (formFieldData) {
        this.$v.standardProduct.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.standardProduct.$error) {
            this.updateStandardProductAction(formFieldData).then((response) => {
              // Mixin function
              this.skipDirtyChecker()
              this.manipulateSaveData()
              this.$v.$reset()
              resolve(response)
            })
          } else {
            this.setNotification({
              title: 'products.standard.creation.failed',
              message: 'validation.failed',
              type: 'negative'
            })
            reject(this.$v.standardProduct.$error)
          }
        })
      },
      doCopy: function () {
        this.$copyText(this.standardProduct.sku).then((e) => {
          this.copied = true
          setTimeout(() => {
            this.copied = false
          }, 1000)
        })
      }
    },
    beforeDestroy () {
      this.unsetProductData()
    }
  }
</script>
<style lang="stylus">
  #SetupForm
    .ellipsis
      overflow visible
</style>
