<template>
  <div class="general-page-holder relative-position">
    <basic-form formName="StockistRefistrationForm"
                :formTitle="$t('sales.newSales.title')"
                :backgroudColor="false"
                v-bind:formFieldData="stockistRegistrationData"
                urlResetPathName="Stockist List"
                formAction="salesOrderAction"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm">
      <template slot="form">
        <div class="form-holder">
          <div class="row">
            <div class="col-lg-12">
              <div class="row">
                <div class="col-xl-12 col-lg-12">
                  <q-card color="white" class="full-height">
                    <q-card-main class="text-black">
                      <div
                        class="row gutter-md"
                        v-if="stockistRegistrationData.member_data !== undefined && stockistRegistrationData.member_data !== undefined
                              && stockistRegistrationData.member_data.details !== undefined && stockistRegistrationData.member_data.details !== undefined"
                      >
                        <div class="col-xl-4 col-lg-4 personal-data-holder justify-content-start gutter-xs">
                          <q-field
                            :label="$t('stockist.registration.label.countryCode')"
                          >
                            {{ stockistRegistrationData.details.country.code_iso_2}}
                          </q-field>
                          <q-field
                            :helper="'*'"
                            :label="$t('stockist.registration.label.stockistID')"
                            :error="$v.stockistRegistrationData.details.stockist_number.$error || setError('stockist_data.details.stockist_number', 'type.exp')"
                            :error-label="setError('stockist_data.details.stockist_number', 'type.exp') ? setError('stockist_data.details.stockist_number', 'type.msg') : $t('stockist.registration.errorMessage.stockistID')"
                          >
                            <q-input
                              clearable
                              :disable="!isNewRegistration"
                              v-model="stockistRegistrationData.details.stockist_number"
                            />
                          </q-field>
                          <q-field
                            :helper="'*'"
                            :label="$t('stockist.registration.label.stockistName')"
                            :error="$v.stockistRegistrationData.details.name.$error || setError('stockist_data.name', 'type.exp')"
                            :error-label="setError('stockist_data.name', 'type.exp') ? setError('stockist_data.name', 'type.msg') : $t('stockist.registration.errorMessage.stockistName')"
                          >
                           <q-input
                             clearable
                              v-model="stockistRegistrationData.details.name"
                            />
                          </q-field>
                          <q-field
                            :label="$t('stockist.registration.label.iboID')"
                          >
                              {{stockistRegistrationData.member_data.details.country.code_iso_2  + stockistRegistrationData.member_data.details.user.old_member_id}}
                          </q-field>
                          <q-field
                            :label="$t('stockist.registration.label.iboName')"
                          >
                              {{stockistRegistrationData.member_data.details.name}}
                          </q-field>
                          <q-field
                            :label="$t('stockist.registration.label.expiryDate')"
                          >
                              {{ formatDate(stockistRegistrationData.member_data.details.expiry_date)}}
                              <span v-if="checkDateValidity(stockistRegistrationData.member_data.details.expiry_date)"><q-icon color="positive" name="check_circle"></q-icon></span>
                              <span v-else=""><q-icon color="negative" name="remove_circle"></q-icon></span>
                          </q-field>
                        </div>
                        <div class="col-xl-4 col-lg-4 personal-data-holder justify-content-start">
                          <q-field
                            :label="$t('stockist.registration.label.stockistType')"
                            :helper="'*'"
                            :error="$v.stockistRegistrationData.details.stockist_type_id.$error"
                            error-label="Please select a stockist type"
                          >
                            <q-select
                              v-model="stockistRegistrationData.details.stockist_type_id"
                              :options="masterDataOptionsCreator($const.masterKey.STOCKIST_TYPE)"
                              filter
                              color="black"
                              clearable
                              :filterPlaceholder="$t('stockist.registration.placeholder.stockistType')"
                            ></q-select>
                          </q-field>
                          <q-field
                            :helper="'*'"
                            :label="$t('stockist.registration.label.stockistRatio')"
                            :error="$v.stockistRegistrationData.details.stockist_ratio.$error || setError('stockist_data.details.stockist_ratio', 'type.exp')"
                            :error-label="setError('stockist_data.details.stockist_ratio', 'type.exp') ? setError('stockist_data.details.stockist_ratio', 'type.msg') : 'Stockist ratio is required and must be greater than 0'"
                          >
                            <!--white space stack level so that the prefix shows constantly-->
                            <q-input
                              type="number"
                              align="left"
                              prefix="1:"
                              color="black"
                              stack-label=" "
                              :step="0.5"
                              v-model.lazy="stockistRegistrationData.details.stockist_ratio"
                              @input="roundStockistRatio"
                            />
                          </q-field>
                          <q-field
                            :label="$t('stockist.registration.stock_location.label')"
                            helper="*"
                            :error="$v.stockistRegistrationData.stockist_stock_location.id.$error"
                            :error-label="$t('stockist.registration.stock_location.errorLabel')"
                            >
                            <q-select
                              v-model="stockistRegistrationData.stockist_stock_location.id"
                              :options="stockLocationsOptionsByCountry"
                            />
                          </q-field>
                          <q-field
                            :label="$t('stockist.registration.label.ibsOnline')">
                            <q-option-group inline
                                            type="radio"
                                            v-model="stockistRegistrationData.details.ibs_online"
                                            :options="ibs_online_option"
                            />
                          </q-field>
                        </div>
                        <div class="col-xl-4 col-lg-4 personal-data-holder justify-content-start">
                          <q-field
                            :label="$t('stockist.registration.label.status')"
                            :helper="'*'"
                            :error="$v.stockistRegistrationData.details.status_id.$error"
                            :error-label="$t('stockist.registration.errorMessage.status')"
                          >
                            <q-select
                              clearable
                              v-model="stockistRegistrationData.details.status_id"
                              :options="masterDataOptionsCreator($const.masterKey.STOCKIST_STATUS)"
                              filter
                              color="black"
                              clearable
                              :filterPlaceholder="$t('stockist.registration.placeholder.status')"
                            />
                          </q-field>
                          <q-field
                            :label="$t('stockist.registration.label.effectiveDate')"
                            :helper="'*'"
                            :error="$v.stockistRegistrationData.details.effective_date.$error || setError('stockist_data.details.effective_date', 'type.exp')"
                            :error-label="setError('stockist_data.details.effective_date', 'type.exp') ? setError('stockist_data.details.effective_date', 'type.msg') : 'Please select stockist effective date'"
                          >
                            <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                        v-model="stockistRegistrationData.details.effective_date"
                                        @input="$v.stockistRegistrationData.details.effective_date.$touch()"
                            />
                          </q-field>
                          <q-field
                            v-if="!isNewRegistration"
                            :helper="'*'"
                            :label="$t('stockist.registration.label.remark')"
                            :error="$v.stockistRegistrationData.details.remark.$error || setError('stockist_data.details.remark', 'type.exp')"
                            :error-label="setError('stockist_data.details.remark', 'type.exp') ? setError('stockist_data.details.remark', 'type.msg') : 'Please enter update remark'"
                          >
                            <q-input
                              v-model="stockistRegistrationData.details.remark"
                            />
                          </q-field>
                        </div>
                      </div>
                    </q-card-main>
                  </q-card>
                  <q-loader :message="message" :visible="isProcessingSection"></q-loader>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-white shadow-1 relative-position mt-20">
            <div class="col-lg-12">
              <q-card class="full-width" color="white">
                <q-card-main
                  class="text-black"
                >
                  <div class="form-tabs mt-20 text-black">
                    <q-tabs inverted color="grey-7" align="left" v-if="isCompletedLoading">
                      <q-tab :alert="$v.stockistRegistrationData.business_address.$error" default name="business_info" slot="title"
                             :label="$t('stockist.registration.tab.title.businessAddress')"/>
                      <q-tab name="personal_info" slot="title"
                             :label="$t('stockist.registration.tab.title.personalInfo')"/>
                      <q-tab :alert="$v.stockistRegistrationData.deposits.$error" name="deposits" slot="title"
                             :label="$t('stockist.registration.tab.title.depositCreditLimit')"/>
                      <q-tab :alert="$v.stockistRegistrationData.banks.$error" name="bank_info" slot="title"
                             :label="$t('stockist.registration.tab.title.bankInfo')"/>
                      <q-tab :alert="$v.stockistRegistrationData.gst_vat.$error" name="gst_vat" slot="title"
                             :label="$t('stockist.registration.tab.title.gstVat')"/>
                      <q-tab v-if="stockistRegistrationData.logs !== undefined && stockistRegistrationData.logs !== null" name="logs" slot="title"
                             :label="$t('stockist.registration.tab.title.updates')"/>
                      <!-- Tab Content -->
                      <q-tab-pane name="business_info" class="no-border bg-white full-height full-width align-content-start">
                        <!-- business_info Content-->
                        <business-info-tab
                          :validation="$v"
                          :business_address="stockistRegistrationData.business_address"
                          :selectedFilters="selectedFilters"
                          :setError="setError"
                        ></business-info-tab>
                        <!-- business_info Content End -->
                      </q-tab-pane>
                      <q-tab-pane name="personal_info" class="no-border bg-white shadow-1">
                        <!-- personal_info Content-->
                        <personal-info-tab
                          :member_data="stockistRegistrationData.member_data"
                        ></personal-info-tab>
                        <!-- personal_info Content End -->
                      </q-tab-pane>
                      <q-tab-pane name="deposits" class="no-border bg-white shadow-1">
                        <!-- Payments Content-->
                        <deposit-credit-limit-tab
                          :deposits="stockistRegistrationData.deposits"
                          :validation="$v"
                          :setError="setError"
                        ></deposit-credit-limit-tab>
                        <!-- Payments Content End -->
                      </q-tab-pane>
                      <q-tab-pane name="bank_info" class="no-border bg-white shadow-1">
                        <!-- Payments Content-->
                        <bank-info-tab
                          :banks="stockistRegistrationData.banks"
                          :validation="$v"
                          :selectedFilters="selectedFilters"
                        ></bank-info-tab>
                        <!-- Payments Content End -->
                      </q-tab-pane>
                      <q-tab-pane name="gst_vat" class="no-border bg-white shadow-1">
                        <!-- Payments Content-->
                        <g-s-t-v-a-t-tab
                          :gst_vat="stockistRegistrationData.gst_vat"
                          :validation="$v"
                          :selectedFilters="selectedFilters"
                        ></g-s-t-v-a-t-tab>
                        <!-- Payments Content End -->
                      </q-tab-pane>
                      <q-tab-pane name="logs" class="no-border bg-white shadow-1">
                        <!-- Payments Content-->
                        <updates-tab
                          :updates="stockistRegistrationData.logs"
                        ></updates-tab>
                        <!-- Payments Content End -->
                      </q-tab-pane>
                    </q-tabs>
                  </div>
                </q-card-main>
              </q-card>
            </div>
          </div>
        </div>
      </template>
    </basic-form>
    <q-loader :message="message" :visible="isProcessingForm"></q-loader>
  </div>
</template>

<script>
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { DatesMixin, MasterDataTransformarMixin, GeneralsMixin, SetFormFieldErrorsMixin } from 'src/application/global/mixins/index'
  import taxInvoiceSearchForm from 'src/application/sales/components/forms/taxInvoiceSearchForm'
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import { BusinessInfoTab, BankInfoTab, DepositCreditLimitTab, GSTVATTab, PersonalInfoTab, UpdatesTab } from 'src/application/stockist/components/registration-tabs/index'
  import { required, minLength, email } from 'vuelidate/lib/validators'
  import { Dialog } from 'quasar'

  export default {
    name: 'stockist-registration',
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin, SetFormFieldErrorsMixin],
    components: {
      basicForm,
      qLoader,
      errorsModal,
      BusinessInfoTab,
      BankInfoTab,
      DepositCreditLimitTab,
      GSTVATTab,
      UpdatesTab,
      PersonalInfoTab,
      layoutModal,
      taxInvoiceSearchForm
    },
    props: ['stockistUserID'],
    data: () => ({
      message: '',
      isNewRegistration: true,
      isCompletedLoading: false,
      ibs_online_option: [
        {
          label : 'Yes',
          value : 1
        },
        {
          label : 'No',
          value : 0
        }
      ],
      stockistRegistrationData: {
        details: {
          country_id: '',
          stockist_number: '',
          name: '',
          user_id: '',
          default_price_code_id: '1',
          stockist_type_id: '',
          stockist_ratio: 0,
          ibs_online: true,
          registration_date: '',
          status_id: '',
          effective_date: '',
          remark: ''
        },
        stockist_stock_location: {
          id: '',
        },
        business_address: {
          contact_person: '',
          mobile_1_country_code_id: '',
          mobile_1_num: '',
          mobile_2_country_code_id: '',
          mobile_2_num: '',
          telephone_office_country_code_id: '',
          telephone_office_num: '',
          fax_country_code_id: '',
          fax_num: '',
          email_1: '',
          email_2: '',
          addresses: [{
            fields: []
          }]
        },
        member_data: {
          addresses: [],
          contact_info: {
            mobile_1_country_code_id: '',
            mobile_1_num: '',
            mobile_2_country_code_id: '',
            mobile_2_num: '',
            tel_office_1_country_code_id: '',
            tel_office_1_num: '',
            tel_office_2_country_code_id: '',
            tel_office_2_num: '',
            tel_home_1_country_code_id: '',
            tel_home_1_num: '',
            fax_country_code_id: '',
            fax_num: '',
            email: ''
          },
          country:{
            code_iso_2: ''
          },
          user: {
            member_id: ''
          }
        },
        deposits: {
          minimum_initial_deposit: 0,
          maximum_initial_deposit: 0,
          minimum_top_up_deposit: 0,
          maximum_top_up_deposit: 0,
          minimum_capping : 0,
          credit_limit_1: 0,
          credit_limit_2: 0,
          credit_limit_3: 0
        },
        // rename to banks later
        banks: {
          bank_detail: {
            details: {
              country: {
                name: '',
                code_iso_2: ''
              }
            },
            banking: {
              payment_data: {
                selected: '',
                bank_data: []
              }
            },
          },
          courier_number: ''
        },
        gst_vat: {
          gst_vat_detail: {
            tax_data: []
          }
        }
      }
    }),
    validations () {
      let def = {
        stockistRegistrationData: {
          details: {
            stockist_number: {
              required
            },
            name: {
              required
            },
            stockist_type_id: {
              required
            },
            stockist_ratio: {
              required,
              check (val, elm) {
                return val > 0
              }
            },
            ibs_online: {
              required
            },
            status_id: {
              required
            },
            effective_date: {
              // require further investigation on date type validation
              check (val, elm) {
                return val !== null && val !== undefined && val !== ''
              }
            }
          },
          stockist_stock_location: {
            id: {
              required
            }
          },
          business_address: {
            contact_person: {
              required
            },
            mobile_1_country_code_id: {
              required
            },
            mobile_1_num: {
              required
            },
            email_1: {
              required,
              email
            },
            email_2: {
              email
            },
            address: {
              minLength: minLength(1)
            }
          },
          banks: {
            bank_detail: {
              banking: {
                payment_data: {
                  bank_data: {
                    required,
                    minLength: minLength(1)
                  }
                }
              }
            }
          },
          gst_vat: {
            gst_vat_detail: {
              tax_data: {
                required,
                minLength: minLength(1)
              }
            }
          },
          deposits: {
            minimum_initial_deposit: {
              check (val, elm) {
                return parseFloat(val) > 0 && parseFloat(val) < parseFloat(elm.maximum_initial_deposit)
              }
            },
            maximum_initial_deposit: {
              check (val, elm) {
                return parseFloat(val) > 0 && parseFloat(val) > parseFloat(elm.minimum_initial_deposit)
              }
            },
            minimum_top_up_deposit: {
              check (val, elm) {
                return parseFloat(val) > 0 && parseFloat(val) < parseFloat(elm.maximum_top_up_deposit)
              }
            },
            maximum_top_up_deposit: {
              check (val, elm) {
                return parseFloat(val) > 0 && parseFloat(val) > parseFloat(elm.minimum_top_up_deposit)
              }
            },
            minimum_capping : {
              check (val, elm) {
                return parseFloat(val) > 0
              }
            },
            credit_limit_1: {
              check (val, elm) {
                return parseFloat(val) > 0
              }
            },
            credit_limit_2: {
              check (val, elm) {
                return parseFloat(val) > 0
              }
            },
            credit_limit_3: {
              check (val, elm) {
                return parseFloat(val) > 0
              }
            },
          }
        }
      }
      if (typeof this.stockistRegistrationData.business_address.addresses !== 'undefined'
        && this.stockistRegistrationData.business_address.addresses !== null
        && this.stockistRegistrationData.business_address.addresses.length > 0) {
        def.stockistRegistrationData.business_address.addresses = {
          $each: {
            fields: {
              $each: {
                value: {
                  check (val, elm) {
                    if (elm.required || elm.min) {
                      if (elm.value === '' || elm.value === null) {
                        return false
                      }
                      if (typeof elm.min !== 'undefined') {
                        if (val.length < elm.min) {
                          return false
                        }
                      }
                    }
                    return true
                  }
                }
              }
            }
          }
        }
      }
      if (typeof this.stockistRegistrationData.banks.bank_detail.banking !== 'undefined'
        && this.stockistRegistrationData.banks.bank_detail.banking !== null
        && typeof this.stockistRegistrationData.banks.bank_detail.banking.payment_data !== 'undefined'
        && this.stockistRegistrationData.banks.bank_detail.banking.payment_data !== null
        && typeof this.stockistRegistrationData.banks.bank_detail.banking.payment_data.bank_data !== 'undefined'
        && this.stockistRegistrationData.banks.bank_detail.banking.payment_data.bank_data.length > 0) {
        def.stockistRegistrationData.banks.bank_detail.banking = {
          payment_data: {
            bank_data: {
              $each: {
                fields: {
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
            },
            minLength: minLength(1)
          }
        }
      }
      if (typeof this.stockistRegistrationData.gst_vat.gst_vat_detail.tax_data !== 'undefined'
        && this.stockistRegistrationData.gst_vat.gst_vat_detail.tax_data !== null
        && this.stockistRegistrationData.gst_vat.gst_vat_detail.tax_data.length > 0) {
        def.stockistRegistrationData.gst_vat.gst_vat_detail = {
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
      if (this.stockistRegistrationData.details.remark !== undefined && !this.isNewRegistration) {
        def.stockistRegistrationData.details.remark = {
          required
        }
      }
      return def
    },
    mounted () {
      this.master.keys = [
        this.$const.masterKey.STOCKIST_STATUS,
        this.$const.masterKey.STOCKIST_TYPE,
        'country_code',
        'bank_account_type'
      ]
      this.initSetupArea()
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        errors: state => state.globalCMP.errors.data,
        memberDetails: state => state.membersCMP.memberData.data,
        selectedFilters: state => state.globalCMP.selectedFilters,
        stockistRegistrationDetails: state => state.stockistCMP.stockistRegistrationData
      }),
      ...mapGetters([
        'stockLocationsOptionsByCountry'
      ])
    },
    watch: {
    },
    methods: {
      ...mapActions([
        'getMemberByUserIdAction',
        'getCountryRelationAction',
        'getMastersWithKey',
        'createUpdateStockist',
        'getExistingStockist'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        setMemberData: 'SET_MEMBER_DATA'
      }),
      search (terms, done) {
        let query = {
          search_text: terms,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      initSetupArea () {
        this.stockistRegistrationData.details.country_id = this.selectedFilters.countryID
        let query1 = {
          country_id: this.selectedFilters.countryID,
          relations: ['entity.locations', 'currency', 'taxes', 'stockLocation']
        }
        this.getCountryRelationAction(query1)
        if (this.stockistUserID !== undefined && this.stockistUserID !== null && this.stockistUserID !== '') {
          this.loadExistingStockistData(this.stockistUserID)
        } else {
          if (this.stockistRegistrationDetails.userID === '') {
            this.invalidRequest()
          } else {
            this.stockistRegistrationData.banks.bank_detail.details.country.code_iso_2 = this.selectedFilters.filterCountryCode
            this.stockistRegistrationData.banks.bank_detail.details.country.name = this.selectedFilters.filterCountryName
            let query = {
              user_id: this.stockistRegistrationDetails.userID
            }
            this.getMemberByUserIdAction(query).then((res) => {
              this.show = true
              let member = res
              if (member !== null && member !== undefined) {
                this.stockistRegistrationData.details.member_user_id = member.member_data.details.user_id
                this.stockistRegistrationData.member_data = member.member_data
              }
              this.isNewRegistration = true
              this.isCompletedLoading = true
            })
          }
        }
      },
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Stockist List'})
        }, 1500)
      },
      roundStockistRatio () {
        setTimeout(() => {
          this.stockistRegistrationData.details.stockist_ratio = Math.round(this.stockistRegistrationData.details.stockist_ratio * 2) / 2
        }, 1000)
      },
      loadExistingStockistData (stockistUserID) {
        this.isNewRegistration = false
        let query = {
          stockist_user_id: stockistUserID
        }
        this.getExistingStockist(query).then((res) => {
          if (this.nullObjectValidation(res) && this.nullObjectValidation(res.stockist_data)) {
            this.stockistRegistrationData.details = JSON.parse(JSON.stringify(res.stockist_data.details))
            this.stockistRegistrationData.details.remark = ''
            this.stockistRegistrationData.deposits = JSON.parse(JSON.stringify(res.stockist_data.deposits))
            this.stockistRegistrationData.banks = JSON.parse(JSON.stringify(res.stockist_data.banks))
            this.stockistRegistrationData.banks.bank_detail = JSON.parse(res.stockist_data.banks.bank_detail)
            this.stockistRegistrationData.business_address = JSON.parse(JSON.stringify(res.stockist_data.business_address))
            this.stockistRegistrationData.business_address.addresses = JSON.parse(res.stockist_data.business_address.addresses)
            this.stockistRegistrationData.gst_vat.gst_vat_detail = JSON.parse(res.stockist_data.gst_vat.gst_vat_detail)
            this.stockistRegistrationData.logs = JSON.parse(JSON.stringify(res.stockist_data.logs))
            this.stockistRegistrationData.res = JSON.parse(JSON.stringify(res.stockist_data))
            if (res.stockist_data.stockist_stock_location !==  null && res.stockist_data.stockist_stock_location !== undefined) {
              this.stockistRegistrationData.stockist_stock_location = JSON.parse(JSON.stringify(res.stockist_data.stockist_stock_location))
            } else {
              this.stockistRegistrationData.stockist_stock_location = {id: '' }
            }
            let query = {
              user_id: res.stockist_data.member_data.details.user_id
            }
            this.getMemberByUserIdAction(query).then((res) => {
              this.show = true
              let member = res
              if (member !== null && member !== undefined) {
                this.stockistRegistrationData.member_data = member.member_data
              }
            })
            this.isNewRegistration = false
            this.isCompletedLoading = true
          }
        })
      },
      processForm: function (formFieldData) {
        this.$v.stockistRegistrationData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.stockistRegistrationData.$error) {
            Dialog.create({
              title: this.$t('stockist.setup.dialog.confirmSave.title'),
              message: this.$t('stockist.setup.dialog.confirmSave.message'),
              noEscDismiss: true,
              noBackdropDismiss: true,
              position: 'top',
              ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
              cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel')
            }).then(()=> {
              let query = {
                stockist_data: this.stockistRegistrationData
              }
              this.createUpdateStockist(query).then((res) => {
                // Update vuex saveData
                // Wrap response with data {} object to ensure follow API request standard
                // this.manipulateSaveData(RESPONSE, {data: res.member_data})
                let notificationTitle = ''
                let notificationMessage = ''
                if (this.isNewRegistration) {
                  notificationTitle = this.$t('stockist.registration.notification.creationSuccess.title')
                  notificationMessage = this.$t('stockist.registration.notification.creationSuccess.message')
                } else {
                  notificationTitle = this.$t('stockist.registration.notification.updateSuccess.title')
                  notificationMessage = this.$t('stockist.registration.notification.updateSuccess.message')
                }
                this.setNotification({
                  title: notificationTitle,
                  message: notificationMessage,
                  type: 'positive'
                })
                if (res !== null && res !== undefined && res.stockist_data !== null && res.stockist_data !== undefined) {
                  this.$router.replace({
                    name: 'Stockist Update',
                    params: {stockistUserID: res.stockist_data.details.stockist_user_id}
                  })
                  this.isNewRegistration = false
                  this.stockistRegistrationData.details = JSON.parse(JSON.stringify(res.stockist_data.details))
                  this.stockistRegistrationData.details.remark = ''
                  this.stockistRegistrationData.deposits = JSON.parse(JSON.stringify(res.stockist_data.deposits))
                  this.stockistRegistrationData.banks = JSON.parse(JSON.stringify(res.stockist_data.banks))
                  if (res.stockist_data.banks !== null && res.stockist_data.banks !== undefined) {
                    this.stockistRegistrationData.banks.bank_detail = JSON.parse(res.stockist_data.banks.bank_detail)
                  }
                  this.stockistRegistrationData.business_address = JSON.parse(JSON.stringify(res.stockist_data.business_address))
                  if (res.stockist_data.business_address !== null && res.stockist_data.business_address !== undefined) {
                    this.stockistRegistrationData.business_address.addresses = JSON.parse(res.stockist_data.business_address.addresses)
                  }
                  if (res.stockist_data.gst_vat !== null && res.stockist_data.gst_vat !== undefined) {
                    this.stockistRegistrationData.gst_vat.gst_vat_detail = JSON.parse(res.stockist_data.gst_vat.gst_vat_detail)
                  }
                  this.stockistRegistrationData.logs = JSON.parse(JSON.stringify(res.stockist_data.logs))
                  this.stockistRegistrationData.res = JSON.parse(JSON.stringify(res.stockist_data))
                  this.$v.$reset()
                }
                resolve(res)
              }).catch(error => {
                if (typeof error.response !== 'undefined' && error.response.status_id === 422) {
                  this.openCloseModal({name: 'errorsModal', status_id: true})
                }
                if (typeof error.response !== 'undefined' && error.response.status_idText === 500) {
                  this.setNotification({
                    title: 'Uh oh! An error occured',
                    message: error.response.status_id + '<br>' + error.response.status_idText,
                    type: 'negative'
                  })
                }
                reject(error.response)
              })
            }).catch((error)=>{
            })
          } else {
            this.setNotification({
              title: this.$t('stockist.registration.notification.registrationFailed.title'),
              message: this.$t('stockist.registration.notification.registrationFailed.message'),
              type: 'negative'
            })
            reject(this.$v.stockistRegistrationData.$error)
          }
        })
      },
      nullObjectValidation (object) {
        return object !== undefined && object!== null
      }
    }
  }
</script>

<style scoped>

</style>
