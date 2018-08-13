<template>
  <div class="general-page-holder">
    <basic-form formName="eWalletAdjustmentDetailForm"
                                               formTitle="e-Wallet GIRO Payment Generation"
                                               :backgroudColor="false"
                                               v-bind:formFieldData="giroPaymentData"
                                               urlResetPathName="e-Wallet GIRO Payment List"
                                               :buttonTitleCaption="$t('Common.Save.Btn')"
                                               :formSubmit="processForm"
                                               :buttonOneVisibility="false"
                                               buttonTwoCaption="Generate"
                                               buttonThreeCaption="Cancel">
      <template slot="form">
        <div class="form-holder">
          <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between q-ma-md ">
              <div class="col-lg-10">
                <div class="row gutter-md">
                  <div class="col-4">
                    <q-field
                      :label="$t('sale.cancellation.list.filter.selectCountry')"
                      :error="$v.filterData.countryID.$error"
                      :error-label="$t('sale.cancellation.list.error.selectCountry')"
                    >
                      <q-select
                        clearable
                        color="black"
                        v-model="filterData.countryID"
                        :options="countriesOptions.options"
                        @input="salesCountryChange"
                      />
                    </q-field>
                  </div>
                  <div class="col-4">
                    <q-field
                      label="Giro Type"
                      :error="$v.filterData.filterGiroType.$error"
                      error-label="Please select GIRO type"
                    >
                      <q-select
                        clearable
                        color="black"
                        :disable="disable"
                        v-model="filterData.filterGiroType"
                        :options="giroTypeByCountry"
                      />
                    </q-field>
                  </div>
                </div>
              </div>
              <div class="col-lg-2">
                <div class="row full-height justify-center gutter-xs">
                  <div class="col-lg-11 self-center z-absolute">
                    <q-btn class="full-width"
                           color="primary"
                           @click="queryGiroPayments"
                           :disable="disable"
                    >
                      Run
                    </q-btn>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--table content here-->
          <div class="bg-white shadow-1 fit">
            <div class="row">
              <div class="col-12">
                <div class="row q-pa-md gutter-md">
                  <div class="col-3">
                    <q-input v-model.lazy="giroPaymentData.registered_country"
                             :disable="true"
                             stack-label="Registered Country"
                             hide-underline
                    >
                    </q-input>
                  </div>
                  <div class="col-3">
                    <q-input v-model.lazy="giroPaymentData.giro_type"
                             :disable="true"
                             stack-label="GIRO Type"
                             hide-underline
                    >
                    </q-input>
                  </div>
                  <div class="col-3">
                    <q-input v-model.lazy="giroPaymentData.total_amount"
                             :disable="true"
                             stack-label="Total Amount"
                             hide-underline
                    >
                    </q-input>
                  </div>
                </div>
              </div>
              <div class="col-12 q-pa-xs">
                <table class="text-grey-6 q-table-html bordered cell-separator responsive fit">
                  <thead v-if="giroPaymentData.column_names.length > 0">
                  <tr>
                    <th class="bg-grey-3" v-for="headerName in giroPaymentData.column_names">{{headerName}}</th>
                  </tr>
                  </thead>
                  <tbody>
                    <tr v-for="row in giroPaymentData.data">
                      <td :data-th="giroPaymentData.column_names[0]">{{row.payment_mode}}</td>
                      <td :data-th="giroPaymentData.column_names[1]">{{row.beneficiary_name}}</td>
                      <td :data-th="giroPaymentData.column_names[2]">{{row.beneficiary_account}}</td>
                      <td :data-th="giroPaymentData.column_names[3]">{{row.beneficiary_bank_code}}</td>
                      <td :data-th="giroPaymentData.column_names[4]">{{row.amount | formatPriceDouble}}</td>
                      <td :data-th="giroPaymentData.column_names[5]">{{row.payment_description }}
                      <td :data-th="giroPaymentData.column_names[6]">{{row.beneficiary_account}}</td>
                      <td :data-th="giroPaymentData.column_names[7]">{{row.payment_reference}}</td>
                      <td :data-th="giroPaymentData.column_names[8]">{{row.beneficiary_new_ic_no}}</td>
                      <td :data-th="giroPaymentData.column_names[9]">{{row.beneficiary_old_ic_no}}</td>
                      <td :data-th="giroPaymentData.column_names[10]">{{row.beneficiary_business_registration}}</td>
                      <td :data-th="giroPaymentData.column_names[11]">{{row.beneficiary_others}}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </template>
    </basic-form>
  </div>
</template>

<script>
  import Vue from 'vue'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import genaralHeader from '../../global/components/common/header/generalHeader'
  import qLoader from '../../global/components/common/loading/loader'
  import {DatesMixin} from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: "e-wallet-giro-payment-generation",
    mixins: [DatesMixin],
    components: {
      basicForm,
      genaralHeader,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        isProcessing: state => state.globalCMP.isProcessing,
        simplePagination: state => state.globalCMP.simplePagination,
        selectedFilters: state => state.globalCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal
      }),
      ...mapGetters({
        tableList: 'tableDataWalletAdjustment',
        paginationQuery: 'pagination',
        giroTypeByCountry: 'giroTypeByCountry'
      })
    },
    data: function () {
      return {
        disable: true,
        filterData: {
          countryID: '',
          filterGiroType: ''
        },
        giroPaymentData: {
          registered_country: '-',
          giro_type: '-',
          total_amount: 0,
          column_names: [],
          data: []
        }
      }
    },
    validations: {
      filterData: {
        countryID: {
          required
        },
        filterGiroType: {
          required
        }
      }
    },
    mounted () {
      // Clone vuex filterData to local object
      this.filterData.countryID = this.selectedFilters.countryID
      this.salesCountryChange()
      this.getCountriesAction()
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getGiroTypeAction',
        'retrieveGiroPaymentDetailAction',
        'generateGiroPaymentBatchAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA',
        setNotification: 'SHOW_NOTIFICATION',
        setWalletData: 'SET_WALLET_DATA',
        unsetWalletData: 'UNSET_WALLET_DATA'
      }),
      salesCountryChange () {
        if (this.filterData.countryID > 0) {
          this.disable = false
          // fetch GIRO options here
          let query = {
            country_id: this.filterData.countryID
          }
          this.getGiroTypeAction(query).then(res => {
            if (this.giroTypeByCountry.length > 0) {
              this.filterData.filterGiroType = this.giroTypeByCountry[0].value
            } else {
              this.filterData.filterGiroType = ''
            }
          })
        }
      },
      queryGiroPayments () {
        let query = {
          registered_country_id: this.filterData.countryID,
          giro_type: this.filterData.filterGiroType
        }
        this.retrieveGiroPaymentDetailAction(query).then(res => {
          if (res !== null && res !== undefined) {
            this.giroPaymentData = res
          }
        }).catch(error => {
          if (error['giro_type'] !== undefined && error['giro_type'] !== null && error['giro_type'].length > 0){
            this.setNotification({
              title: 'GIRO Payment request failed',
              message: error['giro_type'][0],
              type: 'negative'
            })
          } else {
            this.setNotification({
              title: 'GIRO Payment request failed',
              message: 'Something went wrong',
              type: 'negative'
            })
          }
        })
      },
      processForm () {
        return new Promise((resolve, reject) => {
          let query = {
            registered_country_id: this.filterData.countryID,
            giro_type: this.filterData.filterGiroType
          }
          this.generateGiroPaymentBatchAction(query).then(res => {
            if (res !== null && res !== undefined) {
              this.setNotification({
                title: 'GIRO Payment Generation Success',
                message: 'GIRO payment batch generated',
                type: 'positive'
              })
              resolve(true)
            }
          }).catch(error => {
            if (error['giro_type'] !== undefined && error['giro_type'] !== null && error['giro_type'].length > 0){
              this.setNotification({
                title: 'GIRO Payment request failed',
                message: error['giro_type'][0],
                type: 'negative'
              })
            } else {
              this.setNotification({
                title: 'GIRO Payment request failed',
                message: 'Something went wrong',
                type: 'negative'
              })
            }
            reject(error)
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>
