<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SalesForm"
                    :formTitle="$t('sales.newSales.title')"
                    :backgroudColor="false"
                    v-bind:formFieldData="exchangeData"
                    urlResetPathName="Sales Exchange List"
                    formAction="salesOrderAction"
                    :buttonTitleCaption="$t('Common.Save.Btn')"
                    :formSubmit="processForm"
                    :buttonOneVisibility="!lockProductExchange"
                    :buttonTwoVisibility="!lockProductExchange"
                    :buttonThreeCaption="lockProductExchange ? 'Close' : 'Cancel'">
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
                                                            :error="$v.exchangeData.legacy_invoice.invoice_number.$error"
                                                            :error-label="'Please select tax invoice for cancellation'"
                                                            helper="*"
                                                          >
                                                            <q-input
                                                              :disable="lockProductExchange"
                                                              v-model="exchangeData.legacy_invoice.invoice_number"
                                                            ></q-input>
                                                          </q-field>
                                                        </q-item-tile>
                                                      </q-item-main>
                                                    </q-item>
                                                    <q-item
                                                      tag="label"
                                                      multiline
                                                      v-if="exchangeData.new_sale === null || exchangeData.new_sale === undefined || exchangeData.new_sale.invoice === undefined || exchangeData.new_sale.invoice === null">
                                                      <q-item-main class="bordered bg-grey-4 fit">
                                                        <q-list no-border>
                                                          <q-item tag="label" multiline >
                                                            <q-item-main>
                                                              <q-item-tile label>{{$t('sale.cancellation.detail.label.transactionDate')}}</q-item-tile>
                                                              <q-item-tile sublabel class="uppercase">
                                                                <q-field
                                                                  :error="$v.exchangeData.legacy_invoice.invoice_date.$error"
                                                                  :error-label="$t('sale.cancellation.list.error.laterThanCurrentDate')"
                                                                  helper="*"
                                                                >
                                                                  <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                                                              :disable="lockProductExchange"
                                                                              v-model="exchangeData.legacy_invoice.invoice_date"
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
                                                                  :error="$v.exchangeData.legacy_invoice.cw_id.$error"
                                                                  :error-label="$t('bonus.cwIncome.errorMessage.selectCommissionWeek')"
                                                                  helper="*"
                                                                >
                                                                  <q-select
                                                                    v-model="exchangeData.legacy_invoice.cw_id"
                                                                    :options="commissionWeeks"
                                                                    filter
                                                                    :disable="lockProductExchange"
                                                                    color="black"
                                                                    :filterPlaceholder="$t('bonus.cwIncome.placeholder.selectCommissionWeek')"
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
                                                                  :error="$v.exchangeData.legacy_invoice.transaction_location_id.$error"
                                                                  :error-label="$t('sale.cancellation.detail.validation.selectTransactionLocation')"
                                                                  helper="*"
                                                                >
                                                                  <q-select
                                                                    v-model="exchangeData.legacy_invoice.transaction_location_id"
                                                                    :options="locationsOptionsByCountry"
                                                                    :disable="lockProductExchange"
                                                                  />
                                                                </q-field>
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
                                                          <q-btn color="primary" @click="openDocument('invoice')" disable>
                                                            {{exchangeData.legacy_invoice.invoice_number}}
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
                                    <q-card-main>
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
                                                type="number"
                                                :disable="lockProductExchange"
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
                    </div>
                  <!--bottom tabs-->
                    <div class="bg-white shadow-1 relative-position mt-20">
                        <div class="col-lg-12">
                          <q-card class="full-width" color="white">
                            <q-card-main
                              class="text-black"
                            >
                              <div class="form-tabs mt-20 text-black">
                                <q-tabs inverted  two-lines color="grey-7" align="left" v-model="currentTab">
                                  <q-tab default name="items"
                                         slot="title"
                                         :label="$t('sale.exchange.detail.tab.header.label.items')"/>
                                  <q-tab name="shipping" slot="title" :alert="$v.exchangeData.selected.shipping.$error || addressesValidationStatus"
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
                                      v-bind:exchangeData="exchangeData"
                                      v-bind:validator="$v"
                                      :lockProductExchange="lockProductExchange"
                                      :addToExchangeCart="addToExchangeCart"
                                      :addToReturnCart="addToReturnCart"
                                      :processProductGroupingsContra="processProductQuantityChangeAndGroupingsContra"
                                    ></items-tab>
                                    <!-- Items Content End -->
                                  </q-tab-pane>
                                  <q-tab-pane name="shipping" class="no-border bg-white sales-items shadow-1">
                                    <!-- Shipping Content-->
                                    <!--<shipping-tab v-bind:exchangeData="exchangeData"-->
                                                  <!--v-bind:memberDetails="memberDetails"-->
                                                  <!--:lockProductExchange="lockProductExchange"-->
                                                  <!--:validations="$v"></shipping-tab>-->
                                    <shipping-tab v-bind:salesData="exchangeData"
                                                  v-bind:memberDetails="memberDetails"
                                                  :lockSalesOrder="lockProductExchange"
                                                  :validations="$v.exchangeData"
                                                  :isSalesExchange="true"
                                                  @checkAddressesValidationStatus="checkAddressesValidationStatus">
                                    </shipping-tab>
                                    <!-- Shipping Content End -->
                                  </q-tab-pane>
                                  <q-tab-pane name="payments" class="no-border bg-white sales-items shadow-1">
                                    <!-- Payments Content-->
                                    <payment-tab :paymentData="exchangeData"
                                                 :processForm="processForm"
                                                 :initSetupArea="initSetupArea"
                                                 :lock="lockProductExchange"
                                                 :isSinglePaymentMethod="true"
                                                 :totalPayableAmount="exchangeData.balance"
                                                 :callback="loadExistingSalesExchange"
                                                 @changeCurrentTab="changeCurrentTab"
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
                  <errors-modal refs="errorsModal"></errors-modal>
                </div>
            </template>
        </basic-form>
      <!--<div class="row"><pre class="col-6">{{productGroupings}}</pre><pre class="col-6">{{exchangeData.exchange_products}}</pre></div>-->
      <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { DatesMixin, MasterDataTransformarMixin, GeneralsMixin, SetFormFieldErrorsMixin } from 'src/application/global/mixins/index'
  import taxInvoiceSearchForm from 'src/application/sales/components/forms/taxInvoiceSearchForm'
  import { ItemsTab } from 'src/application/sales/components/legacy-sales-exchange-tabs/index'
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
      hasReturnQuantity: false,
      hasExchangeProduct: false,
      lockProductExchange: false,
      productGroupings: [],
      addressesValidationStatus: false,
      exchangeData: {
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
        legacy_invoice: {
          country_id: '',
          invoice_number: '',
          invoice_date: '',
          cw_id: '',
          cw_name: '',
          location_id: ''
        },
        legacy_return_products: [],
        legacy_return_kitting: [],
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
          legacy_invoice:{
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
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        productExchangeData: state => state.salesCMP.productExchangeData,
        salesExchangeDetails: state => state.salesCMP.salesExchangeData.data,
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
        if (type === 'productExchange') {
          // From mixins
          this.openCloseModal({name: 'productExchangeModal', status: true})
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
              if (!this.lockProductExchange) {
                this.exchangeData.transaction_location_id = this.locationsOptionsByCountry[0].value
                this.exchangeData.location_id = this.exchangeData.transaction_location_id
                this.setStockLocations(this.exchangeData.transaction_location_id)
              }
            }
          })
          this.loadExistingSalesExchange()
          this.getCommissionWeeksData()
        } else {
          if (this.productExchangeData.userID === '') {
            this.invalidRequest()
          } else {
            this.getCountryRelationAction(query1).then(() => {
              if (this.locationsOptionsByCountry.length > 0) {
                // Set default country location ID
                if (!this.lockProductExchange) {
                  this.exchangeData.is_legacy = true
                  this.exchangeData.legacy_invoice.country_id = this.selectedFilters.countryID
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
              this.exchangeData.user_id = this.productExchangeData.userID
              this.exchangeData.country_id = this.selectedFilters.countryID !== null ? this.selectedFilters.countryID : ''
              let query = {
                filter_type: 'current'
              }
              this.getCommissionWeekSearchAction(query).then((res) => {
                this.exchangeData.cw = res.data !== undefined && res.data !== null && res.data.length > 0 ? res.data[0] : undefined
                this.exchangeData.cw_id = this.exchangeData.cw.id
                this.getCommissionWeeksData()
              })
            })
          }
        }
      },
      loadExistingSalesExchange () {
        this.getProductExchangeDetailAction({sale_exchange_id: this.exchangeID}).then(res => {
          if (typeof this.salesExchangeDetails !== 'undefined' && Object.keys(this.salesExchangeDetails).length > 0) {
            this.exchangeData = Object.assign({}, JSON.parse(JSON.stringify(this.salesExchangeDetails)))
            this.exchangeData.location_id = this.exchangeData.transaction_location_id
            this.getMemberByUserIdAction({user_id: res.sales_exchange_data.user_id})
            this.initializeContraGroup()
          }
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
        if (this.exchangeData.exchange_products.length > 0) {
          this.exchangeData.exchange_amount_total += this.exchangeData.exchange_products.reduce((a, b) => a + Number(b.base_price.gmp_price_tax) * b.chargedQuantity, 0)
        }
        if (this.exchangeData.exchange_kitting.length > 0) {
          this.exchangeData.exchange_amount_total += this.exchangeData.exchange_kitting.reduce((a, b) => a + Number(b.kitting_price.gmp_price_tax) * b.quantity, 0)
        }
        this.updateTotalExchangeAmount()
      },
      updateReturnAmount () {
        this.exchangeData.return_amount_total = 0
        if (this.exchangeData.legacy_return_products.length > 0) {
          this.exchangeData.legacy_return_products.forEach((product) => {
            this.exchangeData.return_amount_total +=  parseFloat(product.return_amount)
          })
        }
        if (this.exchangeData !== undefined && this.exchangeData !== null && this.exchangeData.legacy_return_kitting.length > 0) {
          this.exchangeData.return_amount_total += this.exchangeData.legacy_return_kitting.reduce((total, product) => total + Number(product.kitting_price.gmp_price_tax) * product.return_quantity, 0)
        }
        this.updateTotalExchangeAmount()
      },
      // selected (item, user, field) {
      //   this[field] = item.sublabel
      //   if (field === 'cw') {
      //     this.exchangeData.legacy_invoice.cw_id = item
      //     this.$v.exchangeData.legacy_invoice.cw_id.$touch()
      //   }
      //   this.togglePopupSearch = true
      // },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'past',
          limit: 50,
          sort: 'date_from',
          order: 'desc'
        }
        this.getCommissionWeekSearchAction(query)
      },
      updateTotalExchangeAmount () {
        if (isNaN(this.exchangeData.delivery_fees) || this.exchangeData.delivery_fees === ''|| this.exchangeData.delivery_fees === null) {
          this.exchangeData.delivery_fees = 0
        }
        let amt = Number(this.exchangeData.exchange_amount_total) + Number(this.exchangeData.delivery_fees) - Number(this.exchangeData.return_amount_total)
        if (amt < 0) {
          amt = 0
        }
        this.exchangeData.balance = amt.toFixed(2)
      },
      processForm: function (formFieldData) {
        this.$v.exchangeData.$touch()
        return new Promise((resolve, reject) => {
          if (this.returnQuantityCheck() && this.exchangeQuantityCheck() && !this.$v.exchangeData.$error) {
            let query = {sales_exchange_data: this.exchangeData}
            this.getProductExchangeCreationAction(query).then((res) => {
              // Update vuex saveData
              // Wrap response with data {} object to ensure follow API request standard
              this.exchangeData = res.sales_exchange_data
              this.setNotification({
                title: this.$t('sale.exchange.detail.notification.saveSuccess.title'),
                message: this.$t('sale.exchange.detail.notification.saveSuccess.message'),
                type: 'positive'
              })
              this.$router.replace({
                name: 'Legacy Product Exchange Detail',
                params: {exchangeID: res.sales_exchange_data.id}
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
      reCalculateCart () {
        this.updateReturnAmount()
        this.updateExchangeAmount()
      },
      addToExchangeCart (type, id) {
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
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added product row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.exchangeData.exchange_products[this.exchangeData.exchange_products.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.exchangeData.exchange_products[this.exchangeData.exchange_products.length - 1], 'quantity', 1)
                  newItem.chargedQuantity = newItem.quantity
                  this.processProductGroupings(newItem, 'exchange')
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    if ((newItem.kitting_price === undefined || newItem.kitting_price === null) && (newItem.dummy_code === null || newItem.dummy_code === undefined)) {
                      // for standalone product that does not have a group, create a temp group to store the product grouping
                      newItem.dummy_code = { id: product.sku}
                    }
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
      addToReturnCart (type, id) {
        if (id !== '' && id !== null) {
          if (type === 'product') {
            // stand-alone products
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexProducts = this.exchangeData.legacy_return_products.findIndex(x => x.product_id === id)
            if (itemIndexProducts >= 0) {
              this.exchangeData.legacy_return_products[itemIndexProducts].quantity = (1 + parseInt(this.exchangeData.legacy_return_products[itemIndexProducts].quantity))
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
                newItem.chargedQuantity = newItem.quantity
                let reConstructPromise = Promise.resolve(this.exchangeData.legacy_return_products.push(newItem))
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added product row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.exchangeData.legacy_return_products[this.exchangeData.legacy_return_products.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.exchangeData.legacy_return_products[this.exchangeData.legacy_return_products.length - 1], 'return_quantity', 1)
                  this.processProductGroupings(newItem, 'return')
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.exchangeData.legacy_return_products[this.exchangeData.legacy_return_products.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.exchangeData.legacy_return_products[this.exchangeData.legacy_return_products.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.exchangeData.legacy_return_products[this.exchangeData.legacy_return_products.length - 1].line_item_number = this.currentLineItemCount
                    this.reCalculateCart()
                  })
                })
              })
            }
          } else {
            // kitting products
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexKitting = this.exchangeData.legacy_return_kitting.findIndex(x => x.kitting_id === id)
            if (itemIndexKitting >= 0) {
              this.exchangeData.legacy_return_kitting[itemIndexKitting].quantity = (1 + parseInt(this.exchangeData.legacy_return_kitting[itemIndexKitting].quantity))
              this.reCalculateCart()
            } else {
              let query2 = {
                country_id: this.selectedFilters.countryID,
                kitting_id: id
              }
              this.getKittingProductByIdAction(query2).then((res) => {
                let assignTransactionTypePromise = ''
                // Remove reactivity using JSON.stringify
                let reConstructPromise = Promise.resolve(this.exchangeData.legacy_return_kitting.push(JSON.parse(JSON.stringify(this.itemData))))
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added kitting row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.exchangeData.legacy_return_kitting[this.exchangeData.legacy_return_kitting.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.exchangeData.legacy_return_kitting[this.exchangeData.legacy_return_kitting.length - 1], 'return_quantity', 1)
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.exchangeData.legacy_return_kitting[this.exchangeData.legacy_return_kitting.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.exchangeData.legacy_return_kitting[this.exchangeData.legacy_return_kitting.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.exchangeData.legacy_return_kitting[this.exchangeData.legacy_return_kitting.length - 1].line_item_number = this.currentLineItemCount
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
            invoice_id: this.exchangeData.legacy_invoice.id
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
      returnQuantityCheck () {
        this.hasReturnQuantity = false
        for (let i = 0; i < this.exchangeData.legacy_return_products.length && !this.hasReturnQuantity; i++) {
          this.hasReturnQuantity = this.exchangeData.legacy_return_products[i].return_quantity > 0
        }
        for (let i = 0; i < this.exchangeData.legacy_return_kitting.length && !this.hasReturnQuantity; i++) {
          this.hasReturnQuantity = this.exchangeData.legacy_return_kitting[i].return_quantity > 0
        }
        return this.hasReturnQuantity
      },
      exchangeQuantityCheck () {
        this.hasExchangeProduct = false
        for (let i = 0; i < this.exchangeData.exchange_products.length && !this.hasExchangeProduct; i++) {
          this.hasExchangeProduct = this.exchangeData.exchange_products[i].quantity > 0
        }
        for (let i = 0; i < this.exchangeData.exchange_kitting.length && !this.hasExchangeProduct; i++) {
          this.hasExchangeProduct = this.exchangeData.exchange_kitting[i].quantity > 0
        }
        return this.hasExchangeProduct
      },
      initializeContraGroup () {
        this.exchangeData.legacy_return_products.forEach( product => {this.processProductGroupings(product, 'return')})
        this.exchangeData.exchange_products.forEach( product => {this.processProductGroupings(product, 'exchange')})
      },
      checkAddressesValidationStatus(status) {
        this.addressesValidationStatus = status
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
                if (productGroup.return_products[i].product !== null && productGroup.return_products[i].product !== undefined) {
                  // if it is kitting product, and return amount = full line amount, take total instead of avg_price * return qty
                  productGroup.return_products[i].return_amount = Number(productGroup.return_products[i].return_quantity) === Number(productGroup.return_products[i].quantity) ? Number(productGroup.return_products[i].product.base_price.total) : productGroup.return_products[i].product.base_price.average_price_unit * productGroup.return_products[i].return_quantity
                } else {
                  productGroup.return_products[i].return_amount = productGroup.return_products[i].base_price.gmp_price_tax * productGroup.return_products[i].return_quantity
                }
              }
              // this.calculateKittingReturnAmount(productGroup.return_products[i])
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
            if (product.product !== null && product.product !== undefined) {
              // if it is kitting product, and return amount = full line amount, take total instead of avg_price * return qty
              product.return_amount = Number(product.return_quantity) === Number(product.quantity) ? Number(product.base_price.total) : product.base_price.average_price_unit * product.return_quantity
              // this.calculateKittingReturnAmount(product)
            } else if (product.base_price !== undefined && product.base_price !== null) {
              product.return_amount = product.base_price.gmp_price_tax * product.return_quantity
            } else if (product.kitting_price !== undefined && product.kitting_price !== null) {
              product.return_amount = product.kitting_price.gmp_price_tax * product.return_quantity
            }
          }
        }
        this.updateExchangeAmount()
        this.updateReturnAmount()
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
