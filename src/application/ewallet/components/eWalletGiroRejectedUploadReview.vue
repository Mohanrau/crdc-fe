<template>
  <div class="general-page-holder">
    <basic-form formName="eWalletAdjustmentDetailForm"
                formTitle="e-Wallet GIRO Payment Generation"
                :backgroudColor="false"
                v-bind:formFieldData="giroRejectedUpload"
                urlResetPathName="e-Wallet GIRO Rejected Payment"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="false"
                buttonTwoCaption="Generate"
                buttonThreeCaption="Cancel">
      <template slot="form">
        <div class="form-holder">
          <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between gutter-md">
              <div class="col-12">
                <q-input
                  stack-label="File Name"
                  v-model="walletUploadResponse.file_name"
                  :disable="true"
                  hide-underline
                />
              </div>
              <div class="col-4">
                <q-field
                >
                  <q-select
                    color="black"
                    :stack-label="$t('sale.cancellation.list.filter.selectCountry')"
                    v-model="giroRejectedUpload.registered_country"
                    :options="countriesOptions.options"
                  />
                </q-field>
              </div>
              <div class="col-12">
                <table
                  class="text-black col-lg-10 q-table-html bordered cell-separator fit responsive"
                  v-if="walletUploadResponse.data !== undefined && walletUploadResponse.data !== null"
                >
                  <thead class="bg-grey-4">
                  <tr>
                    <th rowspan="2">IBO ID</th>
                    <th rowspan="2">IBO Name</th>
                    <th rowspan="2">Rejected Amount</th>
                    <th colspan="2">Registered Country</th>
                    <th rowspan="2">Remarks</th>
                  </tr>
                  <tr>
                    <th>Currency</th>
                    <th>Total Amount</th>
                  </tr>
                  </thead>
                  <tbody>
                  <!--{-->
                  <!--"ibo_id": 100299033,-->
                  <!--"ibo_name": "NORHASHIMAH BINTI HASSAN",-->
                  <!--"rejected_amount": 2000,-->
                  <!--"registered_country_currency": "MYR",-->
                  <!--"registered_country_total": 2000,-->
                  <!--"remarks": "missing passport"-->
                  <!--}-->
                  <tr
                    v-for="row in walletUploadResponse.data"
                    >
                    <td>{{row.ibo_id}}</td>
                    <td>{{row.ibo_name}}</td>
                    <td>{{row.rejected_amount}}</td>
                    <td>{{row.registered_country_currency}}</td>
                    <td>{{row.registered_country_total}}</td>
                    <td>{{row.remarks}}</td>
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
    name:  "e-wallet-giro-rejected-upload-review",
    mixins: [DatesMixin],
    components: {
      basicForm,
      genaralHeader,
      qLoader
    },
    computed: {
      ...mapState({
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        selectedFilters: state => state.globalCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        walletUploadResponse: state => state.eWalletCMP.walletRejectedPaymentResponse.response,
      }),
      ...mapGetters({
        tableList: 'tableDataWalletAdjustment',
        paginationQuery: 'pagination',
        giroTypeByCountry: 'giroTypeByCountry'
      })
    },
    data: function () {
      return {
        giroRejectedUpload: {
          registered_country: ''
        }
      }
    },
    validations: {
      giroRejectedUpload: {
        registered_country: {
          required
        }
      }
    },
    mounted () {
      this.getCountriesAction()
    },
    invalidRequest () {
      this.setIsProcessingForm(true)
      this.message = 'Oops something went wrong. Redirecting ...'
      this.show = false
      setTimeout(() => {
        this.setIsProcessingForm(false)
        this.$router.push({name: 'e-Wallet GIRO Rejected Payment'})
      }, 1500)
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'submitGiroRejectedPaymentAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION'
      }),
      processForm () {
        return new Promise((resolve, reject) => {
          let query = {
            country_id: this.giroRejectedUpload.registered_country,
            file_url: this.walletUploadResponse.file_url
          }
          this.submitGiroRejectedPaymentAction(query).then(res => {
            console.log(res)
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
