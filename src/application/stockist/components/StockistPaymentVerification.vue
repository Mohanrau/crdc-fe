<template>
  <div class="general-page-holder relative-position">
    <basic-form formName="eWalletAdjustmentDetailForm"
                formTitle="e-Wallet Adjustment"
                :backgroudColor="false"
                v-bind:formFieldData="stockistPaymentVerificationData"
                urlResetPathName="e-Wallet Adjustment List"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="true"
                buttonThreeCaption="Back">
      <template slot="form">
        <div class="form-holder">
          <div class="row bg-white shadow-1">
            <div class="col-12">
              <q-card color="white" class="full-height">
                <q-card-main class="text-black">
                  <div class="row gutter-lg justify-end">
                    <div class="col-lg-4">
                      <q-list no-border class="col-12">
                        <q-item>
                          <q-item-main>
                            <q-item-tile label>
                              {{$t('sale.cancellation.list.filter.selectCountry')}}
                            </q-item-tile>
                            <q-item-tile sublabel>
                              <q-field
                                :error="$v.stockistPaymentVerificationData.countryID.$error"
                                :error-label="$t('sale.cancellation.list.error.selectCountry')"
                              >
                                <q-select
                                  clearable
                                  color="black"
                                  v-model="stockistPaymentVerificationData.countryID"
                                  :options="countriesOptions.options"
                                  @input="salesCountryChange"
                                />
                              </q-field>
                            </q-item-tile>
                          </q-item-main>
                        </q-item>
                        <q-item>
                          <q-item-main>
                            <q-item-tile label>
                              {{$t('stockist.list.filter.dateFrom')}}
                            </q-item-tile>
                            <q-item-tile sublabel>
                              <q-field
                                :error="$v.stockistPaymentVerificationData.dateFrom.$error"
                                :error-label="$t('stockist.list.errorMessage.dateFrom')">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            v-model="stockistPaymentVerificationData.dateFrom"
                                            @input="filterChange"
                                />
                              </q-field>
                            </q-item-tile>
                          </q-item-main>
                        </q-item>
                        <q-item>
                          <q-item-main>
                            <q-item-tile label>
                              {{$t('stockist.list.filter.dateTo')}}
                            </q-item-tile>
                            <q-item-tile sublabel>
                              <q-field
                                :error="$v.stockistPaymentVerificationData.dateTo.$error"
                                :error-label="$t('stockist.list.errorMessage.dateTo')">
                                <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                            v-model="stockistPaymentVerificationData.dateTo"
                                            @input="filterChange"
                                />
                              </q-field>
                            </q-item-tile>
                          </q-item-main>
                        </q-item>
                        <q-item>
                          <q-item-main>
                            <q-item-tile sublabel>
                              <q-checkbox
                                v-model="stockistPaymentVerificationData.excludeZeroBalance"
                                label="Exclude Zero Balance Records"
                                @input="filterChange()"
                              />
                            </q-item-tile>
                          </q-item-main>
                        </q-item>
                      </q-list>
                    </div>
                    <div class="col-lg-8">
                      <div class="row gutter-xs fit">
                        <p class="col-12 q-pl-xs q-title">Stockist List</p>
                        <div
                          class="col-lg-6 col-md-6 col-xs-12"
                          v-for="(user, index) in stockistPaymentVerificationData.stockist_ids"
                          :key="index"
                        >
                          <div class="row gutter-xs">
                            <q-field
                              class="col-10"
                              :error="$v.stockistPaymentVerificationData.stockist_ids.$each[index].$error || setError(''+user.stockist_id.toString(),'type.exp')"
                              :error-label="setError(user.stockist_id.toString(),'type.exp') ?  setError(user.stockist_id.toString(),'type.msg') : $t('bonus.cwIncome.errorMessage.selectMember')"
                            >
                              <q-input v-model="user.stockist_name"
                                       clearable
                                       :disable="user.isStockistSelected"
                                       :placeholder="$t('stockist.list.placeholder.stockistSearchTerm')"
                                       @input="$v.stockistPaymentVerificationData.stockist_ids.$each[index].$touch()"
                              >
                                <q-autocomplete @search="(terms, done) => search(terms, done, user, 'stockist_id')"
                                                @selected="(item) => selected(item, user, 'stockist_id')"
                                />
                              </q-input>
                            </q-field>
                            <div class="col-2">
                              <q-btn
                                icon="remove"
                                round
                                small
                                @click="removeMemberInSearch(user, index)"
                              ></q-btn>
                            </div>
                          </div>
                        </div>
                        <q-field
                          class="col-12"
                          :error="$v.stockistPaymentVerificationData.stockist_ids.$error"
                          :error-label="$t('stockist.paymentVerification.errorMessage.selectStockists')"
                        ></q-field>
                        <div class="col-12">
                          <q-btn
                            flat
                            round
                            icon="add"
                            :disable="stockistPaymentVerificationData.stockist_ids.length >= 10"
                            @click="addMemberInSearch"
                          >
                          </q-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card-main>
              </q-card>
            </div>
          </div>
          <div class="bg-white shadow-1 relative-position mt-20 col-lg-12">
            <div>
              <q-card class="full-width" color="white">
                <q-card-main
                  class="text-black"
                >
                  <div class="form-tabs mt-20 text-black">
                    <q-tabs inverted  two-lines color="grey-7" align="left">
                      <q-tab default name="stockistSummary"
                             slot="title"
                             :label="$t('stockist.paymentVerification.tabTitle.stockistSummary')"/>
                      <q-tab
                        slot="title"
                        v-for="user in stockistPaymentVerificationData.stockist_ids"
                        v-if="user.isStockistSelected"
                        :name="user.stockist_id.toString()"
                        :label="user.stockist_name"
                        :alert="user.has_error"
                        :key="user.stockist_id"
                      ></q-tab>
                      <!-- Tab Content -->
                      <q-tab-pane
                        name="stockistSummary"
                        class="no-border bg-white q-pa-none q-ma-none sales-items full-height full-width align-content-start"
                      >
                        <stockist-a-r-summary
                          v-if="stockistPaymentVerificationData.countryID !== null && stockistPaymentVerificationData.countryID !== undefined  && stockistPaymentVerificationData.countryID !== ''"
                          :countryID="stockistPaymentVerificationData.countryID"
                          :excludeZeroAR="stockistPaymentVerificationData.excludeZeroBalance" />
                      </q-tab-pane>
                      <q-tab-pane
                        v-for="user in stockistPaymentVerificationData.stockist_ids"
                        v-if="user.isStockistSelected"
                        :name="user.stockist_id.toString()"
                        :key="user.stockist_id"
                        class="no-border bg-white sales-items shadow-1  q-pa-none q-ma-none "
                      >
                        <stockist-payments
                          :stockist="user"
                          :userValidation="$v"
                          />
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
    <!--<pre>{{stockistPaymentVerificationData}}</pre>-->
  </div>
</template>

<script>
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {DatesMixin, SetFormFieldErrorsMixin} from 'src/application/global/mixins/index'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import { StockistARSummary, StockistPayments } from 'src/application/stockist/components/payment-verification-tabs/index'

  export default {
    name: "stockist-payment-verification",
    mixins: [SetFormFieldErrorsMixin, DatesMixin],
    components: {
      genaralHeader,
      basicForm,
      qLoader,
      StockistARSummary,
      StockistPayments
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        stockistSearchData: state => state.stockistCMP.stockistSearchData,
        selectedFilters: state => state.globalCMP.selectedFilters,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        errors: state => state.globalCMP.errors.data
      })
    },
    mounted: function () {
      this.stockistPaymentVerificationData.countryID = this.selectedFilters.countryID
      if (this.stockistPaymentVerificationData.dateFrom === '') {
        this.stockistPaymentVerificationData.dateFrom = new Date().setDate(new Date().getDate() -1)
      }
      if (this.stockistPaymentVerificationData.dateTo === '') {
        this.stockistPaymentVerificationData.dateTo = new Date().setDate(new Date().getDate() -1)
      }
      this.salesCountryChange()
      this.getCountriesAction()
      this.$v.$reset()
    },
    data: () => ({
      stockistPaymentVerificationData: {
        countryID: '',
        dateFrom: '',
        dateTo: '',
        excludeZeroBalance: false,
        stockist_ids: [
          {
            stockist_id: '',
            stockist_name: '',
            has_error: false,
            isStockistSelected: false,
            payment_info: [],
            totalOutstanding: 0
          }
        ]
      }
    }),
    validations: {
      stockistPaymentVerificationData: {
        countryID: {
          required
        },
        dateFrom: {
          isInRange (val, elm) {
            if (elm && val !== '') {
              let diff = this.getDateDiff(elm.filterDateRangeTo, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        dateTo: {
          isInRange (val, elm) {
            if (elm) {
              let diff = this.getDateDiff(this.getCurrentDate(), val, 'days')
              if (diff >= 0) {
                return true
              } else {
                return false
              }
            }
            return false
          }
        },
        stockist_ids: {
          required,
          minLength: minLength(1),
          $each: {
            stockist_id: {
              required
            }
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getStockistSearchAction',
        'getStockistPaymentVerificationListAction',
        'updateStockistPaymentVerificationAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      search (terms, done, user, field) {
        if (field === 'stockist_id') {
          let query = {
            country_id: this.stockistPaymentVerificationData.countryID,
            search_text: user.stockist_name,
            limit: 10
          }
          this.getStockistSearchAction(query).then(res => {
            done(this.stockistSearchData.list)
          })
        }
      },
      selected (item, user, field) {
        this[field] = item.sublabel
        if (field === 'stockist_id') {
          user.stockist_id = item.stockist_id
          user.stockist_name = item.label
          user.isStockistSelected = true
        }
        this.filterChange()
      },
      getAdditionalIBO () {
        return {
          stockist_id: '',
          stockist_name: '',
          has_error: false,
          isStockistSelected: false,
          payment_info: [],
          totalOutstanding: 0
        }
      },
      addMemberInSearch () {
        this.stockistPaymentVerificationData.stockist_ids.push(this.getAdditionalIBO())
      },
      removeMemberInSearch (user, index) {
        // make sure the error messages doesn't reappear after removing the text field to ensure validation consistency
        this.$v.stockistPaymentVerificationData.stockist_ids.$reset()
        this.stockistPaymentVerificationData.stockist_ids.splice(this.stockistPaymentVerificationData.stockist_ids.indexOf(user), 1)
      },
      resetForm () {
        this.stockistPaymentVerificationData.cw_id = ''
        this.stockistPaymentVerificationData.cw_name = ''
        this.stockistPaymentVerificationData.stockist_ids = []
      },
      processForm () {
        this.$v.stockistPaymentVerificationData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.stockistPaymentVerificationData.$error) {
            if (this.checkStockistAdjustmentContra()) {
              let updatedStockistPayment = []
              this.stockistPaymentVerificationData.stockist_ids.forEach(stockist => {
                let updatedPayments = stockist.payment_info.filter(payment => {
                  return payment.pay_amount !== 0 || payment.adjustment_amount !== 0
                })
                if (updatedPayments !== undefined) {
                  updatedStockistPayment = updatedStockistPayment.concat(updatedPayments)
                }
              })
              this.updateStockistPaymentVerificationAction({stockists_sales_payments: updatedStockistPayment}).then((res) => {
                if (res !== null && res !== undefined && res.result !== undefined) {
                  if (res.result) {
                    this.setNotification({
                      title: this.$t('stockist.paymentVerification.notification.paymentUpdated.title'),
                      message: this.$t('stockist.paymentVerification.notification.paymentUpdated.message'),
                      type: 'positive'
                    })
                    this.retrieveStockistPayments()
                    resolve(res)
                  } else {
                    this.setNotification({
                      title: this.$t('stockist.paymentVerification.notification.paymentFailed.title'),
                      message: this.$t('stockist.paymentVerification.notification.paymentFailed.message'),
                      type: 'negative'
                    })
                    reject(res)
                  }
                }
              }).catch(error => {
                this.setNotification({
                  title: this.$t('stockist.paymentVerification.notification.paymentFailed.title'),
                  message: this.$t('stockist.paymentVerification.notification.paymentFailed.message'),
                  type: 'negative'
                })
                reject(error)
              })
            } else {
              this.setNotification({
                title: this.$t('stockist.paymentVerification.notification.paymentFailed.title'),
                message: 'Stockist adjustment amount is not completely contra out',
                type: 'negative'
              })
              reject(false)
            }
          } else {
            this.setNotification({
              title: this.$t('stockist.paymentVerification.notification.paymentFailed.title'),
              message: this.$t('stockist.paymentVerification.notification.validationFailed.message'),
              type: 'negative'
            })
            reject(this.$v.stockistPaymentVerificationData.$error)
          }
        })
      },
      filterChange() {
        this.$v.stockistPaymentVerificationData.$touch()
        if (!this.$v.stockistPaymentVerificationData.$error) {
          this.retrieveStockistPayments()
        }
      },
      checkStockistAdjustmentContra () {
        let isAdjustmentAmountContra = true
        this.stockistPaymentVerificationData.stockist_ids.forEach(stockist => {
          stockist.has_error = stockist.payment_info.reduce((total, payment) => total + payment.adjustment_amount, 0) !== 0
          isAdjustmentAmountContra = !stockist.has_error
        })
        return isAdjustmentAmountContra
      },
      retrieveStockistPayments () {
        let selected_stockist_ids = []
        this.stockistPaymentVerificationData.stockist_ids.forEach(stockist => {
          selected_stockist_ids.push(stockist.stockist_id)
          // also reset the payment information array for query
          stockist.payment_info = []
          stockist.totalOutstanding = 0
        })
        let query = {
          // set parameters here
          country_id: this.stockistPaymentVerificationData.countryID,
          from_date: this.formatDate(this.stockistPaymentVerificationData.dateFrom, 'YYYY-MM-DD'),
          to_date: this.formatDate(this.stockistPaymentVerificationData.dateTo, 'YYYY-MM-DD'),
          exclude_zero_balance: this.stockistPaymentVerificationData.excludeZeroBalance ? 1 : 0,
          selected_stockist_ids: selected_stockist_ids
        }
        this.getStockistPaymentVerificationListAction(query).then(res => {
          if (res !== null && res !== undefined && res.data !== null && res.data !== undefined && res.data.length > 0) {
            res.data.forEach(payment => {
              // set to 0 since BE returns empty space
              payment.pay_amount = 0.00
              let stockist = this.stockistPaymentVerificationData.stockist_ids.find(user => {
                return user.stockist_id === payment.stockist_id
              })
              if (stockist !== null && stockist !== undefined) {
                stockist.payment_info.push(payment)
                stockist.totalOutstanding += parseFloat(payment.outstanding_amount)
              }
            })
          }
        })
      },
      salesCountryChange () {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.stockistPaymentVerificationData.countryID)
        if (getCountryName !== null && getCountryName !== undefined && getCountryName.length > 0) {
          this.setFilterData({
            countryID: this.stockistPaymentVerificationData.countryID,
            filterCountryName: getCountryName[0].label,
            filterCountryCode: getCountryName[0].code
          })
        }
        if (this.stockistPaymentVerificationData.countryID > 0) {
          this.show = true
          this.disable = false
          this.filterChange()
        } else {
          this.disable = true
        }
      }
    }
  }
</script>

<style scoped>

</style>
