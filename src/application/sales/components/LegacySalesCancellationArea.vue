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
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.taxInvoice')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            class="full-width"
                                                            :error="$v.cancellationData.sale.legacy_invoice.invoice_number.$error  || setError('invoice_id','type.exp')"
                                                            :error-label="$v.cancellationData.sale.legacy_invoice.invoice_number.$error ? $t('sale.cancellation.detail.validation.selectInvoice') : setError('invoice_id','type.msg')"
                                                            helper="*"
                                                          >
                                                           <q-input
                                                             :disable="!isNewRequest"
                                                             v-model="cancellationData.sale.legacy_invoice.invoice_number"
                                                           ></q-input>
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main class="bordered bg-grey-4 fit">
                                                        <q-list no-border>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.cancellation.detail.label.transactionDate')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase">
                                                                <q-field
                                                                  :error="$v.cancellationData.sale.legacy_invoice.invoice_date.$error"
                                                                  :error-label="$t('sale.cancellation.list.error.laterThanCurrentDate')"
                                                                  helper="*"
                                                                >
                                                                  <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                                                              :disable="!isNewRequest"
                                                                              v-model="cancellationData.sale.legacy_invoice.invoice_date"
                                                                  />
                                                                </q-field>
                                                              </q-item-tile>
                                                            </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                          <q-item-main>
                                                            <q-item-tile label>{{$t('sale.cancellation.detail.label.cw')}}</q-item-tile>
                                                            <q-item-tile sublabel class="uppercase">
                                                              <q-field
                                                                :error="$v.cancellationData.sale.legacy_invoice.cw_id.$error"
                                                                :error-label="$t('bonus.cwIncome.errorMessage.selectCommissionWeek')"
                                                                helper="*"
                                                              >
                                                                <q-select
                                                                  v-model="cancellationData.sale.legacy_invoice.cw_id"
                                                                  :options="commissionWeeks"
                                                                  filter
                                                                  :disable="!isNewRequest"
                                                                  color="black"
                                                                  :filterPlaceholder="$t('bonus.cwIncome.placeholder.selectCommissionWeek')"
                                                                  @input="(item) => selected(item, null, 'cw')"
                                                                ></q-select>
                                                              </q-field>
                                                            </q-item-tile>
                                                          </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                          <q-item-main>
                                                            <q-item-tile label>{{$t('sale.cancellation.detail.label.transactionLocation')}}</q-item-tile>
                                                            <q-item-tile sublabel class="uppercase">
                                                              <q-field
                                                                :error="$v.cancellationData.sale.legacy_invoice.transaction_location_id.$error"
                                                                :error-label="$t('sale.cancellation.detail.validation.selectTransactionLocation')"
                                                                helper="*"
                                                              >
                                                                <q-select
                                                                  v-model="cancellationData.sale.legacy_invoice.transaction_location_id"
                                                                  :options="locationsOptionsByCountry"
                                                                  :disable="!isNewRequest"
                                                                />
                                                              </q-field>
                                                            </q-item-tile>
                                                          </q-item-main>
                                                          </q-item>
                                                        </q-list>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline v-if="cancellationData.legacy_sale_cancellation.credit_note !== undefined && cancellationData.legacy_sale_cancellation.credit_note != null">
                                                      <q-item-main>
                                                        <q-item-tile label class="text-primary">{{$t('sale.cancellation.detail.label.creditNote')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-btn color="primary" @click="openDocument('creditNote')">
                                                            {{cancellationData.legacy_sale_cancellation.credit_note.credit_note_number}}
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
                                                      <q-item-tile label>{{$t('sale.cancellation.detail.label.transactionLocation')}}</q-item-tile>
                                                      <q-item-tile sublabel class="uppercase">
                                                        <q-field
                                                          :error="$v.cancellationData.legacy_sale_cancellation.transaction_location_id.$error"
                                                          :error-label="$t('sale.cancellation.detail.validation.selectTransactionLocation')"
                                                          helper="*"
                                                        >
                                                          <q-select
                                                          v-model="cancellationData.legacy_sale_cancellation.transaction_location_id"
                                                          :options="locationsOptionsByCountry"
                                                          :disable="!isNewRequest"
                                                          @input="cancellationData.location_id = cancellationData.legacy_sale_cancellation.transaction_location_id,setStockLocations(cancellationData.legacy_sale_cancellation.transaction_location_id)"
                                                          />
                                                        </q-field>
                                                      </q-item-tile>
                                                    </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.stockLocation')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            :error="$v.cancellationData.legacy_sale_cancellation.stock_location_id.$error"
                                                            :error-label="$t('sale.cancellation.detail.validation.selectStockLocation')"
                                                            helper="*"
                                                          >
                                                            <q-select
                                                              v-model="cancellationData.legacy_sale_cancellation.stock_location_id"
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
                                                          {{cancellationData.legacy_sale_cancellation.cw !== undefined && cancellationData.legacy_sale_cancellation.cw !== null && cancellationData.legacy_sale_cancellation.cw.cw_name !== undefined ? cancellationData.legacy_sale_cancellation.cw.cw_name : 'N/A'}}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.cancellation.detail.label.cancellationReason')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            :error="$v.cancellationData.legacy_sale_cancellation.cancellation_reason_id.$error"
                                                            :error-label="$t('sale.cancellation.detail.validation.selectCancellationReason')"
                                                            helper="*"
                                                          >
                                                            <q-select
                                                              v-model="cancellationData.legacy_sale_cancellation.cancellation_reason_id"
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
                                                                v-model="cancellationData.legacy_sale_cancellation.remarks"
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
                                            <q-item-tile sublabel class="text-black text-right q-headline"><p>{{cancellationData.legacy_sale_cancellation.total_cancellation_amount | formatPriceDouble }}</p></q-item-tile>
                                          </q-item-main>
                                        </q-item>
                                        <q-item tag="label">
                                          <q-item-main>
                                            <q-item-tile label class="text-red text-left q-subheading">{{$t('sale.cancellation.detail.label.buyBackAmount')}}({{currencyLabelByCountry}})</q-item-tile>
                                            <q-item-tile sublabel class="text-black text-right q-headline justify-end">
                                                <q-input v-if="enableBuyBackAmountField" align="right" v-model="cancellationData.legacy_sale_cancellation.total_buy_back_amount"
                                                         :disable="!enableBuyBackAmountField">
                                                </q-input>
                                                <p v-else >{{cancellationData.legacy_sale_cancellation.total_buy_back_amount | formatPriceDouble}}</p>
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
                          <q-card color="white" class="full-height full-width">'
                            <q-card-title class="text-black">Product Cancellation</q-card-title>
                            <q-card-main>
                              <div class="action-bar" v-if="isNewRequest">
                                <div class="row">
                                  <div class="col-lg-12">
                                    <div class="row items-baseline justify-start gutter-sm">
                                      <div class="col-lg-4">
                                        <q-input v-model="terms"
                                                 autofocus
                                                 inverted
                                                 :disable="!isNewRequest"
                                                 :loading="isProcessingTable"
                                                 color="grey-7"
                                                 :after="[
                                        {
                                          icon: 'search',
                                          error: true,
                                          handler () {
                                            // do something...
                                          }
                                        }
                                      ]"
                                                 v-on:keyup.enter="search()"
                                                 placeholder="Scan Barcode Here ...">
                                        </q-input>
                                      </div>
                                      <div class="col-lg-8">
                                        <div class="row justify-between gutter-sm">
                                          <div class="col-lg-3 col-md-6 col-xs-6">
                                            <q-btn class="fit"
                                                   outline
                                                   icon="add"
                                                   :disable="!isNewRequest"
                                                   color="positive"
                                                   @click="mixActions('productListingModal')">Add
                                            </q-btn>
                                          </div>
                                          <div class="col-lg-3 col-md-6 col-xs-6">
                                            <q-btn @click="removeRowFromCart"
                                                   :disabled="cartSelectedProductIDs.length < 1 &&  cartSelectedKittingIDs.length < 1"
                                                   class="fit" outline icon="delete"
                                                   color="negative">Delete
                                            </q-btn>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div class="content">
                                <div class="row gutter-sm">
                                  <div class="col-lg-12">
                                    <table class="q-table-html fit q-mt-sm bordered fit cell-separator responsive text-center text-black">
                                      <thead class="bg-grey-4">
                                        <tr>
                                          <th></th>
                                          <th align="left" width="20%">{{$t('sale.cancellation.detail.tableLabel.productCode')}}</th>
                                          <th align="left">{{$t('sale.cancellation.detail.tableLabel.productName')}}</th>
                                          <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.totalCV')}}</th>
                                          <th align="center" width="13%">{{$t('sale.cancellation.detail.tableLabel.unitPrice')}}</th>
                                          <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.cancellationQty')}}</th>
                                          <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.totalPrice')}}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr
                                          v-if="cancellationData.sale !== undefined && cancellationData.sale !== null && cancellationData.sale.products !== undefined"
                                          v-for="(product,product_index) in cancellationData.sale.products"
                                        >
                                          <td align="left">
                                            <q-checkbox v-if="isNewRequest"
                                                        :val="product.product_id"
                                                        v-model="cartSelectedProductIDs"/>
                                          </td>
                                          <td>{{ product.sku }}</td>
                                          <td>{{ product.name }}</td>
                                          <td>
                                            <q-input type="number" v-model="product.base_price.base_cv"
                                                     :disable="!isNewRequest"
                                                     align="center"></q-input>
                                          </td>
                                          <td>
                                            <q-input type="number" v-model="product.base_price.gmp_price_tax"
                                                     :disable="!isNewRequest"
                                                     align="center"
                                                     @input="calculateTotalReturnAmount()"
                                            >
                                            </q-input>
                                          </td>
                                          <td width="10%">
                                            <q-input type="number" v-model="product.cancellation_quantity"
                                                     :disable="!isNewRequest"
                                                     align="center"
                                                     @input="calculateTotalReturnAmount()"
                                            ></q-input>
                                            <!--:error="validator.cancellationData.sale.products.$each[index].quantity.$error"-->
                                          </td>
                                          <td>
                                            {{ product.base_price.gmp_price_tax * product.cancellation_quantity | formatPriceDouble }}
                                          </td>
                                        </tr>
                                      </tbody>
                                      <tbody
                                        v-if="cancellationData.sale !== undefined && cancellationData.sale !== null && cancellationData.sale.kitting !== undefined"
                                        v-for="(kitting,product_index) in cancellationData.sale.kitting"
                                      >
                                        <tr align="center">
                                          <td align="left">
                                            <q-checkbox v-if="isNewRequest"
                                                        :val="kitting.kitting_id"
                                                        v-model="cartSelectedKittingIDs"/>
                                            <q-btn color="blue" flat
                                                   @click="mixActions('kittingProductsListModal', 'kitting', kitting.kitting_products, kitting.name, kitting.code, kitting.kitting_id, kitting.cancellation_quantity), kittingDefaultTab = 'kitComponents'">
                                              <q-icon name="add_circle_outline"></q-icon>
                                            </q-btn>
                                          </td>
                                          <td>{{kitting.code}}</td>
                                          <td>{{kitting.name}}</td>
                                          <td>
                                            <q-input type="number" v-model="kitting.kitting_price.base_cv"
                                                     :disable="!isNewRequest"
                                                     align="center"></q-input>
                                          </td>
                                          <td>
                                            <q-input type="number" v-model="kitting.kitting_price.gmp_price_tax"
                                                     :disable="!isNewRequest"
                                                     align="center"
                                                     @input="calculateTotalReturnAmount()"
                                            >
                                            </q-input>
                                          </td>
                                          <td width="10%">
                                            <q-input type="number" v-model="kitting.cancellation_quantity"
                                                     :disable="!isNewRequest"
                                                     align="center"
                                                     @input="calculateTotalReturnAmount()"
                                            ></q-input>
                                            <!--:error="validator.cancellationData.sale.products.$each[index].quantity.$error"-->
                                          </td>
                                          <td align="center">{{kitting.kitting_price.gmp_price_tax * kitting.cancellation_quantity | formatPriceDouble }}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <layout-modal refs="kittingProductsListModal"
                                            urlResetPathName=""
                                            :title="kittingModalData.kittingCode + ' : ' +  kittingModalData.title"
                                            :subTitle="'Total set Quantiy : ' + kittingModalData.kittingQty"
                                            :shadow="false"
                                            minWidth="70vw"
                                            minHeight="90vh"
                                            footerButtonTwo="Close"
                                            :headerSearchBar="false"
                                            :noEscDismiss="false"
                                            :search="true"
                                            classes="transparent text-black">
                                <template slot="modal-data" slot-scope="props">
                                  <div class="pd-20">
                                    <q-tabs v-model="kittingDefaultTab" class="no-shadow" inverted color="grey-7" align="left">
                                      <q-tab default name="kitComponents"
                                             slot="title"
                                             :label="$t('Common.tab.items.label.kitComponents')"/>
                                      <q-tab name="redemption" slot="title"
                                             :hidden="!kittingRedemptionEligibility(kittingModalData.items)"
                                             :label="$t('Common.tab.items.label.redemption')"/>
                                      <q-tab-pane name="kitComponents" class="no-border bg-white sales-items shadow-1 no-padding">
                                        <!-- kitComponents-->
                                        <table class="q-table-html fit cell-separator">
                                          <thead class="bg-grey-2">
                                          <tr>
                                            <th>{{$t('Common.tab.items.tableLabel.productCode')}}</th>
                                            <th>{{$t('Common.tab.items.tableLabel.productName')}}</th>
                                            <th>{{$t('Common.tab.items.tableLabel.Quantity')}}</th>
                                          </tr>
                                          </thead>
                                          <tbody>
                                          <tr v-for="item in kittingModalData.items">
                                            <td>{{ item.product.sku }}</td>
                                            <td>{{ item.product.name }}</td>
                                            <td>{{ !isNewRequest ? item.quantity !== 0 ? item.quantity * kittingModalData.kittingQty : item.foc_qty * kittingModalData.kittingQty : item.quantity !== 0 ? item.quantity : item.foc_qty
                                              }} <span class="text-grey-5" v-if="item.foc_qty > 0"> (FOC) </span>
                                            </td>
                                          </tr>
                                          </tbody>
                                        </table>
                                        <!-- kitComponents End -->
                                      </q-tab-pane>
                                      <q-tab-pane name="redemption"
                                                  v-if="kittingRedemptionEligibility(kittingModalData.items)"
                                                  class="no-border bg-white sales-items shadow-1 no-padding">
                                        <!-- Redemption-->
                                        <div class="col-lg-12 sizes-area">
                                          <sizes-attributes :salesData="salesData"
                                                            :itemsData="kittingModalData.items"
                                                            :kittingQty="kittingModalData.kittingQty"
                                                            :tableTh="tableTh"></sizes-attributes>
                                          <!-- Todo Remove -->
                                          <!--<pre>{{ salesData.selected.additional_requirements }}</pre>-->
                                        </div>
                                        <!-- Redemption End -->
                                      </q-tab-pane>
                                    </q-tabs>
                                  </div>
                                </template>
                              </layout-modal>
                              <layout-modal refs="productListingModal"
                                            urlResetPathName=""
                                            title="Product Listing"
                                            :shadow="false"
                                            minWidth="70vw"
                                            minHeight="90vh"
                                            footerButtonOne="Confirm"
                                            footerButtonTwo="Close"
                                            :headerSearchBar="true"
                                            :noEscDismiss="false"
                                            :search="true"
                                            classes="transparent text-black">
                                <template slot="modal-data" slot-scope="props">
                                  <listing-search-form v-if="cancellationData.location_id !== '' && cancellationData.location_id !== null && cancellationData.location_id !== undefined"
                                                       v-bind:salesData="cancellationData"
                                                       v-bind:memberDetails="memberDetails"
                                                       :addToCart="addToCart"></listing-search-form>
                                </template>
                              </layout-modal>
                              <q-loader :visible="isProcessingCart"></q-loader>
                            </q-card-main>
                          </q-card>
                        </div>
                      <!--<div class="row"><pre>{{cancellationData}}</pre><pre>{{$v}}</pre></div>-->
                    </div>
                </div>
            </template>
        </basic-form>
      <!--<div><pre>{{cancellationData}}</pre></div>-->
      <q-loader :message="message" :visible="isProcessingForm"></q-loader>
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
  import { required } from 'vuelidate/lib/validators'
  import { openURL, Dialog } from 'quasar'
  import listingSearchForm from 'src/application/global/components/common/shared-forms/listingSearchForm'
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
      listingSearchForm
    },
    props: ['cancellationID'],
    data: () => ({
      kittingDefaultTab: 'kitComponents',
      taxInvoiceNumber: '',
      totalCancellationAmount: 0.00,
      creditNote: '',
      currentStep: '',
      isDecline: false,
      isNewRequest: true,
      terms: '',
      cartSelectedProductIDs: [],
      cartSelectedKittingIDs: [],
      rejectReason: '',
      message: '',
      enableBuyBackAmountField: false,
      kittingModalData: {
        items: [],
        kittingID: '',
        kittingQty: '',
        title: ''
      },
      cancellationData: {
        location_id: '',
        legacy_sale_cancellation: {
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
          total_cancellation_amount: 0.00
        },
        buy_back_percentage: 90.00,
        sale_cancellation_type: undefined,
        sale: {
          legacy_invoice: {
            country_id: '',
            transaction_location_id: [],
            cw_id: '',
            cw_name: '',
            invoice_date: '',
            invoice_number: ''
          },
          id: '',
          products: [],
          kitting: [],
          promotions: [],
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
            legacy_invoice: {
              transaction_location_id: {
                required
              },
              invoice_date: {
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
              cw_id: {
                required
              },
              invoice_number: {
                required
              }
            }
            // products: {
            //   $each: {
            //     cancellation_quantity: {
            //       quantity_validation (val) {
            //         return val <= 0
            //       }
            //     }
            //   }
            // },
            // kitting: {
            //   $each: {
            //     cancellation_quantity: {
            //       quantity_validation (val) {
            //         return val <= 0
            //       }
            //     }
            //   }
            // },
            // promotions: {
            //   $each: {
            //     cancellation_quantity: {
            //       quantity_validation (val) {
            //         return val <= 0
            //       }
            //     }
            //   }
            // }
          },
          legacy_sale_cancellation: {
            transaction_location_id: {
              required
            },
            stock_location_id: {
              required
            },
            cancellation_reason_id: {
              required
            },
            total_cancellation_amount: {
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
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingCart: state => state.globalCMP.isProcessingCart,
        masterData: state => state.globalCMP.masterData.data.list,
        memberDetails: state => state.membersCMP.memberData.data,
        itemData: state => state.productsCMP.saveData.data,
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
        'createUpdateLegacySalesCancellation',
        'getSalesCancellationDetail',
        'getCountryRelationAction',
        'updateWorkflowAction',
        'downloadTaxInvoicePDF',
        'downloadCreditNotePDF',
        'getProductByIdAction',
        'getKittingProductByIdAction',
        'getStockLocations'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setMemberData: 'SET_MEMBER_DATA'
      }),
      initSetupArea () {
        let query1 = {
          country_id: this.selectedFilters.countryID,
          relations: ['entity.locations', 'currency', 'taxes', 'stockLocation']
        }
        this.getCountryRelationAction(query1).then(() => {
          if (this.locationsOptionsByCountry.length > 0) {
            // Set default country location ID
            if (this.isNewRequest) {
              this.cancellationData.legacy_sale_cancellation.transaction_location_id = this.locationsOptionsByCountry[0].value
              this.cancellationData.location_id = this.cancellationData.transaction_location_id
              this.setStockLocations(this.cancellationData.legacy_sale_cancellation.transaction_location_id)
            }
          }
        })
        if (this.cancellationID !== undefined && this.cancellationID !== null && this.cancellationID !== '') {
          this.loadExistingCancellationData(this.cancellationID)
          this.getCommissionWeeksData()
        } else {
          if (this.salesCancellationData.userID === '') {
            this.invalidRequest()
          } else {
            this.cancellationData.sale.legacy_invoice.country_id = this.selectedFilters.countryID
            let query = {
              user_id: this.salesCancellationData.userID
            }
            this.getMemberByUserIdAction(query).then((res) => {
              this.show = true
              let query = {
                filter_type: 'current'
              }
              this.getCommissionWeekSearchAction(query).then((res) => {
                this.cancellationData.legacy_sale_cancellation.cw = res.data !== undefined && res.data !== null && res.data.length > 0 ? res.data[0] : undefined
                this.cancellationData.legacy_sale_cancellation.cw_id = res.data !== undefined && res.data !== null && res.data.length > 0 ? res.data[0].id : ""
                this.getCommissionWeeksData()
              })
              let query1 = {
                country_id: this.selectedFilters.countryID,
                user_id: this.memberDetails.details.user_id,
                method: 'legacy'
              }
              this.getSalesCancellationInvoiceDetailAction(query1).then((res) => {
                let returnResult = res
                if (returnResult.sale_cancellation_type !== undefined && returnResult.sale_cancellation_type !== null) {
                  this.cancellationData.legacy_sale_cancellation.cancellation_type_id = returnResult.sale_cancellation_type.id
                  this.cancellationData.legacy_sale_cancellation.user_id = this.memberDetails.details.user_id
                }
                if (returnResult.buy_back_percentage !== undefined && returnResult.buy_back_percentage !== null) {
                  this.cancellationData.buy_back_percentage = returnResult.buy_back_percentage
                }
                if (returnResult.workflow !== undefined && returnResult.workflow !== null) {
                  this.cancellationData.workflow = returnResult.workflow
                }
              })
            })
          }
        }
      },
      setStockLocations (locationId) {
        let query = {
          location_id : locationId
        }
        // if (!this.isNewRequest) {
        //   this.cancellationData.legacy_sale_cancellation.stock_location_id = ''
        // }
        this.getStockLocations(query).then(() => {
          if (this.isNewRequest) {
            this.cancellationData.legacy_sale_cancellation.stock_location_id = this.stocklocationsOptionsByCountry[0].value
          }
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
                submitData.legacy_sale_cancellation.cancellation_mode_id = 34
                this.createUpdateLegacySalesCancellation(submitData).then((res) => {
                  this.isNewRequest = false
                  this.setNotification({
                    title: this.$t('sale.cancellation.detail.notification.saveSuccess.title'),
                    message: this.$t('sale.cancellation.detail.notification.saveSuccess.message'),
                    type: 'positive'
                  })
                  if( res !== null && res !== undefined && res.sale_cancellation !== null && res.sale_cancellation !== undefined) {
                    this.loadExistingCancellationData(res.sale_cancellation.id)
                    this.manipulateDetailLoadingResponse(res)
                    this.$router.replace({
                      name: 'Legacy Sales Cancellation Detail',
                      params: {cancellationID: res.sale_cancellation.id}
                    })
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
            console.error(error)
            if (error['legacy_sale_cancellation.invoice_id'] !== undefined && error['legacy_sale_cancellation.invoice_id'] !== null && error['legacy_sale_cancellation.invoice_id'].length > 0){
              this.setNotification({
                title: this.$t('sale.cancellation.detail.notification.saveFailed.title'),
                message: error['legacy_sale_cancellation.invoice_id'][0],
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
          if (returnResult.legacy_sale_cancellation !== undefined && returnResult.legacy_sale_cancellation !== null) {
            query = {
              user_id: returnResult.legacy_sale_cancellation.user_id
            }
            this.getMemberByUserIdAction(query)
          }
          this.manipulateDetailLoadingResponse(returnResult)
        })
      },
      manipulateDetailLoadingResponse (returnResult) {
        this.isNewRequest = false
        this.cancellationData = returnResult
        this.cancellationData.legacy_sale_cancellation = this.cancellationData.sale_cancellation
        this.cancellationData.location_id = this.cancellationData.legacy_sale_cancellation.transaction_location_id
        this.setStockLocations(this.cancellationData.legacy_sale_cancellation.transaction_location_id)
        if (returnResult.sale !== undefined && returnResult.sale !== null && returnResult.sale.invoice !== undefined && returnResult.sale.invoice !== null) {
          this.cancellationData.sale.legacy_invoice = this.cancellationData.sale.invoice
          this.taxInvoiceNumber = returnResult.sale.legacy_invoice.invoice_number
        }
        let query = {
          user_id: this.cancellationData.member.id
        }
        this.getMemberByUserIdAction(query)
        if (returnResult.workflow !== undefined && returnResult.workflow !== null) {
          if (returnResult.workflow.workflow !== undefined && returnResult.workflow.workflow !== null) {
            returnResult.workflow = returnResult.workflow.workflow
          }
          if (returnResult.workflow.current_step !== undefined && returnResult.workflow.current_step !== null) {
            // change this to detect from dynamic field later on
            this.enableBuyBackAmountField = returnResult.workflow.current_step.step_data.actions !== undefined && returnResult.workflow.current_step.step_data.actions.buy_back_amount_editable !== undefined && returnResult.workflow.current_step.step_data.actions.buy_back_amount_editable
            Vue.nextTick(() => {
              this.$refs.stepper.goToStep(returnResult.workflow.current_step.step)
              this.calculateTotalReturnAmount()
            })
          }
        }
      },
      calculateTotalReturnAmount () {
        this.cancellationData.legacy_sale_cancellation.total_cancellation_amount = 0
        this.cancellationData.legacy_sale_cancellation.total_cancellation_amount += this.cancellationData.sale.products.reduce((total, product) => total + (product.base_price.gmp_price_tax * product.cancellation_quantity), 0)
        this.cancellationData.legacy_sale_cancellation.total_cancellation_amount += this.cancellationData.sale.kitting.reduce((total, product) => total + (product.kitting_price.gmp_price_tax * product.cancellation_quantity), 0 )
        if (this.isNewRequest) {
          this.cancellationData.legacy_sale_cancellation.total_buy_back_amount = this.cancellationData.legacy_sale_cancellation.total_cancellation_amount * this.cancellationData.buy_back_percentage / 100
        }
      },
      openDocument (documentType) {
        if (documentType === 'creditNote') {
          let query = {
            credit_note_id: this.cancellationData.legacy_sale_cancellation.credit_note.id,
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
      addToCart (type, id) {
        if (id !== '' && id !== null) {
          if (type === 'product') {
            // stand-alone products
            // Line number generation
            this.currentLineItemCount += 1
            let query1 = {
              country_id: this.selectedFilters.countryID,
              product_id: id
            }
            this.getProductByIdAction(query1).then((res) => {
              let assignTransactionTypePromise = ''
              // Remove reactivity using JSON.stringify
              let reConstructPromise = Promise.resolve(this.cancellationData.sale.products.push(JSON.parse(JSON.stringify(this.itemData))))
              Promise.all([reConstructPromise]).then(() => {
                // Set transaction_type properties to newly added product row
                assignTransactionTypePromise = Promise.resolve(this.$set(this.cancellationData.sale.products[this.cancellationData.sale.products.length - 1], 'transaction_type', ''))
                // Set quantity properties to newly added product row
                this.$set(this.cancellationData.sale.products[this.cancellationData.sale.products.length - 1], 'cancellation_quantity', 1)
                Promise.all([assignTransactionTypePromise]).then(() => {
                  let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.cancellationData.sale.products[this.cancellationData.sale.products.length - 1].general.sale_types))
                  Promise.all([getMasterDataOptionsPromise]).then((res) => {
                    let saleTypes = res
                    if (saleTypes[0].length > 0) {
                      this.cancellationData.sale.products[this.cancellationData.sale.products.length - 1].transaction_type = saleTypes[0][0].value
                    }
                  })
                  this.cancellationData.sale.products[this.cancellationData.sale.products.length - 1].line_item_number = this.currentLineItemCount
                  this.calculateTotalReturnAmount()
                })
              })
            })
          } else {
            // kitting products
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexKitting = this.cancellationData.sale.kitting.findIndex(x => x.kitting_id === id)
            if (itemIndexKitting >= 0) {
              this.cancellationData.sale.kitting[itemIndexKitting].quantity = (1 + parseInt(this.cancellationData.sale.kitting[itemIndexKitting].quantity))
              this.calculateTotalReturnAmount()
            } else {
              let query2 = {
                country_id: this.selectedFilters.countryID,
                kitting_id: id
              }
              this.getKittingProductByIdAction(query2).then((res) => {
                let assignTransactionTypePromise = ''
                // Remove reactivity using JSON.stringify
                let reConstructPromise = Promise.resolve(this.cancellationData.sale.kitting.push(JSON.parse(JSON.stringify(this.itemData))))
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added kitting row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.cancellationData.sale.kitting[this.cancellationData.sale.kitting.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.cancellationData.sale.kitting[this.cancellationData.sale.kitting.length - 1], 'cancellation_quantity', 1)
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.cancellationData.sale.kitting[this.cancellationData.sale.kitting.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.cancellationData.sale.kitting[this.cancellationData.sale.kitting.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.cancellationData.sale.kitting[this.cancellationData.sale.kitting.length - 1].line_item_number = this.currentLineItemCount
                    this.calculateTotalReturnAmount()
                  })
                })
              })
            }
          }
        }
      },
      removeRowFromCart () {
        let products = this.cancellationData.sale.products
        let kittings = this.cancellationData.sale.kitting
        if (this.cartSelectedProductIDs.length > 0) {
          this.cartSelectedProductIDs.forEach((id) => {
            let productIndex = products.findIndex(x => x.product_id === id)
            // this.resetAdditionalRequirementItems(id, null)
            products.splice(productIndex, 1)
          })
          this.cartSelectedProductIDs = []
        }
        if (this.cartSelectedKittingIDs.length > 0) {
          this.cartSelectedKittingIDs.forEach((id) => {
            let kittingIndex = kittings.findIndex(x => x.kitting_id === id)
            kittings.splice(kittingIndex, 1)
          })
          this.cartSelectedKittingIDs = []
        }
        this.calculateTotalReturnAmount()
      },
      mixActions(name, section, data, title, kittingCode, kittingID, kittingQty) {
        this.openCloseModal({name: name, status: true})
        if (section === 'standard') {
          if (typeof data !== 'undefined' && Object.keys(data).length > 0) {
            this.standardProductModalData.item = Object.assign({}, data)
            this.standardProductModalData.title = title
          }
        }
        if (section === 'kitting') {
          if (typeof data !== 'undefined' && data.length > 0) {
            this.kittingModalData.items = [...data]
            this.kittingModalData.title = title
            this.kittingModalData.kittingCode = kittingCode
            this.kittingModalData.kittingID = kittingID
            this.kittingModalData.kittingQty = kittingQty
          }
        }
      },
      selected (item, user, field) {
        this[field] = item.sublabel
        if (field === 'cw') {
          this.cancellationData.sale.legacy_invoice.cw_id = item
          this.$v.cancellationData.sale.legacy_invoice.cw_id.$touch()
        }
        this.togglePopupSearch = true
      },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'past',
          limit: 50,
          sort: 'date_from',
          order: 'desc'
        }
        this.getCommissionWeekSearchAction(query)
      },
      // workflow actions
      submitApprovalStep (field) {
        // this.workflowMixinData.remark = 'semething'
        if (field.buy_back_amount !== undefined) {
          field.buy_back_amount = this.cancellationData.legacy_sale_cancellation.total_buy_back_amount
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
      toggleChildVisibility (step) {
        if (step.show_child !== undefined) {
          step.show_child = !step.show_child
        }
      },
      kittingRedemptionEligibility (data) {
        let count = 0
        data.forEach((item) => {
          if (typeof item.product.general !== 'undefined' && typeof item.product.general.product_additional_requirements !== 'undefined' && item.product.general.product_additional_requirements.length > 0) {
            count += 1
          }
        })
        if (count > 0) {
          return true
        } else {
          return false
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
