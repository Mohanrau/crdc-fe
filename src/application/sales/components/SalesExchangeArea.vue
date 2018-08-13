<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SalesForm"
                    :formTitle="$t('sales.newSales.title')"
                    :backgroudColor="false"
                    v-bind:formFieldData="exchangeData"
                    urlResetPathName="Sales Exchange List"
                    formAction="salesOrderAction"
                    :buttonTitleCaption="$t('Common.Save.Btn')"
                    :buttonOneVisibility="!lockProductExchange"
                    :buttonTwoVisibility="!lockProductExchange"
                    :buttonThreeCaption="lockProductExchange ? 'Close' : 'Cancel'"
                    :formSubmit="processForm">
            <template slot="form">
                <div class="form-holder">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row justify-end">
                                <div class="col-xl-8 col-lg-8">
                                    <q-card color="white" class="full-height">
                                        <q-card-main class="text-black">
                                            <div class="row">
                                                <div class="col-xl-6 col-lg-6 personal-data-holder relative-position">
                                                  <q-list no-border
                                                          v-if="memberDetails !== undefined && memberDetails.details !== undefined">
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.memberID')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">{{ memberDetails.details.country.code_iso_2 + memberDetails.details.member_id}}</q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.memberName')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          {{ memberDetails.details.name }}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.translatedName')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          {{ memberDetails.details.translated_name !== null ? memberDetails.details.translated_name : '-- N/A --' }}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.expiryDate')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          {{ formatDate(memberDetails.details.expiry_date)}}
                                                          <span v-if="checkDateValidity(memberDetails.details.expiry_date)"><q-icon color="positive" name="check_circle"></q-icon></span>
                                                          <span v-else=""><q-icon color="negative" name="remove_circle"></q-icon></span>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label" multiline>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.taxInvoice')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            class="full-width"
                                                            :error="$v.exchangeData.sale.invoice.$error  || setError('invoice_id','type.exp')"
                                                            :error-label="$v.exchangeData.sale.invoice.$error ? 'Please select tax invoice for cancellation' : setError('invoice_id','type.msg')"
                                                            helper="*"
                                                          >
                                                            <q-input
                                                              :disable="lockProductExchange"
                                                              v-model="taxInvoiceNumber"
                                                              @click="actions(null, 'productExchange')"
                                                              :after="[
                                                               {
                                                                 icon: 'search',
                                                                 handler () {
                                                                   actions(null, 'productExchange')
                                                                 }
                                                               }
                                                             ]"
                                                            ></q-input>
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item
                                                      tag="label"
                                                      multiline
                                                      v-if=" exchangeData.sale.invoice !== undefined && exchangeData.sale.invoice !== null
                                                      && (exchangeData.new_sale === undefined || exchangeData.new_sale === null
                                                      || exchangeData.new_sale.invoice === undefined || exchangeData.new_sale.invoice === null)"
                                                    >
                                                      <q-item-main class="bordered bg-grey-4 fit">
                                                        <q-list no-border>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.exchange.detail.label.transactionDate')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase">{{exchangeData.sale.invoice.invoice_date}}</q-item-tile>
                                                            </q-item-main>
                                                            <q-item-side right>
                                                              <q-item-tile>
                                                                <q-btn flat small @click="openDocument('invoice')"><q-icon name="launch" color="blue"/></q-btn>
                                                              </q-item-tile>
                                                            </q-item-side>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.exchange.detail.label.cw')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase">
                                                                {{exchangeData.sale.invoice.cw !== null &&  exchangeData.sale.invoice.cw !== undefined ? exchangeData.sale.invoice.cw.cw_name : ''}}
                                                              </q-item-tile>
                                                            </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.exchange.detail.label.transactionLocation')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase" v-if="exchangeData.sale.transaction_location !== null &&  exchangeData.sale.transaction_location !== undefined" >
                                                                {{exchangeData.sale.transaction_location.name}}
                                                              </q-item-tile>
                                                              <q-item-tile sublabel class="uppercase" v-if="exchangeData.sale.location !== null &&  exchangeData.sale.location !== undefined" >
                                                                {{exchangeData.sale.location.name}}
                                                              </q-item-tile>
                                                            </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.exchange.detail.label.stockLocation')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase">
                                                                {{exchangeData.sale.stock_location !== null &&  exchangeData.sale.stock_location !== undefined  ? exchangeData.sale.stock_location.code + ' - ' + exchangeData.sale.stock_location.name : ''}}
                                                              </q-item-tile>
                                                            </q-item-main>
                                                          </q-item>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.exchange.detail.label.deliveryStatus')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase">
                                                                {{exchangeData.sale.delivery_status !== null  &&  exchangeData.sale.delivery_status !== undefined ? exchangeData.sale.delivery_status.title : 'N/A'}}
                                                              </q-item-tile>
                                                            </q-item-main>
                                                          </q-item>
                                                        </q-list>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item
                                                      tag="label"
                                                      multiline
                                                      v-if="exchangeData.new_sale !== undefined && exchangeData.new_sale != null
                                                      && exchangeData.new_sale.invoice !== undefined && exchangeData.new_sale.invoice !== null"
                                                    >
                                                      <q-item-main>
                                                        <q-item-tile label class="text-primary">{{$t('sale.exchange.detail.label.originalTaxInvoice')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-btn color="primary" @click="openDocument('invoice')">
                                                            {{exchangeData.sale.invoice.invoice_number}}
                                                          </q-btn>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item
                                                      tag="label"
                                                      multiline
                                                      v-if="exchangeData.new_sale !== undefined && exchangeData.new_sale != null
                                                      && exchangeData.new_sale.invoice !== undefined && exchangeData.new_sale.invoice !== null
                                                      && exchangeData.exchange_bill!== undefined && exchangeData.exchange_bill !== null "
                                                    >
                                                      <q-item-main>
                                                        <q-item-tile label class="text-primary">{{$t('sale.exchange.detail.label.exchangeBill')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-btn color="primary" @click="openDocument('exc_bill')">
                                                            {{exchangeData.exchange_bill.exchange_bill_number}}
                                                          </q-btn>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item
                                                      tag="label"
                                                      multiline
                                                      v-if="exchangeData.new_sale !== undefined && exchangeData.new_sale != null
                                                      && exchangeData.new_sale.invoice !== undefined && exchangeData.new_sale.invoice !== null
                                                      && exchangeData.credit_note!== undefined && exchangeData.credit_note !== null "
                                                    >
                                                      <q-item-main>
                                                        <q-item-tile label class="text-primary">{{$t('sale.exchange.detail.label.creditNote')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-btn color="primary" @click="openDocument('creditNote')">
                                                            {{exchangeData.credit_note.credit_note_number}}
                                                          </q-btn>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item
                                                      tag="label"
                                                      multiline
                                                      v-if="exchangeData.new_sale !== undefined && exchangeData.new_sale != null
                                                      && exchangeData.new_sale.invoice !== undefined && exchangeData.new_sale.invoice !== null "
                                                    >
                                                      <q-item-main>
                                                        <q-item-tile label class="text-primary">{{$t('sale.exchange.detail.label.newTaxInvoice')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-btn color="primary" @click="openDocument('new_invoice')">
                                                            {{exchangeData.new_sale.invoice.invoice_number}}
                                                          </q-btn>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                  </q-list>
                                                </div>
                                                <div class="col-xl-6 col-lg-6">
                                                  <q-list no-border>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.transactionDate')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          {{ lockProductExchange ? formatDate(exchangeData.transaction_date, 'DD/MM/YYYY') : getCurrentDate('DD/MM/YYYY') }}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item tag="label">
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.transactionLocation')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            helper="*"
                                                            :error="$v.exchangeData.transaction_location_id.$error"
                                                            error-label='Please insert transaction location'>
                                                            <q-select
                                                              v-model="exchangeData.transaction_location_id"
                                                              :options="locationsOptionsByCountry"
                                                              :disable="lockProductExchange || this.exchangeData.exchange_products.length !== 0 || this.exchangeData.exchange_kitting.length !== 0"
                                                              filter
                                                              @input="exchangeData.location_id = exchangeData.transaction_location_id,setStockLocations(exchangeData.transaction_location_id)"
                                                              color="black"
                                                            />
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.stockLocation')}}</q-item-tile>
                                                        <q-item-tile sublabel class="uppercase">
                                                          <q-field
                                                            helper="*"
                                                            :error="$v.exchangeData.stock_location_id.$error"
                                                            error-label='Please insert stock location'>
                                                            <q-select
                                                              v-model="exchangeData.stock_location_id"
                                                              :options="stocklocationsOptionsByCountry"
                                                              :disable="lockProductExchange || this.exchangeData.exchange_products.length !== 0 || this.exchangeData.exchange_kitting.length !== 0"
                                                              filter
                                                              color="black"
                                                            />
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.cw')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          {{exchangeData.cw !== undefined && exchangeData.cw !== null && exchangeData.cw.cw_name !== undefined ? exchangeData.cw.cw_name : 'N/A'}}
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.exchangeReason')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          <q-field
                                                            helper="*"
                                                            :error="$v.exchangeData.reason_id.$error"
                                                            error-label='Please select reason'>
                                                            <q-select
                                                              class="uppercase"
                                                              v-model="exchangeData.reason_id"
                                                              :options="masterDataOptionsCreator('product_exchange_reason')"
                                                              filter
                                                              color="black"
                                                              :disable="lockProductExchange"
                                                            ></q-select>
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.fmsNumber')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          <q-field
                                                            :error="$v.exchangeData.fms_number.$error ||  setError('sales exchange data.fms_number','type.exp')"
                                                            :error-label="setError('sales exchange data.fms_number','type.exp') ? setError('sales exchange data.fms_number','type.msg') : 'Please FMS No'"
                                                            helper="*"
                                                          >
                                                            <q-input
                                                              v-model="exchangeData.fms_number"
                                                              type="textarea"
                                                              :max-height="50"
                                                              :min-rows="3"
                                                              :disable="lockProductExchange"
                                                            />
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item>
                                                      <q-item-main>
                                                        <q-item-tile label>{{$t('sale.exchange.detail.label.exchangeRemark')}}</q-item-tile>
                                                        <q-item-tile sublabel>
                                                          <q-field
                                                          >
                                                            <q-input
                                                              v-model="exchangeData.remarks"
                                                              type="textarea"
                                                              :max-height="50"
                                                              :min-rows="3"
                                                              :disable="lockProductExchange"
                                                            />
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                  </q-list>
                                                </div>
                                              <q-loader :visible="isProcessingSection"></q-loader>
                                            </div>
                                        </q-card-main>
                                    </q-card>
                                </div>
                                <div class="col-xl-4 col-lg-4">
                                  <q-card color="white" class="full-height">
                                    <q-card-main
                                      v-if="exchangeData.sale !== undefined && exchangeData.sale !== null && exchangeData.sale.invoice !== null && exchangeData.sale.invoice !== undefined"
                                    >
                                      <q-list no-border>
                                        <q-item tag="label" multiline>
                                          <q-item-main>
                                            <q-item-tile label class="text-red text-left q-subheading">{{$t('sale.exchange.detail.label.returnAmount')}}({{currencyLabelByCountry}})</q-item-tile>
                                            <q-item-tile sublabel class="text-black text-right q-headline"><p>{{exchangeData.return_amount_total | formatPriceDouble}}</p></q-item-tile>
                                          </q-item-main>
                                        </q-item>
                                        <q-item>
                                          <q-item-main>
                                            <q-item-tile label class="text-red text-left q-subheading">{{$t('sale.exchange.detail.label.exchangeAMount')}}({{currencyLabelByCountry}})</q-item-tile>
                                            <q-item-tile sublabel class="text-black text-right q-headline"><p>{{exchangeData.exchange_amount_total | formatPriceDouble}}</p></q-item-tile>
                                          </q-item-main>
                                        </q-item>
                                        <q-item tag="label" multiline>
                                          <q-item-main>
                                            <q-item-tile label class="text-red text-left q-subheading">{{$t('sale.exchange.detail.label.deliveryFee')}} ({{currencyLabelByCountry}})</q-item-tile>
                                            <q-item-tile sublabel class="mt-10 text-black text-right q-headline justify-end">
                                              <q-input
                                                align="right"
                                                v-model="exchangeData.delivery_fees"
                                                :disable="lockProductExchange"
                                                type="number"
                                                @input="updateTotalExchangeAmount"
                                              >
                                              </q-input>
                                            </q-item-tile>
                                          </q-item-main>
                                        </q-item>
                                        <q-item tag="label" multiline class="mt-10" >
                                          <q-item-main>
                                            <q-item-tile label class="text-red text-left q-subheading">{{$t('sale.exchange.detail.label.balanceToPay')}} ({{currencyLabelByCountry}})</q-item-tile>
                                            <q-item-tile sublabel class="mt-10 text-black text-right q-headline justify-end">
                                              <q-input
                                                align="right"
                                                v-model.number="exchangeData.balance"
                                                :disable="lockProductExchange"
                                              />
                                            </q-item-tile>
                                          </q-item-main>
                                        </q-item>
                                      </q-list>
                                    </q-card-main>
                                  </q-card>
                                </div>
                            </div>
                        </div>
                      <q-loader :message="message" :visible="isProcessingSection"></q-loader>
                    </div>
                  <!--bottom tabs-->
                    <div class="bg-white shadow-1 relative-position mt-20">
                        <div class="col-lg-12">
                          <q-card class="full-width" color="white">
                            <q-card-main
                              class="text-black"
                              v-if="exchangeData.sale !== undefined && exchangeData.sale !== null && exchangeData.sale.invoice !== null && exchangeData.sale.invoice !== undefined"
                            >
                              <div class="form-tabs mt-20 text-black">
                                <q-tabs inverted  two-lines color="grey-7" align="left" v-model="currentTab">
                                  <q-tab default name="items"
                                         slot="title"
                                         :alert="!hasReturnQuantity || !hasExchangeProduct"
                                         :label="$t('sale.exchange.detail.tab.header.label.items')"/>
                                  <q-tab name="shipping" slot="title" :alert="$v.exchangeData.selected.shipping.$error  || addressesValidationStatus"
                                         :label="$t('sale.exchange.detail.tab.header.label.shipping')"/>
                                  <q-tab name="payments" slot="title"
                                         :label="$t('sale.exchange.detail.tab.header.label.payments')"/>
                                  <!-- Tab Content -->
                                  <q-tab-pane name="items" class="no-border bg-white sales-items full-height full-width align-content-start">
                                    <!-- Items Content-->
                                    <items-tab
                                      v-bind:memberDetails="memberDetails"
                                      :updateExchangeAmount="updateExchangeAmount"
                                      :updateReturnAmount="updateReturnAmount"
                                      @reCalculateCart="reCalculateCart"
                                      :showTransactionTypeColumn="false"
                                      :productGroupings="productGroupings"
                                      v-bind:exchangeData="exchangeData"
                                      v-bind:validator="$v"
                                      :lockProductExchange="lockProductExchange"
                                      :addToCart="addToCart"
                                      :hasReturnQuantity="hasReturnQuantity"
                                      :processProductGroupingsContra="processProductQuantityChangeAndGroupingsContra"
                                    ></items-tab>
                                    <!-- Items Content End -->
                                  </q-tab-pane>
                                  <q-tab-pane name="shipping" class="no-border bg-white sales-items shadow-1">
                                    <!-- Shipping Content-->
                                    <shipping-tab v-bind:salesData="exchangeData"
                                                  v-bind:memberDetails="memberDetails"
                                                  :lockSalesOrder="lockProductExchange"
                                                  :validations="$v.exchangeData"
                                                  :isSalesExchange="true"
                                                  @checkAddressesValidationStatus="checkAddressesValidationStatus"
                                    ></shipping-tab>
                                    <!-- Shipping Content End -->
                                  </q-tab-pane>
                                  <q-tab-pane name="payments" class="no-border bg-white sales-items shadow-1">
                                    <!-- Payments Content-->
                                    <payment-tab :paymentData="exchangeData"
                                                 :processForm="processForm"
                                                 :initSetupArea="initSetupArea"
                                                 :lock="lockProductExchange"
                                                 :totalPayableAmount="exchangeData.balance"
                                                 :callback="loadExistingProductExchange"
                                                 @changeCurrentTab="changeCurrentTab"
                                                 :isSinglePaymentMethod="true"
                                                 :popupDialog="{title: 'Attention !', message: 'Confirm proceed to payment section ? (Note: Item change not allowed after proceeding to payment section)', disableLock: true}"
                                                 :tabChanger="{emiter: 'changeCurrentTab', to: 'items'}"
                                    >

                                    </payment-tab>
                                    <!-- Payments Content End -->
                                  </q-tab-pane>
                                </q-tabs>
                              </div>
                            </q-card-main>
                          </q-card>
                        </div>
                    </div>
                  <layout-modal refs="productExchangeModal"
                                urlResetPathName=""
                                title="Tax Invoice"
                                :shadow="false"
                                minWidth="70vw"
                                minHeight="90vh"
                                footerButtonOne="Confirm"
                                v-if="memberDetails !== undefined && memberDetails !== null && memberDetails.details !== undefined && memberDetails.details !== null"
                                footerButtonTwo="Close"
                                :noBackdropDismiss="true"
                                classes="transparent text-black">
                    <template slot="modal-data" slot-scope="props">
                      <tax-invoice-search-form
                        v-bind:memberDetails="memberDetails"
                        v-bind:selectInvoice="selectInvoice"
                      ></tax-invoice-search-form>
                    </template>
                  </layout-modal>
                  <errors-modal refs="errorsModal"></errors-modal>
                </div>
            </template>
        </basic-form>
      <!--<div class="row"><pre class="col-4">{{exchangeData.selected}}</pre><pre class="col-6">{{productGroupings}}</pre></div>-->
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
  import taxInvoiceSearchForm from 'src/application/sales/components/forms/taxInvoiceSearchForm'
  import { ItemsTab } from 'src/application/sales/components/sales-exchange-tabs/index'
  import { PaymentTab, ShippingTab } from 'src/application/global/components/common/shared-tabs/index'
  import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import { required, minLength } from 'vuelidate/lib/validators'
  import { openURL } from 'quasar'

  // const REQUEST = 'REQUEST'
  // const RESPONSE = 'RESPONSE'

  export default {
    name: 'sales-exchange-area',
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin, SetFormFieldErrorsMixin],
    props: ['exchangeID'],
    components: {
      generalHeader,
      basicForm,
      qLoader,
      errorsModal,
      ItemsTab,
      ShippingTab,
      PaymentTab,
      layoutModal,
      taxInvoiceSearchForm
    },
    data: () => ({
      message: '',
      isNewRequest: true,
      taxInvoiceNumber: '',
      currentTab: '',
      addressesValidationStatus: false,
      hasReturnQuantity: true,
      hasExchangeProduct: true,
      lockProductExchange: true,
      productGroupings: [],
      exchangeData: {
        is_legacy: false,
        user_id: '',
        exchange_amount_total: 0.00,
        return_amount_total: 0.00,
        balance: 0.00,
        delivery_fees: 0.00,
        invoice_number: '',
        stock_location_code: '',
        cw_id: '',
        tax_invoice: undefined,
        transaction_location_id: '',
        stock_location_id: '',
        cw: {},
        reason_id: '',
        fms_number: '',
        remarks: '',
        country_id: '',
        cvs: {
          total_cv: 0,
          total_qualified_cv: 0
        },
        sale: {
          invoice: undefined
        },
        return_products: [],
        return_kitting: [],
        return_promotions: [],
        exchange_products: [],
        exchange_kitting: [],
        exchange_promotion: [],
        exchangeList: [],
        selected: {
          promotions: [],
          shipping: {
            sale_delivery_method: '',
            recipient_name: '',
            recipient_mobile_country_code_id: '',
            recipient_mobile_phone_number: '',
            recipient_addresses: [],
            recipient_selected_shipping_index: ''
          },
          payments: {
            paid: [],
            unpaid: []
          },
          additional_requirements: {
            sizes: [],
            addresses: [],
            evoucher: []
          }
        }
      }
    }),
    validations () {
      let def = {
        exchangeData: {
          sale:{
            products: {
              $each: {
                return_quantity: {
                  quantity_validation (val, elm) {
                    return val <= elm.available_quantity || val === 0
                  }
                }
              }
            },
            kitting: {
              $each: {
                return_quantity: {
                  quantity_validation (val, elm) {
                    return val <= elm.available_quantity || val === 0
                  }
                },
                kitting_products: {
                  $each: {
                    return_quantity: {
                      quantity_validation (val, elm) {
                        return val <= elm.available_quantity || val === 0
                      }
                    }
                  }
                }
              }
            },
            promotions: {
              $each: {
                return_quantity: {
                  quantity_validation (val, elm) {
                    return val <= elm.available_quantity || val === 0
                  }
                }
              }
            },
            invoice: {
              required
            }
          },
          exchange_products: {
            $each: {
              quantity: {
                quantity_validation (val, elm) {
                  return val > 0
                }
              }
            }
          },
          exchange_kitting: {
            $each: {
              quantity: {
                quantity_validation (val, elm) {
                  return val > 0
                }
              }
            }
          },
          transaction_location_id: {
            required
          },
          stock_location_id: {
            required
          },
          reason_id: {
            required
          },
          fms_number: {
            required
          },
          selected: {}
        }
      }
      let methodID = this.exchangeData.selected.shipping !== null ? this.exchangeData.selected.shipping.sale_delivery_method : 0
      if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === methodID) {
        def.exchangeData.selected = {
          shipping: {
            sale_delivery_method: {
              required
            },
            recipient_name: {
              required
            },
            recipient_mobile_country_code_id: {
              required
            },
            recipient_mobile_phone_number: {
              required
            },
            recipient_addresses: {
              $each: {
                fields: {
                  required,
                  minLength: minLength(1)
                }
              }
            }
          }
        }
      } else {
        def.exchangeData.selected = {
          shipping: {
            sale_delivery_method: {
              required
            }
          }
        }
      }
      return def
    },
    mounted () {
      // Merge mixin master array
      this.master.keys = [
        'product_exchange_reason'
      ]
      this.initSetupArea()
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        memberDetails: state => state.membersCMP.memberData.data,
        selectedFilters: state => state.globalCMP.selectedFilters,
        itemData: state => state.productsCMP.saveData.data,
        orderData: state => state.salesCMP.orderData,
        errors: state => state.globalCMP.errors.data,
        salesExchangeDetails: state => state.salesCMP.salesExchangeData.data,
        productExchangeData: state => state.salesCMP.productExchangeData
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
        'getCountryRelationAction',
        'getMastersWithKey',
        'getSalesInvoiceDetail',
        'getProductByIdAction',
        'getKittingProductByIdAction',
        'getCommissionWeekSearchAction',
        'getProductExchangeCreationAction',
        'getProductExchangeDetailAction',
        'downloadTaxInvoicePDF',
        'downloadCreditNotePDF',
        'downloadExchangeBillPDF',
        'getStockLocations'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setMemberData: 'SET_MEMBER_DATA'
      }),
      actions (row, type) {
        if (!this.lockProductExchange) {
          if (type === 'productExchange') {
            // From mixins
            this.openCloseModal({name: 'productExchangeModal', status: true})
          }
        }
      },
      search (terms, done) {
        let query = {
          search_text: terms,
          limit: 10
        }
        this.getMemberSearchAction(query).then(res => {
          done(this.membersSearchData.list)
        })
      },
      initSetupArea () {
        this.exchangeData.selected.shipping.sale_delivery_method = this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.SELF_PICK_UP)
        this.lockProductExchange = this.exchangeID !== undefined && this.exchangeID !== null && this.exchangeID !== ''
        let query1 = {
          country_id: this.selectedFilters.countryID,
          relations: ['entity.locations', 'currency', 'taxes', 'stockLocation']
        }
        if (this.exchangeID !== undefined && this.exchangeID !== null && this.exchangeID !== '') {
          this.getCountryRelationAction(query1).then(() => {
            if (this.locationsOptionsByCountry.length > 0) {
              // Set default country location ID
              if (this.lockProductExchange) {
                this.exchangeData.transaction_location_id = this.locationsOptionsByCountry[0].value
                this.exchangeData.location_id = this.exchangeData.transaction_location_id
                this.setStockLocations(this.exchangeData.transaction_location_id)
              }
            }
          })
          this.loadExistingProductExchange()
        } else {
          if (this.productExchangeData.userID === '') {
            this.invalidRequest()
          } else {
            this.lockProductExchange = false
            this.getCountryRelationAction(query1).then(() => {
              if (this.locationsOptionsByCountry.length > 0) {
                // Set default country location ID
                if (!this.lockProductExchange) {
                  this.exchangeData.transaction_location_id = this.locationsOptionsByCountry[0].value
                  this.exchangeData.location_id = this.exchangeData.transaction_location_id
                  this.setStockLocations(this.exchangeData.transaction_location_id)
                }
              }
            })
            let query = {
              user_id: this.productExchangeData.userID
            }
            this.getMemberByUserIdAction(query).then((res) => {
              this.show = true
              if (this.productExchangeData.searchByTaxInvoice) {
                this.selectInvoice(this.productExchangeData.invoiceID)
              }
              this.exchangeData.user_id = this.productExchangeData.userID
              let query = {
                filter_type: 'current'
              }
              this.exchangeData.country_id = this.selectedFilters.countryID !== null ? this.selectedFilters.countryID : ''
              this.getCommissionWeekSearchAction(query).then((res) => {
                this.exchangeData.cw = res.data !== undefined && res.data !== null && res.data.length > 0 ? res.data[0] : undefined
                this.exchangeData.cw_id = this.exchangeData.cw.id
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
          this.exchangeData.stock_location_id = ''
        }
        this.getStockLocations(query).then(() => {
          this.exchangeData.stock_location_id = this.stocklocationsOptionsByCountry[0].value
        })
      },
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Sales Exchange List'})
        }, 1500)
      },
      updateExchangeAmount () {
        this.exchangeData.exchange_amount_total = 0
        if (this.exchangeData !== undefined && this.exchangeData.exchange_products.length > 0) {
          this.exchangeData.exchange_products.forEach((product) => {
            let qty = product.chargedQuantity !== undefined ? product.chargedQuantity : product.quantity
            this.exchangeData.exchange_amount_total += parseFloat(product.base_price.gmp_price_tax) * parseInt(qty)
          })
        }
        if (this.exchangeData !== undefined && this.exchangeData !== null && this.exchangeData.exchange_kitting.length > 0) {
          this.exchangeData.exchange_amount_total += this.exchangeData.exchange_kitting.reduce((total, product) => total + Number(product.kitting_price.gmp_price_tax) * product.quantity, 0)
        }
        this.updateTotalExchangeAmount()
      },
      updateReturnAmount () {
        this.exchangeData.return_amount_total = 0
        if (this.exchangeData !== undefined && this.exchangeData.sale.products.length > 0) {
          this.exchangeData.sale.products.forEach((product) => {
            this.exchangeData.return_amount_total +=  parseFloat(product.return_amount)
          })
        }
        if (this.exchangeData !== undefined && this.exchangeData.sale.kitting.length > 0) {
          this.exchangeData.sale.kitting.forEach((kitting) => {
            if (kitting.kitting_products.length > 0) {
              kitting.kitting_products.forEach((product) => {
                this.exchangeData.return_amount_total += parseFloat(product.return_amount)
              })
            }
          })
        }
        if (this.exchangeData !== undefined && this.exchangeData.sale.promotions.length > 0) {
          this.exchangeData.return_amount_total += this.exchangeData.sale.promotions.reduce((total, product) => total + product.return_amount , 0)
        }
        this.updateTotalExchangeAmount()
      },
      updateTotalExchangeAmount () {
        if (isNaN(this.exchangeData.delivery_fees) || this.exchangeData.delivery_fees === ''|| this.exchangeData.delivery_fees === null) {
          this.exchangeData.delivery_fees = 0
        }
        let amt = parseFloat(this.exchangeData.exchange_amount_total) + parseFloat(this.exchangeData.delivery_fees) - parseFloat(this.exchangeData.return_amount_total)
        if (amt < 0) {
          amt = 0
        }
        this.exchangeData.balance = amt.toFixed(2)
      },
      processForm: function (formFieldData) {
        this.$v.exchangeData.$touch()
        return new Promise((resolve, reject) => {
          if (this.returnQuantityCheck() && this.exchangeQuantityCheck() && !this.$v.exchangeData.$error) {
            this.exchangeData.return_products = this.exchangeData.sale.products
            this.exchangeData.return_kitting = this.exchangeData.sale.kitting
            this.exchangeData.return_promotions = this.exchangeData.sale.promotions
            let query = {sales_exchange_data: this.exchangeData}
            this.getProductExchangeCreationAction(query).then((res) => {
              // Update vuex saveData
              // Wrap response with data {} object to ensure follow API request standard
              this.exchangeData = res.sales_exchange_data
              this.exchangeData.sale.promotions = this.exchangeData.sale.selected.promotions
              this.exchangeData.sale.kitting = this.exchangeData.sale.kittings
              this.exchangeData.location_id = this.exchangeData.transaction_location_id
              this.setNotification({
                title: this.$t('sale.exchange.detail.notification.saveSuccess.title'),
                message: this.$t('sale.exchange.detail.notification.saveSuccess.message'),
                type: 'positive'
              })
              this.$router.replace({
                name: 'Sales Exchange Detail',
                params: {exchangeID: this.exchangeData.id}
              })
              this.lockProductExchange = true
              this.currentTab = 'payments'
              resolve(res)
            }).catch(error => {
              if (this.errors !== null && this.errors !== undefined && Object.keys(this.errors).length > 0) {
                this.openCloseModal({name: 'errorsModal', status: true})
              }
              if (typeof error.response !== 'undefined' && error.response.statusText === 500) {
                this.setNotification({
                  title: 'Uh oh! An error occured',
                  message: error.response.status + '<br>' + error.response.statusText,
                  type: 'negative'
                })
              }
              reject(error.response)
            })
          } else {
            this.changeCurrentTab('items')
            if (!this.hasReturnQuantity) {
              this.setNotification({
                title: this.$t('sale.exchange.detail.notification.saveFailed.title'),
                message: this.$t('sale.exchange.detail.notification.returnProductNeeded.message'),
                type: 'negative'
              })
            } else if (!this.hasExchangeProduct) {
              this.setNotification({
                title: this.$t('sale.exchange.detail.notification.saveFailed.title'),
                message: this.$t('sale.exchange.detail.notification.exchangeProductNeeded.message'),
                type: 'negative'
              })
            } else {
              this.setNotification({
                title: this.$t('sale.exchange.detail.notification.saveFailed.title'),
                message: this.$t('sale.exchange.detail.notification.errorsFound.message'),
                type: 'negative'
              })
            }
            reject(this.$v.exchangeData.$error)
          }
        })
      },
      changeCurrentTab (tab) {
        if (tab !== '') {
          this.currentTab = tab
        }
      },
      selectInvoice (selectedInvoiceID) {
        if (selectedInvoiceID !== null && selectedInvoiceID !== undefined && selectedInvoiceID !== '') {
          let query = {
            invoice_id: selectedInvoiceID
          }
          this.getSalesInvoiceDetail(query).then((res) => {
            // this.exchangeData = res
            if (res.sale !== undefined && res.sale !== null) {
              this.exchangeData.sale = res.sale
              if (res.sale !== undefined && res.sale !== null && res.sale.invoice !== undefined && res.sale.invoice !== null) {
                this.taxInvoiceNumber = res.sale.invoice.invoice_number
                this.exchangeData.sale = res.sale
                this.exchangeData.invoice_number = res.sale.invoice.invoice_number
                // this.exchangeData.return_products = res.sale.products
                // this.exchangeData.return_kitting = res.sale.kitting !== null && res.sale.kitting !== undefined ? res.sale.kitting : []
                // this.exchangeData.return_promotions = res.sale.promotions !== null && res.sale.promotions !== undefined ? res.sale.promotions : []
                this.productGroupings = []
                this.initializeContraGroup()
              }
            }
          }).catch(error => {
            this.openCloseModal({name: 'productExchangeModal', status: false})
            if (error.invoice !== undefined && error.invoice !== null && error.invoice.length > 0) {
              this.setNotification({
                title: this.$t('sale.exchange.detail.notification.invoiceLoadFail.title'),
                message: error.invoice_id[0],
                type: 'negative'
              })
            } else {
              this.setNotification({
                title: 'Something went wrong here',
                message: '',
                type: 'negative'
              })
              console.error(error)
            }
          })
        }
      },
      reCalculateCart () {
        this.updateExchangeAmount()
      },
      addToCart (type, id) {
        if (id !== '' && id !== null) {
          if (type === 'product') {
            // stand-alone products
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexProducts = this.exchangeData.exchange_products.findIndex(x => x.product_id === id)
            if (itemIndexProducts >= 0) {
              this.exchangeData.exchange_products[itemIndexProducts].quantity = (1 + parseInt(this.exchangeData.exchange_products[itemIndexProducts].quantity))
              this.reCalculateCart()
            } else {
              let query1 = {
                country_id: this.selectedFilters.countryID,
                product_id: id
              }
              this.getProductByIdAction(query1).then((res) => {
                let assignTransactionTypePromise = ''
                // Remove reactivity using JSON.stringify
                let newItem = JSON.parse(JSON.stringify(this.itemData))
                // initialize required attribute for product grouping contra
                let reConstructPromise = Promise.resolve(this.exchangeData.exchange_products.push(newItem))
                // this.processProductGroupings(newItem, 'exchange')
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added product row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.exchangeData.exchange_products[this.exchangeData.exchange_products.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.exchangeData.exchange_products[this.exchangeData.exchange_products.length - 1], 'quantity', 1)
                  this.processProductGroupings(newItem, 'exchange')
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.exchangeData.exchange_products[this.exchangeData.exchange_products.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.exchangeData.exchange_products[this.exchangeData.exchange_products.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.exchangeData.exchange_products[this.exchangeData.exchange_products.length - 1].line_item_number = this.currentLineItemCount
                    this.reCalculateCart()
                  })
                })
              })
            }
          } else {
            // kitting products
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexKitting = this.exchangeData.exchange_kitting.findIndex(x => x.kitting_id === id)
            if (itemIndexKitting >= 0) {
              this.exchangeData.exchange_kitting[itemIndexKitting].quantity = (1 + parseInt(this.exchangeData.exchange_kitting[itemIndexKitting].quantity))
              this.reCalculateCart()
            } else {
              let query2 = {
                country_id: this.selectedFilters.countryID,
                kitting_id: id
              }
              this.getKittingProductByIdAction(query2).then((res) => {
                let assignTransactionTypePromise = ''
                // Remove reactivity using JSON.stringify
                let reConstructPromise = Promise.resolve(this.exchangeData.exchange_kitting.push(JSON.parse(JSON.stringify(this.itemData))))
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added kitting row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.exchangeData.exchange_kitting[this.exchangeData.exchange_kitting.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.exchangeData.exchange_kitting[this.exchangeData.exchange_kitting.length - 1], 'quantity', 1)
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.exchangeData.exchange_kitting[this.exchangeData.exchange_kitting.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.exchangeData.exchange_kitting[this.exchangeData.exchange_kitting.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.exchangeData.exchange_kitting[this.exchangeData.exchange_kitting.length - 1].line_item_number = this.currentLineItemCount
                    this.reCalculateCart()
                  })
                })
              })
            }
          }
        }
      },
      openDocument (documentType) {
        if (documentType === 'invoice') {
          let query = {
            invoice_id: this.exchangeData.sale.invoice.id
          }
          this.downloadTaxInvoicePDF(query).then((res) => {
            let pdfUrl = res.download_link
            if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
              openURL(pdfUrl)
            }
          })
        } else if (documentType === 'exc_bill') {
          let query = {
            sales_exchange_bill_id: this.exchangeData.exchange_bill.id
          }
          this.downloadExchangeBillPDF(query).then((res) => {
            let pdfUrl = res.download_link
            if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
              openURL(pdfUrl)
            }
          })
        } else if (documentType === 'creditNote') {
          let query = {
            credit_note_id: this.exchangeData.credit_note.id,
            section: 'sales_exchange'
          }
          this.downloadCreditNotePDF(query).then((res) => {
            let pdfUrl = res.download_link
            if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
              openURL(pdfUrl)
            }
          })
        } else if (documentType === 'new_invoice') {
          let query = {
            invoice_id: this.exchangeData.new_sale.invoice.id
          }
          this.downloadTaxInvoicePDF(query).then((res) => {
            let pdfUrl = res.download_link
            if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '') {
              openURL(pdfUrl)
            }
          })
        }
      },
      loadExistingProductExchange () {
        this.getProductExchangeDetailAction({sale_exchange_id: this.exchangeID}).then(res => {
          if (typeof this.salesExchangeDetails !== 'undefined' && Object.keys(this.salesExchangeDetails).length > 0) {
            this.exchangeData = Object.assign({}, JSON.parse(JSON.stringify(this.salesExchangeDetails)))
            this.exchangeData.balance = 0
            this.taxInvoiceNumber = this.exchangeData.sale.invoice.invoice_number
            this.exchangeData.sale.promotions = this.exchangeData.sale.selected.promotions
            this.exchangeData.sale.kitting = this.exchangeData.sale.kittings
            this.exchangeData.location_id = this.exchangeData.transaction_location_id
            this.setStockLocations(this.exchangeData.transaction_location_id)
            this.getMemberByUserIdAction({user_id: this.exchangeData.user_id})
            this.updateTotalExchangeAmount()
            // Vue.nextTick(() => {
            //   this.initializeContraGroup()
            // })
          }
        })
      },
      returnQuantityCheck () {
        this.hasReturnQuantity = false
        for (let i = 0; i < this.exchangeData.sale.products.length && !this.hasReturnQuantity; i++) {
          this.hasReturnQuantity = this.exchangeData.sale.products[i].return_quantity > 0
        }
        // if (this.exchangeData.return_kitting.length > 0) {
        this.exchangeData.sale.kitting.forEach((kitting) => {
          for (let i = 0; i < kitting.kitting_products.length && !this.hasReturnQuantity; i++) {
            this.hasReturnQuantity = kitting.kitting_products[i].return_quantity > 0
          }
        })
        // }
        for (let i = 0; i < this.exchangeData.sale.promotions.length > 0 && !this.hasReturnQuantity; i++) {
          this.hasReturnQuantity = this.exchangeData.sale.promotions[i].return_quantity > 0
        }
        return this.hasReturnQuantity
      },
      exchangeQuantityCheck () {
        this.hasExchangeProduct = false
        for (let i = 0; i < this.exchangeData.exchange_products.length && !this.hasExchangeProduct; i++) {
          this.hasExchangeProduct = this.exchangeData.exchange_products[i].quantity > 0
        }
        for (let j = 0; j < this.exchangeData.exchange_kitting.length && !this.hasExchangeProduct && this.exchangeData.exchange_kitting.length !== undefined ; j++) {
          this.hasExchangeProduct = this.exchangeData.exchange_kitting[j].quantity > 0
        }
        return this.hasExchangeProduct
      },
      initializeContraGroup () {
        if (this.exchangeData.sale.products !== undefined && this.exchangeData.sale.products !== null && this.exchangeData.sale.products.length > 0) {
          this.exchangeData.sale.products.forEach(product => {
            this.processProductGroupings(product, 'return')
          })
        }
        if (this.exchangeData.sale.kitting !== undefined && this.exchangeData.sale.kitting !== null && this.exchangeData.sale.kitting.length > 0) {
          this.exchangeData.sale.kitting.forEach(kitting => {
            kitting.kitting_products.forEach(product => {
              product.dummy_code = product.product.dummy_code
              product.base_price = product.product.base_price
              // product.kitting_master = kitting
              this.processProductGroupings(product, 'return')
            })
          })
        }
        if (this.exchangeData.sale.promotions !== undefined && this.exchangeData.sale.promotions !== null && this.exchangeData.sale.promotions.length > 0) {
          this.exchangeData.sale.promotions.forEach(promo => {
            this.processProductGroupings(promo, 'return')
          })
        }
        if (this.exchangeData.exchange_products !== undefined && this.exchangeData.exchange_products !== null && this.exchangeData.exchange_products.length > 0) {
          this.exchangeData.exchange_products.forEach( product => {this.processProductGroupings(product, 'exchange')})
        }
      },
      processProductGroupings (product, type) {
        if ((product.kitting_price === undefined || product.kitting_price === null) && (product.dummy_code === null || product.dummy_code === undefined)) {
          // for standalone product that does not have a group, create a temp group to store the product grouping
          product.dummy_code = { id: product.sku}
        }
        if (product.dummy_code !== null && product.dummy_code !== undefined && product.dummy_code.length === undefined) {
          let productDummyCode = product.dummy_code
          let productGroup = this.productGroupings.find(group => {
            return group.id === productDummyCode.id
          })
          if (productGroup === null || productGroup === undefined) {
            // perform copy instead of referring to instance
            productGroup = JSON.parse(JSON.stringify(product.dummy_code))
            this.productGroupings.push(productGroup)
            // initialize required attribute for contra calculation
            productGroup.totalReturn = 0
            productGroup.totalExchange = 0
            productGroup.return_products = []
            productGroup.exchange_products = []
          }
          if (type === 'return') {
            productGroup.return_products.push(product)
          } else {
            productGroup.exchange_products.push(product)
          }
        }
        this.processProductQuantityChangeAndGroupingsContra(product, type)
      },
      calculateKittingReturnAmount (product) {
        // find the kitting to update the total return of the kitting to reflect accurate amount
        let productOfKitting = this.exchangeData.return_kitting.find(kitting => kitting.kitting_products.includes(product))
        if (productOfKitting !== undefined && productOfKitting !== null) {
          // default to a max number instead of 0, so that the minQtyInKitting will be calculated correctly
          let minQtyInKitting = Number.MAX_VALUE
          productOfKitting.return_amount = 0
          productOfKitting.kitting_products.forEach((element) => {
            let qty = element.quantity > 0 ? element.quantity : element.foc_qty
            // calculate how many full kit has been returned based on the item quantity per kitting
            let qtyPerKit = qty / productOfKitting.quantity
            let returnKitCount = Math.floor(element.return_quantity / qtyPerKit)
            // obtain the smallest value of return kit count
            minQtyInKitting = returnKitCount < minQtyInKitting ? returnKitCount : minQtyInKitting
            // only add other products than the passed on one
            productOfKitting.return_amount += element.return_amount
          })
          // set the smallest full kit return count as the kitting master return quantity
          productOfKitting.return_quantity = minQtyInKitting
        }
      },
      checkAddressesValidationStatus(status) {
        this.addressesValidationStatus = status
      },
      processProductQuantityChangeAndGroupingsContra (product, type) {
        if (type === 'exchange') {
          product.chargedQuantity = product.quantity
        }
        if (product.dummy_code !== null && product.dummy_code !== undefined && product.dummy_code.length === undefined) {
          let productDummyCode = product.dummy_code
          // always assume will find it, cos we will call processProductGroupings before entering this array
          let productGroup = this.productGroupings.find(element => {
            return element.id === productDummyCode.id
          })
          if (productGroup !== null && productGroup !== undefined) {
            if (type === 'return') {
              if (productGroup.return_products.length > 0) {
                productGroup.totalReturn = productGroup.return_products.reduce((total, product) => parseInt(total) + parseInt(product.return_quantity), 0)
              } else {
                productGroup.totalReturn = 0
              }
            }
            else {
              if (productGroup.exchange_products.length > 0) {
                productGroup.totalExchange = productGroup.exchange_products.reduce((total, product) => parseInt(total) + parseInt(product.quantity), 0)
              } else {
                productGroup.totalExchange = 0
              }
            }
            let totalContra = Math.min(productGroup.totalReturn, productGroup.totalExchange)
            for (let i = 0; i < productGroup.return_products.length; i++) {
              if (totalContra > 0) {
                // adjust the contra amount based on remaining total return
                if (productGroup.return_products[i].return_quantity <= totalContra) {
                  // if current product has less than quantity difference, none of the items are charged
                  productGroup.return_products[i].return_amount = 0
                  totalContra = totalContra - productGroup.return_products[i].return_quantity
                } else {
                  // if current product quantity is more than quantity difference, calculate amount only for non contra-d items only
                  let productPrice = productGroup.return_products[i].base_price.average_price_unit !== undefined ? productGroup.return_products[i].base_price.average_price_unit : productGroup.return_products[i].base_price.gmp_price_tax
                  productGroup.return_products[i].return_amount = productPrice * (productGroup.return_products[i].return_quantity - totalContra)
                  totalContra = 0
                }
              } else {
                // reset the return amount so that items does not remain with return_amount = 0
                if (productGroup.return_products[i].product !== null && productGroup.return_products[i].product !== undefined ) {
                  // if it is kitting product, and return amount = full line amount, take total instead of avg_price * return qty
                  productGroup.return_products[i].return_amount = Number(productGroup.return_products[i].return_quantity) === Number(productGroup.return_products[i].quantity) ?  Number(productGroup.return_products[i].product.base_price.total) :  productGroup.return_products[i].product.base_price.average_price_unit * productGroup.return_products[i].return_quantity
                } else {
                  productGroup.return_products[i].return_amount = productGroup.return_products[i].base_price.gmp_price_tax * productGroup.return_products[i].return_quantity
                }
              }
             this.calculateKittingReturnAmount(productGroup.return_products[i])
            }
            // reset the value to process exchange product list
            totalContra = Math.min(productGroup.totalReturn, productGroup.totalExchange)
            for (let i = 0; i < productGroup.exchange_products.length; i++) {
              if (totalContra > 0) {
                // similarly, adjust contra based on remaining total exchange
                if (productGroup.exchange_products[i].quantity <= totalContra) {
                  // if current product has less than quantity difference, none of the items are charged
                  productGroup.exchange_products[i].chargedQuantity = 0
                  totalContra = totalContra - productGroup.exchange_products[i].quantity
                } else {
                  // if current product quantity is more than quantity difference, calculate amount only for non contra-d items only
                  productGroup.exchange_products[i].chargedQuantity = productGroup.exchange_products[i].quantity - totalContra
                  totalContra = 0
                }
              } else {
                // reset chargedQuantity so that the total exchange is correct
                productGroup.exchange_products[i].chargedQuantity = productGroup.exchange_products[i].quantity
              }
            }
          }
        } else {
          // product doesnt contain grouping, calculate as normal
          if (type === 'return') {
            if (product.product !== null && product.product !== undefined ) {
              // if it is kitting product, and return amount = full line amount, take total instead of avg_price * return qty
              product.return_amount = Number(product.return_quantity) === Number(product.quantity) ?  Number(product.base_price.total) :  product.base_price.average_price_unit * product.return_quantity
              this.calculateKittingReturnAmount(product)
            } else {
              product.return_amount = product.base_price.gmp_price_tax * product.return_quantity
            }
          }
        }
        this.updateReturnAmount()
        this.updateExchangeAmount()
        if (type === 'return') {
          return product.return_amount
        } else {
          //havent decide what to do with it yet
          return 0
        }
      }
    }
  }
</script>
<style lang="stylus">
    .cv-boxes > div:nth-of-type(1)
        border-right 1px solid #d3d3d3
        border-bottom 1px solid #d3d3d3

    .cv-boxes > div:nth-of-type(2)
        border-right 1px solid #d3d3d3

    .form-tabs
        .active
            background-color white
    .sales
        .q-card-container
            padding 8px !important
        .sales-items
            padding-right 0px !important
            padding-left 0px !important
</style>
