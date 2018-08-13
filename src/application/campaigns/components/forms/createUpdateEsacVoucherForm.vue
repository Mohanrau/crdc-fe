<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createUpdateEsacVoucherForm"
                    :backgroudColor="false"
                    :formTitle="$t('campaigns.esacVoucherNew.title')"
                    v-bind:formFieldData="esacVoucherData"
                    urlResetPathName="eSac Voucher List"
                    formAction="createEsacVoucherAction"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="pwp-foc-section">
                    <div class="configuration-content-sections shadow-1 pd-10  bg-white">
                        <div class="row gutter-sm">
                            <div class="col-lg-6" v-if='esacVoucherData.id === null'>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.campaign')"
                                                 helper="*"
                                                 :error="getErrorState('campaign_id')"
                                                 :error-label="getErrorMessage('campaign_id')"
                                        >
                                            <q-select
                                                    color="primary"
                                                    v-model="esacVoucherData.campaign_id"
                                                    :options="campaignsOptions"
                                                    @input="campaignChange"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.esacPromotion')"
                                                helper="*"
                                                :error="getErrorState('promotion_id')"
                                                :error-label="getErrorMessage('promotion_id')"
                                        >
                                            <q-select
                                                    color="primary"
                                                    v-model="esacVoucherData.promotion_value"
                                                    :options="esacPromotionsOptions"
                                                    @input="promotionChange"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.esacVoucherType')"
                                                helper="*"
                                                :error="getErrorState('voucher_type_id')"
                                                :error-label="getErrorMessage('voucher_type_id')"
                                        >
                                            <q-select
                                                    color="primary"
                                                    v-model="esacVoucherData.voucher_type_id"
                                                    :options="esacVoucherTypesOptions"
                                                    :readonly="true"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.esacVoucherSubType')"
                                                helper="*"
                                                :error="getErrorState('voucher_sub_type_id')"
                                                :error-label="getErrorMessage('voucher_sub_type_id')"
                                        >
                                            <q-select
                                                    color="primary"
                                                    v-model="esacVoucherData.voucher_sub_type_id"
                                                    :options="esacVoucherSubTypesOptions"
                                                    @input="voucherSubTypeChange"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherNumber')" 
                                                 helper="*"
                                                 :error="getErrorState('voucher_number')"
                                                 :error-label="getErrorMessage('voucher_number')"
                                                 :count="10"
                                        >
                                            <q-input v-model="esacVoucherData.voucher_number"
                                                     ></q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherValue')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.voucher_value}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherStatus')"
                                                 helper="*"
                                                :error="getErrorState('voucher_status')"
                                                :error-label="getErrorMessage('voucher_status')"
                                        >
                                            <q-select
                                                color="primary"
                                                v-model="esacVoucherData.voucher_status"
                                                :options="esacVoucherStatusOptions"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherRemarks')"
                                                 helper="*"
                                                 :error="getErrorState('voucher_remarks')"
                                                 :error-label="getErrorMessage('voucher_remarks')"
                                                 :count="500"
                                        >
                                            <q-input type="textarea" :min-rows="5"
                                                     :max-height="80" v-model="esacVoucherData.voucher_remarks"
                                                     ></q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherPeriod')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.voucher_period.title}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.member')"
                                                 helper="*"
                                                 :error="getErrorState('member_user_id')"
                                                 :error-label="getErrorMessage('member_user_id')"
                                        >
                                            <q-search v-model="esacVoucherData.member_search" :placeholder="$t('Common.search.placeholder')">
                                                <q-autocomplete
                                                      :max-results="10"
                                                      @search="searchMember"
                                                      @selected="selectedMember"
                                                />
                                            </q-search>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.iboId')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.ibo_id}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.iboName')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.ibo_name}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherIssuedDate')"
                                                 helper="*"
                                                 :error="getErrorState('issued_date')"
                                                 :error-label="getErrorMessage('issued_date')"
                                        >
                                            <q-datetime v-model="esacVoucherData.issued_date" type="date" 
                                              @input="voucherIssuedDateChange"/>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherExpiryDate')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.expiry_date}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4" v-if='esacVoucherData.id !== null'>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.id')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.id}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherNumber')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.voucher_number}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherValue')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.voucher_value}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.iboId')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.ibo_id}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.iboName')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.ibo_name}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4" v-if='esacVoucherData.id !== null'>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.campaignName')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.campaign.name}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.campaignStartDate')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.campaign.from_cw_schedule.date_from}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.campaignEndDate')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.campaign.to_cw_schedule.date_to}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.campaignStartCw')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.campaign.from_cw_schedule.cw_name}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.campaignEndCw')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.campaign.to_cw_schedule.cw_name}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4" v-if='esacVoucherData.id !== null'>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherIssuedDate')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.issued_date}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherPeriod')">
                                            <q-chip class="fit" square small>
                                                {{esacVoucherData.voucher_period.title}}
                                            </q-chip>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherExpiryDate')"
                                                 helper="*"
                                                 :error="getErrorState('expiry_date')"
                                                 :error-label="getErrorMessage('expiry_date')"
                                        >
                                            <q-datetime v-model="esacVoucherData.expiry_date" type="date" />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherStatus')"
                                                 helper="*"
                                                :error="getErrorState('voucher_status')"
                                                :error-label="getErrorMessage('voucher_status')"
                                        >
                                            <q-select
                                                color="primary"
                                                v-model="esacVoucherData.voucher_status"
                                                :options="esacVoucherStatusOptions"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field :label="$t('campaigns.esacVoucher.voucherRemarks')"
                                                 helper="*"
                                                 :error="getErrorState('voucher_remarks')"
                                                 :error-label="getErrorMessage('voucher_remarks')"
                                                 :count="500"
                                        >
                                            <q-input type="textarea" :min-rows="5"
                                                     :max-height="80" v-model="esacVoucherData.voucher_remarks"
                                                     ></q-input>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import Vue from 'vue'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {DatesMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
  import _ from 'lodash'
  import { date } from 'quasar'
  import { api } from '../../api'
  import { required, minLength, maxLength, between, numeric, url } from 'vuelidate/lib/validators'
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

  export default {
    name: 'create-update-esac-voucher-form',
    components: {
      BasicForm: basicForm,
      qLoader
    },
    mixins: [DatesMixin, MasterDataTransformarMixin],
    props: ['esacVoucherId'],
    computed: {
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        selectedFilters: state => state.globalCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        formData: state => state.globalCMP.formData,
      }),
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry',
        esacVoucherTypeList: 'tableDataEsacVoucherTypes',
        paginationQuery: 'pagination'
      })
    },
    mounted: function () {
      this.master.keys = [this.$const.masterKey.VOUCHER_PERIOD]
      if (this.esacVoucherId) {
        this.setFormData()
      }
      else {
        this.esacVoucherData.country_id = this.selectedFilters.countryID
        this.countryChange()
      }
      let query = {
        country_id: this.selectedFilters.countryID,
        relations: ['currency']
      }
      this.getCountryRelationAction(query)
    },
    data: () => ({
      message: '',
      headers: {
        Accept: 'form-data',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
      },
      campaignsOptions: [],
      esacPromotionsOptions: [],
      esacVoucherTypesMaster: [],
      esacVoucherTypesOptions: [],
      esacVoucherSubTypesOptions: [],
      voucherPeriodsOptions: [],
      esacVoucherStatusOptions: [
        {label: Vue.prototype.$t('campaigns.esacVoucher.voucherStatusNew'), value: 'N'},
        {label: Vue.prototype.$t('campaigns.esacVoucher.voucherStatusProcessed'), value: 'P'},
        {label: Vue.prototype.$t('campaigns.esacVoucher.voucherStatusVoid'), value: 'V'}
      ],
      voucher_period_day: null,
      esacPromotionData: null,
      esacVoucherData: {
        id: null,
        country_id: null,
        campaign_id: null,
        promotion_value: null,
        promotion_id: null,
        voucher_type_id:null,
        voucher_sub_type_id:null,
        voucher_number: null,
        voucher_value: null,
        voucher_status: null,
        voucher_remarks: null,
        voucher_period_id: null,
        member_user_id: null,
        issued_date: null,
        expiry_date: null,
        active: 1,
        voucher_period: {
          title: ''
        }
      }
    }),
    validations: {
      esacVoucherData: {
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
        promotion_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        voucher_type_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        voucher_sub_type_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        voucher_number: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(50)
        },
        voucher_value: {
          required
        },
        voucher_status: {
          required
        },
        voucher_remarks: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(50)
        },
        voucher_period_id: {
          required
        },
        member_user_id: {
          required
        },
        issued_date: {
          required
        },
        expiry_date: {
          required
        },
        active: {
          required
        }
      }
    },
    methods: {
      ...mapActions([
        'getCountryRelationAction',
        'getCampaignListAction',
        'getEsacPromotionListAction',
        'getEsacVoucherTypeListAction',
        'getEsacVoucherSubTypeListAction',
        'getEsacPromotionAction',
        'getEsacVoucherAction',
        'getMemberSearchAction',
        'createEsacVoucherAction',
        'updateEsacVoucherAction'
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
          this.$router.push({name: 'eSac Voucher List'})
        }, 1500)
      },
      setFormData: function () {
        this.getEsacVoucherAction(this.esacVoucherId).then((res) => {
          // clone object assign store state to local state
          this.esacVoucherData = Object.assign({}, this.formData.formData)
          this.esacVoucherData.ibo_id = this.esacVoucherData.user.old_member_id
          this.esacVoucherData.ibo_name = this.esacVoucherData.user.name
          this.esacVoucherData.promotion_value = {
            id: this.esacVoucherData.promotion_id,
            voucher_type_id: this.esacVoucherData.voucher_type_id
          }
          this.countryChange()
          this.campaignChange()
          this.promotionChange()
          this.voucherSubTypeChange()
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
      getErrorState: function (name) {
        var isError = false
        if (this.$v.esacVoucherData[name] !== undefined) {
          isError = this.$v.esacVoucherData[name].$error
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
        if (this.$v.esacVoucherData[name] !== undefined) {
          if (this.$v.esacVoucherData[name].$error) {
            if (this.$v.esacVoucherData[name].hasOwnProperty('required')) {
              if (this.$v.esacVoucherData[name].required === false) {
                errorMessage = 'Required'
              }
            }
            if (this.$v.esacVoucherData[name].hasOwnProperty('minLength')) {
              if (this.$v.esacVoucherData[name].minLength === false) {
                errorMessage = 'Minimum length'
              }
            }
            if (this.$v.esacVoucherData[name].hasOwnProperty('maxLength')) {
              if (this.$v.esacVoucherData[name].maxLength === false) {
                errorMessage = 'Maximum length'
              }
            }
            if (this.$v.esacVoucherData[name].hasOwnProperty('numeric')) {
              if (this.$v.esacVoucherData[name].numeric === false) {
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
        if (this.esacVoucherData.country_id > 0) {
          let query = {}
          query.country_id = this.esacVoucherData.country_id
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
          this.campaignChange()
          this.esacVoucherTypesMaster = []
          let query2 = {}
          query2.country_id = this.esacVoucherData.country_id
          this.getEsacVoucherTypeListAction(_(query2).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
            if (res.data.length > 0) {
              res.data.forEach(x => {
                this.esacVoucherTypesMaster.push({
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
        this.esacPromotionsOptions = []
        let query = {}
        query.country_id = this.esacVoucherData.country_id
        query.campaign_id = this.esacVoucherData.campaign_id
        this.getEsacPromotionListAction(_(query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(res => {
          if (res.data.length > 0) {
            res.data.forEach(x => {
              this.esacPromotionsOptions.push({
                label: x.id + ' - ' + x.campaign.name + ' - ' + x.esac_voucher_type.name,
                value: {id: x.id, voucher_type_id: x.voucher_type_id}
              })
            })
          }
        })
      },
      promotionChange() {
        this.esacVoucherTypesOptions = []
        this.esacVoucherSubTypesOptions = []
        this.esacVoucherData.promotion_id = this.esacVoucherData.promotion_value.id
        this.esacVoucherData.voucher_type_id = this.esacVoucherData.promotion_value.voucher_type_id
        this.getEsacPromotionAction(this.esacVoucherData.promotion_id).then((res) => {
          // clone object assign store state to local state
          this.esacPromotionData = Object.assign({}, this.formData.formData)
          this.esacVoucherTypesMaster.forEach(x => {
            if (x.value === this.esacPromotionData.voucher_type_id) {
              this.esacVoucherTypesOptions.push({
                label: x.label,
                value: x.value
              })
            }
          })
          this.esacPromotionData.esac_promotion_voucher_sub_types.forEach(x => {
            this.esacVoucherSubTypesOptions.push({
              label: x.voucher_sub_type.name,
              value: x.voucher_sub_type.id
            })
          })
        }).catch((error) => {
          this.esacPromotionData = null
          if (error.status === 404) {
            this.setNotification({
              title: 'Uh oh! An error occured',
              message: error.data.error,
              type: 'negative'
            })
          }
        })
      },
      voucherSubTypeChange() {
        if (this.esacVoucherData.voucher_sub_type_id > 0 && this.esacPromotionData !== null) {
          this.esacPromotionData.esac_promotion_voucher_sub_types.forEach(x => {
            if (x.voucher_sub_type_id === this.esacVoucherData.voucher_sub_type_id) {
              this.esacVoucherData.voucher_value = x.voucher_amount
              this.esacVoucherData.voucher_period_id = x.voucher_period_id
              this.voucherPeriodsOptions = []
              this.voucherPeriodsOptions.push({
                label: x.voucher_period.title,
                value: x.voucher_period.id
              })
              this.esacVoucherData.voucher_period.title = x.voucher_period.title
              this.voucher_period_day = parseFloat(x.voucher_period.title)
              this.voucherIssuedDateChange()
            }
          })
        }
      },
      voucherIssuedDateChange() {
        if (this.esacVoucherData.issued_date && this.voucher_period_day) {
          this.esacVoucherData.expiry_date = this.formatDate(date.addToDate(this.esacVoucherData.issued_date, { days: this.voucher_period_day }))
        }
      },
      searchMember (terms, done) {
        let query = {
          search_text: this.esacVoucherData.member_search,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      selectedMember (item, keyboard) {
        if (!keyboard) {
          this.esacVoucherData.member_search = item.sublabel
          this.esacVoucherData.member_user_id = item.userID
          this.esacVoucherData.ibo_id = item.sublabel
          this.esacVoucherData.ibo_name = item.label
        }
      },
      processForm: function (formFieldData) {
        return new Promise((resolve, reject) => {
          this.$v.esacVoucherData.$touch()
          if (!this.$v.esacVoucherData.$error) {
            if (this.esacVoucherId) {
              this.updateEsacVoucherAction(formFieldData).then((response) => {
                resolve(response)
              }).catch(error => {
                if (typeof error.response !== 'undefined' && error.response.status === 422) {
                  if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                    this.setNotification({
                      title: 'eSac Voucher Editing Failed',
                      message: error.response.data.id[0],
                      type: 'negative'
                    })
                  }
                }
              })
            } else {
              this.createEsacVoucherAction(formFieldData).then((response) => {
                this.esacVoucherData = Object.assign({}, JSON.parse(JSON.stringify(response)))
                this.esacVoucherData.ibo_id = this.esacVoucherData.user.old_member_id
                this.esacVoucherData.ibo_name = this.esacVoucherData.user.name
                this.esacVoucherData.promotion_value = {
                  id: this.esacVoucherData.promotion_id,
                  voucher_type_id: this.esacVoucherData.voucher_type_id
                }
                if (typeof this.esacVoucherData.errors !== 'undefined') {
                  delete this.esacVoucherData.errors
                }
                this.$router.push({ name: 'Update eSac Voucher', params: { esacVoucherId: response.id }})
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'eSac Voucher Creation Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.esacVoucherData.$error)
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
