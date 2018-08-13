<template>
  <div class="general-page-holder relative-position">
    <basic-form formName="StockistConsignmentDepositArea"
                :formTitle="$t('Common.form.title.stockist_consignment_deposit')"
                :backgroudColor="false"
                v-bind:formFieldData="stockist_consignment_deposit"
                urlResetPathName="Stockist Consignment Funds"
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="!lockStockistDepositRefund"
                :buttonTwoVisibility="!lockStockistDepositRefund"
                :buttonThreeCaption="lockStockistDepositRefund ? 'Close' : 'Cancel'">
      <template slot="form">
        <div class="form-holder">
          <div class="row">
            <div class="col-lg-12">
              <div class="row gutter-xs">
                <div class="col-xl-3 col-lg-3 col-md-3 col-xs-12">
                  <q-card color="white" class="full-height">
                    <q-card-main class="text-black">
                      <div class="row">
                        <div class="col-12 personal-data-holder relative-position">
                          <q-list no-border
                                  v-if="stockist_consignment_deposit !== undefined && stockist_consignment_deposit !== null && stockistData !== undefined && stockistData !== null"
                          >
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.requestedDate')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">{{ formatDate(requested_date)}}</q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.countryCode')}}</q-item-tile>
                                <q-item-tile sublabel>
                                  {{ stockistData.details.country.code_iso_2}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.stockistID')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ stockistData.details.stockist_number }}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.stockistName')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ stockistData.details.name }}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.expiryDate')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ formatDate(stockistData.member_data.details.expiry_date)}}
                                  <span v-if="checkDateValidity(stockistData.member_data.details.expiry_date)">
                                    <q-icon color="positive" name="check_circle"></q-icon>
                                  </span>
                                  <span v-else="">
                                    <q-icon color="negative" name="remove_circle"></q-icon>
                                  </span>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.stockistStatus')}}</q-item-tile>
                                <q-item-tile sublabel class="uppercase">
                                  {{ stockistData.details.status.title }}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <!--to show consignment deposit receipt later-->
                            <q-item tag="label" :class="{'disabled' : !$can($apply('stockist.funds.details|files'))}" data-schema="stockist.funds.details|files" multiline v-if="stockist_consignment_deposit.document_number !== null && stockist_consignment_deposit.document_number !== undefined && stockist_consignment_deposit.document_number !== ''">
                              <q-item-main>
                                <q-item-tile label class="text-primary" v-if="isDeposit">{{$t('stockist.deposit.label.consignmentDepositReceipt')}}</q-item-tile>
                                <q-item-tile label class="text-primary" v-else>{{$t('stockist.deposit.label.consignmentRefundNote')}}</q-item-tile>
                                <q-item-tile sublabel>
                                  <q-btn
                                    color="primary"
                                    @click="$can($apply('stockist.funds.details|files')) ? openDocument() : ''"
                                  >
                                    {{stockist_consignment_deposit.document_number}}
                                  </q-btn>
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
                <div class="col-xl-9 col-lg-9 col-md-9 col-xs-12">
                  <q-card color="white"  class="fit" v-if="nullObjectValidation(stockistData)">
                      <div class="row text-black full-height">
                        <div class="col-lg-4 col-md-6 col-xs-12 full-height" v-if="isDeposit">
                          <q-list sparse class="full-height">
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.consignmentDepositBalance')}}</q-item-tile>
                                <q-item-tile sublabel class="text-black text-right q-headline">
                                  {{stockistData.deposits.deposit_balance | formatPriceDouble}} {{currencyLabelByCountry}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item-separator />
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.consignmentDepositAmount')}}</q-item-tile>
                                <q-item-tile sublabel class="text-black text-right q-headline">
                                  <q-field
                                    class="text-uppercase"
                                    :error="$v.stockist_consignment_deposit.amount.$error"
                                    :error-label="$t('stockist.deposit.errorMessage.depositAmount')"
                                  >
                                  <q-input
                                    align="right"
                                    :disable="lockStockistDepositRefund"
                                    v-model="stockist_consignment_deposit.amount"
                                    @input="$v.stockist_consignment_deposit.amount.$touch()"
                                    type="number"
                                    :suffix="currencyLabelByCountry"
                                  />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item>
                              <q-item-main>
                                <q-item-tile>
                                  <q-list class="bg-grey-3">
                                    <q-item tag="label" multiline>
                                      <q-item-side left>
                                        {{$t('stockist.deposit.label.min')}}
                                      </q-item-side>
                                      <q-item-main>
                                        <q-item-tile class="text-right">{{stockist_consignment_deposit.minimum_amount | formatPriceDouble}}</q-item-tile>
                                      </q-item-main>
                                    </q-item>
                                    <q-item tag="label" multiline>
                                      <q-item-side left>
                                        {{$t('stockist.deposit.label.max')}}
                                      </q-item-side>
                                      <q-item-main>
                                        <q-item-tile class="text-right">{{stockist_consignment_deposit.maximum_amount | formatPriceDouble}}</q-item-tile>
                                      </q-item-main>
                                    </q-item>
                                  </q-list>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                        </div>
                        <div class="col-lg-4 col-md-6 col-xs-12 full-height" v-if="!isDeposit">
                          <q-list sparse class=" full-height">
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.consignmentDepositBalance')}}</q-item-tile>
                                <q-item-tile sublabel class="text-black text-right q-headline">
                                  {{stockistData.deposits.deposit_balance | formatPriceDouble}} {{currencyLabelByCountry}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item-separator />
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.refundAmount')}}</q-item-tile>
                                <q-item-tile sublabel class="text-black uppercase q-headline">
                                  <q-field
                                    class="text-uppercase"
                                    :error="$v.stockist_consignment_deposit.amount.$error"
                                    :error-label="$t('stockist.deposit.errorMessage.refundAmount')"
                                  >
                                  <q-input
                                    align="right"
                                    :disable="lockStockistDepositRefund"
                                    v-model="stockist_consignment_deposit.amount"
                                    @input="calculateRefundCreditLimit(), $v.stockist_consignment_deposit.amount.$touch(), $v.refund_credit_limit.$touch()"
                                    type="number"
                                    :suffix="currencyLabelByCountry"
                                  />
                                  </q-field>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item>
                              <q-item-main>
                                <q-item-tile>
                                  <q-list class="bg-grey-3">
                                    <q-item tag="label" multiline>
                                      <q-item-side left>
                                        {{$t('stockist.deposit.label.minBalanceCap')}}
                                      </q-item-side>
                                      <q-item-main>
                                        <q-item-tile class="text-right">{{stockist_consignment_deposit.minimum_capping | formatPriceDouble}}</q-item-tile>
                                      </q-item-main>
                                    </q-item>
                                    <q-item tag="label" multiline>
                                      <q-item-side left>
                                        {{$t('stockist.deposit.label.minCreditLimitCap')}}
                                      </q-item-side>
                                      <q-item-main>
                                        <q-item-tile class="text-right">
                                          {{Number(stockist_consignment_deposit.minimum_capping) * Number(stockist_consignment_deposit.ratio) | formatPriceDouble}}
                                        </q-item-tile>
                                      </q-item-main>
                                    </q-item>
                                  </q-list>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                        </div>
                        <div class="col-lg-4 col-md-6 col-xs-12 full-height">
                          <q-list sparse  class="full-height">
                            <q-item tag="label" multiline>
                              <q-item-main>
                                <q-item-tile label>{{$t('stockist.deposit.label.consignmentLimitBalance')}}</q-item-tile>
                                <q-item-tile sublabel class="text-black text-right q-headline">
                                  {{stockistData.deposits.deposit_limit | formatPriceDouble}} {{currencyLabelByCountry}}
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                            <q-item-separator />
                            <q-item tag="label" multiline>
                              <q-item-main v-if="isDeposit">
                                <q-item-tile label>{{$t('stockist.deposit.label.consignmentLimitAmount')}}</q-item-tile>
                                <q-item-tile sublabel class="text-black text-right q-headline">
                                  {{stockist_consignment_deposit.amount * Number(stockist_consignment_deposit.ratio) | formatPriceDouble}} {{currencyLabelByCountry}}
                                </q-item-tile>
                              </q-item-main>
                              <q-item-main v-if="!isDeposit">
                                <q-item-tile label>{{$t('stockist.deposit.label.consignmentLimitReduction')}}</q-item-tile>
                                <q-field
                                  :error="$v.refund_credit_limit.$error"
                                  :error-label="$t('stockist.deposit.errorMessage.refundCreditLimit')"
                                >
                                <q-item-tile sublabel class="text-red text-right q-headline">
                                  -{{refund_credit_limit | formatPriceDouble}} {{currencyLabelByCountry}}
                                </q-item-tile>
                                </q-field>
                              </q-item-main>
                            </q-item>
                            <q-item>
                              <q-item-main>
                                <q-item-tile>
                                  <q-list class="bg-grey-3">
                                    <q-item tag="label" multiline>
                                      <q-item-side left>
                                        {{$t('stockist.deposit.label.stockistRatio')}}
                                      </q-item-side>
                                      <q-item-main>
                                        <q-item-tile class="text-right">1:{{Number(stockist_consignment_deposit.ratio)}}</q-item-tile>
                                      </q-item-main>
                                    </q-item>
                                    <q-item tag="label" multiline>
                                      <q-item-main>
                                        <q-item-tile class="text-right">   </q-item-tile>
                                      </q-item-main>
                                    </q-item>
                                  </q-list>
                                </q-item-tile>
                              </q-item-main>
                            </q-item>
                          </q-list>
                        </div>
                        <div
                          class="workflow-action col-lg-4 col-md-4 col-xs-12 ">
                          <div>
                            <q-card color="white" class="full-height shadow-0">
                              <q-card-main class="text-black">
                                <div class="row gutter-sm justify-center">
                                  <div class="col-12" v-if="stockist_consignment_deposit.verified_by !== null && stockist_consignment_deposit.verified_by !== undefined">
                                    <p class="q-title text-green">Verified By</p>
                                    <p>
                                      Verification Date: {{stockist_consignment_deposit.verified_at}}
                                    </p>
                                    <p>
                                      Verification By: {{stockist_consignment_deposit.verified_by.name}}
                                    </p>
                                  </div>
                                </div>
                              </q-card-main>
                            </q-card>
                          </div>
                          <div
                          v-if="nullObjectValidation(workflow) &&
                                nullObjectValidation(workflow.current_step) &&
                                nullObjectValidation(workflow.current_step.step_data) &&
                                nullObjectValidation(workflow.current_step.step_data.actions) &&
                                nullObjectValidation(workflow.current_step.step_data.actions.fields) &&
                                workflow.current_step.step_data.actions.fields.length > 0">
                           <q-card color="white" class="full-height shadow-0">
                             <q-card-title>
                               <p class="q-title text-green" v-if="workflow.completion_status == 0">{{workflow.current_step.name}}</p>
                             </q-card-title>
                             <q-card-main class="text-black">
                              <div class="row gutter-sm">
                              <div v-for="step in workflow.current_step.step_data.actions.fields"
                                   class="col-xl-auto col-lg-auto">
                                <!--{'col-xl-auto col-lg-auto col-md-12 col-xs-12': typeof step.share !== 'undefined' && step.share.pos !=='C',-->
                                <!--'col': typeof step.share === 'undefined',-->
                                <!--'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof step.share !== 'undefined' && step.share.pos ==='C'}-->
                                <q-btn
                                  v-if="step.type === 'button'"
                                  color="primary"
                                  @click="handleTriggerActions(step, workflow.current_step.step_data.actions)"
                                >
                                  {{step.label}}
                                </q-btn>
                                <q-select v-if="step.type === 'masters-select'"
                                          filter
                                          autofocus-filter
                                          clearable
                                          @input="handleTriggerActions(step, workflow.current_step.step_data.actions)"
                                          :stack-label="step.label"
                                          v-model="step.value"
                                          :options="masterDataOptionsCreator(step.master_key)"
                                />
                                <q-input
                                  v-if="step.type === 'textarea'"
                                  v-model="step.value"
                                  :stack-label="step.label"
                                  type="textarea"
                                  @input="handleTriggerActions(step, workflow.current_step.step_data.actions)"
                                  :max-height="50"
                                  :min-rows="2"
                                />
                                <q-input class="full-width"
                                         v-if="step.type === 'textfield'"
                                         v-model="step.value"
                                         @input="handleTriggerActions(step, workflow.current_step.step_data.actions)"
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
                                <div v-if="step.type === 'complete'" class="row">
                                  <div class="col-12" v-if="workflow.rejected_status === null || workflow.rejected_status === 0">
                                    <p class="q-title text-green">{{$t('stockist.deposit.label.approved')}}</p>
                                    <p>
                                      {{$t('stockist.deposit.label.approvalDate')}} {{workflow.current_step.updated_at}}
                                    </p>
                                    <p>
                                      {{$t('stockist.deposit.label.approvedBy')}} {{workflow.updated_by.name}}
                                    </p>
                                  </div>
                                  <div class="col-12" v-if="workflow.rejected_status !== null || workflow.rejected_status === 1">
                                    <p class="q-title text-red">{{$t('stockist.deposit.label.declined')}}</p>
                                    <p class="text-red">{{$t('stockist.deposit.label.declinedAt')}} {{workflow.current_step.updated_at}}</p>
                                    <p class="text-red">{{$t('stockist.deposit.label.declinedBy')}} {{workflow.updated_by.name}}</p>
                                    <p class="text-red-4">{{$t('stockist.deposit.label.declinedRemark')}}</p>
                                    <p class="text-red-4">{{workflow.rejected_reason}}</p>
                                  </div>
                                </div>
                              </div>
                              <div
                                v-if="workflow.current_step.step_data.actions.show_child"
                                class="row col-12 justify-center"
                              >
                                <div  v-for="(childstep, childindex) in workflow.current_step.step_data.actions.child.fields"
                                      class="self-center"
                                      :class="{'col-xl-6 col-lg-6 col-md-6 col-xs-12 col-md-12 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos !=='C',
                                                           'col': typeof childstep.share === 'undefined',
                                                           'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos ==='C'}">
                                  <!--xl-3 col-lg-6 col-md-6 col-xs-12-->
                                  <q-btn
                                    v-if="childstep.type === 'button'"
                                    color="primary"
                                    @click="handleTriggerActions(childstep, workflow.current_step.step_data.actions.child)"
                                  >
                                    {{childstep.label}}
                                  </q-btn>
                                  <q-input
                                    v-if="childstep.type === 'textarea'"
                                    v-model="childstep.value"
                                    :stack-label="childstep.label.concat(childstep.required?'*':'')"
                                    :error="childstep.required ?  $v.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                                    :error-label="$t('stockist.deposit.errorMessage.requiredField')"
                                    type="textarea"
                                    :max-height="childstep.max_height"
                                    :min-rows="childstep.min_rows"
                                    @input="handleTriggerActions(childstep, workflow.current_step.step_data.actions.child)"
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
                                    :error="childstep.required ?  $v.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                                    :error-label="$t('stockist.deposit.errorMessage.requiredField')"
                                    @input="handleTriggerActions(childstep, workflow.current_step.step_data.actions.child)"
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
                      <q-tabs inverted  two-lines color="grey-7" align="left" v-model="currentTab">
                        <q-tab v-if="isDeposit" default name="payment"
                               slot="title"
                               :label="$t('stockist.deposit.tab.payment')"/>
                        <q-tab v-if="!isDeposit" default name="bank_info"
                               slot="title"
                               :label="$t('stockist.deposit.tab.bankInfo')"/>
                        <!-- Tab Content -->
                        <q-tab-pane v-if="isDeposit" name="payment" class="no-border bg-white sales-items full-height full-width align-content-start">
                          <!-- Items Content-->
                          <div v-if="depositRefundID === undefined || depositRefundID === null || depositRefundID == ''">
                            <p>Please save deposit request before proceeding with payment</p>
                          </div>
                          <payment-tab v-if="depositRefundID !== undefined && depositRefundID !== null && depositRefundID !== '' && loadingComplete"
                                       :paymentData="stockist_consignment_deposit"
                                       :totalPayableAmount="stockist_consignment_deposit.amount.toString()"
                                       :processForm="processForm"
                                       :initSetupArea="initSetupArea"
                                       :lock="lockStockistDepositRefund"
                                       :makePaymentData="{payType:'consignment_deposit', consignmentDepositId: depositRefundID}"
                                       :popupDialog="{disableLock: true, title: '', message: '', noEscDismiss: '', position: '', okBtnText: '', cancelBtnText:''}"
                                       :callback="initSetupArea"
                                       :excludePaymentMode="['AEON', 'E-Wallet', 'House Cheque', 'Discount Voucher', 'EPP (Moto)', 'EPP (Terminal)', 'Credit Card', 'Credit Card (Mega)']"
                                       >

                          </payment-tab>
                        </q-tab-pane>
                        <q-tab-pane
                          v-if="!isDeposit && banks.bank_detail !== undefined && banks.bank_detail !== null"
                          name="bank_info"
                          class="no-border bg-white sales-items full-height full-width align-content-start">
                          <bank-info-tab
                            :banks="banks"
                            :validation="$v"
                            :selectedFilters="selectedFilters"
                            :isViewOnly="true"
                          ></bank-info-tab>
                        </q-tab-pane>
                      </q-tabs>
                    </div>
                  </q-card-main>
                </q-card>
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
    <q-loader :visible="isProcessingForm || isLoaderActive"></q-loader>
  </div>
</template>

<script>
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { DatesMixin, MasterDataTransformarMixin, GeneralsMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import { required, minLength } from 'vuelidate/lib/validators'
  import {PaymentTab} from 'src/application/global/components/common/shared-tabs'
  import { BankInfoTab } from 'src/application/stockist/components/registration-tabs/index'
  import { Dialog, openURL } from 'quasar'

  export default {
    name: "stockist-consignment-deposit-area",
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin],
    components: {
      basicForm,
      qLoader,
      errorsModal,
      layoutModal,
      PaymentTab,
      BankInfoTab
    },
    props: ['depositRefundType', 'depositRefundID'],
    data: () => ({
      isDeposit: true,
      requested_date: new Date(),
      banks: {},
      rejectReason: '',
      loadingComplete: false,
      currentTab: 'payment',
      lockStockistDepositRefund: false,
      refund_credit_limit: 0,
      isLoaderActive: false,
      stockist_consignment_deposit: {
        user_id: '',
        stockist_id: '',
        amount: 0,
        refund_credit_limit: 0,
        minimum_amount: 0,
        maximum_amount: 0,
        deposit_balance: 0,
        min_capping_credit_limit: 0,
        deposit_limit: 0,
        ratio: 0,
        selected: {
          payments: {
            paid: [],
            unpaid: []
          }
        }
      },
      workflow: {}
    }),
    validations () {
      let def = {
        stockist_consignment_deposit: {
        }
      }
      if (this.isDeposit){
        def.stockist_consignment_deposit.amount = {
          check (val, elm) {
            return this.stockist_consignment_deposit.minimum_amount <= val && val <= this.stockist_consignment_deposit.maximum_amount
          }
        }
      } else {
        def.stockist_consignment_deposit.amount = {
          check (val, elm) {
            return (this.stockist_consignment_deposit.deposit_balance - this.stockist_consignment_deposit.minimum_capping )>= val && val > 0
          }
        }
        def.refund_credit_limit = {
          check(val, elm) {
            return (this.stockist_consignment_deposit.deposit_limit - this.stockist_consignment_deposit.min_capping_credit_limit) >= val
          }
        }
      }
      if (this.nullObjectValidation(this.workflow)
        && this.nullObjectValidation(this.workflow.current_step)
        && this.nullObjectValidation(this.workflow.current_step.step_data)
        && this.nullObjectValidation(this.workflow.current_step.step_data.actions)) {
        def.workflow = {}
        def.workflow.current_step = {}
        def.workflow.current_step.step_data = {}
        def.workflow.current_step.step_data.actions = {
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
        if (this.nullObjectValidation(this.workflow.current_step.step_data.actions.child)
          && this.workflow.current_step.step_data.actions.show_child) {
          def.workflow.current_step.step_data.actions.child = {
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
      this.master.keys = [
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
        stockistData: state => state.stockistCMP.stockistData.data,
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
        'getMastersWithKey',
        'updateWorkflowAction',
        'submitConsignmentDepositAction',
        'getStockistDepositSettingsAction',
        'getExistingStockistDepositRefundAction',
        'submitConsignmentRefundAction',
        'updateWorkflowAction',
        'downloadConsignmentDepositRefundNoteAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      initSetupArea () {
        // search for stockist and load data, need to wait till stockist creation complete to restructure data obj
        if (this.nullObjectValidation(this.depositRefundType) && this.depositRefundType !== '') {
          this.isDeposit = this.depositRefundType == 'deposit'
          if (!this.isDeposit) {
            this.currentTab = 'bank_info'
          }
          let query1 = {
            country_id: this.selectedFilters.countryID,
            relations: ['currency']
          }
          this.getCountryRelationAction(query1)
          if (this.nullObjectValidation(this.depositRefundID) && this.depositRefundID !== '') {
            // load existing deposit info
            this.lockStockistDepositRefund = true
            this.getExistingStockistDepositRefundAction({id: this.depositRefundID}).then((res) => {
              if (this.nullObjectValidation(res) && this.nullObjectValidation(res.consignment_deposit_refund)) {
                this.stockist_consignment_deposit = res.consignment_deposit_refund
                this.stockist_consignment_deposit.min_capping_credit_limit =Number(this.stockist_consignment_deposit.minimum_capping) * Number(this.stockist_consignment_deposit.ratio)
                this.calculateRefundCreditLimit()
                this.workflow = res.workflow.workflow
                this.getExistingStockist({stockist_user_id: this.stockist_consignment_deposit.stockist_user_id}).then(() => {
                  this.banks = JSON.parse(JSON.stringify(this.stockistData.banks))
                  this.banks.bank_detail = JSON.parse(this.banks.bank_detail)
                  this.stockist_consignment_deposit.country_id = this.stockistData.details.country_id
                  this.stockist_consignment_deposit.location_id = this.stockistData.stockist_location.id
                  this.loadingComplete = true
                })
              }
            })
          } else if (this.stockistRegistrationDetails.userID !== '') {
            // init new deposit
            let query = {
              stockist_user_id: this.stockistRegistrationDetails.userID,
              type: this.depositRefundType
            }
            this.getStockistDepositSettingsAction(query).then((res) => {
              // not sure what to do yet, remove if nothing is needed
              if (!this.isDeposit && this.nullObjectValidation(res) && this.nullObjectValidation(res.is_allow_consignment_refund) && !res.is_allow_consignment_refund) {
                this.isLoaderActive = true
                this.invalidRequest()
                this.setNotification({
                  title: this.$t('stockist.deposit.notification.notAllowed.title'),
                  message: this.$t('stockist.deposit.notification.notAllowed.message'),
                  type: 'negative'
                })
                reject()
              } else if (this.nullObjectValidation(res)
                && this.nullObjectValidation(res.consignment_deposit_refund)) {
                this.stockist_consignment_deposit = res.consignment_deposit_refund
                this.stockist_consignment_deposit.min_capping_credit_limit =Number(this.stockist_consignment_deposit.minimum_capping) * Number(this.stockist_consignment_deposit.ratio)
              }
            })
            this.getExistingStockist(query).then(() => {
              this.banks = JSON.parse(JSON.stringify(this.stockistData.banks))
              this.banks.bank_detail = JSON.parse(this.banks.bank_detail)
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
          this.$router.push({name: 'Stockist Consignment Funds'})
        }, 1500)
      },
      processForm: function (formFieldData) {
        this.$v.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.$error) {
            Dialog.create({
              title: this.$t('stockist.depositRefund.dialog.confirmSave.title'),
              message: this.$t('stockist.depositRefund.dialog.confirmSave.message'),
              noEscDismiss: true,
              noBackdropDismiss: true,
              position: 'top',
              ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
              cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel')
            }).then(()=> {
              if (this.isDeposit) {
                this.submitConsignmentDepositAction({consignment_deposit_refund: this.stockist_consignment_deposit}).then((res) => {
                  if (this.nullObjectValidation(res) && this.nullObjectValidation(res.consignment_deposit_refund)) {
                    this.lockStockistDepositRefund = true
                    this.stockist_consignment_deposit = res.consignment_deposit_refund
                    this.stockist_consignment_deposit.country_id = this.stockistData.details.country_id
                    this.stockist_consignment_deposit.location_id = this.stockistData.stockist_location.id
                    this.workflow = res.workflow.workflow
                    this.calculateRefundCreditLimit()
                    this.loadingComplete = true
                    this.$router.replace({
                      name: 'Stockist Consignment Deposit Area',
                      params: {
                        depositRefundType: this.depositRefundType,
                        depositRefundID: res.consignment_deposit_refund.id
                      }
                    })
                    this.$v.$reset()
                    resolve(res)
                  }
                }).catch((error)=>{
                  this.setNotification({
                    title: this.$t('stockist.deposit.notification.error.title'),
                    message: this.$t('stockist.deposit.notification.errorOccurred.message'),
                    type: 'negative'
                  })
                  reject()
                })
              } else {
                // submit refund here
                this.submitConsignmentRefundAction({consignment_deposit_refund: this.stockist_consignment_deposit}).then((res) => {
                  if (this.nullObjectValidation(res) && this.nullObjectValidation(res.consignment_deposit_refund)) {
                    this.stockist_consignment_deposit = res.consignment_deposit_refund
                    this.workflow = res.workflow.workflow
                    this.stockist_consignment_deposit.min_capping_credit_limit = Number(this.stockist_consignment_deposit.minimum_capping) * Number(this.stockist_consignment_deposit.ratio)
                    this.calculateRefundCreditLimit()
                    this.$router.replace({
                      name: 'Stockist Consignment Deposit Area',
                      params: {
                        depositRefundType: this.depositRefundType,
                        depositRefundID: res.consignment_deposit_refund.id
                      }
                    })
                  }
                  resolve(res)
                })
              }
            }).catch((error)=>{
              reject()
            })
          } else {
            this.setNotification({
              title: this.$t('stockist.deposit.notification.error.title'),
              message: this.$t('stockist.deposit.notification.errorFound.message'),
              type: 'negative'
            })
            reject()
          }
        })
      },
      handleTriggerActions (workflowField, action) {
        switch (workflowField.trigger) {
          case 'updateRejectionReason':
            this.rejectReason = workflowField.value
            break
          case 'sendDepositDecline':
          case 'sendRefundDecline':
          case 'sendRefundRejected':
            this.$v.workflow.current_step.$touch()
            if (!this.$v.workflow.current_step.$error) {
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
          case 'sendDepositApproval':
          case 'sendRefundVerified':
          case 'sendRefundApproval':
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
      nullObjectValidation (object) {
        return object !== undefined && object!== null
      },
      reCalculateCart () {
      },
      submitApprovalStep (field) {
        // this.workflowMixinData.remark = 'semething'
        let payload = {
          workflow_tracking_step_id: this.workflow.current_step.id,
          workflow_remark: this.rejectReason,
          tracking_step_input: field
        }
        this.updateWorkflowAction(payload).then((res) => {
          if (this.nullObjectValidation(res) && this.nullObjectValidation(res.even_result) && res.even_result.length > 0) {
            this.workflow = res.even_result[0].workflow.workflow
            this.stockist_consignment_deposit = res.even_result[0].consignment_deposit_refund
            this.calculateRefundCreditLimit()
            this.getExistingStockist({stockist_user_id: this.stockist_consignment_deposit.stockist_user_id})
            this.$v.$reset()
          }
          // setTimeout(this.loadExistingStockistOrder(), 2000)
        })
      },
      calculateRefundCreditLimit () {
        this.refund_credit_limit = this.stockist_consignment_deposit.amount * this.stockist_consignment_deposit.ratio
      },
      openDocument () {
        let query = {
          consignment_deposit_refund_id: this.stockist_consignment_deposit.id
        }
        this.downloadConsignmentDepositRefundNoteAction(query).then((res) => {
          let pdfUrl = res.download_link
          if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
            openURL(pdfUrl)
          }
        })
      }
    }
  }
</script>

<style scoped>
  .workflow-action {
    border-left: 4px solid lightgrey
  }
</style>
