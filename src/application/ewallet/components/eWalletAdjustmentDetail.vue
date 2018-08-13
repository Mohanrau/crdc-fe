<template>
  <div class="general-page-holder relative-position">
    <basic-form formName="eWalletAdjustmentDetailForm"
                formTitle="e-Wallet Adjustment"
                :backgroudColor="false"
                v-bind:formFieldData="adjustmentData"
                urlResetPathName="e-Wallet Adjustment List"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="!lockAdjustmentData"
                :buttonTwoVisibility="!lockAdjustmentData"
                :buttonThreeCaption="lockAdjustmentData ? 'Close' : 'Cancel'">
      <template slot="form">
        <div class="form-holder">
          <div class="row">
            <div class="col-lg-12">
              <div class="row gutter-xs">
                <div class="col-xl-4 col-lg-4 col-md-4 col-xs-12">
                  <q-card color="white" class="full-height">
                    <q-card-main class="text-black">
                      <div class="row">
                        <div class="col-12 personal-data-holder relative-position">
                          <q-list no-border
                                  v-if="memberDetails !== undefined && memberDetails !== null && memberDetails.details !== undefined && memberDetails.details !== null"
                          >
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('wallet.adjustment.label.iboID')}}</q-item-tile>
                                <q-item-tile sublabel>{{ memberDetails.details.member_id}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('wallet.adjustment.label.iboName')}}</q-item-tile>
                                <q-item-tile sublabel>
                                  {{ memberDetails.details.name }}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('wallet.adjustment.label.joinedDate')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ formatDate(memberDetails.details.join_date)}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('wallet.adjustment.label.expiryDate')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ formatDate(memberDetails.details.expiry_date)}}
                                  <span v-if="checkDateValidity(memberDetails.details.expiry_date)"><q-icon color="positive" name="check_circle"></q-icon></span>
                                  <span v-else=""><q-icon color="negative" name="remove_circle"></q-icon></span>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('wallet.adjustment.label.membershipType')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ memberDetails.details.effective_rank.rank_name}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('wallet.adjustment.label.highestRank')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ memberDetails.details.highest_rank.rank_name}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('wallet.adjustment.label.balance')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{currencyLabelByCountry}} {{memberDetails.ewallet !== null && memberDetails.ewallet !== undefined ? memberDetails.ewallet.balance: 0 | formatPriceDouble}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                          <q-loader :visible="isProcessingSection"></q-loader>
                        </div>
                      </div>
                    </q-card-main>
                  </q-card>
                </div>
                <div class="col-xl-8 col-lg-8 col-md-8 col-xs-12">
                  <q-card color="white" class="full-height">
                    <q-card-main class="text-black full-height">
                      <div class="row fit">
                        <div class="col-12">
                          <div class="row  gutter-xs">
                            <div class="mt-20 col-9">
                              <q-field
                                :helper="'*'"
                                :label="$t('wallet.adjustment.label.adjustmentType')"
                                :error="$v.adjustmentData.amount_type_id.$error"
                                :error-label="$t('wallet.adjustment.label.error.selectAdjustmentType')"
                              >
                                <q-option-group
                                  type="radio"
                                  inline
                                  :disable="lockAdjustmentData"
                                  v-model="adjustmentData.amount_type_id"
                                  :options="masterDataOptionsCreator(this.$const.masterKey.EWALLET_AMOUNT_TYPE)"
                                >
                                </q-option-group>
                              </q-field>
                              <q-field
                                :helper="'*'"
                                :label="$t('wallet.adjustment.label.adjustmentAmount')"
                                :error="$v.adjustmentData.amount.$error"
                                :error-label="$t('wallet.adjustment.label.error.enterAdjustmentAmount')"
                              >
                                <q-input
                                  type="number"
                                  :disable="lockAdjustmentData"
                                  v-model="adjustmentData.amount"
                                />
                              </q-field>
                              <q-field
                                :helper="'*'"
                                :label="$t('wallet.adjustment.label.reason')"
                                :error="$v.adjustmentData.reason_id.$error"
                                :error-label="$t('wallet.adjustment.label.error.selectAdjustmentReason')"
                              >
                                <q-select
                                  v-model="adjustmentData.reason_id"
                                  :options="masterDataOptionsCreator(this.$const.masterKey.EWALLET_ADJUSTMENT_REASON)"
                                  filter
                                  color="black"
                                  :disable="lockAdjustmentData"
                                ></q-select>
                              </q-field>
                              <q-field
                                :label="$t('wallet.adjustment.label.remarks')"
                              >
                                <q-input
                                  v-model="adjustmentData.remarks"
                                  type="textarea"
                                  :max-height="50"
                                  :min-rows="3"
                                  :disable="lockAdjustmentData"
                                />
                              </q-field>
                            </div>
                          </div>
                        </div>
                        <div class="col-12 self-end" v-if="lockAdjustmentData && adjustmentData.created_by !== null && adjustmentData.created_by !== undefined">
                          <div class="row gutter-xs content-between text-grey q-ma-xs">
                            <div class="col-lg-4 col-md-4 col-xs-12">{{$t('wallet.adjustment.label.submittedDate')}} {{adjustmentData.created_by.created_at}}</div>
                            <div class="col-lg-4 col-md-4 col-xs-12">{{$t('wallet.adjustment.label.performerID')}} {{adjustmentData.created_by.old_member_id}}</div>
                            <div class="col-lg-4 col-md-4 col-xs-12">{{$t('wallet.adjustment.label.performerName')}} {{adjustmentData.created_by.name}}</div>
                          </div>
                        </div>
                      </div>
                    </q-card-main>
                  </q-card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </basic-form>
    <!--<div class="row">-->
    <!--<pre>{{workflow}}</pre>-->
    <!--<pre>{{stockist_consignment_deposit}}</pre>-->
    <!--</div>-->
    <q-loader :visible="isProcessingForm"></q-loader>
  </div>
</template>

<script>
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { DatesMixin, MasterDataTransformarMixin, GeneralsMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import { required, minLength } from 'vuelidate/lib/validators'
  import { Dialog } from 'quasar'

  export default {
    name: "e-wallet-adjustment-area",
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin],
    components: {
      basicForm,
      qLoader,
      errorsModal
    },
    props: ['adjustmentID'],
    data: () => ({
      lockAdjustmentData: false,
      adjustmentData: {
        user_id: '',
        country_id : '',
        amount_type_id: '',
        amount: '',
        reason_id: '',
        remarks: ''
      }
    }),
    validations: {
      adjustmentData: {
        amount_type_id: {
          required
        },
        amount: {
          required
        },
        reason_id: {
          required
        }
      }
    },
    mounted () {
      this.master.keys = [
        this.$const.masterKey.EWALLET_AMOUNT_TYPE,
        this.$const.masterKey.EWALLET_ADJUSTMENT_REASON
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
        walletData: state => state.eWalletCMP.walletData
      }),
      ...mapGetters([
        'currencyLabelByCountry'
      ])
    },
    watch: {
    },
    methods: {
      ...mapActions([
        'getMemberByUserIdAction',
        'getCountryRelationAction',
        'getMastersWithKey',
        'createWalletAdjustmentAction',
        'loadExistingWalletAdjustmentAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      initSetupArea () {
        let query1 = {
          country_id: this.selectedFilters.countryID,
          relations: ['currency']
        }
        this.getCountryRelationAction(query1)
        if (this.nullObjectValidation(this.adjustmentID) && this.adjustmentID !== '') {
          this.lockAdjustmentData = true
          let query = {
            id: this.adjustmentID,
            member_data: false
          }
          this.loadExistingWalletAdjustmentAction(query).then(res => {
            if (this.nullObjectValidation(res)) {
              this.adjustmentData = res
              let query = {
                user_id: res.user_id,
              }
              this.getMemberByUserIdAction(query)
            } else {
              this.invalidRequest()
            }
          })
        } else if (this.walletData.userID !== '') {
          this.adjustmentData.user_id = this.walletData.userID
          this.adjustmentData.country_id = this.selectedFilters.countryID
          let query = {
            user_id: this.walletData.userID,
          }
          this.getMemberByUserIdAction(query)
        } else {
          this.invalidRequest()
        }
      },
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'e-Wallet Adjustment List'})
        }, 1500)
      },
      processForm () {
        this.$v.$touch()
        if (!this.$v.$error) {
          // submit adjustment here
          if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.EWALLET_AMOUNT_TYPE, this.$const.masterData.CREDIT) === this.adjustmentData.amount_type_id) {
            this.adjustmentData.credit_amount = this.adjustmentData.amount
          } else {
            this.adjustmentData.debit_amount = this.adjustmentData.amount
          }
          this.createWalletAdjustmentAction(this.adjustmentData).then((res) => {
            if (this.nullObjectValidation(res)) {
              // this.stockist_consignment_deposit = res.consignment_deposit_refund
              // this.workflow = res.workflow.workflow
              // this.stockist_consignment_deposit.min_capping_credit_limit = Number(this.stockist_consignment_deposit.minimum_capping) * Number(this.stockist_consignment_deposit.ratio)
              // this.calculateRefundCreditLimit()
              this.lockAdjustmentData = true
              this.adjustmentData = res
              let query = {
                user_id: this.adjustmentData.user_id,
              }
              this.getMemberByUserIdAction(query)
              this.$router.replace({
                name: 'e-Wallet Adjustment Detail',
                params: {
                  adjustmentID: res.id
                }
              })
            }
          })
        } else {
          this.setNotification({
            title: 'Adjustment Request Failed',
            message: 'Please fix errors in the form before submitting',
            type: 'negative'
          })
        }
      },
      nullObjectValidation (object) {
        return object !== undefined && object!== null
      }
    }
  }
</script>

<style scoped>
  .workflow-action {
    border-left: 4px solid lightgrey
  }
</style>
