<template>
  <div class="full-width full-height">
    <q-card color="white" class="full-height">
      <q-card-title v-if="rentalSalesOrder.workflow !== null && rentalSalesOrder.workflow !== undefined">
        <p class="text-black q-display-1">{{rentalSalesOrder.workflow.name}}</p>
      </q-card-title>
    <q-card-main class="text-black fit no-shadow" v-if="rentalSalesOrder.workflow !== undefined && rentalSalesOrder.workflow !== null">
      <q-stepper
        flat
        ref="stepper"
        vertical
        class=" no-shadow"
        color="primary"
        :alternative-labels="true"
        contractable
      >
        <q-step
          v-for="wfstep in rentalSalesOrder.workflow.steps"
          :disable="isNewRequest ||
                    rentalSalesOrder.workflow === undefined ||
                    rentalSalesOrder.workflow === null ||
                    rentalSalesOrder.workflow.current_step === undefined ||
                    rentalSalesOrder.workflow.current_step === null ||
                    rentalSalesOrder.workflow.current_step.step !== wfstep.step"
          :key="wfstep.sequence"
          :name="wfstep.step"
          :title="wfstep.name" >
          <div
            v-if="rentalSalesOrder.workflow !== undefined &&
                  rentalSalesOrder.workflow !== null &&
                  rentalSalesOrder.workflow.current_step !== undefined &&
                  rentalSalesOrder.workflow.current_step !== null &&
                  wfstep.step === rentalSalesOrder.workflow.current_step.step &&
                  rentalSalesOrder.workflow.current_step.step_data.actions!== undefined &&
                  rentalSalesOrder.workflow.current_step.step_data.actions !== null &&
                  rentalSalesOrder.workflow.current_step.step_data.actions.fields.length > 0">
            <div class="row gutter-sm justify-start">
              <div v-for="step in rentalSalesOrder.workflow.current_step.step_data.actions.fields">
                <!--{'col-xl-auto col-lg-auto col-md-12 col-xs-12': typeof step.share !== 'undefined' && step.share.pos !=='C',-->
                <!--'col': typeof step.share === 'undefined',-->
                <!--'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof step.share !== 'undefined' && step.share.pos ==='C'}-->
                <q-btn
                  v-if="step.type === 'button'"
                  size="md"
                  color="primary"
                  @click="handleTriggerActions(step, rentalSalesOrder.workflow.current_step.step_data.actions)"
                >
                  {{step.label}}
                </q-btn>
                <q-select v-if="step.type === 'masters-select'"
                          filter
                          autofocus-filter
                          clearable
                          @input="handleTriggerActions(step, rentalSalesOrder.workflow.current_step.step_data.actions)"
                          :stack-label="step.label"
                          v-model="step.value"
                          :options="masterDataOptionsCreator(step.master_key)"
                />
                <q-input
                  v-if="step.type === 'textarea'"
                  v-model="step.value"
                  :stack-label="step.label"
                  type="textarea"
                  @input="handleTriggerActions(step, rentalSalesOrder.workflow.current_step.step_data.actions)"
                  :max-height="50"
                  :min-rows="2"
                />
                <q-input class="full-width"
                         v-if="step.type === 'textfield'"
                         v-model="step.value"
                         @input="handleTriggerActions(step, rentalSalesOrder.workflow.current_step.step_data.actions)"
                         :stack-label="step.label">
                </q-input>
                <q-field
                  :helper="step.helper_text"
                  :label="step.label"
                  v-if="step.type === 'radiobutton'"
                >
                  <q-option-group
                    type="radio"
                    color="secondary"
                    v-model="step.value"
                    :options="step.radio_option"
                  />
                </q-field>
                <div v-if="step.type === 'complete'">
                  <div v-if="rentalSalesOrder.workflow.rejected_status === null || rentalSalesOrder.workflow.rejected_status === 0">
                    <p>Completed at {{wfstep.updated_at}} by {{wfstep.updated_by.name}}</p>
                  </div>
                  <!--v-if="rentalSalesOrder.workflow.rejected_status !== null || rentalSalesOrder.workflow.rejected_status === 1"-->
                  <div v-else>
                    <p class="text-red">Declined by {{wfstep.updated_by.name}} at {{wfstep.updated_at}}</p>
                    <div class="row gutter-sm">
                      <div class="col-lg-4 col-md-12 col-xs-12">
                        <p class="text-red-4">Rejection remark:</p>
                      </div>
                      <div class="col-lg-8 col-md-12 col-xs-12">
                        <p class="text-red-4">{{rentalSalesOrder.workflow.rejected_reason}}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="rentalSalesOrder.workflow.current_step.step_data.actions.show_child"
                class="row col-12"
              >
                <div  v-for="(childstep, childindex) in rentalSalesOrder.workflow.current_step.step_data.actions.child.fields"
                      class="self-center"
                      :class="{'col-xl-6 col-lg-6 col-md-6 col-xs-12 col-md-12 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos !=='C',
                                                                 'col': typeof childstep.share === 'undefined',
                                                                 'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos ==='C'}">
                  <!--xl-3 col-lg-6 col-md-6 col-xs-12-->
                  <q-btn
                    v-if="childstep.type === 'button'"
                    color="primary"
                    @click="handleTriggerActions(childstep, rentalSalesOrder.workflow.current_step.step_data.actions.child)"
                  >
                    {{childstep.label}}
                  </q-btn>
                  <q-input
                    v-if="childstep.type === 'textarea'"
                    v-model="childstep.value"
                    :stack-label="childstep.label.concat(childstep.required?'*':'')"
                    :error="childstep.required ?  $v.rentalSalesOrder.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                    :error-label="$t('sale.cancellation.workflow.validation.missingRequiredField')"
                    type="textarea"
                    :max-height="childstep.max_height"
                    :min-rows="childstep.min_rows"
                    @input="handleTriggerActions(childstep, rentalSalesOrder.workflow.current_step.step_data.actions.child)"
                  />
                  <q-input class="full-width"
                           v-if="childstep.type === 'textfield'"
                           v-model="childstep.value"
                           :stack-label="childstep.label">
                  </q-input>
                  <q-field
                    :helper="childstep.helper_text"
                    :label="childstep.label"
                    v-model="childstep.value"
                    v-if="childstep.type === 'radiobutton'"
                    :error="childstep.required ?  $v.rentalSalesOrder.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                    :error-label="$t('sale.cancellation.workflow.validation.missingRequiredField')"
                    @input="handleTriggerActions(childstep, rentalSalesOrder.workflow.current_step.step_data.actions.child)"
                  >
                    <q-option-group
                      type="radio"
                      color="secondary"
                      v-model="childstep.value"
                      :options="childstep.radio_option"
                    />
                  </q-field>
                  <q-select v-if="childstep.type === 'masters-select'"
                            filter
                            autofocus-filter
                            clearable
                            @input=""
                            :stack-label="childstep.label"
                            v-model="childstep.value"
                            :options="masterDataOptionsCreator(childstep.master_key)"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-step>
      </q-stepper>
    </q-card-main>
    </q-card>
    <!--<q-loader :visible="isProcessingForm || isProcessing"></q-loader>-->
  </div>
</template>

<script>
  import Vue from 'vue'
  import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
  import { MasterDataTransformarMixin } from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'
  import { Dialog } from 'quasar'

  const RESPONSE = 'RESPONSE'

  export default {
    name: "workflow-tab",
    mixins: [MasterDataTransformarMixin],
    props: {
      rentalSalesOrder: {
        type: Object,
        required: true
      },
      isNewRequest: {
        type: Boolean,
        default: false
      },
      manipulateSaveData: {
        type: Function,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingCart: state => state.globalCMP.isProcessingCart,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        selectedFilters: state => state.globalCMP.selectedFilters,
        productSearchData: state => state.productsCMP.productSearchData,
        isProcessingList: state => state.globalCMP.isProcessingList
      }),
      ...mapGetters([
        'currencyLabelByCountry',
        'listProductAndKittingSearchList'
      ])
    },
    mounted () {
      this.master.keys = [
        'sale_types',
        'promotion_free_items_promo_types'
      ]
      Vue.nextTick(() => {
        this.$refs.stepper.goToStep(this.rentalSalesOrder.workflow.current_step.step)
      })
    },
    validations () {
      let def = {
        rentalSalesOrder: {}
      }
      if (this.rentalSalesOrder.workflow !== undefined && this.rentalSalesOrder.workflow !== null && this.rentalSalesOrder.workflow.current_step !== undefined && this.rentalSalesOrder.workflow.current_step !== null && this.rentalSalesOrder.workflow.current_step.step_data.actions !== undefined && this.rentalSalesOrder.workflow.current_step.step_data.actions !== null) {
        def.rentalSalesOrder.workflow = {}
        def.rentalSalesOrder.workflow.current_step = {}
        def.rentalSalesOrder.workflow.current_step.step_data = {}
        def.rentalSalesOrder.workflow.current_step.step_data.actions = {
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
        if (this.rentalSalesOrder.workflow.current_step.step_data.actions.child !== undefined && this.rentalSalesOrder.workflow.current_step.step_data.actions.child !== null && this.rentalSalesOrder.workflow.current_step.step_data.actions.show_child) {
          def.rentalSalesOrder.workflow.current_step.step_data.actions.child = {
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
        }
      }
      return def
    },
    data: () => ({
      rejectReason: ''
    }),
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessing: state => state.globalCMP.isProcessing
      })
    },
    methods: {
      ...mapActions([
        'getSalesProductSearchAction',
        'updateWorkflowAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        setSalesData: 'SET_SALES_DATA'
      }),
      handleTriggerActions (workflowField, action) {
        switch (workflowField.trigger) {
          case 'updateRejectionReason':
            this.rejectReason = workflowField.value
            break
          case 'sendRentalSaleOrderDecline':
            this.$v.rentalSalesOrder.workflow.current_step.$touch()
            if (!this.$v.rentalSalesOrder.workflow.current_step.$error) {
              if (!workflowField.require_confirmation) {
                workflowField.rejection_reason = this.rejectReason
                this.submitApprovalStep(workflowField)
              } else {
                Dialog.create({
                  title: this.$t('sale.cancellation.detail.dialog.confirmSave.title'),
                  message: workflowField.conformation_message,
                  noEscDismiss: true,
                  noBackdropDismiss: true,
                  position: 'top',
                  ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
                  cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel'),
                }).then(()=> {
                  workflowField.rejection_reason = this.rejectReason
                  this.submitApprovalStep(workflowField)
                }).catch(()=>{
                })
              }
            }
            break
          case 'sendRentalSaleOrderApproval':
            if (!workflowField.require_confirmation) {
              this.submitApprovalStep(workflowField)
            } else {
              Dialog.create({
                title: this.$t('sale.cancellation.detail.dialog.confirmSave.title'),
                message: workflowField.conformation_message,
                noEscDismiss: true,
                noBackdropDismiss: true,
                position: 'top',
                ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
                cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel'),
              }).then(()=> {
                this.submitApprovalStep(workflowField)
              }).catch(()=>{
              })
            }
            break
          case 'processRelease':
            if (!workflowField.require_confirmation) {
              this.submitApprovalStep(workflowField)
            } else {
              Dialog.create({
                title: this.$t('sale.cancellation.detail.dialog.confirmSave.title'),
                message: workflowField.conformation_message,
                noEscDismiss: true,
                noBackdropDismiss: true,
                position: 'top',
                ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
                cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel'),
              }).then(()=> {
                this.submitApprovalStep(workflowField)
              }).catch(()=>{
              })
            }
            break
          case 'toggleChildVisibility':
            this.toggleChildVisibility(action)
            break
          case null:
          case undefined:
          default:
        }
      },
      toggleChildVisibility (step) {
        if (step.show_child !== undefined) {
          step.show_child = !step.show_child
        }
      },
      submitApprovalStep (field) {
        // this.workflowMixinData.remark = 'semething'
        let payload = {
          workflow_tracking_step_id: this.rentalSalesOrder.workflow.current_step.id,
          workflow_remark: this.rejectReason,
          tracking_step_input: field
        }
        this.updateWorkflowAction(payload).then((res) => {
          if (res !== undefined && res !== null && res.even_result !== null && res.even_result !== undefined && res.even_result.length > 0) {
            let salesData = res.even_result[0]
            if (salesData.workflow !== null && salesData.workflow !== undefined && salesData.sales_data !== null && salesData.sales_data !== undefined) {
              salesData.sales_data.workflow = salesData.workflow
            }
            this.setSalesData({data:salesData.sales_data})
            this.manipulateSaveData(RESPONSE)
            Vue.nextTick(() => {
              this.$refs.stepper.goToStep(this.rentalSalesOrder.workflow.current_step.step)
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
