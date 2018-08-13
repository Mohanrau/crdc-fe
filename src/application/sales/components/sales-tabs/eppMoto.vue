<template>
    <div class="epp-moto-detail-tab full-width">
        <q-card color="white" class="full-height shadow-0">
            <q-card-main class="text-black full-height">
                <div class="row">
                    <div class="col-6">
                        <q-list no-border>
                            <q-item tag="label" multiline>
                                <q-item-main>
                                    <q-item-tile label>
                                        {{$t('sales.eppMoto.totalAmount.label')}}
                                    </q-item-tile>
                                    <q-item-tile sublabel>
                                        {{salesData.epp_moto_payment.amount}}
                                    </q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                                <q-item-main>
                                    <q-item-tile label>
                                        {{$t('sales.eppMoto.cardType.label')}}
                                    </q-item-tile>
                                    <q-item-tile sublabel>
                                        {{salesData.epp_moto_payment.payment_detail.payment_response.card_type}}
                                    </q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                                <q-item-main>
                                    <q-item-tile label>{{$t('sales.eppMoto.tenure.label')}}</q-item-tile>
                                    <q-item-tile sublabel>
                                        {{salesData.epp_moto_payment.payment_detail.payment_response.tenure}}
                                    </q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                                <q-item-main>
                                    <q-item-tile label>{{$t('sales.eppMoto.cardholderName.label')}}</q-item-tile>
                                    <q-item-tile sublabel>
                                        {{salesData.epp_moto_payment.payment_detail.payment_response.card_holder_name}}
                                    </q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                                <q-item-main>
                                    <q-item-tile label>{{$t('sales.eppMoto.cardNumber.label')}}</q-item-tile>
                                    <q-item-tile sublabel>
                                        {{salesData.epp_moto_payment.payment_detail.payment_response.card_number}}
                                    </q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                                <q-item-main>
                                    <q-item-tile label>
                                        {{$t('sales.eppMoto.cardExpiryDate.label')}}
                                    </q-item-tile>
                                    <q-item-tile sublabel>
                                        {{salesData.epp_moto_payment.payment_detail.payment_response.card_expiry_date}}
                                    </q-item-tile>
                                </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                                <q-item-main>
                                    <q-item-tile label>{{$t('sales.eppMoto.CvvCode.label')}}</q-item-tile>
                                    <q-item-tile sublabel>
                                        {{salesData.epp_moto_payment.payment_detail.payment_response.cvv_code}}
                                    </q-item-tile>
                                </q-item-main>
                            </q-item>
                        </q-list>
                    </div>
                    <div class="col-6">
                        <q-card flat class="q-mt-lg custom-border q-pa-sm" color="white">
                            <q-card-title class="text-black">
                                {{$t('sales.eppMoto.approvalAction.label')}}
                            </q-card-title>
                            <q-card-main class="text-black">
                                <div class="row gutter-sm">
                                    <div class="col-lg-12" v-if="!isPaymentRejected">
                                        <q-field
                                                :label="$t('sales.eppMoto.approvalCode.label')"
                                                :label-width="12"
                                                :error="$v.salesData.epp_moto_payment.payment_detail.payment_response.approval_code.$error"
                                                :error-label="$t('sales.eppMoto.errorLabel.missingApprovalCode')"
                                        >
                                            <q-input
                                                    v-model.trim="salesData.epp_moto_payment.payment_detail.payment_response.approval_code"
                                                    :disable="isPaymentApproved"
                                                    inverted-light
                                                    color="white text-black"
                                                    class="no-shadow custom-input-border"
                                                    clearable
                                                    autofocus>
                                            </q-input>
                                        </q-field>
                                    </div>
                                    <div class="col-auto">
                                        <q-btn size="md" rounded :outline="!isPaymentApproved" color="positive"
                                               :disable="isPaymentRejected || isPaymentApproved"
                                               @click="sendEppApproval">{{$t('sales.eppMoto.approveButton.label')}}
                                        </q-btn>
                                    </div>
                                    <div class="col-auto">
                                        <q-btn size="md" rounded :outline="!isPaymentRejected" color="negative"
                                               :disable="isPaymentRejected || isPaymentApproved"
                                               @click="rejectEppApproval">{{$t('sales.eppMoto.rejectButton.label')}}
                                        </q-btn>
                                    </div>
                                </div>
                                <div div class="q-mt-lg" v-if="isPaymentApproved">
                                    <div class="q-mt-xs text-green">
                                        {{$t('sales.eppMoto.approvedBy.label', {approvedBy: salesData.epp_moto_payment.payment_detail.payment_response.approvedBy.name})}}
                                    </div>
                                    <div class="q-mt-xs text-green">
                                        {{$t('sales.eppMoto.approvedAt.label', {approvedAt: salesData.epp_moto_payment.payment_detail.payment_response.approved_date})}}
                                    </div>
                                </div>
                                <div div class="q-mt-lg" v-else-if="isPaymentRejected">
                                    <div class="q-mt-xs text-red">
                                        {{$t('sales.eppMoto.rejectedBy.label', {rejectedBy: salesData.epp_moto_payment.updated_by !== null && salesData.epp_moto_payment.updated_by !== undefined ? salesData.epp_moto_payment.updated_by.name : '-'})}}
                                    </div>
                                    <div class="q-mt-xs text-red">
                                        {{$t('sales.eppMoto.rejectedAt.label', {rejectedAt: salesData.epp_moto_payment.updated_at})}}
                                    </div>
                                </div>
                            </q-card-main>
                        </q-card>
                    </div>
                </div>
            </q-card-main>
        </q-card>
    </div>
</template>

<script>
  import {
    MasterDataTransformarMixin,
    GeneralsMixin
  } from 'src/application/global/mixins/index'
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
  import {Dialog} from 'quasar'
  import {required} from 'vuelidate/lib/validators'

  export default {
    name: "epp",
    mixins: [MasterDataTransformarMixin, GeneralsMixin],
    props: {
      salesData: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters([
        'callCodeOptionsByCountry',
        'eppMotoApprovalResponseData',
        'eppMotoRejectionResponseData'
      ]),
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        memberData: state => state.membersCMP.memberData.data,
        storeAddresses: state => state.salesCMP.salesAddresses,
        appSettings: state => state.globalCMP.appSettings
      }),
      isPaymentApproved() {
        return this.salesData.epp_moto_payment.payment_detail.payment_response.approvalStatus.id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.EPP_PAYMENT_APPROVAL_STATUS, this.$const.masterData.APPROVED)
      },
      isPaymentRejected() {
        return this.salesData.epp_moto_payment.payment_detail.payment_response.approvalStatus.id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.EPP_PAYMENT_APPROVAL_STATUS, this.$const.masterData.DECLINED)
      }
    },
    props: {
      salesData: {
        type: Object,
        required: true
      }
    },
    mounted() {
      this.master.keys = [this.$const.masterKey.EPP_PAYMENT_APPROVAL_STATUS]
    },
    validations: {
      salesData: {
        epp_moto_payment: {
          payment_detail: {
            payment_response: {
              approval_code: {
                required
              }
            }
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'submitEppApprovalAction',
        'batchCancelPaymentAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        setCartPwpValidationIds: 'SET_CART_PWP_VALIDATION_IDS',
        unsetCartPwpValidationIds: 'UNSET_CART_PWP_VALIDATION_IDS',
        setCartPwpItemTempList: 'SET_CART_PWP_ITEM_TEMP_LIST',
        unsetCartPwpItemList: 'UNSET_CART_PWP_ITEM_TEMP_LIST',
        setSalesAddresses: 'SET_SALES_ADDRESSES_DATA'
      }),
      sendEppApproval() {
        Dialog.create({
          title: this.$t('sale.order.eppMoto.dialog.confirmApproval.title'),
          message: this.$t('sale.order.eppMoto.dialog.confirmApproval.message'),
          noEscDismiss: true,
          noBackdropDismiss: true,
          position: 'top',
          ok: this.$t('sale.order.eppMoto.dialog.confirmSave.ok'),
          cancel: this.$t('sale.order.eppMoto.dialog.confirmSave.cancel')
        }).then(() => {
          this.$v.salesData.$touch()
          if (!this.$v.salesData.$error) {
            let query = {
              payment_id: this.salesData.epp_moto_payment.id,
              approve_code: this.salesData.epp_moto_payment.payment_detail.payment_response.approval_code
            }
            this.submitEppApprovalAction(query).then((res) => {
              if (this.eppMotoApprovalResponseData !== null && this.eppMotoApprovalResponseData !== undefined && this.eppMotoApprovalResponseData.payment !== null && this.eppMotoApprovalResponseData.payment !== undefined) {
                this.salesData.epp_moto_payment = Object.assign({}, this.eppMotoApprovalResponseData.payment)
                this.setNotification({
                  title: this.$t('sales.eppMoto.notification.approvalSuccess.title'),
                  message: this.$t('sales.eppMoto.notification.approvalSuccess.message'),
                  type: 'positive'
                })
              }
            }).catch((error) => {
              console.error(error)
            })
          } else {
            this.setNotification({
              title: this.$t('sales.eppMoto.notification.approvalFailed.title'),
              message: this.$t('sales.eppMoto.notification.approvalFailed.missingApprovalCode.message'),
              type: 'negative'
            })
          }
        })
      },
      rejectEppApproval() {
        Dialog.create({
          title: this.$t('sale.order.eppMoto.dialog.confirmRejection.title'),
          message: this.$t('sale.order.eppMoto.dialog.confirmRejection.message'),
          noEscDismiss: true,
          noBackdropDismiss: true,
          position: 'top',
          ok: this.$t('sale.order.eppMoto.dialog.confirmSave.ok'),
          cancel: this.$t('sale.order.eppMoto.dialog.confirmSave.cancel')
        }).then(() => {
          let query = {
            payment_mode: 'epp_moto',
            sales_payments_ids: [this.salesData.epp_moto_payment.id]
          }
          this.batchCancelPaymentAction(query).then((res) => {
            if (this.eppMotoRejectionResponseData !== null && this.eppMotoRejectionResponseData !== undefined && this.eppMotoRejectionResponseData.payments !== null && this.eppMotoRejectionResponseData.payments !== undefined && this.eppMotoRejectionResponseData.payments.length > 0) {
              this.salesData.epp_moto_payment = Object.assign({}, this.eppMotoRejectionResponseData.payments[0])
              this.setNotification({
                title: this.$t('sales.eppMoto.notification.rejectionSuccess.title'),
                message: this.$t('sales.eppMoto.notification.rejectionSuccess.message'),
                type: 'positive'
              })
            }
          })
        })
      }
    }
  }
</script>

<style scoped>
</style>
