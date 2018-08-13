<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SalesForm"
                    :formTitle="$t('sales.newSales.title')"
                    :backgroudColor="false"
                    v-bind:formFieldData="cancellationData"
                    urlResetPathName="Sales Order Cancellation List"
                    formAction="salesOrderAction"
                    :buttonTitleCaption="$t('Common.Save.Btn')"
                    :formSubmit="processForm"
                    :buttonOneVisibility="isNewRequest"
                    :buttonTwoVisibility="isNewRequest"
                    :buttonThreeCaption="!isNewRequest ? 'Close' : 'Cancel'">
            <template slot="form">
                <div class="form-holder">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row justify-end">
                                <div class="col-xl-8 col-lg-8">
                                    <q-card color="white" class="full-height">
                                        <q-card-main class="text-black">
                                            <div class="row">
                                                <div class="col-lg-6 personal-data-holder relative-position">
                                                  <q-list no-border
                                                          v-if="memberDetails !== undefined && memberDetails !== null && memberDetails.details !== null && memberDetails.details !== undefined">
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.memberID')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">{{ memberDetails.details.member_id}}</q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.memberName')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          {{ memberDetails.details.name }}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.translatedName')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          {{ memberDetails.details.translated_name !== null ? memberDetails.details.translated_name : '-- N/A --' }}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.expiryDate')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                            {{ formatDate(memberDetails.details.expiry_date)}}
                                                            <span v-if="checkDateValidity(memberDetails.details.expiry_date)"><q-icon color="positive" name="check_circle"></q-icon></span>
                                                            <span v-else=""><q-icon color="negative" name="remove_circle"></q-icon></span>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.taxInvoice')}}<span class="text-red">*</span></q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            class="full-width"
                                                            :error="$v.cancellationData.sale.invoice.$error  || setError('invoice_id','type.exp')"
                                                            :error-label="$v.cancellationData.sale.invoice.$error ? $t('sale.cancellation.detail.validation.selectInvoice') : setError('invoice_id','type.msg')"
                                                          >
                                                           <q-input
                                                             :disable="!isNewRequest"
                                                             v-model="taxInvoiceNumber"
                                                             @click="actions(null, 'productCancellation')"
                                                             :after="[
                                                               {
                                                                 icon: 'search',
                                                                 handler () {
                                                                   actions(null, 'productCancellation')
                                                                 }
                                                               }
                                                             ]"
                                                           ></q-input>
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline v-if="cancellationData.sale.id !== ''">
                                                      <q-item-main class="bordered bg-grey-4 fit">
                                                        <q-list no-border>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.cancellation.detail.label.transactionDate')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase">{{cancellationData.sale.invoice.invoice_date}}</q-item-tile>
                                                            </q-item-main>
                                                            <q-item-side right>
                                                              <q-item-tile>
                                                                <q-btn flat small @click="openDocument('invoice')"><q-icon name="launch" color="blue"/></q-btn>
                                                              </q-item-tile>
                                                            </q-item-side>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                          <q-item-main>
                                                            <q-item-tile label>{{$t('sale.cancellation.detail.label.cw')}}</q-item-tile>
                                                            <q-item-tile sublabel class="uppercase">
                                                              {{cancellationData.sale.cw !== null &&  cancellationData.sale.cw !== undefined ? cancellationData.sale.cw.cw_name : ''}}
                                                            </q-item-tile>
                                                          </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                          <q-item-main>
                                                            <q-item-tile label>{{$t('sale.cancellation.detail.label.transactionLocation')}}</q-item-tile>
                                                            <q-item-tile sublabel class="uppercase">
                                                              {{cancellationData.sale.transaction_location !== null &&  cancellationData.sale.transaction_location !== undefined  ? cancellationData.sale.transaction_location.name : ''}}
                                                            </q-item-tile>
                                                          </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline v-if="cancellationData.sale.stock_location !== null && cancellationData.sale.stock_location !== undefined">
                                                          <q-item-main>
                                                            <q-item-tile label>{{$t('sale.cancellation.detail.label.stockLocation')}}</q-item-tile>
                                                            <q-item-tile sublabel>
                                                              {{cancellationData.sale.stock_location.name}}
                                                            </q-item-tile>
                                                          </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                          <q-item-main>
                                                            <q-item-tile label>{{$t('sale.cancellation.detail.label.deliveryStatus')}}</q-item-tile>
                                                            <q-item-tile sublabel class="uppercase">
                                                              {{cancellationData.sale.delivery_status !== null  &&  cancellationData.sale.delivery_status !== undefined ? cancellationData.sale.delivery_status.title : 'N/A'}}
                                                            </q-item-tile>
                                                          </q-item-main>
                                                          </q-item>
                                                        </q-list>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline v-if="cancellationData.sale_cancellation.credit_note !== undefined && cancellationData.sale_cancellation.credit_note != null">
                                                      <q-item-main>
                                                        <q-item-tile label class="text-primary">{{$t('sale.cancellation.detail.label.creditNote')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-btn color="primary" @click="openDocument('creditNote')">
                                                            {{cancellationData.sale_cancellation.credit_note.credit_note_number}}
                                                          </q-btn>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                  </q-list>
                                                    <q-loader :visible="isProcessingSection"></q-loader>
                                                </div>
                                                <div class="col-lg-6 order-data-holder">
                                                  <q-list no-border>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.cancellationDate')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          {{ !isNewRequest ? formatDate(cancellationData.sale_cancellation.transaction_date, 'DD/MM/YYYY') : getCurrentDate('DD/MM/YYYY') }}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label">
                                                    <q-item-main>
                                                      <q-item-tile label>{{$t('sale.cancellation.detail.label.transactionLocation')}}<span class="text-red">*</span></q-item-tile>
                                                      <q-item-tile sublabel class="uppercase">
                                                        <q-field
                                                          :error="$v.cancellationData.sale_cancellation.transaction_location_id.$error"
                                                          :error-label="$t('sale.cancellation.detail.validation.selectTransactionLocation')">
                                                          <q-select
                                                          v-model="cancellationData.sale_cancellation.transaction_location_id"
                                                          :options="locationsOptionsByCountry"
                                                          :disable="!isNewRequest"
                                                          @input="setStockLocations(cancellationData.sale_cancellation.transaction_location_id)"
                                                          />
                                                        </q-field>
                                                      </q-item-tile>
                                                    </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.stockLocation')}}<span class="text-red">*</span></q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            :error="$v.cancellationData.sale_cancellation.stock_location_id.$error"
                                                            :error-label="$t('sale.cancellation.detail.validation.selectStockLocation')">
                                                            <q-select
                                                              v-model="cancellationData.sale_cancellation.stock_location_id"
                                                              :options="stocklocationsOptionsByCountry"
                                                              :disable="!isNewRequest"
                                                            />
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.cw')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          {{cancellationData.sale_cancellation.cw !== undefined && cancellationData.sale_cancellation.cw !== null && cancellationData.sale_cancellation.cw.cw_name !== undefined ? cancellationData.sale_cancellation.cw.cw_name : 'N/A'}}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item v-if="!isLegacy">
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.cancellationMode')}}
                                                          <span class="text-red">*</span></q-item-tile>
                                                            <q-item-tile sublabel class="uppercase">
                                                              <q-field
                                                                :error="$v.cancellationData.sale_cancellation.cancellation_mode_id.$error"
                                                                :error-label="$t('sale.cancellation.detail.validation.selectCancellationMode')">
                                                                <div class="row">
                                                                  <q-radio
                                                                    :disable="!isNewRequest || isSameDayCancellation || isEsacCancellation"
                                                                    v-for="mode in masterDataOptionsCreator('sale_cancellation_mode')"
                                                                    :key="mode.value"
                                                                    v-model="cancellationData.sale_cancellation.cancellation_mode_id"
                                                                    :val="mode.value"
                                                                    :label="mode.label"
                                                                    @input="processCancellationModeChange(mode.label.toLowerCase())"
                                                                    />
                                                                </div>
                                                              </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.cancellationReason')}}<span class="text-red">*</span></q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            :error="$v.cancellationData.sale_cancellation.cancellation_reason_id.$error"
                                                            :error-label="$t('sale.cancellation.detail.validation.selectCancellationReason')">
                                                            <q-select
                                                              v-model="cancellationData.sale_cancellation.cancellation_reason_id"
                                                              :options="masterDataOptionsCreator('sale_cancellation_reason')"
                                                              filter
                                                              color="black"
                                                              :disable="!isNewRequest"
                                                            ></q-select>
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.cancellationRemarks')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                            <q-field
                                                              >
                                                              <q-input
                                                                v-model="cancellationData.sale_cancellation.remarks"
                                                                type="textarea"
                                                                :max-height="50"
                                                                :min-rows="3"
                                                                :disable="!isNewRequest"
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
                                <div class="col-xl-4 col-lg-4">
                                  <q-card color="white" class="full-height">
                                    <q-card-title class="bg-grey-3">
                                      <q-list no-border>
                                        <q-item tag="label" multiline>
                                          <q-item-main>
                                            <q-item-tile label class="text-red text-left q-subheading">{{$t('sale.cancellation.detail.label.totalCancellationAmount')}}({{currencyLabelByCountry}})</q-item-tile>
                                            <q-item-tile sublabel class="text-black text-right q-headline"><p>{{cancellationData.sale_cancellation.total_amount | formatPriceDouble }}</p></q-item-tile>
                                          </q-item-main>
                                        </q-item>
                                        <q-item tag="label" multiline v-if="isBuyBackPolicy" >
                                          <q-item-main>
                                            <q-item-tile label class="text-red text-left q-subheading">{{$t('sale.cancellation.detail.label.buyBackAmount')}}({{currencyLabelByCountry}})</q-item-tile>
                                            <q-item-tile sublabel class="text-black text-right q-headline justify-end">
                                                <q-input v-if="enableBuyBackAmountField" align="right" v-model="cancellationData.sale_cancellation.total_buy_back_amount"
                                                         :disable="!enableBuyBackAmountField">
                                                </q-input>
                                                <p v-else >{{cancellationData.sale_cancellation.total_buy_back_amount | formatPriceDouble}}</p>
                                            </q-item-tile>
                                          </q-item-main>
                                        </q-item>
                                      </q-list>
                                    </q-card-title>
                                    <q-card-title v-if="cancellationData.workflow !== null && cancellationData.workflow !== undefined">
                                      <p class="text-black q-display-1">{{cancellationData.workflow.name}}</p>
                                    </q-card-title>
                                    <q-card-main class="text-black fit no-shadow" v-if="cancellationData.workflow !== undefined && cancellationData.workflow !== null">
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
                                          v-for="wfstep in cancellationData.workflow.steps"
                                          :disable="isNewRequest ||
                                                    cancellationData.workflow === undefined ||
                                                    cancellationData.workflow === null ||
                                                    cancellationData.workflow.current_step === undefined ||
                                                    cancellationData.workflow.current_step === null ||
                                                    cancellationData.workflow.current_step.step !== wfstep.step"
                                          :key="wfstep.sequence"
                                          :name="wfstep.step"
                                          :title="wfstep.name" >
                                          <div
                                            v-if="cancellationData.workflow !== undefined &&
                                                  cancellationData.workflow !== null &&
                                                  cancellationData.workflow.current_step !== undefined &&
                                                  cancellationData.workflow.current_step !== null &&
                                                  wfstep.step === cancellationData.workflow.current_step.step &&
                                                  cancellationData.workflow.current_step.step_data.actions!== undefined &&
                                                  cancellationData.workflow.current_step.step_data.actions !== null &&
                                                  cancellationData.workflow.current_step.step_data.actions.fields.length > 0">
                                            <div class="row gutter-sm justify-start">
                                              <div v-for="step in cancellationData.workflow.current_step.step_data.actions.fields">
                                                <!--{'col-xl-auto col-lg-auto col-md-12 col-xs-12': typeof step.share !== 'undefined' && step.share.pos !=='C',-->
                                                <!--'col': typeof step.share === 'undefined',-->
                                                <!--'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof step.share !== 'undefined' && step.share.pos ==='C'}-->
                                                <q-btn
                                                  v-if="step.type === 'button'"
                                                  size="md"
                                                  color="primary"
                                                  @click="handleTriggerActions(step, cancellationData.workflow.current_step.step_data.actions)"
                                                >
                                                  {{step.label}}
                                                </q-btn>
                                                <q-select v-if="step.type === 'masters-select'"
                                                          filter
                                                          autofocus-filter
                                                          clearable
                                                          @input="handleTriggerActions(step, cancellationData.workflow.current_step.step_data.actions)"
                                                          :stack-label="step.label"
                                                          v-model="step.value"
                                                          :options="masterDataOptionsCreator(step.master_key)"
                                                />
                                                <q-input
                                                  v-if="step.type === 'textarea'"
                                                  v-model="step.value"
                                                  :stack-label="step.label"
                                                  type="textarea"
                                                  @input="handleTriggerActions(step, cancellationData.workflow.current_step.step_data.actions)"
                                                  :max-height="50"
                                                  :min-rows="2"
                                                />
                                                <q-input class="full-width"
                                                         v-if="step.type === 'textfield'"
                                                         v-model="step.value"
                                                         @input="handleTriggerActions(step, cancellationData.workflow.current_step.step_data.actions)"
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
                                                  <div v-if="cancellationData.workflow.rejected_status === null || cancellationData.workflow.rejected_status === 0">
                                                    <p>Completed at {{wfstep.updated_at}}</p>
                                                  </div>
                                                  <!--v-if="cancellationData.workflow.rejected_status !== null || cancellationData.workflow.rejected_status === 1"-->
                                                  <div v-else>
                                                    <p class="text-red">Declined by {{wfstep.updated_by.name}} at {{wfstep.updated_at}}</p>
                                                    <div class="row gutter-sm">
                                                      <div class="col-lg-4 col-md-12 col-xs-12">
                                                        <p class="text-red-4">Rejection remark:</p>
                                                      </div>
                                                      <div class="col-lg-8 col-md-12 col-xs-12">
                                                        <p class="text-red-4">{{cancellationData.workflow.rejected_reason}}</p>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                              <div
                                                v-if="cancellationData.workflow.current_step.step_data.actions.show_child"
                                                class="row col-12"
                                              >
                                                <div  v-for="(childstep, childindex) in cancellationData.workflow.current_step.step_data.actions.child.fields"
                                                      class="self-center"
                                                      :class="{'col-xl-6 col-lg-6 col-md-6 col-xs-12 col-md-12 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos !=='C',
                                                               'col': typeof childstep.share === 'undefined',
                                                               'col-xl-3 col-lg-6 col-md-6 col-xs-12': typeof childstep.share !== 'undefined' && childstep.share.pos ==='C'}">
                                                  <!--xl-3 col-lg-6 col-md-6 col-xs-12-->
                                                  <q-btn
                                                    v-if="childstep.type === 'button'"
                                                    color="primary"
                                                    @click="handleTriggerActions(childstep, cancellationData.workflow.current_step.step_data.actions.child)"
                                                  >
                                                    {{childstep.label}}
                                                  </q-btn>
                                                  <q-input
                                                    v-if="childstep.type === 'textarea'"
                                                    v-model="childstep.value"
                                                    :stack-label="childstep.label.concat(childstep.required?'*':'')"
                                                    :error="childstep.required ?  $v.cancellationData.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                                                    :error-label="$t('sale.cancellation.workflow.validation.missingRequiredField')"
                                                    type="textarea"
                                                    :max-height="childstep.max_height"
                                                    :min-rows="childstep.min_rows"
                                                    @input="handleTriggerActions(childstep, cancellationData.workflow.current_step.step_data.actions.child)"
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
                                                    :error="childstep.required ?  $v.cancellationData.workflow.current_step.step_data.actions.child.fields.$each[childindex].value.$error: false"
                                                    :error-label="$t('sale.cancellation.workflow.validation.missingRequiredField')"
                                                    @input="handleTriggerActions(childstep, cancellationData.workflow.current_step.step_data.actions.child)"
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white shadow-1 relative-position mt-20">
                        <div class="col-lg-12">
                          <q-card class="full-width" color="white">
                            <q-card-main class="text-black">
                              <table class="text-black loose col-lg-10 q-table-html bordered cell-separator fit responsive">
                                <thead class="bg-grey-4">
                                <tr>
                                  <th></th>
                                  <th align="left" width="20%">{{$t('sale.cancellation.detail.tableLabel.productCode')}}</th>
                                  <th align="left">{{$t('sale.cancellation.detail.tableLabel.productName')}}</th>
                                  <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.purchaseQty')}}</th>
                                  <th  v-if="!isLegacy" align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.availableQty')}}</th>
                                  <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.totalCV')}}</th>
                                  <th align="center" width="13%">{{$t('sale.cancellation.detail.tableLabel.unitPrice')}}</th>
                                  <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.totalPrice')}}</th>
                                  <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.cancellationQty')}}</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr
                                  v-if="cancellationData.sale !== undefined && cancellationData.sale !== null && cancellationData.sale.products !== undefined"
                                  v-for="(product,product_index) in cancellationData.sale.products"
                                >
                                  <td> </td>
                                  <td align="left">{{product.sku}}</td>
                                  <td align="left">{{product.name}}</td>
                                  <td align="center">{{product.quantity}}</td>
                                  <td  v-if="!isLegacy" align="center">{{product.available_quantity_snapshot}}</td>
                                  <td align="center">{{product.base_price.base_cv * product.quantity}}</td>
                                  <td align="center">{{product.base_price.gmp_price_tax | formatPriceDouble }}
                                  <td align="center">{{product.base_price.gmp_price_tax * product.available_quantity_snapshot | formatPriceDouble  }}</td>
                                  <td align="center">
                                    <q-input
                                      v-model="product.cancellation_quantity"
                                      v-if="product.product_type !== 'promoProduct'"
                                      @input="processQuantityChange(product), $v.cancellationData.sale.products.$each[product_index].$touch()"
                                      :error="$v.cancellationData.sale.products.$each[product_index].$error"
                                      :disable="!isNewRequest || isSameDayCancellation || isEsacCancellation"
                                      color="black"
                                    >
                                    </q-input>
                                  </td>
                                </tr>
                                </tbody>
                                <tbody
                                  v-if="cancellationData.sale !== undefined && cancellationData.sale !== null && cancellationData.sale.kitting !== undefined"
                                  v-for="(kitting,product_index) in cancellationData.sale.kitting"
                                >
                                <tr align="center">
                                  <td>
                                    <q-btn
                                      round
                                      small
                                      @click="toggleShowKittingProduct(product_index)"
                                    >
                                      <q-icon name="expand_more">
                                      </q-icon>
                                    </q-btn>
                                  </td>
                                  <td align="left">{{kitting.code}}</td>
                                  <td align="left">{{kitting.name}}</td>
                                  <td align="center">{{kitting.quantity}}</td>
                                  <td  v-if="!isLegacy" align="center">{{kitting.available_quantity_snapshot}}</td>
                                  <td align="center">{{kitting.kitting_price.base_cv}}</td>
                                  <td align="center">{{kitting.kitting_price.gmp_price_tax  | formatPriceDouble }}
                                  <td align="center">{{kitting.kitting_price.gmp_price_tax * kitting.available_quantity_snapshot | formatPriceDouble }}</td>
                                  <td align="center">
                                    <q-input
                                      v-model="kitting.cancellation_quantity"
                                      v-if="kitting.product_type !== 'promoProduct'"
                                      @input="processQuantityChange(kitting), $v.cancellationData.sale.kitting.$each[product_index].$touch()"
                                      :error="$v.cancellationData.sale.kitting.$each[product_index].$error"
                                      :disable="!isNewRequest || isSameDayCancellation || isEsacCancellation"
                                      color="black"
                                    >
                                    </q-input>
                                  </td>
                                </tr>
                                <tr
                                  v-for="(productInKitting, kitting_index) in kitting.kitting_products"
                                  v-if="!hideKittingItems.includes(product_index)"
                                  class="bg-green-1">
                                  <td></td>
                                  <td align="left">{{productInKitting.product.sku}}</td>
                                  <td align="left">{{productInKitting.product.name}}</td>
                                  <td align="center">{{productInKitting.quantity > 0 ? productInKitting.quantity : productInKitting.foc_qty}}</td>
                                  <td  v-if="!isLegacy" align="center">{{productInKitting.available_quantity_snapshot}}</td>
                                  <td align="center">{{productInKitting.product.base_price.base_cv}}</td>
                                  <td align="center">{{productInKitting.product.base_price.average_price_unit | formatPriceDouble }}
                                  <td align="center">{{productInKitting.product.base_price.total| formatPriceDouble }}</td>
                                  <td align="center">
                                    <q-input
                                      v-model="productInKitting.cancellation_quantity"
                                      @input="processQuantityChange(productInKitting, kitting), $v.cancellationData.sale.kitting.$each[product_index].kitting_products.$each[kitting_index].$touch()"
                                      :error="$v.cancellationData.sale.kitting.$each[product_index].kitting_products.$each[kitting_index].$error"
                                      :disable="!isNewRequest || isSameDayCancellation || isEsacCancellation"
                                      color="black"
                                    >
                                    </q-input>
                                  </td>
                                </tr>
                                </tbody>
                                <tbody>
                                <tr
                                  v-if="cancellationData.sale !== undefined && cancellationData.sale !== null && cancellationData.sale.promotions !== undefined"
                                  v-for="(promo, promo_index) in cancellationData.sale.promotions">
                                  <td></td>
                                  <td align="left">{{promo.sku}}</td>
                                  <td align="left">{{promo.name}}</td>
                                  <td align="center">{{promo.quantity}}</td>
                                  <td  v-if="!isLegacy" align="center">{{promo.available_quantity_snapshot}}</td>
                                  <td align="center">{{promo.base_price.base_cv}}</td>
                                  <td align="center">{{promo.base_price.average_price_unit | formatPriceDouble }}</td>
                                  <td align="center">{{promo.base_price.total | formatPriceDouble }}</td>
                                  <td align="center">
                                    <q-input
                                      v-model="promo.cancellation_quantity"
                                      @input="processQuantityChange(promo), $v.cancellationData.sale.promotions.$each[promo_index].$touch()"
                                      :error="$v.cancellationData.sale.promotions.$each[promo_index].$error"
                                      :disable="!isNewRequest || isSameDayCancellation || isEsacCancellation"
                                      color="black"
                                    >
                                    </q-input>
                                  </td>
                                </tr>
                                </tbody>
                                <tbody>
                                <tr
                                  v-if="cancellationData.sale !== undefined && cancellationData.sale !== null && cancellationData.sale.esac_vouchers !== undefined"
                                  v-for="(esac_vouchers,exac_index) in cancellationData.sale.esac_vouchers"
                                >
                                  <td> </td>
                                  <td></td>
                                  <td align="left">{{esac_vouchers.name}}</td>
                                  <td align="center">{{esac_vouchers.quantity}}</td>
                                  <td></td>
                                  <td></td>
                                  <td align="center">{{esac_vouchers.base_price.gmp_price_tax * -1 | formatPriceDouble }}
                                  <td align="center">{{esac_vouchers.base_price.gmp_price_tax * esac_vouchers.quantity * -1 | formatPriceDouble  }}</td>
                                  <td></td>
                                </tr>
                                </tbody>
                              </table>
                            </q-card-main>
                          </q-card>
                        </div>
                      <!--<div class="row"><pre>{{cancellationData.sale_cancellation.total_amount}}</pre><pre>{{$v}}</pre></div>-->
                    </div>
                </div>
              <layout-modal refs="productCancellationModal"
                            urlResetPathName=""
                            title="Tax Invoice"
                            :shadow="false"
                            minWidth="70vw"
                            minHeight="90vh"
                            footerButtonOne="Confirm"
                            footerButtonTwo="Close"
                            :noBackdropDismiss="true"
                            classes="transparent text-black">
                <template slot="modal-data" slot-scope="props">
                  <tax-invoice-search-form
                    v-if="memberDetails !== undefined && memberDetails !== null && memberDetails.details !== null && memberDetails.details !== undefined"
                    v-bind:memberDetails="memberDetails"
                    v-bind:selectInvoice="selectInvoice"
                    :isSalesCancellation="true"
                  ></tax-invoice-search-form>
                </template>
              </layout-modal>
            </template>
        </basic-form>
      <!--<div><pre>{{cancellationData}}</pre></div>-->
        <q-loader :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import Vue from 'vue'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { DatesMixin, MasterDataTransformarMixin, GeneralsMixin, SetFormFieldErrorsMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import taxInvoiceSearchForm from 'src/application/sales/components/forms/taxInvoiceSearchForm'
  import { required } from 'vuelidate/lib/validators'
  import { openURL, Dialog } from 'quasar'
  // const REQUEST = 'REQUEST'
  // const RESPONSE = 'RESPONSE'

  export default {
    name: 'sales-cancellation-area',
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin, SetFormFieldErrorsMixin],
    components: {
      generalHeader,
      basicForm,
      qLoader,
      errorsModal,
      layoutModal,
      taxInvoiceSearchForm
    },
    props: ['cancellationID'],
    data: () => ({
      taxInvoiceNumber: '',
      isLegacy: false,
      totalCancellationAmount: 0.00,
      creditNote: '',
      currentStep: '',
      isDecline: false,
      isBuyBackPolicy: false,
      isNewRequest: false,
      hideKittingItems: [],
      showPromoItems: [],
      rejectReason: '',
      isSameDayCancellation: false,
      isEsacCancellation: false,
      enableBuyBackAmountField: false,
      cancellationData: {
        sale_cancellation: {
          user_id: '',
          cancellation_type_id: '',
          cancellation_mode_id: '',
          cancellation_reason_id: '',
          transaction_location_id: '',
          stock_location_id: '',
          cw: {},
          cw_id: '',
          remarks: '',
          invoice_id: '',
          total_buy_back_amount: 0.00,
          total_amount: 0.00
        },
        buy_back_percentage: 0.00,
        sale_cancellation_type: undefined,
        sale: {
          id: '',
          products: [],
          kitting: [],
          promotions: []
        },
        member: undefined,
        workflow: undefined,
        invoice: undefined,
        credit_note: undefined,
        isProcessing: false,
        commission_week: undefined
      }
    }),
    mounted () {
      // Merge mixin master array
      this.master.keys = [
        'sale_cancellation_mode',
        'sale_cancellation_reason'
      ]
      this.initSetupArea()
    },
    validations () {
      let def = {
        cancellationData: {
          sale: {
            products: {
              $each: {
                cancellation_quantity: {
                  quantity_validation (val, elm) {
                    return val <= elm.available_quantity_snapshot
                  }
                }
              }
            },
            kitting: {
              $each: {
                cancellation_quantity: {
                  quantity_validation (val, elm) {
                    return val <= elm.available_quantity_snapshot
                  }
                },
                kitting_products: {
                  $each: {
                    cancellation_quantity: {
                      quantity_validation (val, elm) {
                        return val <= elm.available_quantity_snapshot
                      }
                    }
                  }
                }
              }
            },
            promotions: {
              $each: {
                cancellation_quantity: {
                  quantity_validation (val, elm) {
                    return val <= elm.available_quantity_snapshot
                  }
                }
              }
            },
            invoice: {
              required
            }
          },
          sale_cancellation: {
            cancellation_mode_id: {
              required
            },
            transaction_location_id: {
              required
            },
            stock_location_id: {
              required
            },
            cancellation_reason_id: {
              required
            },
            total_amount: {
              cancellation (val, elm) {
                return Number(val) > 0.00
              }
            }
          }
        }
      }
      if (this.cancellationData.workflow !== undefined && this.cancellationData.workflow !== null && this.cancellationData.workflow.current_step !== undefined && this.cancellationData.workflow.current_step !== null && this.cancellationData.workflow.current_step.step_data.actions !== undefined && this.cancellationData.workflow.current_step.step_data.actions !== null) {
        def.cancellationData.workflow = {}
        def.cancellationData.workflow.current_step = {}
        def.cancellationData.workflow.current_step.step_data = {}
        def.cancellationData.workflow.current_step.step_data.actions = {
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
        if (this.cancellationData.workflow.current_step.step_data.actions.child !== undefined && this.cancellationData.workflow.current_step.step_data.actions.child !== null && this.cancellationData.workflow.current_step.step_data.actions.show_child) {
          def.cancellationData.workflow.current_step.step_data.actions.child = {
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
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        memberDetails: state => state.membersCMP.memberData.data,
        selectedFilters: state => state.globalCMP.selectedFilters,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        salesCancellationData: state => state.salesCMP.salesCancellationData,
        errors: state => state.globalCMP.errors.data
      }),
      ...mapGetters([
        'locationsOptionsByCountry',
        'currencyLabelByCountry',
        'stocklocationsOptionsByCountry'
      ])
    },
    methods: {
      ...mapActions([
        'getMemberByUserIdAction',
        'getMastersWithKey',
        'getSalesCancellationInvoiceDetailAction',
        'getCommissionWeekSearchAction',
        'createUpdateSalesCancellation',
        'getSalesCancellationDetail',
        'getCountryRelationAction',
        'updateWorkflowAction',
        'downloadTaxInvoicePDF',
        'downloadCreditNotePDF',
        'getStockLocations'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setMemberData: 'SET_MEMBER_DATA'
      }),
      toggleChildVisibility (step) {
        if (step.show_child !== undefined) {
          step.show_child = !step.show_child
        }
      },
      initSetupArea () {
        let query1 = {
          country_id: this.selectedFilters.countryID,
          relations: ['entity.locations', 'currency', 'taxes']
        }
        this.getCountryRelationAction(query1).then(res => {
          if (this.isNewRequest) {
            this.cancellationData.sale_cancellation.transaction_location_id = this.locationsOptionsByCountry[0].value
            this.setStockLocations(this.cancellationData.sale_cancellation.transaction_location_id)
            // this.cancellationData.sale_cancellation.stock_location_id = this.stocklocationsOptionsByCountry[0].value
          }
        })
        if (this.cancellationID !== undefined && this.cancellationID !== null && this.cancellationID !== '') {
          // apparently ok?
          this.loadExistingCancellationData(this.cancellationID)
        } else {
          if (this.salesCancellationData.userID === '') {
            this.invalidRequest()
          } else {
            this.isNewRequest = true
            let query = {
              user_id: this.salesCancellationData.userID
            }
            this.getMemberByUserIdAction(query).then((res) => {
              this.show = true
              if (this.salesCancellationData.searchByTaxInvoice) {
                this.selectInvoice(this.salesCancellationData.invoiceID)
              }
              let query = {
                filter_type: 'current'
              }
              this.getCommissionWeekSearchAction(query).then((res) => {
                this.cancellationData.sale_cancellation.cw = res.data !== undefined && res.data !== null && res.data.length > 0 ? res.data[0] : undefined
                this.cancellationData.sale_cancellation.cw_id = res.data !== undefined && res.data !== null && res.data.length > 0 ? res.data[0].id : ""
              })
            })
          }
        }
      },
      setStockLocations (locationId) {
        let query = {
          location_id : locationId
        }
        if (!this.lockSalesOrder) {
          this.cancellationData.sale_cancellation.stock_location_id = ''
        }
        this.getStockLocations(query).then(() => {
          this.cancellationData.sale_cancellation.stock_location_id = this.stocklocationsOptionsByCountry[0].value
        })
      },
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Sales Order Cancellation List'})
        }, 1500)
      },
      submitApprovalStep (field) {
        // this.workflowMixinData.remark = 'semething'
        if (field.buy_back_amount !== undefined) {
          field.buy_back_amount = this.cancellationData.sale_cancellation.total_buy_back_amount
        }
        let payload = {
          workflow_tracking_step_id: this.cancellationData.workflow.current_step.id,
          workflow_remark: this.rejectReason,
          tracking_step_input: field
        }
        this.updateWorkflowAction(payload).then((res) => {
          if (res !== undefined && res !== null && res.even_result !== null && res.even_result !== undefined && res.even_result.length > 0) {
            this.manipulateDetailLoadingResponse(res.even_result[0])
          }
        })
      },
      processForm: function (formFieldData) {
        if (this.isNewRequest) {
          this.$v.cancellationData.$touch()
          return new Promise((resolve, reject) => {
            if (!this.$v.cancellationData.$error) {
              Dialog.create({
                title: this.$t('sale.cancellation.detail.dialog.confirmSave.title'),
                message: this.$t('sale.cancellation.detail.dialog.confirmSave.message'),
                noEscDismiss: true,
                noBackdropDismiss: true,
                position: 'top',
                ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
                cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel')
              }).then(()=> {
                let submitData = this.cancellationData
                this.createUpdateSalesCancellation(submitData).then((res) => {
                  if( res !== null && res !== undefined && res.sale_cancellation !== null && res.sale_cancellation !== undefined) {
                    this.isNewRequest = false
                    this.setNotification({
                      title: this.$t('sale.cancellation.detail.notification.saveSuccess.title'),
                      message: this.$t('sale.cancellation.detail.notification.saveSuccess.message'),
                      type: 'positive'
                    })
                    this.$router.replace({
                      name: 'Sales Cancellation Detail',
                      params: {cancellationID: res.sale_cancellation.id}
                    })
                    this.manipulateDetailLoadingResponse(res)
                  }
                  resolve(res)
                }).catch(error => {
                  reject(error)
                })
              }).catch((error)=>{
              })
            } else {
              this.setNotification({
                title: this.$t('sale.cancellation.detail.notification.saveFailed.title'),
                message: this.$t('sale.cancellation.detail.notification.errorsFound.message'),
                type: 'negative'
              })
              reject(this.$v.cancellationData.$error)
            }
          }).catch(error => {
            if (error['sale_cancellation.invoice_id'] !== undefined && error['sale_cancellation.invoice_id'] !== null && error['sale_cancellation.invoice_id'].length > 0){
              this.setNotification({
                title: this.$t('sale.cancellation.detail.notification.saveFailed.title'),
                message: error['sale_cancellation.invoice_id'][0],
                type: 'negative'
              })
            }
          })
        } else {
          this.setNotification({
            title: this.$t('sale.cancellation.detail.notification.saveFailed.title'),
            message: this.$t('sale.cancellation.detail.notification.existingCancellation.message'),
            type: 'negative'
          })
        }
      },
      loadExistingCancellationData (cancellationID) {
        let query = {
          sales_cancellation_id: cancellationID
        }
        this.getSalesCancellationDetail(query).then((res) => {
          let returnResult = res
          if (returnResult.sale_cancellation !== undefined && returnResult.sale_cancellation !== null) {
            query = {
              user_id: returnResult.sale_cancellation.user_id
            }
            this.getMemberByUserIdAction(query)
          }
          this.manipulateDetailLoadingResponse(returnResult)
        })
      },
      manipulateDetailLoadingResponse (returnResult) {
        this.isNewRequest = false
        this.cancellationData = Object.assign(JSON.parse(JSON.stringify(returnResult)))
        if (this.cancellationData.sale_cancellation !== null && this.cancellationData.sale_cancellation !== undefined) {
          this.setStockLocations(this.cancellationData.sale_cancellation.transaction_location_id)
        }
        this.isLegacy = this.cancellationData.sale_cancellation.legacy_invoice_id !== null && this.cancellationData.sale_cancellation.legacy_invoice_id !== undefined
        if (this.cancellationData.sale !== undefined && this.cancellationData.sale !== null && this.cancellationData.sale.invoice !== undefined && this.cancellationData.sale.invoice !== null) {
          this.taxInvoiceNumber = this.cancellationData.sale.invoice.invoice_number
        }
        if (this.cancellationData.sale_cancellation.cancellation_type !== undefined && this.cancellationData.sale_cancellation.cancellation_type !== null) {
          this.isBuyBackPolicy = this.cancellationData.sale_cancellation.cancellation_type.title.toLowerCase() === 'buy back'
        }
        if (this.cancellationData.workflow !== undefined && this.cancellationData.workflow !== null) {
          if (this.cancellationData.workflow.workflow !== undefined && this.cancellationData.workflow.workflow !== null) {
            this.cancellationData.workflow = this.cancellationData.workflow.workflow
          }
          if (this.cancellationData.workflow.current_step !== undefined && this.cancellationData.workflow.current_step !== null) {
            // change this to detect from dynamic field later on
            this.enableBuyBackAmountField = this.cancellationData.workflow.current_step.step_data.actions !== undefined && this.cancellationData.workflow.current_step.step_data.actions.buy_back_amount_editable !== undefined && this.cancellationData.workflow.current_step.step_data.actions.buy_back_amount_editable
            Vue.nextTick(() => {
              this.$refs.stepper.goToStep(this.cancellationData.workflow.current_step.step)
              this.calculateTotalReturnAmount()
            })
          }
        }
      },
      selectInvoice (selectedInvoiceID) {
        let query = {
          country_id: this.selectedFilters.countryID,
          user_id: this.memberDetails.details.user_id,
          invoice_id: selectedInvoiceID,
          method: 'normal'
        }
        this.getSalesCancellationInvoiceDetailAction(query).then((res) => {
          let returnResult = res
          if (returnResult.sale !== undefined && returnResult.sale !== null) {
            this.cancellationData.sale = returnResult.sale
            if (returnResult.sale.invoice !== undefined && returnResult.sale.invoice !== null) {
              this.taxInvoiceNumber = returnResult.sale.invoice.invoice_number
              this.cancellationData.sale_cancellation.invoice_id = returnResult.sale.invoice.id
            }
          }
          if (returnResult.sale_cancellation_type !== undefined && returnResult.sale_cancellation_type !== null) {
            this.cancellationData.sale_cancellation.cancellation_type_id = returnResult.sale_cancellation_type.id
            this.cancellationData.sale_cancellation.user_id = this.memberDetails.details.user_id
          }
          if (returnResult.workflow !== undefined && returnResult.workflow !== null) {
            this.cancellationData.workflow = returnResult.workflow
          }
          if (returnResult.member !== undefined && returnResult.member !== null) {
            this.cancellationData.member = returnResult.member
          }
          if (returnResult.buy_back_percentage !== undefined && returnResult.buy_back_percentage !== null) {
            this.cancellationData.buy_back_percentage = returnResult.buy_back_percentage
          }
          if (returnResult.sale_cancellation_type !== undefined && returnResult.sale_cancellation_type !== null) {
            this.isBuyBackPolicy = returnResult.sale_cancellation_type.title.toLowerCase() === 'buy back'
            if (returnResult.sale_cancellation_type.title.toLowerCase() === 'same day') {
              this.processCancellationModeChange('FULL')
              let cancellationModeCode = this.masterDataOptionsCreator('sale_cancellation_mode').find(function (element) {
                return element.label.toLowerCase() === 'full'
              })
              this.cancellationData.sale_cancellation.cancellation_mode_id = cancellationModeCode !== undefined ? cancellationModeCode.value : ''
              this.isSameDayCancellation = true
            } else {
              this.isEsacCancellation = false
              this.isSameDayCancellation = false
              if (this.cancellationData.sale.is_esac_redemption === 1) {
                // esac redemption will always be full cancellationthis.processCancellationModeChange('FULL')
                let cancellationModeCode = this.masterDataOptionsCreator('sale_cancellation_mode').find(function (element) {
                  return element.label.toLowerCase() === 'full'
                })
                this.cancellationData.sale_cancellation.cancellation_mode_id = cancellationModeCode !== undefined ? cancellationModeCode.value : ''
                this.isEsacCancellation = true
              }
            }
          }
          // if selection mode has been selected, make sure parse selection accordingly
          if (this.cancellationData.sale_cancellation.cancellation_mode_id !== '') {
            let cancellationModeCode = this.masterDataOptionsCreator('sale_cancellation_mode').find((element) => {
              return element.value === this.cancellationData.sale_cancellation.cancellation_mode_id
            })
            if (cancellationModeCode !== undefined && cancellationModeCode !== null) {
              this.processCancellationModeChange(cancellationModeCode.label)
            }
          }
        }).catch(error => {
          this.setNotification({
            title: this.$t('sale.cancellation.detail.notification.invoiceLoadFail.title'),
            message: error.invoice_id[0],
            type: 'negative'
          })
        })
      },
      processQuantityChange (product, productOfKitting = undefined) {
        // if product is item in kitting, the kitting master will be passed in
        if (productOfKitting !== undefined) {
          // default to a max number instead of 0, so that the minQtyInKitting will be calculated correctly
          let minQtyInKitting = Number.MAX_VALUE
          productOfKitting.kitting_products.forEach((element) => {
            let qty = element.quantity > 0 ? element.quantity : element.foc_qty
            // calculate how many full kit has been returned based on the item quantity per kitting
            let returnKitCount = Math.floor(element.cancellation_quantity / (qty/productOfKitting.quantity))
            // obtain the smallest value of return kit count
            minQtyInKitting = returnKitCount < minQtyInKitting ? returnKitCount : minQtyInKitting
          })
          // set the smallest full kit return count as the kitting master return quantity
          productOfKitting.cancellation_quantity = minQtyInKitting
        } else if (product.kitting_products !== undefined && product.kitting_products !== null) {
          // when changing number for kitting master, traverse all kitting items to update their quantity according to
          // item quantity per kit
          product.kitting_products.forEach((element) => {
            let qty = element.quantity > 0 ? element.quantity : element.foc_qty
            let qtyPerKit = qty / product.quantity
            element.cancellation_quantity = product.cancellation_quantity * qtyPerKit
          })
        }
        this.calculateCancellationMode()
        this.calculateTotalReturnAmount()
      },
      calculateKittingProductQuantity () {
        // potentially not needed anymore
        this.cancellationData.sale.kitting.forEach((product) => {
          let minQtyInKitting = 99999
          product.kitting_products.forEach((kitting) => {
            let qtyPerKit = kitting.quantity
            let returnQtyInKit = Math.floor(kitting.return_quantity / qtyPerKit)
            minQtyInKitting = returnQtyInKit < minQtyInKitting ? returnQtyInKit : minQtyInKitting
          })
          product.return_quantity = minQtyInKitting
        })
      },
      calculateCancellationMode () {
        let isPartialCancellation = false
        // loop through all 3 lists and check if the cancellation quantity is the same as the available quantity
        for (let i = 0; i < this.cancellationData.sale.products.length && !isPartialCancellation; i++) {
          let product = this.cancellationData.sale.products[i]
          isPartialCancellation = Number(product.cancellation_quantity) !== Number(product.available_quantity_snapshot)
        }
        for (let i = 0; i < this.cancellationData.sale.kitting.length && !isPartialCancellation; i++) {
          let product = this.cancellationData.sale.kitting[i]
          isPartialCancellation = Number(product.cancellation_quantity) !== Number(product.available_quantity_snapshot)
        }
        if (this.cancellationData.sale.promotions !== undefined && this.cancellationData.sale.promotions !== null) {
          for (let i = 0; i < this.cancellationData.sale.promotions.length && !isPartialCancellation; i++) {
            let product = this.cancellationData.sale.promotions[i]
            isPartialCancellation = Number(product.cancellation_quantity) !== Number(product.available_quantity_snapshot)
          }
        }
        // look through the master data list to find partial/full cancellation code
        let cancellationModeCode = this.masterDataOptionsCreator('sale_cancellation_mode').find(function (element) {
          return isPartialCancellation ? element.label.toLowerCase() === 'partial' : element.label.toLowerCase() === 'full'
        })
        this.cancellationData.sale_cancellation.cancellation_mode_id = cancellationModeCode !== undefined ? cancellationModeCode.value : ''
      },
      processCancellationModeChange (selection) {
        if (selection.toLowerCase() === 'full') {
          // set all loose item to full quantity
          this.cancellationData.sale.products.forEach((product) => {
            product.cancellation_quantity = product.available_quantity_snapshot
          })
          // set all kitting master to full quantity
          this.cancellationData.sale.kitting.forEach((kitting) => {
            kitting.cancellation_quantity = kitting.available_quantity_snapshot
            // set all kitting items to full quantity
            kitting.kitting_products.forEach((productInKitting) => {
              productInKitting.cancellation_quantity = productInKitting.available_quantity_snapshot
            })
          })
          // set all promotion items to full quantity
          if (this.cancellationData.sale.promotions !== undefined && this.cancellationData.sale.promotions !== null) {
            this.cancellationData.sale.promotions.forEach((element) => {
              element.cancellation_quantity = element.available_quantity_snapshot * 1
            })
          }
        } else {
          this.cancellationData.sale.products.forEach((product) => {
            product.cancellation_quantity = 0
          })
          this.cancellationData.sale.kitting.forEach((kitting) => {
            kitting.cancellation_quantity = 0
            kitting.kitting_products.forEach((productInKitting) => {
              productInKitting.cancellation_quantity = 0
            })
          })
          if (this.cancellationData.sale.promotions !== undefined && this.cancellationData.sale.promotions !== null) {
            this.cancellationData.sale.promotions.forEach((element) => {
              element.cancellation_quantity = 0
            })
          }
        }
        this.calculateTotalReturnAmount()
      },
      calculateTotalReturnAmount () {
        this.cancellationData.sale_cancellation.total_amount = this.cancellationData.sale.products.reduce((total, product) => total + (parseFloat(product.base_price.gmp_price_tax) * parseInt(product.cancellation_quantity)), 0)
        // this.cancellationData.cancellationData.sale_cancellation.total_amount += this.cancellationData.promotions.reduce((total, product) => total + (product.base_price.nmp_price / product.quantity * product.cancellation_quantity), 0)
        if (this.cancellationData.sale.promotions !== undefined && this.cancellationData.sale.promotions !== null) {
          this.cancellationData.sale_cancellation.total_amount += this.cancellationData.sale.promotions.reduce((total, product) => total + (parseFloat(product.base_price.gmp_price_tax) *  parseInt(product.cancellation_quantity)), 0)
        }
        this.cancellationData.sale.kitting.forEach((kitting) => {
          this.cancellationData.sale_cancellation.total_amount += kitting.kitting_products.reduce((total, product) => parseInt(product.cancellation_quantity) === parseInt(product.quantity) ? total + parseFloat(product.product.base_price.total) : total + parseFloat(product.product.base_price.average_price_unit) * parseInt(product.cancellation_quantity), 0)
        })
        if (this.cancellationData.sale !== null && this.cancellationData.sale !== undefined && this.cancellationData.sale.is_esac_redemption === 1) {
          this.cancellationData.sale_cancellation.total_amount = this.cancellationData.sale_cancellation.total_amount - this.cancellationData.sale.total_esac_voucher_value
        }
        if (this.isNewRequest) {
          this.cancellationData.sale_cancellation.total_buy_back_amount = this.cancellationData.sale_cancellation.total_amount * this.cancellationData.buy_back_percentage / 100
        }
      },
      actions (row, type) {
        if (this.isNewRequest) {
          if (type === 'productCancellation') {
            // From mixins
            this.openCloseModal({name: 'productCancellationModal', status: true})
          }
        }
      },
      toggleShowKittingProduct (productIndex) {
        if (this.hideKittingItems.includes(productIndex)) {
          this.hideKittingItems.pop(productIndex)
        } else {
          this.hideKittingItems.push(productIndex)
        }
      },
      openDocument (documentType) {
        if (documentType === 'invoice') {
          let query = {
            invoice_id: this.cancellationData.sale.invoice.id
          }
          this.downloadTaxInvoicePDF(query).then((res) => {
            let pdfUrl = res.download_link
            if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
              openURL(pdfUrl)
            }
          })
        } else if (documentType === 'creditNote') {
          let query = {
            credit_note_id: this.cancellationData.sale_cancellation.credit_note.id,
            section: 'sales_cancellation'
          }
          this.downloadCreditNotePDF(query).then((res) => {
            let pdfUrl = res.download_link
            if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
              openURL(pdfUrl)
            }
          })
        }
      },
      handleTriggerActions (workflowField, action) {
        switch (workflowField.trigger) {
          case 'updateRejectionReason':
            this.rejectReason = workflowField.value
            break
          case 'sendDecline':
            this.$v.cancellationData.workflow.current_step.$touch()
            if (!this.$v.cancellationData.workflow.current_step.$error) {
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
          case 'sendApproval':
          case 'generateCN':
          case 'processRefund':
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
      }
    }
  }
</script>
