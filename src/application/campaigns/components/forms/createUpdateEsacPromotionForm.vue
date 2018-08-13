<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createUpdateEsacPromotionForm"
                    :backgroudColor="false"
                    :formTitle="$t('campaigns.esacPromotionNew.title')"
                    v-bind:formFieldData="esacPromotionData"
                    urlResetPathName="eSac Promotion List"
                    formAction="createEsacPromotionAction"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="pwp-foc-section">
                    <div class="configuration-content-sections shadow-1 pd-10  bg-white">
                        <div class="row gutter-sm">
                            <div class="col-lg-6">
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.setupDate')">
                                            <q-chip class="fit" square small>
                                                {{esacPromotionData.setup_date}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.id')">
                                            <q-chip class="fit" square small>
                                                {{esacPromotionData.id}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.campaign')"
                                                 helper="*"
                                                 :error="getErrorState('campaign_id')"
                                                 :error-label="getErrorMessage('campaign_id')"
                                        >
                                            <q-select
                                                    color="primary"
                                                    v-model="esacPromotionData.campaign_id"
                                                    :options="campaignsOptions"
                                                    @input="campaignChange"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.startDate')">
                                            <q-chip class="fit" square small>
                                                {{esacPromotionData.campaign_start}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.endDate')">
                                            <q-chip class="fit" square small>
                                                {{esacPromotionData.campaign_end}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.taxable')">
                                            <q-checkbox :label="$t('campaigns.esacPromotion.taxable')" 
                                              v-model="esacPromotionData.taxable" />
                                        </q-field>
                                    </div>
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.esacVoucherType')"
                                                 helper="*"
                                                 :error="getErrorState('voucher_type_id')"
                                                 :error-label="getErrorMessage('voucher_type_id')"
                                        >
                                            <q-select
                                                    color="primary"
                                                    v-model="esacPromotionData.voucher_type_id"
                                                    :readonly="esacPromotionData.esac_promotion_voucher_sub_types.length > 0"
                                                    :disabled="esacPromotionData.esac_promotion_voucher_sub_types.length > 0"
                                                    :options="esacVoucherTypesOptions"
                                                    @input="voucherTypeChange"
                                            />
                                        </q-field>
                                    </div>
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacPromotion.entitledBy')"
                                                 :error="getErrorState('entitled_by')"
                                                 :error-label="getErrorMessage('entitled_by')"
                                        >
                                            <q-option-group
                                                    type="radio"
                                                    color="primary"
                                                    :readonly="entitledByDisabled"
                                                    :disabled="entitledByDisabled"
                                                    inline
                                                    v-model="esacPromotionData.entitled_by"
                                                    :options="entitledBysOptions"
                                                    @input="entitledByChange"
                                            />
                                        </q-field>
                                    </div>
                                    <div class="general-item relative-position" v-show="esacPromotionData.entitled_by === 'P'">
                                        <q-field :label="$t('campaigns.esacPromotion.maxPurchaseQuantity')"
                                                helper="*"
                                                :error="getErrorState('max_purchase_qty')"
                                                :error-label="getErrorMessage('max_purchase_qty')"
                                        >
                                            <q-input v-model="esacPromotionData.max_purchase_qty"
                                                    type="number"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-tabs mt-20 text-black">
                            <q-tabs v-model="selectedTab" inverted color="grey-7" align="justify">
                                <q-tab name="productCategories" v-show="esacPromotionData.entitled_by === 'C'"
                                      :alert="$v.esacPromotionData.esac_promotion_product_categories.$error"
                                      slot="title" default
                                      :label="$t('campaigns.esacPromotion.tabProductCategory')"/>
                                <q-tab name="exceptionProducts" v-show="esacPromotionData.entitled_by === 'C'"
                                      slot="title"
                                      :label="$t('campaigns.esacPromotion.tabExceptionProduct')"/>
                                <q-tab name="products" v-show="esacPromotionData.entitled_by === 'P'"
                                      :alert="$v.esacPromotionData.products_and_kittings.$error"
                                      slot="title" default
                                      :label="$t('campaigns.esacPromotion.tabProduct')"/>
                                <q-tab name="voucherSubTypes" :disabled="esacPromotionData.voucher_type_id === null"
                                      :alert="$v.esacPromotionData.esac_promotion_voucher_sub_types.$error"
                                      slot="title"
                                      :label="$t('campaigns.esacPromotion.tabVoucherSubType')"/>
                                <!-- Tab Content -->
                                <q-tab-pane name="productCategories" class="no-border">
                                    <div class="pd-10">
                                        <product-categories-tab :validation="$v" v-bind:esacPromotionData="esacPromotionData"></product-categories-tab>
                                    </div>
                                </q-tab-pane>
                                <q-tab-pane name="exceptionProducts" class="no-border">
                                    <div class="pd-10">
                                        <exception-products-tab :validation="$v" v-bind:esacPromotionData="esacPromotionData"></exception-products-tab>
                                    </div>
                                </q-tab-pane>
                                <q-tab-pane name="products" class="no-border">
                                    <div class="pd-10">
                                        <products-tab :validation="$v" v-bind:esacPromotionData="esacPromotionData"></products-tab>
                                    </div>
                                </q-tab-pane>
                                <q-tab-pane name="voucherSubTypes" class="no-border">
                                    <div class="pd-10">
                                        <esac-voucher-sub-types-tab 
                                            :validation="$v" 
                                            v-bind:esacPromotionData="esacPromotionData" 
                                            :esacVoucherSubTypesOptions="esacVoucherSubTypesOptions" 
                                            :voucherPeriodsOptions="voucherPeriodsOptions"
                                            :currencyLabel="currencyLabelByCountry"
                                        ></esac-voucher-sub-types-tab>
                                    </div>
                                </q-tab-pane>
                            </q-tabs>
                        </div>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import {DatesMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {
    ProductCategoriesTab,
    ExceptionProductsTab,
    ProductsTab,
    EsacVoucherSubTypesTab
  } from 'src/application/campaigns/components/forms/promotion-tabs/index'
  import _ from 'lodash'
  import { api } from '../../api'
  import { required, requiredIf, minLength, maxLength, between, numeric, url } from 'vuelidate/lib/validators'
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

  export default {
    name: 'create-update-esac-voucher-type-form',
    components: {
      BasicForm: basicForm,
      qLoader,
      ProductCategoriesTab,
      ExceptionProductsTab,
      ProductsTab,
      EsacVoucherSubTypesTab
    },
    props: ['esacPromotionId'],
    mixins: [DatesMixin, MasterDataTransformarMixin],
    computed: {
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        selectedFilters: state => state.globalCMP.selectedFilters,
        masterData: state => state.globalCMP.masterData.data.list,
        formData: state => state.globalCMP.formData,
      }),
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry'
      }),
      voucherPeriodsOptions: function() {
        return this.masterDataOptionsCreator(this.$const.masterKey.VOUCHER_PERIOD).map(
          opt => ({
            label: opt.label,
            value: {label: opt.label, value: opt.value}
          })
        )
      },
      entitledByDisabled: function() {
        if(this.esacPromotionData.esac_promotion_product_categories.length > 0 ||
          this.esacPromotionData.exception_products_and_kittings.length > 0 ||
          this.esacPromotionData.products_and_kittings.length > 0 ||
          this.esacPromotionData.esac_promotion_voucher_sub_types.length > 0) {
          return true
        }
        return false
      }
    },
    mounted: function () {
      this.setIsProcessingForm(true)
      let query = {
        country_id: this.selectedFilters.countryID,
        relations: ['currency']
      }
      this.getCountryRelationAction(query)
      this.master.keys = [this.$const.masterKey.VOUCHER_PERIOD]
      if (this.esacPromotionId) {
        this.setFormData()
      }
      else {
        this.esacPromotionData.country_id = this.selectedFilters.countryID
        this.esacPromotionData.setup_date = this.formatDate(new Date())
        this.countryChange()
        this.setIsProcessingForm(false)
      }
    },
    data: () => ({
      message: '',
      headers: {
        Accept: 'form-data',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
      },
      campaignsOptions: [],
      esacVoucherTypesOptions: [],
      esacVoucherSubTypesOptions: [],
      entitledBysOptions : [
        {label:'Product', value:'P'},
        {label:'Category', value:'C'},
      ],
      esacPromotionData: {
        country_id: null,
        campaign_id: null,
        campaign_start: null,
        campaign_end: null,
        taxable: false,
        voucher_type_id: null,
        entitled_by: 'P',
        max_purchase_qty: null,
        active: 1,
        product_categories: [],
        exception_products_and_kittings: [],
        exception_products: [],
        exception_kittings: [],
        products_and_kittings: [],
        products: [],
        kittings: [],
        esac_promotion_product_categories: [],
        esac_promotion_exception_products: [],
        esac_promotion_products: [],
        esac_promotion_voucher_sub_types:[]
      },
      selectedTab: 'products' // 'productCategories'
    }),
    validations: {
      esacPromotionData: {
        country_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        campaign_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        voucher_type_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        max_purchase_qty: {
          required: requiredIf(function (nestedModel) {
              return (this.esacPromotionData.entitled_by === "P")
            }),
          numeric,
          customValidator (val) {
            if(this.esacPromotionData.entitled_by === "P") {
              return val > 0
            }
            return true
          }
        },
        active: {
          required
        },
        esac_promotion_product_categories: {
          customValidator (val) {
            if(this.esacPromotionData.entitled_by === "C") {
              return (this.esacPromotionData.esac_promotion_product_categories.length > 0)
            }
            return true
          }
        },
        products_and_kittings: {
          customValidator (val) {
            if(this.esacPromotionData.entitled_by === "P") {
              return (this.esacPromotionData.products_and_kittings.length > 0)
            }
            return true
          }
        },
        esac_promotion_voucher_sub_types: {
          customValidator (val) {
            return (this.esacPromotionData.esac_promotion_voucher_sub_types.length > 0)
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'getCountryRelationAction',
        'getCampaignListAction',
        'getCampaignAction',
        'getEsacVoucherTypeListAction',
        'getEsacVoucherSubTypeListAction',
        'getEsacPromotionAction',
        'createEsacPromotionAction',
        'updateEsacPromotionAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
      }),
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'eSac Promotion List'})
        }, 1500)
      },
      setFormData: function () {
        this.getEsacPromotionAction(this.esacPromotionId).then((res) => {
          // clone object assign store state to local state
          this.esacPromotionData = Object.assign({}, this.formData.formData)
          this.manipulateSaveData()
          this.countryChange()
          this.campaignChange()
          this.voucherTypeChange()
          this.entitledByChange()
          this.setIsProcessingForm(false)
        }).catch((error) => {
          if (error.status === 404) {
            this.setNotification({
              title: 'Uh oh! An error occured',
              message: error.data.error,
              type: 'negative'
            })
          }
          this.invalidRequest()
        })
      },
      manipulateSaveData: function () {
        let esacPromotionData = Object.assign({}, JSON.parse(JSON.stringify(this.esacPromotionData)))
        esacPromotionData.setup_date = this.formatDate(new Date(esacPromotionData.created_at))
        esacPromotionData.campaign_start = esacPromotionData.campaign.from_cw_schedule.cw_name
        esacPromotionData.campaign_end = esacPromotionData.campaign.to_cw_schedule.cw_name
        esacPromotionData.exception_products_and_kittings = []
        esacPromotionData.products_and_kittings = []
        esacPromotionData.esac_promotion_exception_products.forEach(x => {
          esacPromotionData.exception_products_and_kittings.push({
            product_id: x.id,
            kitting_id: null,
            product_type: 'P',
            display_type: "Product",
            display_code: x.sku,
            display_name: x.name
          })
        })
        esacPromotionData.esac_promotion_exception_kittings.forEach(x => {
          esacPromotionData.exception_products_and_kittings.push({
            product_id: null,
            kitting_id: x.id,
            product_type: 'K',
            display_type: "Kitting",
            display_code: x.code,
            display_name: x.name
          })
        })
        esacPromotionData.esac_promotion_products.forEach(x => {
          esacPromotionData.products_and_kittings.push({
            product_id: x.id,
            kitting_id: null,
            product_type: 'P',
            display_type: "Product",
            display_code: x.sku,
            display_name: x.name
          })
        })
        esacPromotionData.esac_promotion_kittings.forEach(x => {
          esacPromotionData.products_and_kittings.push({
            product_id: null,
            kitting_id: x.id,
            product_type: 'K',
            display_type: "Kitting",
            display_code: x.code,
            display_name: x.name
          })
        })
        esacPromotionData.esac_promotion_voucher_sub_types.forEach(x => {
          x.voucher_sub_type_name = x.voucher_sub_type.name
          x.voucher_period_name = x.voucher_period.title
        })
        this.esacPromotionData = esacPromotionData
      },
      getErrorState: function (name) {
        var isError = false
        if (this.$v.esacPromotionData[name] !== undefined) {
          isError = this.$v.esacPromotionData[name].$error
        }
        if (isError === false) {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            isError = true
          } else {
            isError = false
          }
        }
        return isError
      },
      getErrorMessage: function (name) {
        var errorMessage = ''
        if (this.$v.esacPromotionData[name] !== undefined) {
          if (this.$v.esacPromotionData[name].$error) {
            if (this.$v.esacPromotionData[name].hasOwnProperty('required')) {
              if (this.$v.esacPromotionData[name].required === false) {
                errorMessage = 'Required'
              }
            }
            if (this.$v.esacPromotionData[name].hasOwnProperty('minLength')) {
              if (this.$v.esacPromotionData[name].minLength === false) {
                errorMessage = 'Minimum length'
              }
            }
            if (this.$v.esacPromotionData[name].hasOwnProperty('maxLength')) {
              if (this.$v.esacPromotionData[name].maxLength === false) {
                errorMessage = 'Maximum length'
              }
            }
            if (this.$v.esacPromotionData[name].hasOwnProperty('numeric')) {
              if (this.$v.esacPromotionData[name].numeric === false) {
                errorMessage = 'Must be numeric value'
              }
            }
          }
        }
        if (errorMessage === '') {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            if (this.errors.hasOwnProperty(name)) {
              errorMessage = this.errors[name][0]
            }
          }
        }
        return errorMessage
      },
      countryChange () {
        this.campaignsOptions = []
        this.esacVoucherTypesOptions = []
        if (this.esacPromotionData.country_id > 0) {
          let query = {}
          query.country_id = this.esacPromotionData.country_id
          this.getCampaignListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
            if (res.data.length > 0) {
              res.data.forEach(x => {
                this.campaignsOptions.push({
                  label: x.name,
                  value: x.id
                })
              })
            }
          })
          this.getEsacVoucherTypeListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
            if (res.data.length > 0) {
              res.data.forEach(x => {
                this.esacVoucherTypesOptions.push({
                  label: x.name,
                  value: x.id
                })
              })
            }
          })
        } else {
          this.disable = true
        }
      },
      campaignChange() {
        this.getCampaignAction(this.esacPromotionData.campaign_id).then((res) => {
          this.esacPromotionData.campaign_start = res.from_cw_schedule.cw_name
          this.esacPromotionData.campaign_end = res.to_cw_schedule.cw_name
        })
      },
      voucherTypeChange() {
        this.esacVoucherSubTypesOptions = []
        if (this.esacPromotionData.voucher_type_id > 0) {
          let query = {}
          query.country_id = this.esacPromotionData.country_id
          query.voucher_type_id = this.esacPromotionData.voucher_type_id
          this.getEsacVoucherSubTypeListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
            if (res.data.length > 0) {
              res.data.forEach(x => {
                this.esacVoucherSubTypesOptions.push({
                  label: x.name,
                  value: { label: x.name, value: x.id }
                })
              })
            }
          })
        }
      },
      entitledByChange() {
        this.selectedTab = ((this.esacPromotionData.entitled_by === 'P')? 'products': 'productCategories')
      },
      processForm: function (formFieldData) {
        return new Promise((resolve, reject) => {
          this.$v.esacPromotionData.$touch()
          if (!this.$v.esacPromotionData.$error) {
            if (formFieldData.entitled_by === 'C') {
              formFieldData.max_purchase_qty = 0
            }
            formFieldData.exception_products = []
            formFieldData.exception_kittings = []
            formFieldData.products = []
            formFieldData.kittings = []
            formFieldData.exception_products_and_kittings.forEach(x => {
              if (x.product_type === 'P') {
                formFieldData.exception_products.push(x.product_id)
              } else {
                formFieldData.exception_kittings.push(x.kitting_id)
              }
            });
            formFieldData.products_and_kittings.forEach(x => {
              if (x.product_type === 'P') {
                formFieldData.products.push(x.product_id)
              } else {
                formFieldData.kittings.push(x.kitting_id)
              }
            });
            if (this.esacPromotionId) {
              this.updateEsacPromotionAction(formFieldData).then((response) => {
                resolve(response)
              }).catch(error => {
                if (typeof error.response !== 'undefined' && error.response.status === 422) {
                  if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                    this.setNotification({
                      title: 'eSac Promotion Editing Failed',
                      message: error.response.data.id[0],
                      type: 'negative'
                    })
                  }
                }
              })
            } else {
              this.createEsacPromotionAction(formFieldData).then((response) => {
                this.esacPromotionData = Object.assign({}, JSON.parse(JSON.stringify(response)))
                if (typeof this.esacPromotionData.errors !== 'undefined') {
                  delete this.esacPromotionData.errors
                }
                this.manipulateSaveData()
                this.$router.push({ name: 'Update eSac Promotion', params: { esacPromotionId: response.id }})
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'eSac Promotion Creation Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.esacPromotionData.$error)
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
    .options-holder
        border dotted 1px lightgray
</style>
