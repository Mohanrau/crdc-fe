<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SetupForm"
                    :backgroudColor="false"
                    formTitle="Member Setup"
                    v-bind:formFieldData="memberData"
                    urlResetPathName="Personal Data List"
                    formAction="updateMemberAction"
                    :formSubmit="processForm">
            <template slot="form">
                <div class="form-holder bg-white pd-20" v-if="show">
                    <div class="row gutter-sm justify-end">
                        <div class="col-lg-auto">
                            <div class="created-by">
                                <div>{{ $t('Common.DTableLabel.CreatedBy') }} :
                                    <small>{{ memberData.details.user.name }}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row gutter-sm">
                        <div class="col-lg-4 col-md-12 col-xs-12">
                            <div class="row">
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs">
                                    <q-field :label="$t('members.iboId.label')">
                                        <q-input disable
                                                 inverted-light
                                                 class="no-shadow custom-input-border"
                                                 color="white text-black"
                                                 v-model="memberData.details.member_id === 0 ? 'ROOT' : memberData.details.member_id"
                                        />
                                    </q-field>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs">
                                    <q-field :label="$t('members.country.label')">
                                        <q-input disable
                                                 inverted-light
                                                 class="no-shadow custom-input-border"
                                                 color="white text-black"
                                                 v-model="memberData.details.country.name"
                                        />
                                    </q-field>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs">
                                    <q-field
                                            :helper="'*'"
                                            :label="$t('members.iboName.label')"
                                            :error="$v.memberData.details.name.$error"
                                            error-label="Please input"
                                    >
                                        <q-input v-model="memberData.details.name"
                                                 inverted-light
                                                 class="no-shadow custom-input-border"
                                                 color="white text-black"
                                                 @change="$v.memberData.details.name.$touch"
                                        />
                                    </q-field>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs">
                                    <q-field :label="$t('members.translatedName.label')">
                                        <q-input v-model="memberData.details.translated_name"
                                                 inverted-light
                                                 class="no-shadow custom-input-border"
                                                 color="white text-black"/>
                                    </q-field>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs relative-position">
                                    <q-field :label="$t('members.nationality.label')"
                                             :helper="'*'"
                                             :error="$v.memberData.details.nationality_id.$error"
                                             :error-label="$t('Common.selectCountry.label')">
                                        <q-select clearable
                                                  filter
                                                  inverted-light
                                                  class="no-shadow custom-input-border"
                                                  color="white text-black"
                                                  v-model="memberData.details.nationality_id"
                                                  :options="countriesOptions.options"
                                        />
                                    </q-field>
                                    <q-loader :visible="isProcessingSection"></q-loader>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs relative-position">
                                    <q-field
                                            :helper="'*'"
                                            :label="$t('members.icPassport.label')"
                                            :error="$v.memberData.details.ic_pass_type_id.$error || $v.memberData.details.ic_passport_number.$error"
                                            :error-label="$t('Common.pleaseSelect.label')"
                                    >
                                        <div class="row gutter-xs">
                                            <div class="col-lg-12 col-md-12 col-xs-12">
                                                <q-select clearable
                                                          inverted-light
                                                          class="no-shadow custom-input-border"
                                                          color="white text-black"
                                                          v-model="memberData.details.ic_pass_type_id"
                                                          :options="masterDataOptionsCreator('ic_passport_type')"
                                                />
                                            </div>
                                            <div class="col-lg-12 col-md-12 col-xs-12">
                                                <q-input :disable="memberData.details.ic_pass_type_id === ''"
                                                         inverted-light
                                                         class="no-shadow custom-input-border"
                                                         color="white text-black"
                                                         v-model="memberData.details.ic_passport_number"/>
                                            </div>
                                        </div>
                                    </q-field>
                                    <q-loader :visible="isProcessingSection"></q-loader>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs">
                                    <q-field :label="$t('members.dob.label')"
                                             :helper="'*'"
                                             :error="$v.memberData.details.date_of_birth.$error"
                                             :error-label="$t('members.age.errorLabel')">
                                        <q-datetime align="left"
                                                    inverted-light
                                                    class="no-shadow custom-input-border"
                                                    color="white text-black"
                                                    monday-first
                                                    format="DD-MM-YYYY"
                                                    v-model="memberData.details.date_of_birth"
                                        />
                                    </q-field>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs">
                                    <q-field :label="$t('members.joinDate.label')">
                                        <q-datetime disable
                                                    align="left"
                                                    monday-first
                                                    format="DD-MM-YYYY"
                                                    inverted-light
                                                    class="no-shadow custom-input-border"
                                                    color="white text-black"
                                                    v-model="memberData.details.join_date"
                                        />
                                    </q-field>
                                </div>
                                <div class="col-lg-12 col-md-12 col-xs-12 q-ma-xs">
                                    <q-field :label="$t('members.expiryDate.label')">
                                        <q-datetime disable
                                                    align="left"
                                                    monday-first
                                                    format="DD-MM-YYYY"
                                                    inverted-light
                                                    class="no-shadow custom-input-border"
                                                    color="white text-black"
                                                    v-model="memberData.details.expiry_date"
                                        />
                                    </q-field>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-5 col-md-12 col-xs-12">
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.DTableLabel.memberValidity')">
                                    <q-input disable
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                             :value="memberData.details.status !== null ? memberData.details.status.title : '-'"
                                    />
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.personalSales.label')">
                                    <div class="row gutter-xs justify-between items-center">
                                        <div class="col-5">
                                            <q-input disable
                                                     inverted-light
                                                     class="no-shadow custom-input-border"
                                                     color="white text-black"
                                                     v-model="memberData.details.personal_sales_cv === null ? na : memberData.details.personal_sales_cv"
                                            />
                                        </div>
                                        <div class="col-auto">|</div>
                                        <div class="col-5">
                                            <q-input disable
                                                     inverted-light
                                                     class="no-shadow custom-input-border"
                                                     color="white text-black"
                                                     v-model="memberData.details.personal_sales_cv_percentage === null ? na : memberData.details.personal_sales_cv_percentage"
                                            />
                                        </div>
                                    </div>
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.rankEffective.label')">
                                    <q-input disable
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                             v-model="memberData.details.effective_rank === null ? na : memberData.details.effective_rank.rank_name"
                                    />
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.rankEnrollment.label')">
                                    <q-input disable
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                             v-model="memberData.details.enrollment_rank === null ? na : memberData.details.enrollment_rank.rank_name"
                                    />
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.rankHighest.label')">
                                    <q-input disable
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                             v-model="memberData.details.highest_rank === null ? na : memberData.details.highest_rank.rank_name"
                                    />
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.sponsor.label')">
                                    <div class="row gutter-xs justify-between items-center">
                                        <div class="col-5">
                                            <q-input disable
                                                     inverted-light
                                                     class="no-shadow custom-input-border"
                                                     color="white text-black"
                                                     v-model="memberData.details.sponsor === null ? na : memberData.details.sponsor.member.name"
                                            />
                                        </div>
                                        <div class="col-auto">|</div>
                                        <div class="col-5">
                                            <q-input disable
                                                     inverted-light
                                                     class="no-shadow custom-input-border"
                                                     color="white text-black"
                                                     v-model="memberData.details.sponsor === null ? na : memberData.details.sponsor.old_member_id"
                                            />
                                        </div>
                                    </div>
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.placement.label')">
                                    <div class="row gutter-xs justify-between items-center">
                                        <div class="col-5">
                                            <q-input disable
                                                     inverted-light
                                                     class="no-shadow custom-input-border"
                                                     color="white text-black"
                                                     v-model="memberData.details.placement.ibo === null ? na : memberData.details.placement.ibo"
                                            />
                                        </div>
                                        <div class="col-auto">|</div>
                                        <div class="col-5">
                                            <q-input disable
                                                     inverted-light
                                                     class="no-shadow custom-input-border"
                                                     color="white text-black"
                                                     v-model="memberData.details.placement.name === null ? na :  memberData.details.placement.name"
                                            />
                                        </div>
                                    </div>
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.placementLeg.label')">
                                    <q-input disable
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                             v-model="memberData.details.placement.leg === null || memberData.details.placement.leg.length < 1 ? na : memberData.details.placement.leg"
                                    />
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.tinNoTaiwan.label')">
                                    <q-input v-model="memberData.details.tin_no_taiwan"
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                    />
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.tinNoPhilippines.label')">
                                    <q-input v-model="memberData.details.tin_no_philippines"
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                    />
                                </q-field>
                            </div>
                            <div class="col-lg-12 q-ma-xs">
                                <q-field :label="$t('members.enrollFormReceived.label')">
                                    <q-option-group
                                            inline
                                            type="radio"
                                            v-model="memberData.details.enroll_from_received"
                                            :options="[{label: 'Yes', value: 1}, {label: 'No', value: 0}]"/>
                                </q-field>
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="verification-section q-mt-xs" v-if="memberData.verification">
                                <div class="col-lg-12 q-ma-xs">
                                    <q-field
                                            :class="{'text-positive': memberData.details.ic_pass_verified, 'text-negative': memberData.details.ic_pass_verified === 0}"
                                            :label-width="12" :label="$t('members.verification.label')">
                                        <q-option-group
                                                inline
                                                type="radio"
                                                v-model="memberData.details.ic_pass_verified"
                                                :options="[{label: 'Passed', value: 1}, {label: 'Failed', value: 0}]"/>
                                    </q-field>
                                </div>
                                <div class="col-lg-12 q-ma-xs relative-position"
                                     v-show="memberData.details.ic_pass_verified === 0">
                                    <q-field :label-width="12" :label="$t('members.verificationFailedReason.label')">
                                        <q-select clearable
                                                  inverted-light
                                                  class="no-shadow custom-input-border"
                                                  color="white text-black"
                                                  :placeholder="$t('Common.choose.label')"
                                                  v-model="memberData.details.defer_reason_id"
                                                  :options="masterDataOptionsCreator('verification_failed_reason')"
                                        />
                                    </q-field>
                                    <q-loader :visible="isProcessingSection"></q-loader>
                                </div>
                                <hr>
                                <div class="col-lg-12 q-ma-xs">
                                    <q-field :label-width="12" :label="$t('members.deferBonusCommissions.label')">
                                        <q-option-group
                                                inline
                                                type="radio"
                                                v-model="memberData.details.defer_bonus_commission"
                                                :options="[{label: 'Yes', value: 1}, {label: 'No', value: 0}]"/>
                                    </q-field>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="form-tabs mt-20 text-black">
                        <q-tabs inverted color="grey-7" align="justify">
                            <q-tab :alert="addressesValidationStatus" default name="addresses" slot="title"
                                   :label="$t('members.addresses.label')"/>
                            <q-tab :alert="$v.memberData.information.$error || $v.memberData.contact_info.$error" name="information" slot="title"
                                   :label="$t('members.information.label')"/>
                            <q-tab name="image" slot="title" :label="$t('members.icPassportPhoto.label')"/>
                            <q-tab name="beneficiary" slot="title" :label="$t('members.beneficiary.label')"/>
                            <q-tab :alert="typeof $v.memberData.banking !== 'undefined' ? $v.memberData.banking.$error : false"
                                   name="banking" slot="title"
                                   label="Bank Info"/>
                            <q-tab name="tax" slot="title" :label="$t('members.taxPayerInfo.label')"/>
                            <q-tab name="salesHistory" slot="title" :label="$t('members.salesHistory.label')"/>
                            <!-- Tab Content -->
                            <q-tab-pane name="addresses" class="no-border">
                                <!-- Addresses Content-->
                                <div class="pd-10">
                                    <member-addresses-tab v-bind:memberData="memberData" @checkAddressesValidationStatus="checkAddressesValidationStatus"></member-addresses-tab>
                                </div>
                                <!-- Addresses Content End -->
                            </q-tab-pane>
                            <q-tab-pane name="information" class="no-border">
                                <!-- Information Content-->
                                <div class="pd-10">
                                    <member-information-tab :validation="$v.memberData" v-bind:memberData="memberData"></member-information-tab>
                                </div>
                                <!-- Information Content End -->
                            </q-tab-pane>
                            <q-tab-pane name="image" class="no-border">
                                <!-- Image Content-->
                                <div class="pd-10">
                                    <member-id-images-tab v-bind:memberData="memberData"></member-id-images-tab>
                                </div>
                                <!-- Image Content End -->
                            </q-tab-pane>
                            <q-tab-pane name="beneficiary" class="no-border">
                                <!-- Beneficiary Content-->
                                <div class="pd-10">
                                    <beneficiary-tab :validation="$v" v-bind:memberData="memberData"></beneficiary-tab>
                                </div>
                                <!-- Beneficiary Content End -->
                            </q-tab-pane>
                            <q-tab-pane name="tax" class="no-border">
                                <!-- Tax Content-->
                                <div class="pd-10">
                                    <tax-tab :validation="$v" v-bind:memberData="memberData"></tax-tab>
                                </div>
                                <!-- Tax Content End -->
                            </q-tab-pane>
                            <q-tab-pane name="banking" class="no-border">
                                <!-- Banking Content-->
                                <div class="pd-10">
                                    <banking-tab :validation="$v" v-bind:memberData="memberData"></banking-tab>
                                </div>
                                <!-- Banking Content End -->
                            </q-tab-pane>
                            <q-tab-pane name="salesHistory" class="no-border">
                                <!-- Image Content-->
                                <div class="pd-10">
                                    <sales-history-tab v-bind:memberData="memberData"></sales-history-tab>
                                </div>
                                <!-- Image Content End -->
                            </q-tab-pane>
                        </q-tabs>
                    </div>
                </div>
                <q-placeholder v-else=""></q-placeholder>
            </template>
        </basic-form>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
        <errors-modal refs="errorsModal"></errors-modal>
    </div>
</template>
<script>
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import qPlaceholder from 'src/application/global/components/common/loading/placeholder'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { MasterDataTransformarMixin, GeneralsMixin } from 'src/application/global/mixins/index'
  import {
    SalesHistoryTab,
    BeneficiaryTab,
    BankingTab,
    TaxTab
  } from 'src/application/members/components/members-tabs/index'
  import { MemberInformationTab, MemberAddressesTab, MemberIdImagesTab } from 'src/application/global/components/common/shared-tabs/index'
  import { required, numeric } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapMutations } from 'vuex'
  import EmptyList from '../../global/components/common/empty/emptyList.vue'
  import { date } from 'quasar'

  const REQUEST = 'REQUEST'
  const RESPONSE = 'RESPONSE'

  export default {
    name: 'member-setup-area',
    mixins: [MasterDataTransformarMixin, GeneralsMixin],
    components: {
      EmptyList,
      generalHeader,
      basicForm,
      qLoader,
      qPlaceholder,
      errorsModal,
      MemberAddressesTab,
      MemberInformationTab,
      MemberIdImagesTab,
      BeneficiaryTab,
      BankingTab,
      TaxTab,
      SalesHistoryTab
    },
    props: ['memberID'],
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        masterData: state => state.globalCMP.masterData.data.list,
        memberDetails: state => state.membersCMP.memberData.data,
        errors: state => state.globalCMP.errors.data
      })
    },
    data: () => ({
      message: '',
      show: false,
      na: '-N/A-',
      addressesValidationStatus: false,
      memberData: {
        banking: {
          payment_data: {}
        },
        tax: {
          tax_data: []
        }
      }
    }),
    validations () {
      let def = {
        memberData: {
          details: {
            name: {required},
            nationality_id: {required},
            ic_pass_type_id: {required},
            ic_passport_number: {required},
            date_of_birth: {
              age_validation (val, elm) {
                // check age validation
                let timeStamp = Date.now()
                let currentYear = date.formatDate(timeStamp, 'YYYY')
                let diff = date.getDateDiff(currentYear, date.formatDate(val, 'YYYY'), 'years')
                if (diff >= 18 && !isNaN(diff)) {
                  return true
                }
                return false
              }
            }
          },
          information: {
            language_id: {required},
            gender_id: {required},
            spouse: {
              spouse_ibo_id: {
                check1 (val, elm) {
                  if (this.isDef(elm) && elm.spouse_elken_member === 1) {
                    if (val === '' || val === null) {
                      return false
                    }
                  }
                  return true
                }
              },
              ic_pass_type_number: {
                check2 (val, elm) {
                  if (this.isDef(elm) && elm.spouse_elken_member === 1) {
                    if (val === '' || val === null) {
                      return false
                    }
                  }
                  return true
                }
              },
              ic_pass_type_id: {
                check3 (val, elm) {
                  if (this.isDef(elm) && elm.spouse_elken_member === 1) {
                    if (val === '' || val === null) {
                      return false
                    }
                  }
                  return true
                }
              },
              spouse_name: {
                check4 (val, elm) {
                  if (this.isDef(elm) && elm.spouse_elken_member === 1) {
                    if (val === '' || val === null) {
                      return false
                    }
                  }
                  return true
                }
              }
            }
          },
          contact_info: {
            preferred_contact_id: {required},
            mobile_1_country_code_id: {required},
            mobile_1_num: {required, numeric}
          },
          banking: {}
        }
      }
      if (typeof this.memberData.banking.payment_data !== 'undefined' && this.memberData.banking.payment_data !== null && typeof this.memberData.banking.payment_data.bank_data !== 'undefined' && this.memberData.banking.payment_data.bank_data.length > 0) {
        def.memberData.banking = {
          payment_data: {
            bank_data: {
              $each: {
                fields: {
                  $each: {
                    value: {
                      check (val, elm) {
                        if (elm.required && elm.value === '' && this.memberData.banking.payment_data.selected === elm.parent_id) {
                          return false
                        }
                        return true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (typeof this.memberData.tax.tax_data !== 'undefined' && this.memberData.tax.tax_data !== null && this.memberData.tax.tax_data.length > 0) {
        def.memberData.tax = {
          tax_data: {
            $each: {
              value: {
                check (val, elm) {
                  if (elm.required && elm.value === '') {
                    return false
                  }
                  return true
                }
              }
            }
          }
        }
      }
      return def
    },
    mounted () {
      // Merge mixin master array
      this.master.keys = ['ic_passport_type', 'verification_failed_reason']
      this.getCountriesAction()
      this.initSetupArea()
    },
    methods: {
      ...mapActions([
        'getMemberByUserIdAction',
        'updateMemberAction',
        'getCountriesAction',
        'getMastersWithKey'
      ]),
      ...mapMutations({
        setIsProcessingSection: 'IS_PROCESSING_SECTION',
        setNotification: 'SHOW_NOTIFICATION',
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setMemberData: 'SET_MEMBER_DATA'
      }),
      initSetupArea () {
        if (this.isUndef(this.memberID)) {
          this.invalidRequest()
        } else {
          let query = {
            user_id: this.memberID
          }
          this.getMemberByUserIdAction(query).then((res) => {
            this.manipulateSaveData(REQUEST)
          }).catch(() => {
            this.invalidRequest()
          })
        }
      },
      manipulateSaveData (operation, data) {
        if (operation === 'RESPONSE') {
          this.setMemberData(data)
        }
        // Clone vuex object into local object
        this.memberData = Object.assign({}, JSON.parse(JSON.stringify(this.memberDetails)))
        let address = {
          user_id: this.memberID,
          id: null,
          address_data: [
            {
              title: this.$t('members.addressPermanent.label'),
              fields: []
            },
            {
              title: this.$t('members.addressCorrespondence.label'),
              fields: []
            },
            {
              title: this.$t('members.addressShipping1.label'),
              fields: []
            },
            {
              title: this.$t('members.addressShipping2.label'),
              fields: []
            }
          ]
        }
        let information = {
          user_id: this.memberID,
          language_id: null,
          gender_id: null,
          salutation_id: null,
          ethnic_id: null,
          religion_id: null,
          martial_status_id: null,
          spouse: {
            spouse_elken_member: 0,
            spouse_ibo_id: '',
            ic_pass_type_id: null,
            ic_pass_type_number: '',
            spouse_name: ''
          },
          education_id: null,
          occupation_id: null,
          industry_id: null,
          salary_range_id: null,
          annual_revenue_id: null
        }
        let contact = {
          preferred_contact_id: null,
          user_id: this.memberID,
          mobile_1_country_code_id: null,
          mobile_1_num: '',
          mobile_2_country_code_id: null,
          mobile_2_num: '',
          tel_office_1_country_code_id: null,
          tel_office_1_num: '',
          tel_office_2_country_code_id: null,
          tel_office_2_num: '',
          fax_country_code_id: null,
          fax_num: '',
          replicator_website: '',
          country_of_residence_id: null
        }
        let beneficiary = {
          user_id: this.memberID,
          beneficiary_name: '',
          beneficiary_type_id: null,
          beneficiary_ic_num: '',
          beneficiary_mobile_code_id: null,
          beneficiary_phone_num: '',
          beneficiary_office_phone_code_id: null,
          beneficiary_office_phone_num: '',
          beneficiary_home_phone_code_id: null,
          beneficiary_home_phone_num: '',
          beneficiary_relationship_id: null
        }
        let banking = {
          user_id: this.memberID,
          payment_data: {
            selected: '',
            bank_data: []
          }
        }
        let tax = {
          user_id: this.memberID,
          tax_data: []
        }
        if (this.memberData.address === null) {
          this.memberData.address = address
        } else {
          if (this.memberData.address.address_data.length > 0) {
            this.memberData.address.address_data = JSON.parse(this.memberData.address.address_data)
          }
        }
        if (this.memberData.verification === null || typeof this.memberData.verification === 'undefined' || Object.keys(this.memberData.verification).length < 1) {
          this.memberData.verification = []
        }
        if (this.memberData.information === null || typeof this.memberData.information === 'undefined' || Object.keys(this.memberData.information).length < 1) {
          this.memberData.information = {}
          this.memberData.information = Object.assign({}, information)
        }
        if (this.memberData.beneficiary === null || typeof this.memberData.beneficiary === 'undefined' || Object.keys(this.memberData.beneficiary).length < 1) {
          this.memberData.beneficiary = {}
          this.memberData.beneficiary = Object.assign({}, beneficiary)
        }
        if (this.memberData.banking === null || this.memberData.banking.payment_data === null || typeof this.memberData.banking === 'undefined' || Object.keys(this.memberData.banking).length < 1) {
          this.memberData.banking = []
          this.memberData.banking = banking
        } else {
          if (this.memberData.banking.payment_data.length > 0) {
            this.memberData.banking.payment_data = JSON.parse(this.memberData.banking.payment_data)
          }
        }
        if (this.memberData.tax === null || typeof this.memberData.tax === 'undefined' || Object.keys(this.memberData.tax).length < 1) {
          this.memberData.tax = {}
          this.memberData.tax = Object.assign({}, tax)
        } else {
          if (this.memberData.tax.tax_data.length > 0) {
            this.memberData.tax.tax_data = JSON.parse(this.memberData.tax.tax_data)
          }
        }
        if (this.memberData.contact_info === null || typeof this.memberData.contact_info === 'undefined' || Object.keys(this.memberData.contact_info).length < 1) {
          this.memberData.contact_info = {}
          this.memberData.contact_info = Object.assign({}, contact)
        }
        // Todo add profile avatar for member
        if (this.memberData.details.avatar_image_path === null) {
          this.memberData.details.avatar_image_path = '/sample'
        }
        this.show = true
      },
      invalidRequest () {
        this.setIsProcessingSection(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        setTimeout(() => {
          this.setIsProcessingSection(false)
          this.$router.replace({name: 'Personal Data List'})
        }, 3000)
      },
      checkAddressesValidationStatus (status) {
        this.addressesValidationStatus = status
      },
      processForm: function (formFieldData) {
        this.$v.memberData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.memberData.$error && !this.addressesValidationStatus) {
            this.updateMemberAction({member_data: formFieldData}).then((res) => {
              // Update vuex saveData
              // Wrap response with data {} object to ensure follow API request standard
              this.manipulateSaveData(RESPONSE, {data: res.member_data})
              resolve(res)
            }).catch(error => {
              if (typeof error.response !== 'undefined' && error.response.status === 422) {
                this.openCloseModal({name: 'errorsModal', status: true})
              }
              if (typeof error.response !== 'undefined' && error.response.statusText === 500) {
                this.setNotification({
                  title: 'Uh oh! An error occured',
                  message: error.response.status + '<br>' + error.response.statusText,
                  type: 'negative'
                })
              }
              reject(error.response)
            })
          } else {
            this.setNotification({
              title: 'Member Update Failed',
              message: 'validation.failed',
              type: 'negative'
            })
            reject(this.$v.memberData.$error)
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
    .verification-section
        border 1px solid #e6e6e6
        padding-left 10px
        padding-right 2px
</style>
