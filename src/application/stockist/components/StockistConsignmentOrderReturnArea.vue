<template>
  <div class="general-page-holder relative-position">
    <basic-form formName="StockistRefistrationForm"
                :formTitle="$t('sales.newSales.title')"
                :backgroudColor="false"
                v-bind:formFieldData="stockist_consignment_order"
                :urlResetPathName="returnURL"
                formAction="salesOrderAction"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="!lockConsignmentOrder"
                :buttonTwoVisibility="!lockConsignmentOrder"
                :buttonThreeCaption="lockConsignmentOrder ? 'Close' : 'Cancel'">
      <template slot="form">
        <div class="form-holder">
          <div class="row">
            <div class="col-lg-12">
              <div
                class="row gutter-xs"
                v-if="nullObjectValidation(stockistData)"
              >
                <div class="col-xl-9 col-lg-9 col-md-9 col-xs-12">
                  <q-card color="white" class="full-height">
                    <q-card-main class="text-black">
                      <div class="row">
                        <div class="col-lg-4 col-md-6 col-xs-12 personal-data-holder relative-position">
                          <q-list no-border>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.consignment.label.transactionDate')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">{{ formatDate(stockist_consignment_order.transaction_date)}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.consignment.label.countryCode')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">{{stockistData.details.country.code_iso_2}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.consignment.label.status')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">{{stockistData.details.status.title}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline v-if="stockist_consignment_order.document_number !== null && stockist_consignment_order.document_number !== undefined && stockist_consignment_order.document_number !== ''">
                            <q-item-main>
                              <q-item-tile label class="text-primary" v-if="isConsignmentOrder">Consignment Order Note</q-item-tile>
                              <q-item-tile label class="text-primary" v-else>Consignment Return Note</q-item-tile>
                              <q-item-tile sublabel>
                                <q-btn
                                  color="primary"
                                  @click="openDocument()"
                                >
                                  {{stockist_consignment_order.document_number}}
                                </q-btn>
                              </q-item-tile>
                            </q-item-main>
                          </q-item>
                          </q-list>
                        </div>
                        <div class="col-lg-4 col-md-6 col-xs-12 personal-data-holder relative-position">
                          <q-list no-border>
                            <q-item>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.consignment.label.stockistID')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">{{stockistData.details.stockist_number}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.consignment.label.stockistName')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">{{stockistData.details.name}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.consignment.label.iboExpiryDate')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ formatDate(stockistData.member_data.details.expiry_date)}}
                                  <span v-if="checkDateValidity(stockistData.member_data.details.expiry_date)"><q-icon color="positive" name="check_circle"></q-icon></span>
                                  <span v-else=""><q-icon color="negative" name="remove_circle"></q-icon></span>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                        </div>
                        <div class="col-lg-4  col-md-6 col-xs-12 personal-data-holder relative-position">
                          <q-list no-border>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.consignment.label.remark')}}</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-field
                                  >
                                    <q-input
                                      v-model="stockist_consignment_order.remark"
                                      type="textarea"
                                      :max-height="50"
                                      :min-rows="5"
                                      :disable="lockConsignmentOrder"
                                    />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                        </div>
                      </div>
                    </q-card-main>
                  </q-card>
                </div>
                <div class="col-xl-3 col-lg-3 col-md-3 col-xs-12">
                  <q-card color="white" class="full-height">
                    <q-card-title>
                      <div v-if="this.isConsignmentOrder">
                        <p class="text-black">{{$t('stockist.consignment.label.consignmentLimit')}}</p>
                        <p class="text-black q-headline">
                          <q-field
                          :error="$v.stockist_consignment_order.total_gmp.$error || setError('consignment_order_return.total_gmp', 'type.exp')"
                          :error-label="setError('consignment_order_return.total_gmp', 'type.exp') ? setError('consignment_order_return.total_gmp', 'type.msg') : $t('stockist.consignment.error.exceedConsignmentLimit')"
                          >
                            {{stockistData.deposits.deposit_limit | formatPriceDouble}}{{currencyLabelByCountry}}
                          </q-field>
                        </p>
                      </div>
                      <div v-else>
                        <p class="text-black">{{$t('stockist.consignment.label.totalReturn')}}</p>
                        <p class="text-black q-headline">
                          {{stockist_consignment_order.total_gmp | formatPriceDouble}} {{currencyLabelByCountry}}
                        </p>
                        <p class="text-red" v-if="setError('consignment_order_return.total_gmp', 'type.exp')">
                          {{setError('consignment_order_return.total_gmp', 'type.msg')}}}
                        </p>
                      </div>
                    </q-card-title>
                    <q-card-main class="text-black"
                                 v-if="nullObjectValidation(stockist_consignment_order.workflow) &&
                                        nullObjectValidation(stockist_consignment_order.workflow.current_step) &&
                                        nullObjectValidation(stockist_consignment_order.workflow.current_step.step_data) &&
                                        nullObjectValidation(stockist_consignment_order.workflow.current_step.step_data.actions) &&
                                        nullObjectValidation(stockist_consignment_order.workflow.current_step.step_data.actions.fields) &&
                                        stockist_consignment_order.workflow.current_step.step_data.actions.fields.length > 0">

                      <hr/>
                      <div class="row gutter-sm justify-center mt-10">
                        <div class="q-title text-green col-12" v-if="stockist_consignment_order.workflow.current_step.last_step === 0">
                          <p>Approval Action</p>
                        </div>
                        <div v-for="step in stockist_consignment_order.workflow.current_step.step_data.actions.fields"
                             class="col-xl-auto col-lg-auto">
                          <!--{'col-xl-auto col-lg-auto col-md-12 col-xs-12': typeof step.share !== 'undefined' && step.share.pos !=='C',-->
                          <!--'col': typeof step.share === 'undefined',-->
                          <!--'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof step.share !== 'undefined' && step.share.pos ==='C'}-->
                          <q-btn
                            v-if="step.type === 'button'"
                            color="primary"
                            @click="handleTriggerActions(step, stockist_consignment_order.workflow.current_step.step_data.actions)"
                          >
                            {{step.label}}
                          </q-btn>
                          <q-select v-if="step.type === 'masters-select'"
                                    filter
                                    autofocus-filter
                                    clearable
                                    @input="handleTriggerActions(step, stockist_consignment_order.workflow.current_step.step_data.actions)"
                                    :stack-label="step.label"
                                    v-model="step.value"
                                    :options="masterDataOptionsCreator(step.master_key)"
                          />
                          <q-input
                            v-if="step.type === 'textarea'"
                            v-model="step.value"
                            :stack-label="step.label"
                            type="textarea"
                            @input="handleTriggerActions(step, stockist_consignment_order.workflow.current_step.step_data.actions)"
                            :max-height="50"
                            :min-rows="2"
                          />
                          <q-input class="full-width"
                                   v-if="step.type === 'textfield'"
                                   v-model="step.value"
                                   @input="handleTriggerActions(step, stockist_consignment_order.workflow.current_step.step_data.actions)"
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
                            <div v-if="stockist_consignment_order.workflow.rejected_status === null || stockist_consignment_order.workflow.rejected_status === 0">
                              <p class="q-title text-green">{{$t('stockist.consignment.label.approved')}}</p>
                              <p>
                                {{$t('stockist.consignment.label.approvalDate')}} {{stockist_consignment_order.workflow.current_step.updated_at}}
                              </p>
                              <p>
                                {{$t('stockist.consignment.label.approvedBy')}} {{stockist_consignment_order.workflow.updated_by.name}}
                              </p>
                            </div>
                            <div v-if="stockist_consignment_order.workflow.rejected_status !== null || stockist_consignment_order.workflow.rejected_status === 1">
                              <p class="q-title text-red">{{$t('stockist.consignment.label.declined')}}</p>
                              <p class="text-red">{{$t('stockist.consignment.label.declinedAt')}}{{stockist_consignment_order.workflow.current_step.updated_at}}</p>
                              <p class="text-red">{{$t('stockist.consignment.label.declinedBy')}} {{stockist_consignment_order.workflow.updated_by.name}}</p>
                              <p class="text-red-4">{{$t('stockist.consignment.label.declinedRemark')}}</p>
                              <p class="text-red-4">{{stockist_consignment_order.workflow.rejected_reason}}</p>
                            </div>
                          </div>
                        </div>
                        <div
                        v-if="stockist_consignment_order.workflow.current_step.step_data.actions.show_child"
                        class="row col-12 justify-center"
                      >
                        <div  v-for="(childstep, childindex) in stockist_consignment_order.workflow.current_step.step_data.actions.child.fields"
                              class="self-center"
                              :class="{'col-xl-6 col-lg-6 col-md-6 col-xs-12 col-md-12 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos !=='C',
                                                       'col': typeof childstep.share === 'undefined',
                                                       'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos ==='C'}">
                          <!--xl-3 col-lg-6 col-md-6 col-xs-12-->
                          <q-btn
                            v-if="childstep.type === 'button'"
                            color="primary"
                            @click="handleTriggerActions(childstep, stockist_consignment_order.workflow.current_step.step_data.actions.child)"
                          >
                            {{childstep.label}}
                          </q-btn>
                          <q-input
                            v-if="childstep.type === 'textarea'"
                            v-model="childstep.value"
                            :stack-label="childstep.label.concat(childstep.required?'*':'')"
                            :error="childstep.required ?  $v.stockist_consignment_order.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                            error-label="Required field missing"
                            type="textarea"
                            :max-height="childstep.max_height"
                            :min-rows="childstep.min_rows"
                            @input="handleTriggerActions(childstep, stockist_consignment_order.workflow.current_step.step_data.actions.child)"
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
                            :error="childstep.required ?  $v.stockist_consignment_order.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                            error-label="Required field missing"
                            @input="handleTriggerActions(childstep, stockist_consignment_order.workflow.current_step.step_data.actions.child)"
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
                    </q-card-main>
                  </q-card>
                </div>
              </div>
            </div>
            <div class=" col-12 bg-white shadow-1 relative-position mt-20">
              <div class="col-lg-12">
                <q-card class="full-width" color="white">
                  <q-card-main
                    class="text-black"
                    v-if="stockistData!== undefined && stockistData !== null"
                  >
                    <div class="form-tabs mt-20 text-black">
                      <q-tabs inverted  two-lines color="grey-7" align="left">
                        <q-tab default name="items"
                               slot="title"
                               :label="$t('stockist.consignment.tab.items')"/>
                        <!-- Tab Content -->
                        <q-tab-pane name="items" class="no-border bg-white sales-items full-height full-width align-content-start">
                          <!-- Items Content-->
                          <items-tab
                            :salesData="stockist_consignment_order"
                            :memberDetails="stockistData.member_data"
                            :lockSalesOrder="lockConsignmentOrder"
                            :excludeKittingSearch="true"
                            :validations="$v.stockist_consignment_order"
                            :addToCart="addToCart"
                            :showTotalRow="this.isConsignmentOrder"
                            @reCalculateCart="reCalculateCart"
                            :totalGMP="stockist_consignment_order.total_gmp"
                            :showDeliveryStageColumn="false"
                            :showCVColumns="false"
                            :showTransactionTypeColumn="false"
                            :showAvailableQuantityColumn="!isConsignmentOrder"
                            :disableQuantityChangeConsignmentReturn="isDisableQuantityChange()"
                          ></items-tab>
                          <!-- Items Content End -->
                        </q-tab-pane>
                      </q-tabs>
                    </div>
                  </q-card-main>
                </q-card>
              </div>
            </div>
          </div>
        </div>
        <!--<pre>{{stockist_consignment_order}}</pre>-->
        <!--<pre>{{stockist_consignment_order}}</pre>-->
        <q-loader :visible="isProcessingForm"></q-loader>
      </template>
    </basic-form>
  </div>
</template>

<script>
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { DatesMixin, MasterDataTransformarMixin, GeneralsMixin, SetFormFieldErrorsMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import { required, minLength, numeric } from 'vuelidate/lib/validators'
  import {ItemsTab} from 'src/application/global/components/common/shared-tabs'
  import { Dialog, openURL } from 'quasar'

  export default {
    name: "stockist-consignment-order-area",
    mixins: [DatesMixin, MasterDataTransformarMixin, GeneralsMixin, SetFormFieldErrorsMixin],
    components: {
      basicForm,
      qLoader,
      errorsModal,
      layoutModal,
      ItemsTab,
      Dialog
    },
    props: ['consignmentType', 'consignmentID'],
    data: () => ({
      lockConsignmentOrder: false,
      rejectReason: '',
      isConsignmentOrder: false,
      returnURL: 'Stockist Consignment Order List',
      stockist_consignment_order: {
        order_id: '',
        transaction_date: new Date(),
        stockist_id: '',
        stockist_user_id: '',
        total_gmp: 0,
        type: '',
        remark: '',
        products: [],
        kittings: [],
        promotion: [],
        consignment_deposit_amount: 0,
        consignment_credit_limit: 0,
        selected: {
          additional_requirements: {
            evoucher: []
          },
          promotions: []
        },
        workflow: {}
      }
    }),
    validations () {
      let def = {
        stockist_consignment_order: {
          products: {
            $each: {
              quantity: {
                required,
                numeric,
                check (val, elm) {
                  return (this.lockConsignmentOrder ? val >= 0 : val > 0) && (this.isConsignmentOrder || elm.available_quantity >= val)
                }
              }
            }
          },
          kittings: {
            $each: {
              quantity: {
                required,
                check (val, elm) {
                  return val > 0
                }
              }
            }
          },
          total_gmp: {
            check(val) {
              return this.lockConsignmentOrder || !this.isConsignmentOrder || val <= this.stockistData.deposits.deposit_limit
            }
          }
        }
      }
      if (this.nullObjectValidation(this.stockist_consignment_order.workflow)
        && this.nullObjectValidation(this.stockist_consignment_order.workflow.current_step)
        && this.nullObjectValidation(this.stockist_consignment_order.workflow.current_step.step_data)
        && this.nullObjectValidation(this.stockist_consignment_order.workflow.current_step.step_data.actions)) {
        def.stockist_consignment_order.workflow = {}
        def.stockist_consignment_order.workflow.current_step = {}
        def.stockist_consignment_order.workflow.current_step.step_data = {}
        def.stockist_consignment_order.workflow.current_step.step_data.actions = {
          fields: {
            $each: {
              value: {
                check(val, elm) {
                  if (elm.required && elm.value === '') {
                    return false
                  }
                  return true
                }
              }
            }
          }
        }
        if (this.nullObjectValidation(this.stockist_consignment_order.workflow.current_step.step_data.actions.child)
          && this.stockist_consignment_order.workflow.current_step.step_data.actions.show_child) {
          def.stockist_consignment_order.workflow.current_step.step_data.actions.child = {
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
    mounted () {
      this.master.key = [
        this.$const.masterKey.SALE_TYPES
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
        itemData: state => state.productsCMP.saveData.data,
        stockistData: state => state.stockistCMP.stockistData.data,
        stockistSearchedProduct: state => state.stockistCMP.stockistSearchedProduct.data,
        stockistRegistrationDetails: state => state.stockistCMP.stockistRegistrationData
      }),
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry'
      })
    },
    watch: {
    },
    methods: {
      ...mapActions([
        'getExistingStockist',
        'getCountryRelationAction',
        'getCommissionWeekSearchAction',
        'getProductByIdAction',
        'getMastersWithKey',
        'submitConsignmentOrderReturnAction',
        'getExistingConsignmentOrderReturn',
        'updateWorkflowAction',
        'downloadConsignmentOrderReturnNoteAction',
        'getReturnProductForStockistAction',
        'checkStockistEligibleReturnAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      initSetupArea () {
        // search for stockist and load data, need to wait till stockist creation complete to restructure data obj
        // load stockist into and consignment limit, and that's it
        if (this.nullObjectValidation(this.consignmentType)) {
          this.stockist_consignment_order.type = this.consignmentType
          this.isConsignmentOrder = this.consignmentType === 'order'
          if (this.isConsignmentOrder) {
            this.returnURL = 'Stockist Consignment Order List'
          } else {
            this.returnURL = 'Stockist Consignment Return List'
          }
          let query1 = {
            country_id: this.selectedFilters.countryID,
            relations: ['entity.locations', 'currency', 'taxes']
          }
          this.getCountryRelationAction(query1)
          if (this.consignmentIDValidation(this.consignmentID)) {
            this.loadExistingStockistOrder()
          } else if (this.stockistRegistrationDetails.userID !== '') {
            let query = {
              stockist_user_id: this.stockistRegistrationDetails.userID
            }
            this.getExistingStockist(query).then((res) => {
              // not sure what to do yet, remove if nothing is needed
              if (this.nullObjectValidation(this.stockistData)
                && this.nullObjectValidation(this.stockistData.stockist_location)) {
                this.stockist_consignment_order.location_id = this.stockistData.stockist_location.id
                this.stockist_consignment_order.stockist_user_id = this.stockistData.details.stockist_user_id
                this.stockist_consignment_order.stockist_id = this.stockistData.details.id
                if (!this.isConsignmentOrder) {
                  this.checkStockistEligibleReturnAction(query).then(res => {
                    if (this.nullObjectValidation(res) && this.nullObjectValidation(res.is_allow_consignment_return) && !res.is_allow_consignment_return) {
                      this.$q.dialog({
                        title: this.$t('stockist.consignment.dialog.existingConsignmentFound.title'),
                        message: this.$t('stockist.consignment.dialog.existingConsignmentFound.message'),
                        ok: true,
                        preventClose: true
                      }).then(() => {
                        this.invalidRequest()
                      })
                    }
                  })
                }
              }
            })
          } else {
            this.invalidRequest()
          }
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
          this.$router.push({name: 'Stockist Consignment Order List'})
        }, 1500)
      },
      loadExistingStockistOrder () {
        // load existing stockist consignment
        let query ={
          id: this.consignmentID
        }
        this.getExistingConsignmentOrderReturn(query).then((res) => {
          this.mapExistingStockistConsignmentOrder(res)
          this.getExistingStockist({stockist_user_id:this.stockist_consignment_order.stockist_user_id})
        })
      },
      processForm: function (formFieldData) {
        if (!this.lockConsignmentOrder) {
          this.$v.stockist_consignment_order.$touch()
          return new Promise((resolve, reject) => {
            if (!this.$v.stockist_consignment_order.$error) {
              Dialog.create({
                title: this.$t('stockist.consignment.dialog.confirmSave.title'),
                message: this.$t('stockist.consignment.dialog.confirmSave.message'),
                noEscDismiss: true,
                noBackdropDismiss: true,
                position: 'top',
                ok: 'Yes',
                cancel: 'No'
              }).then(()=> {
                let query = {
                  consignment_order_return: this.stockist_consignment_order
                }
                this.submitConsignmentOrderReturnAction(query).then((res) => {
                  this.mapExistingStockistConsignmentOrder(res)
                  this.setNotification({
                    title: this.$t('stockist.consignment.notification.creationSuccess.title'),
                    message: this.$t('stockist.consignment.notification.creationSuccess.message'),
                    type: 'positive'
                  })
                  // if( res !== null && res !== undefined && res.sale_cancellation !== null && res.sale_cancellation !== undefined) {
                  //   this.loadExistingCancellationData(res.sale_cancellation.id)
                  // }
                  resolve(res)
                }).catch(error => {
                  this.setNotification({
                    title: this.$t('stockist.consignment.notification.submitFailed.title'),
                    message: this.$t('stockist.consignment.notification.errorOccurred.message'),
                    type: 'negative'
                  })
                  reject(error)
                })
              }).catch((error)=>{
              })
            } else {
              this.setNotification({
                title: this.$t('stockist.consignment.notification.submitFailed.title'),
                message: this.$t('stockist.consignment.notification.submitFailed.message'),
                type: 'negative'
              })
              reject(this.$v.stockist_consignment_order.$error)
            }
          }).catch(error => {
            if (error['sale_cancellation.invoice_id'] !== undefined && error['sale_cancellation.invoice_id'] !== null && error['sale_cancellation.invoice_id'].length > 0){
              this.setNotification({
                title: this.$t('stockist.consignment.notification.submitFailed.title'),
                message: error['sale_cancellation.invoice_id'][0],
                type: 'negative'
              })
            }
          })
        }
      },
      mapExistingStockistConsignmentOrder (response) {
        if (response !== null && response !== undefined ){
          if( response.consignment_order_return !== null && response.consignment_order_return !== undefined){
            this.lockConsignmentOrder = true
            let data = response.consignment_order_return
            if (!this.consignmentIDValidation(this.consignmentID)) {
              if (this.isConsignmentOrder) {
                this.$router.replace({
                  name: 'Stockist Consignment Order Area',
                  params: {consignmentType: this.consignmentType, consignmentID: data.id}
                })
              } else {
                this.$router.replace({
                  name: 'Stockist Consignment Return Area',
                  params: {consignmentType: this.consignmentType, consignmentID: data.id}
                })
              }
            }
            this.stockist_consignment_order.products = JSON.parse(JSON.stringify(data.products))
            this.stockist_consignment_order.id = data.id
            this.stockist_consignment_order.order_id = data.id
            this.stockist_consignment_order.remark = data.remark
            this.stockist_consignment_order.total_gmp = Number(data.total_gmp)
            this.stockist_consignment_order.document_number = data.document_number
          }
          if (response.stockist_data !== null && response.stockist_data !== undefined) {
            this.stockist_consignment_order.stockist_user_id = response.stockist_data.details.stockist_user_id
          }
          if (response.workflow !== null && response.workflow !== undefined) {
            this.stockist_consignment_order.workflow = response.workflow.workflow//Object.assign({}, JSON.parse(JSON.stringify(response.workflow.workflow)))
          }
        }
      },
      nullObjectValidation (object) {
        return object !== undefined && object!== null
      },
      addToCart (type, id) {
        if (id !== '' && id !== null) {
          if (type === 'product') {
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexProducts = this.stockist_consignment_order.products.findIndex(x => x.product_id === id)
            if (itemIndexProducts >= 0) {
              this.stockist_consignment_order.products[itemIndexProducts].quantity = (1 + parseInt(this.stockist_consignment_order.products[itemIndexProducts].quantity))
              this.reCalculateCart()
            } else {
              if (this.isConsignmentOrder) {
                let query1 = {
                  country_id: this.selectedFilters.countryID,
                  product_id: id
                }
                this.getProductByIdAction(query1).then((res) => {
                  let assignTransactionTypePromise = ''
                  // Remove reactivity using JSON.stringify
                  let reConstructPromise = Promise.resolve(this.stockist_consignment_order.products.push(JSON.parse(JSON.stringify(this.itemData))))
                  Promise.all([reConstructPromise]).then(() => {
                    // Set transaction_type properties to newly added product row
                    assignTransactionTypePromise = Promise.resolve(this.$set(this.stockist_consignment_order.products[this.stockist_consignment_order.products.length - 1], 'transaction_type', ''))
                    // Set quantity properties to newly added product row
                    this.$set(this.stockist_consignment_order.products[this.stockist_consignment_order.products.length - 1], 'quantity', 1)
                    Promise.all([assignTransactionTypePromise]).then(() => {
                      let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.stockist_consignment_order.products[this.stockist_consignment_order.products.length - 1].general.sale_types))
                      Promise.all([getMasterDataOptionsPromise]).then((res) => {
                        let saleTypes = res
                        if (saleTypes[0].length > 0) {
                          this.stockist_consignment_order.products[this.stockist_consignment_order.products.length - 1].transaction_type = saleTypes[0][0].value
                        }
                      })
                      this.stockist_consignment_order.products[this.stockist_consignment_order.products.length - 1].line_item_number = this.currentLineItemCount
                      this.reCalculateCart()
                    })
                  })
                })
              } else {
                let query1 = {
                  stockist_id: this.stockistData.details.id,
                  product_id: id
                }
                this.getReturnProductForStockistAction(query1).then((res) => {
                  let assignTransactionTypePromise = ''
                  // Remove reactivity using JSON.stringify
                  let searchedProduct = JSON.parse(JSON.stringify(this.stockistSearchedProduct))
                  searchedProduct.sku = searchedProduct.product_sku
                  searchedProduct.name = searchedProduct.product_name
                  let reConstructPromise = Promise.resolve(this.stockist_consignment_order.products.push(searchedProduct))
                  Promise.all([reConstructPromise]).then(() => {
                    // Set quantity properties to newly added product row
                    this.$set(this.stockist_consignment_order.products[this.stockist_consignment_order.products.length - 1], 'quantity', 1)
                    this.stockist_consignment_order.products[this.stockist_consignment_order.products.length - 1].line_item_number = this.currentLineItemCount
                    this.reCalculateCart()
                  })
                })
              }
            }
          } else {
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexKitting = this.stockist_consignment_order.kittings.findIndex(x => x.kitting_id === id)
            if (itemIndexKitting >= 0) {
              this.stockist_consignment_order.kittings[itemIndexKitting].quantity = (1 + parseInt(this.stockist_consignment_order.kittings[itemIndexKitting].quantity))
              this.reCalculateCart()
            } else {
              let query2 = {
                country_id: this.selectedFilters.countryID,
                kitting_id: id
              }
              this.getKittingProductByIdAction(query2).then((res) => {
                let assignTransactionTypePromise = ''
                // Remove reactivity using JSON.stringify
                let reConstructPromise = Promise.resolve(this.stockist_consignment_order.kittings.push(JSON.parse(JSON.stringify(this.itemData))))
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added kitting row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.stockist_consignment_order.kittings[this.stockist_consignment_order.kittings.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.stockist_consignment_order.kittings[this.stockist_consignment_order.kittings.length - 1], 'quantity', 1)
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.stockist_consignment_order.kittings[this.stockist_consignment_order.kittings.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.stockist_consignment_order.kittings[this.stockist_consignment_order.kittings.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.stockist_consignment_order.kittings[this.stockist_consignment_order.kittings.length - 1].line_item_number = this.currentLineItemCount
                    this.reCalculateCart()
                  })
                })
              })
            }
          }
        }
      },
      reCalculateCart () {
        this.stockist_consignment_order.total_gmp = this.stockist_consignment_order.products.reduce((total, product) => total + (product.base_price.gmp_price_tax * product.quantity), 0)
      },
      handleTriggerActions (workflowField, action) {
        switch (workflowField.trigger) {
          case 'updateRejectionReason':
            this.rejectReason = workflowField.value
            break
          case 'sendReturnDecline':
          case 'sendOrderDecline':
            this.$v.stockist_consignment_order.workflow.current_step.$touch()
            if (!this.$v.stockist_consignment_order.workflow.current_step.$error) {
              if (!workflowField.require_confirmation) {
                workflowField.rejection_reason = this.rejectReason
                this.submitApprovalStep(workflowField)
              } else {
                Dialog.create({
                  title: 'Confirmation',
                  message: workflowField.conformation_message,
                  noEscDismiss: true,
                  noBackdropDismiss: true,
                  position: 'top',
                  ok: 'Yes',
                  cancel: 'No'
                }).then(()=> {
                  workflowField.rejection_reason = this.rejectReason
                  this.submitApprovalStep(workflowField)
                }).catch(()=>{
                })
              }
            }
            break
          case 'sendReturnVerified':
            this.$v.stockist_consignment_order.$touch()
            if (!this.$v.stockist_consignment_order.$error) {
              if (!workflowField.require_confirmation) {
                this.submitApprovalStep(workflowField)
              } else {
                Dialog.create({
                  title: 'Confirmation',
                  message: workflowField.conformation_message,
                  noEscDismiss: true,
                  noBackdropDismiss: true,
                  position: 'top',
                  ok: 'Yes',
                  cancel: 'No'
                }).then(()=> {
                  this.submitApprovalStep(workflowField)
                }).catch(()=>{
                })
              }
            } else {
              this.setNotification({
                title: this.$t('stockist.consignment.notification.submitFailed.title'),
                message: this.$t('stockist.consignment.notification.submitFailed.message'),
                type: 'negative'
              })
              reject(this.$v.stockist_consignment_order.$error)
            }
            break
          case 'sendOrderApproval':
              if (!workflowField.require_confirmation) {
                this.submitApprovalStep(workflowField)
              } else {
                Dialog.create({
                  title: 'Confirmation',
                  message: workflowField.conformation_message,
                  noEscDismiss: true,
                  noBackdropDismiss: true,
                  position: 'top',
                  ok: 'Yes',
                  cancel: 'No'
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
        field.additional_info = {consignment_order_return: JSON.parse(JSON.stringify(this.stockist_consignment_order))}
        let payload = {
          workflow_tracking_step_id: this.stockist_consignment_order.workflow.current_step.id,
          workflow_remark: this.rejectReason,
          tracking_step_input: field
        }
        this.updateWorkflowAction(payload).then((res) => {
          setTimeout(this.loadExistingStockistOrder(), 2000)
        })
      },
      consignmentIDValidation (value) {
        if (typeof value !== 'undefined' && value > 0) {
          return true
        } else {
          return false
        }
      },
      openDocument () {
        let query = {
          consignment_order_return_id: this.stockist_consignment_order.order_id
        }
        this.downloadConsignmentOrderReturnNoteAction(query).then((res) => {
          let pdfUrl = ''
          if (this.isConsignmentOrder) {
            pdfUrl = res.consignement_note_download_link
          } else {
            pdfUrl = res.consignement_note_return_download_link
          }
          if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
            openURL(pdfUrl)
          }
        })
      },
      isDisableQuantityChange () {
        let disableQtyChange =  this.lockConsignmentOrder
        if (this.stockist_consignment_order.workflow !== null && this.stockist_consignment_order.workflow !== undefined) {
          disableQtyChange = this.isConsignmentOrder || this.stockist_consignment_order.workflow.completion_status !== 0
        }
        return disableQtyChange
      }
    }
  }
</script>

<style scoped>

</style>
