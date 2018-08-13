<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createUpdateEsacRedemptionForm"
                    :formTitle="$t('campaigns.route.esacRedemptionNew')"
                    :backgroudColor="false"
                    v-bind:formFieldData="salesData"
                    :urlResetPathName="urlResetPathName"
                    formAction="createUpdateEsacRedemptionForm"
                    :disableSubmit="!isDirty"
                    :buttonOneCaption="saleID ? $t('Common.Update.Btn') : $t('Common.Save.Btn')"
                    :buttonTwoCaption="saleID ? $t('Common.UpdateClose.Btn') : $t('Common.SaveClose.Btn')"
                    :formSubmit="processForm">
            <template slot="form">
                <div class="form-holder">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="row justify-end">
                                <div class="col-lg-7">
                                    <q-card color="white" class="full-height">
                                        <q-card-main class="text-black">
                                            <div class="row items-start">
                                                <div class="col-lg-6 personal-data-holder">
                                                    <q-list no-border
                                                            dense
                                                            v-if="typeof memberDetails !== 'undefined' && Object.keys(memberDetails).length > 0">
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>IBO ID</q-item-tile>
                                                                <q-item-tile sublabel>{{ memberDetails.details.member_id}}</q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>IBO Name</q-item-tile>
                                                                <q-item-tile sublabel>{{ memberDetails.details.name }}
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Translated Name</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    {{ memberDetails.details.translated_name !== null ? memberDetails.details.translated_name : '-- N/A --'
                                                                    }}
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Expiry Date</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    {{ formatDate(memberDetails.details.expiry_date)}}
                                                                    <span v-if="checkDateValidity(memberDetails.details.expiry_date)"><q-icon
                                                                            color="positive"
                                                                            name="check_circle"></q-icon></span>
                                                                    <span v-else=""><q-icon color="negative"
                                                                                            name="remove_circle"></q-icon></span>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Registered Country</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    {{ memberDetails.details.country.name }}
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Enrollment Rank</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    {{ memberDetails.details.enrollment_rank !== null ? memberDetails.details.enrollment_rank.rank_name : '-- N/A --'
                                                                    }}
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Highest Rank</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    {{ memberDetails.details.highest_rank !== null ? memberDetails.details.highest_rank.rank_name : '-- N/A --'
                                                                    }}
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                    </q-list>
                                                    <div class="empty" v-else="">
                                                        <empty></empty>
                                                    </div>
                                                </div>
                                                <div class="col-lg-6 order-data-holder">
                                                    <q-list no-border dense>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Trans Date</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    {{ lockSalesOrder ? formatDate(salesData.transaction_date, 'DD/MM/YYYY') : getCurrentDate('DD/MM/YYYY')
                                                                    }}
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Trans Location</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-select
                                                                            :error="$v.salesData.location_id.$error"
                                                                            clearable
                                                                            :disable="lockSalesOrder || lockTransactionLocation"
                                                                            v-model="salesData.location_id"
                                                                            @input="shippingSectionRestrictionStatus(), setStockLocations(salesData.location_id)"
                                                                            :options="locationsOptionsByCountry"
                                                                            :after="[{icon: 'warning', error: true, handler () {}}]"
                                                                    />
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Stock Location</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-select
                                                                            class="relative-position"
                                                                            clearable
                                                                            :disable="lockSalesOrder"
                                                                            v-model="salesData.stock_location_id"
                                                                            :options="stocklocationsOptionsByCountry"
                                                                            :after="[{icon: 'warning', error: true, handler () {}}]"
                                                                    />
                                                                    <q-loader :visible="isProcessingList"></q-loader>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>CW</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-select
                                                                            :error="$v.salesData.cw_id.$error"
                                                                            clearable
                                                                            :disable="lockSalesOrder"
                                                                            v-model="salesData.cw_id"
                                                                            :options="commissionWeeksOptions"
                                                                            :after="[{icon: 'warning', error: true, handler () {}}]"
                                                                    />
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Remarks</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input
                                                                            clearable
                                                                            :disable="lockSalesOrder"
                                                                            v-model="salesData.remarks"
                                                                            type="textarea"
                                                                            :max-height="350"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Voucher Type</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-select
                                                                            clearable
                                                                            :disable="lockSalesOrder || lockTransactionLocation || salesData.esac_vouchers.length > 0 || salesData.products.length > 0 || salesData.kittings.length > 0"
                                                                            v-model="salesData.voucher_type_id"
                                                                            :options="voucherTypesOptions"
                                                                            :alert="$v.salesData.voucher_type_id.$error"
                                                                            @input="voucherTypeChange"
                                                                            :after="[{icon: 'warning', error: true, handler () {}}]"
                                                                    />
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Voucher</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-field
                                                                          :error="$v.salesData.esac_vouchers.$error"
                                                                          error-label="*"
                                                                    >
                                                                        <q-option-group type="checkbox"
                                                                                name="voucherInput"
                                                                                v-if="!(lockSalesOrder || lockTransactionLocation)"
                                                                                :disable="salesData.products.length > 0 || salesData.kittings.length > 0"
                                                                                v-model="salesData.esac_vouchers"
                                                                                :options="vouchersOptions"
                                                                                @input="voucherChange"
                                                                        ></q-option-group>
                                                                        <q-chip square small
                                                                              v-if="lockSalesOrder || lockTransactionLocation"
                                                                              v-for="(voucher) in salesData.esac_vouchers_list"
                                                                              :key="voucher.id">
                                                                            {{ voucher.voucher_number }}
                                                                        </q-chip>
                                                                    </q-field>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline v-if="salesData.max_purchase_qty > 0">
                                                            <q-item-main>
                                                                <q-item-tile label>Max. Purchase Qty.</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-field
                                                                            :error="$v.salesData.max_purchase_qty.$error"
                                                                            error-label="*"
                                                                      >
                                                                        <q-chip square small>
                                                                          {{ salesData.max_purchase_qty }}
                                                                        </q-chip>
                                                                    </q-field>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                    </q-list>
                                                </div>
                                                <div class="col-lg-12 documents-data-holder"
                                                     v-if="!(isProcessingForm || isProcessingCart || isProcessingSection || isProcessingTable)">
                                                    <div class="row">
                                                        <div class="col-lg-auto col-sm-12 document-data-holder">
                                                            <div class="row col">
                                                                <q-list no-border class="fit">
                                                                    <!--Todo add rnp: this button for  pre order note download -->
                                                                    <q-item tag="div" data-schema="invoice|download"
                                                                            multiline
                                                                            :class="{'disabled' : !$can($apply('invoice|download'))}">
                                                                        <q-item-main>
                                                                            <q-item-tile sublabel>Sale Doc.No
                                                                            </q-item-tile>
                                                                            <q-item-tile sublabel>
                                                                                <q-chip class="cursor-pointer fit"
                                                                                        square small
                                                                                        v-if="salesData.document_number && ( isSaleOrderStatusPreOrder || isSaleOrderStatusPending)"
                                                                                        color="primary"
                                                                                        icon="launch"
                                                                                        @click="$can($apply('')) ? getDocuments(salesData.sale_id, 'preOrderNote') : ''">
                                                                                    {{ salesData.document_number }}
                                                                                </q-chip>
                                                                                <q-chip square small
                                                                                        v-else-if="salesData.document_number"
                                                                                        class="fit">
                                                                                    {{ salesData.document_number }}
                                                                                </q-chip>
                                                                                <q-chip class="fit" square small
                                                                                        v-else="">
                                                                                    -- N/A --
                                                                                </q-chip>
                                                                            </q-item-tile>
                                                                        </q-item-main>
                                                                    </q-item>
                                                                </q-list>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-auto col-sm-12 document-data-holder">
                                                            <div class="row">
                                                                <q-list no-border class="fit">
                                                                    <q-item tag="div" data-schema="invoice|download"
                                                                            multiline
                                                                            :class="{'disabled' : !$can($apply('invoice|download'))}">
                                                                        <q-item-main>
                                                                            <q-item-tile sublabel>Tax invoice
                                                                            </q-item-tile>
                                                                            <q-item-tile sublabel>
                                                                                <q-chip class="cursor-pointer fit"
                                                                                        square small
                                                                                        color="primary"
                                                                                        icon="launch"
                                                                                        v-if="salesData.invoice_id && salesData.invoice !== null"
                                                                                        @click="$can($apply('invoice|download')) ? getDocuments(salesData.invoice_id, 'invoice') : ''">
                                                                                    {{ salesData.invoice.invoice_number}}
                                                                                </q-chip>
                                                                                <q-chip class="fit" square small
                                                                                        v-else="">
                                                                                    -- N/A --
                                                                                </q-chip>
                                                                            </q-item-tile>
                                                                        </q-item-main>
                                                                    </q-item>
                                                                </q-list>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-auto col-sm-12 document-data-holder">
                                                            <div class="row">
                                                                <q-list no-border class="fit">
                                                                    <q-item tag="div" data-schema="invoice|download"
                                                                            multiline
                                                                            :class="{'disabled' : !$can($apply('invoice|download'))}">
                                                                        <q-item-main>
                                                                            <q-item-tile sublabel>Order</q-item-tile>
                                                                            <q-item-tile sublabel>
                                                                                <q-chip class="cursor-pointer fit"
                                                                                        square small
                                                                                        v-if="(!isSaleOrderStatusCancelled && isSaleOrderStatusPreOrder)"
                                                                                        color="negative"
                                                                                        icon="delete_forever"
                                                                                        @click="$can($apply('invoice|download')) ? cancelPreOrder() : ''">
                                                                                    {{ $t('sales.cancelByStatus.label', {status: getCurrentOrderStatus})
                                                                                    }}
                                                                                </q-chip>
                                                                                <q-chip class="fit" square small
                                                                                        v-else=""
                                                                                        :color="isSaleOrderStatusComplete ? 'positive' : ''">
                                                                                    {{ getCurrentOrderStatus }}
                                                                                </q-chip>
                                                                            </q-item-tile>
                                                                        </q-item-main>
                                                                    </q-item>
                                                                </q-list>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </q-card-main>
                                    </q-card>
                                </div>
                                <div class="col-lg-5">
                                    <q-card color="white" class="full-height no-padding">
                                        <q-card-main class="text-black no-padding full-height">
                                            <div class="row full-height">
                                                <div class="col-12 pd-10">
                                                    <q-list no-border dense>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Total Min. Purchase Amt.
                                                                </q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-field
                                                                            :error="$v.salesData.min_purchase_amount.$error"
                                                                            error-label="*"
                                                                      >
                                                                        <q-input type="number" :decimals="2"
                                                                             color="grey-7"
                                                                             readonly
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.min_purchase_amount"/>
                                                                    </q-field>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Total NMP (NET)
                                                                </q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input hide-underline type="number" :decimals="2"
                                                                             color="grey-7"
                                                                             readonly
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.total_nmp"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Admin Fee</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input type="number" :decimals="2" color="grey-7"
                                                                             @input="reCalculateCart('admin_fees')"
                                                                             inverted
                                                                             :disable="lockSalesOrder"
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.admin_fee"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Delivery Fee</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input type="number" :decimals="2" color="grey-7"
                                                                             @input="reCalculateCart('delivery_fees')"
                                                                             inverted
                                                                             :disable="lockSalesOrder"
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.delivery_fee"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Other Fee</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input type="number" :decimals="2" color="grey-8"
                                                                             inverted
                                                                             :disable="lockSalesOrder"
                                                                             @input="reCalculateCart('other_fees')"
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.other_fee"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Tax Amount</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input hide-underline type="number" :decimals="2"
                                                                             color="grey-8"
                                                                             readonly
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.tax_amount"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label
                                                                             :color="salesData.invoice_id && salesData.invoice !== null ? 'positive' : 'negative'">
                                                                    Total GMP (incl. Tax)
                                                                </q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input hide-underline type="number" :decimals="2"
                                                                             :color="salesData.invoice_id && salesData.invoice !== null ? 'positive' : 'negative'"
                                                                             readonly
                                                                             inverted
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.total_gmp"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Rounding Adj. Amount</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input hide-underline type="number" :decimals="2"
                                                                             color="grey-8"
                                                                             readonly
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.rounding_adjustment"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                    </q-list>
                                                </div>
                                            </div>
                                        </q-card-main>
                                    </q-card>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row q-mt-md">
                        <div class="col-lg-12 sales">
                            <q-card color="white" class="no-padding">
                                <q-card-main class="text-black no-padding">
                                    <div class="form-tabs mt-20 text-black">
                                        <q-tabs inverted two-lines no-pane-border color="grey-7" align="left"
                                                v-model="currentTab">
                                            <q-tab default name="items" :alert="$v.salesData.products.$error"
                                                   slot="title"
                                                   label="Items"/>
                                            <q-tab name="shipping" slot="title"
                                                   :disable="this.lockShipping"
                                                   :alert="$v.salesData.selected.shipping.$error || addressesValidationStatus"
                                                   label="Shipping"/>
                                            <q-tab name="payments" :disable="lockPayment" slot="title"
                                                   label="Payments"/>
                                          <q-tab name="eppMoto" slot="title" v-if="salesData.is_epp_moto_payment"
                                                 label="EPP Moto"/>
                                            <!-- Tab Content -->
                                            <q-tab-pane name="items" class="bg-white sales-items">
                                                <!-- Items Content-->
                                                <items-tab keep-alive v-bind:salesData="salesData"
                                                           @reCalculateCart="reCalculateCart"
                                                           v-bind:memberDetails="memberDetails"
                                                           :lockSalesOrder="lockSalesOrder"
                                                           :validations="$v.salesData"
                                                           :addToCart="addToCart"></items-tab>
                                                <!-- Items Content End -->
                                            </q-tab-pane>
                                            <q-tab-pane keep-alive name="shipping" class="bg-white sales-items">
                                                <!-- Shipping Content-->
                                                <shipping-tab v-bind:salesData="salesData"
                                                              @reCalculateCart="reCalculateCart"
                                                              :lockShipping="lockShipping"
                                                              @checkAddressesValidationStatus="checkAddressesValidationStatus"
                                                              v-bind:memberDetails="memberDetails"
                                                              :lockSalesOrder="lockSalesOrder"
                                                              :validations="$v"
                                                              :skipDownline="!lockSalesOrder ? orderData.skipDownline : salesData.skip_downline"
                                                              :addToCart="addToCart"></shipping-tab>
                                                <!-- Shipping Content End -->
                                            </q-tab-pane>
                                            <q-tab-pane name="payments" class="bg-white sales-items">
                                                <!-- Payments Content-->
                                                <!--Todo callback temp fix to reload sales after payment-->
                                                <payment-tab v-bind:paymentData="salesData"
                                                             @reCalculateCart="reCalculateCart"
                                                             @changeCurrentTab="changeCurrentTab"
                                                             v-bind:memberDetails="memberDetails"
                                                             :excludePaymentMode="['AEON', 'credit_card_mega', 'Discount Voucher', 'House Cheque']"
                                                             :processForm="processForm"
                                                             :initSetupArea="initSetupArea"
                                                             :callback="refreshSales"
                                                             :totalPayableAmount="salesData.order_fees.total_gmp"
                                                             :lock="lockSalesOrder"
                                                             :popupDialog="{title: 'Attention !', message: 'Confirm proceed to payment section ? (Note: Item change not allowed after proceeding to payment section)', disableLock: true}"
                                                             :tabChanger="{emiter: 'changeCurrentTab', to: 'items', current: currentTab}"
                                                ></payment-tab>
                                                <!-- Payments Content End -->
                                            </q-tab-pane>
                                          <q-tab-pane name="eppMoto" v-if="salesData.is_epp_moto_payment" class="bg-white sales-items">
                                            <epp-moto-tab
                                              :salesData="salesData"
                                            ></epp-moto-tab>
                                          </q-tab-pane>
                                        </q-tabs>
                                    </div>
                                </q-card-main>
                            </q-card>
                        </div>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :message="message"
                  :visible="isProcessingForm || isProcessingCart || isProcessingSection || isProcessingTable"></q-loader>
        <errors-modal refs="errorsModal"></errors-modal>
    </div>
</template>
<script>
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import empty from 'src/application/global/components/common/empty/emptyList.vue'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import {
    DatesMixin,
    MasterDataTransformarMixin,
    GeneralsMixin,
    DirtyAlertMixin
  } from 'src/application/global/mixins/index'
  import {ShippingTab, EppMotoTab} from 'src/application/sales/components/sales-tabs/index'
  import {ItemsTab, PaymentTab} from 'src/application/global/components/common/shared-tabs'
  import {openURL, Dialog} from 'quasar'
  import {required, alphaNum, minLength, numeric, maxValue, between} from 'vuelidate/lib/validators'
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'

  const REQUEST = 'REQUEST'
  const RESPONSE = 'RESPONSE'

  export default {
    name: 'sales-order-area',
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin, DirtyAlertMixin],
    components: {
      generalHeader,
      basicForm,
      qLoader,
      errorsModal,
      ItemsTab,
      ShippingTab,
      PaymentTab,
      empty,
      EppMotoTab
    },
    props: ['saleID', 'operation', 'referer'],
    validations() {
      let saleDeliveryMethodID = this.salesData.selected.shipping !== null ? this.salesData.selected.shipping.sale_delivery_method : 0
      let def = {
        salesData: {
          location_id: {
            required
          },
          cw_id: {
            required
          },
          products: {
            $each: {
              quantity: {
                required,
                numeric
              }
            },
            count(value, elm) {
              if (value.length <= 0) {
                if (elm.kittings.length > 0) {
                  return true
                } else {
                  return false
                }
              } else {
                return true
              }
            }
          },
          kittings: {
            $each: {
              quantity: {
                required,
                alphaNum
              }
            },
            count(value, elm) {
              if (value.length <= 0) {
                if (elm.products.length > 0) {
                  return true
                } else {
                  return false
                }
              } else {
                return true
              }
            }
          },
          selected: {
            shipping: {},
            payments: {}
          },
          voucher_type_id: {
            required,
            numeric
          },
          esac_vouchers: {
            required,
            minLength: 1
          },
          max_purchase_qty: {
            customValidator (val) {
              let total = 0;
              this.salesData.products.forEach((item, index) => {
                total += item.quantity
              })
              this.salesData.kittings.forEach((item, index) => {
                total += item.quantity
              })
              if(this.salesData.max_purchase_qty > 0) {
                return (total <= this.salesData.max_purchase_qty)
              }
              return true
            }
          },
          min_purchase_amount: {
            customValidator (val) {
              if(this.salesData.min_purchase_amount > 0) {
                let total = parseFloat(this.salesData.order_fees.total_nmp);
                this.salesData.esac_vouchers_list.forEach((item, index) => {
                  total += parseFloat(item.voucher_value)
                })
                return (total > this.salesData.min_purchase_amount)
              }
              return true
            }
          }
        }
      }
      if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === saleDeliveryMethodID) {
        def.salesData.selected.shipping = {
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
            required,
            minLength: minLength(0)
          }
        }
      } else {
        def.salesData.selected.shipping = {
          sale_delivery_method: {
            required,
            beforeUpdateCheck() {
              if (this.saleID) {
                if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.WITHOUT_SHIPPING) === saleDeliveryMethodID) {
                  return false
                }
              }
              return true
            }
          }
        }
      }
      return def
    },
    data: () => ({
      voucherTypesOptions: [],
      vouchersOptions: [],
      vouchersDetails: [],
      message: '',
      currentTab: '',
      lockSalesOrder: false,
      lockTransactionLocation: false,
      lockShipping: false,
      lockPayment: false,
      addressesValidationStatus: false,
      currentLineItemCount: 0,
      terms: '',
      memberChange: false,
      response: false,
      salesData: {
        // redemption data
        is_esac_redemption: 1,
        voucher_type_id: 0,
        esac_vouchers: [],
        esac_vouchers_list: [],
        max_purchase_qty: 0,
        min_purchase_amount: 0,
        // sales data
        skip_downline: 0,
        status: 'pending',
        country_id: '',
        function_type: 'promo',
        sponsor_member_id: '',
        downline_member_id: '',
        location_id: null,
        stock_location_id: null,
        cw_id: '',
        remarks: '',
        cvs: {
          total_cv: 0,
          total_qualified_cv: 0
        },
        order_fees: {
          total_nmp: 0.00,
          admin_fee: 0.00,
          delivery_fee: 0.00,
          other_fee: 0.00,
          tax_amount: 0.00,
          total_gmp: 0.00,
          rounding_adjustment: 0.00
        },
        products: [],
        kittings: [],
        promotion: [],
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
    watch: {
      saleID: {
        handler() {
          this.initSetupArea()
        }
      },
      salesData: {
        handler() {
          this.dirtyChecker()
          this.paymentSectionRestrictionStatus()
          if (this.isSaleOrderStatusCancelled || this.isSaleOrderStatusVoid || this.isSaleOrderStatusRejected) {
            this.changeCurrentTab('items')
          }
        },
        deep: true
      }
    },
    mounted() {
      this.master.keys = [this.$const.masterKey.SALE_ORDER_STATUS]
      this.initSetupArea()
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessingList: state => state.globalCMP.isProcessingList,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingCart: state => state.globalCMP.isProcessingCart,
        masterData: state => state.globalCMP.masterData.data.list,
        memberDetails: state => state.membersCMP.memberData.data,
        selectedFilters: state => state.globalCMP.selectedFilters,
        orderData: state => state.campaignsCMP.orderData,
        commissionWeeksOptions: state => state.globalCMP.commissionWeeks.list,
        itemData: state => state.productsCMP.saveData.data,
        cartPwpValidationIds: state => state.salesCMP.cartPwpValidationIds,
        cartPwpItemsTempList: state => state.salesCMP.cartPwpItemsTempList,
        salesDetails: state => state.salesCMP.salesData.data,
        cartPromotionalRowCurrentStatus: state => state.salesCMP.cartPromotionalRowCurrentStatus,
        errors: state => state.globalCMP.errors.data,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal.list
      }),
      ...mapGetters([
        'locationsOptionsByCountry',
        'currencyLabelByCountry',
        'stocklocationsOptionsByCountry',
        'getUserType',
        'tableDataEsacVoucherTypes',
        'tableDataEsacVouchers'
      ]),
      getCurrentOrderStatus() {
        let status = 'New'
        if (this.salesData.order_status_id) {
          status = this.salesData.order_status
        }
        return status
      },
      isSaleOrderStatusPending() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.PENDING))
      },
      isSaleOrderStatusCancelled() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.CANCELED))
      },
      isSaleOrderStatusPreOrder() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.PRE_ORDER))
      },
      isSaleOrderStatusVoid() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.VOID))
      },
      isSaleOrderStatusRejected() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.REJECTED))
      },
      isSaleOrderStatusComplete() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.COMPLETED))
      },
      urlResetPathName: function() {
        if (this.referer === 0) {
          return 'New Sales & Order History'
        }
        else {
          return 'eSac Redemption List'
        }
      }
    },
    methods: {
      ...mapActions([
        'getEsacVoucherTypeListAction',
        'getEsacVoucherListAction',
        'postSalesAction',
        'getMemberByUserIdAction',
        'getMastersWithKey',
        'getCountryRelationAction',
        'getCommissionWeekSearchAction',
        'getProductByIdAction',
        'getKittingProductByIdAction',
        'getSalesProductEligibleAction',
        'getSalesDataAction',
        'downloadTaxInvoicePDF',
        'getDownlineValidationAction',
        'putSalesAction',
        'getStockLocations',
        'downloadPreOderNote'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setMemberData: 'SET_MEMBER_DATA',
        unsetCartPwpValidationIds: 'UNSET_CART_PWP_VALIDATION_IDS',
        unsetCartPwpItemTempList: 'UNSET_CART_PWP_ITEM_TEMP_LIST',
        unSetOrderData: 'UNSET_ORDER_DATA',
        setSalesData: 'SET_SALES_DATA',
        unsetMemberData: 'UNSET_MEMBER_DATA',
        unsetSalesAddressData: 'UNSET_SALES_ADDRESSES_DATA',
        unsetPromotionalRowCurrentStatus: 'UNSET_PROMOTIONAL_ROW_CURRENT_STATUS'
      }),
      initSetupArea() {
        this.paymentSectionRestrictionStatus()
        this.unsetSalesAddressData()
        if (!this.saleIdValid(this.saleID)) {
          if (Object.keys(this.orderData).length < 1 || this.orderData.downlineUserID === '' || this.orderData.downlineUserID === null) {
            this.invalidRequest()
          } else {
            this.getAdditionalSaleDetails()
          }
        } else {
          if (!this.response) {
            let query = {
              sale_id: this.saleID
            }
            this.getSalesDataAction(query).then(() => {
              let manipulateSaveDataPromise = Promise.resolve(this.manipulateSaveData(REQUEST))
              Promise.all([manipulateSaveDataPromise]).then(() => {
                this.getAdditionalSaleDetails()
              })
            }).catch((error) => {
              this.invalidRequest()
            })
          }
        }
      },
      voucherTypeChange() {
        this.vouchersOptions = []
        this.vouchersDetails.forEach(x => {
          if(x.voucher_type_id === this.salesData.voucher_type_id) {
            this.vouchersOptions.push({
              label: x.voucher_number,
              value: x.id
            })
          }
        })
      },
      voucherChange() {
        let min_purchase_amount = 0, max_purchase_qty = 0
        this.salesData.esac_vouchers_list = []
        this.salesData.esac_vouchers.forEach(v => {
          let m = this.vouchersDetails.filter(x => x.id === v)
          if (m.length> 0) {
            min_purchase_amount = min_purchase_amount + m[0].min_purchase_amount
            max_purchase_qty = max_purchase_qty + m[0].max_purchase_qty
            this.salesData.esac_vouchers_list.push({
              id: m[0].id,
              voucher_number: m[0].voucher_number,
              voucher_value: m[0].voucher_value
            })
          }
        })
        this.salesData.min_purchase_amount = min_purchase_amount
        this.salesData.max_purchase_qty = max_purchase_qty
      },
      saleIdValid(value) {
        if (this.isFalsy(value)) {
          return true
        } else {
          return false
        }
      },
      getAdditionalSaleDetails() {
        let query1 = {
          country_id: this.salesData.country_id !== '' ? this.salesData.country_id : this.selectedFilters.countryID,
          relations: ['entity.locations', 'currency', 'taxes']
        }
        this.getCountryRelationAction(query1).then(async () => {
          if (this.locationsOptionsByCountry.length > 0) {
            // Set default country location ID
            if (!this.lockSalesOrder) {
              this.salesData.location_id = await this.locationsOptionsByCountry[0].value
              this.salesData.country_id = this.selectedFilters.countryID !== null ? this.selectedFilters.countryID : ''
              this.salesData.sponsor_member_id = this.orderData.uplineUserID !== null ? this.orderData.uplineUserID : ''
              this.salesData.downline_member_id = this.orderData.downlineUserID !== null ? this.orderData.downlineUserID : ''
              await this.shippingSectionRestrictionStatus()
            }
            this.setStockLocations(this.salesData.location_id)
          }
        })
        let query2 = {
          filter_type: 'current_back_date',
          limit: 2,
          sort: 'id',
          order: 'asc',
          offset: 0
        }
        this.getMember()
        this.getCommissionWeekSearchAction(query2).then(() => {
          if (this.commissionWeeksOptions.length > 0) {
            this.salesData.cw_id = this.salesData.cw_id !== '' ? this.salesData.cw_id : this.commissionWeeksOptions[0].value
          }
        })
        let query3 = {
          country_id: this.salesData.country_id !== '' ? this.salesData.country_id : this.selectedFilters.countryID,
          member_user_id: this.salesData.downline_member_id !== '' ? this.salesData.downline_member_id : this.orderData.downlineUserID,
          for_redemption: true
        }
        this.voucherTypesOptions = []
        this.vouchersOptions = []
        this.vouchersDetails = []
        this.getEsacVoucherListAction(_(query3).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(() => {
          this.tableDataEsacVouchers.list.data.forEach(x => {
            let m = this.voucherTypesOptions.find(z => z.value === x.esac_voucher_type.id)
            if (typeof m === 'undefined' || m === null) {
              this.voucherTypesOptions.push({
                label: x.esac_voucher_type.name,
                value: x.esac_voucher_type.id
              })
            }
            this.vouchersDetails.push({
              id: x.id,
              voucher_type_id: x.esac_voucher_type.id,
              min_purchase_amount: parseFloat(x.min_purchase_amount),
              max_purchase_qty: x.max_purchase_qty,
              voucher_number: x.voucher_number,
              voucher_value: x.voucher_value
            })
          })
        })
      },
      invalidRequest() {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong OR Unauthorized Request. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'eSac Redemption List'})
        }, 3000)
      },
      /**
       * Add items to cart
       * @param type
       * @param id
       */
      addToCart(type, id) {
        if (id !== '' && id !== null) {
          if (type === 'product') {
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexProducts = this.salesData.products.findIndex(x => x.product_id === id)
            if (itemIndexProducts >= 0) {
              this.salesData.products[itemIndexProducts].quantity = (1 + parseInt(this.salesData.products[itemIndexProducts].quantity))
              this.reCalculateCart('promo')
            } else {
              let query1 = {
                country_id: this.selectedFilters.countryID,
                product_id: id
              }
              this.getProductByIdAction(query1).then((res) => {
                let assignTransactionTypePromise = ''
                // Remove reactivity using JSON.stringify
                let reConstructPromise = Promise.resolve(this.salesData.products.push(JSON.parse(JSON.stringify(this.itemData))))
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added product row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.salesData.products[this.salesData.products.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.salesData.products[this.salesData.products.length - 1], 'quantity', 1)
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.salesData.products[this.salesData.products.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.salesData.products[this.salesData.products.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.salesData.products[this.salesData.products.length - 1].line_item_number = this.currentLineItemCount
                    this.reCalculateCart('promo')
                  })
                })
              })
            }
          } else {
            // Line number generation
            this.currentLineItemCount += 1
            var itemIndexKitting = this.salesData.kittings.findIndex(x => x.kitting_id === id)
            if (itemIndexKitting >= 0) {
              this.salesData.kittings[itemIndexKitting].quantity = (1 + parseInt(this.salesData.kittings[itemIndexKitting].quantity))
              this.reCalculateCart('promo')
            } else {
              let query2 = {
                country_id: this.selectedFilters.countryID,
                kitting_id: id
              }
              this.getKittingProductByIdAction(query2).then((res) => {
                let assignTransactionTypePromise = ''
                // Remove reactivity using JSON.stringify
                let reConstructPromise = Promise.resolve(this.salesData.kittings.push(JSON.parse(JSON.stringify(this.itemData))))
                Promise.all([reConstructPromise]).then(() => {
                  // Set transaction_type properties to newly added kitting row
                  assignTransactionTypePromise = Promise.resolve(this.$set(this.salesData.kittings[this.salesData.kittings.length - 1], 'transaction_type', ''))
                  // Set quantity properties to newly added product row
                  this.$set(this.salesData.kittings[this.salesData.kittings.length - 1], 'quantity', 1)
                  Promise.all([assignTransactionTypePromise]).then(() => {
                    let getMasterDataOptionsPromise = Promise.resolve(this.masterDataOptionsCreator(this.$const.masterKey.SALE_TYPES, this.salesData.kittings[this.salesData.kittings.length - 1].general.sale_types))
                    Promise.all([getMasterDataOptionsPromise]).then((res) => {
                      let saleTypes = res
                      if (saleTypes[0].length > 0) {
                        this.salesData.kittings[this.salesData.kittings.length - 1].transaction_type = saleTypes[0][0].value
                      }
                    })
                    this.salesData.kittings[this.salesData.kittings.length - 1].line_item_number = this.currentLineItemCount
                    this.reCalculateCart('promo')
                  })
                })
              })
            }
          }
        }
      },
      /**
       * Recalculate cart after new item added or removed
       * @param type
       */
      reCalculateCart(type) {
        if (typeof type !== 'undefined' && type !== '') {
          this.salesData.function_type = type
        }
        // Set delay
        setTimeout(() => {
          this.getSalesProductEligibleAction(this.salesData).then((res) => {
            this.salesData = []
            this.salesData = Object.assign({}, res)
            let promotions = this.salesData.promotion
            let selectedPromotions = this.salesData.selected.promotions
            let pwpTempList = this.cartPwpItemsTempList
            // Lock transaction type if item selected
            if (this.salesData.products.length > 0 || this.salesData.kittings.length > 0) {
              this.lockTransactionLocation = true
            } else {
              this.lockTransactionLocation = false
            }
            // Special case where iterating and mutating same array
            this.cartPromotionalRowCurrentStatus.reduceRight((acc, item, index, object) => {
              let promotionsIndex = promotions.findIndex(x => x.promo_id === item.promo_id)
              if (promotionsIndex === -1) {
                this.unsetPromotionalRowCurrentStatus(index)
              }
            }, [])
            if (promotions.length > 0) {
              let deletablePromoIDs = []
              selectedPromotions.forEach((item) => {
                if (typeof promotions.find(x => x.promo_id === item.promo_id) === 'undefined') {
                  if (!deletablePromoIDs.includes(item.promo_id)) {
                    deletablePromoIDs.push(item.promo_id)
                  }
                  if (this.cartPwpValidationIds.includes(item.promo_id)) {
                    let validationIndex = this.cartPwpValidationIds.findIndex(x => x === item.promo_id)
                    this.unsetCartPwpValidationIds(validationIndex)
                  }
                }
              })
              // Special case where iterating and mutating same array
              selectedPromotions.reduceRight(function (acc, item, index, object) {
                if (deletablePromoIDs.includes(item.promo_id)) {
                  object.splice(index, 1)
                }
              }, [])
            } else {
              selectedPromotions.forEach((item) => {
                let validationIndex = this.cartPwpValidationIds.findIndex(x => x === item.promo_id)
                this.unsetCartPwpValidationIds(validationIndex)
              })
              this.salesData.selected.promotions = []
              this.unsetCartPwpItemTempList()
            }
            if (pwpTempList.length > 0) {
              let deletablePwpPromoIDS = []
              pwpTempList.forEach((item) => {
                if (typeof promotions.find(x => x.promo_id === item.promo_id) === 'undefined') {
                  if (!deletablePwpPromoIDS.includes(item.promo_id)) {
                    deletablePwpPromoIDS.push(item.promo_id)
                  }
                } else {
                  let promotionsIndex = promotions.findIndex(x => x.option_id === item.option_id && x.promo_id === item.promo_id && x.product_id === item.product_id)
                  promotions.splice(promotionsIndex, 1)
                }
              })
              // Special case where iterating and mutating same array
              pwpTempList.reduceRight((acc, item, index) => {
                if (deletablePwpPromoIDS.includes(item.promo_id)) {
                  this.unsetCartPwpItemTempList(index)
                }
              }, [])
            }
          })
        }, 700)
      },
      manipulateSaveData(operation) {
        if (operation === 'RESPONSE') {
          this.response = true
          // Mixin function
          this.skipDirtyChecker()
          this.$router.replace({
            name: 'Update eSac Redemption',
            params: {saleID: this.salesDetails.sale_id, referer: 1}
          })
        }
        if (typeof this.salesDetails !== 'undefined' && Object.keys(this.salesDetails).length > 0) {
          this.salesData = Object.assign({}, JSON.parse(JSON.stringify(this.salesDetails)))
          if (this.salesData.selected.shipping === null) {
            this.salesData.selected.shipping = {}
            this.salesData.selected.shipping.sale_delivery_method = 0
          }
          this.lockSalesOrder = true
          this.shippingSectionRestrictionStatus()
        }
      },
      setNotificationHandler() {
        this.setNotification({
          title: 'eSac Redemption Creation Failed',
          message: 'validation.failed',
          type: 'negative'
        })
      },
      getDocuments(id, type) {
        if (type === 'invoice') {
          let query = {
            invoice_id: id
          }
          this.downloadTaxInvoicePDF(query).then((res) => {
            let link = res.download_link
            if (link !== '' && typeof link !== 'undefined') {
              openURL(link)
            }
          })
        } else if (type === 'preOrderNote') {
          let query = {
            sale_id: id
          }
          this.downloadPreOderNote(query).then((res) => {
            let link = res.download_link
            if (link !== '' && typeof link !== 'undefined') {
              openURL(link)
            }
          })
        }
      },
      cancelPreOrder() {
        let query = Object.assign({}, JSON.parse(JSON.stringify(this.salesData)))
        query.status = 'cancelPreOrder'
        this.putSalesAction({sales_data: query}).then((res) => {
          this.manipulateSaveData(RESPONSE)
          resolve(res)
        })
      },
      checkAddressesValidationStatus(status) {
        this.addressesValidationStatus = status
      },
      shippingSectionRestrictionStatus() {
        let item = this.locationsOptionsByCountry.find(x => x.value === this.salesData.location_id)
        if (typeof item !== 'undefined') {
          if (item.type_id === 3 && !this.lockSalesOrder) {
            // Navigate tab programmatically to first tab if shipping tab locked
            this.currentTab = 'items'
            this.lockShipping = true
            this.salesData.selected.shipping.sale_delivery_method = this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.SELF_PICK_UP)
          } else {
            this.lockShipping = false
          }
        } else {
          this.lockShipping = false
        }
        if (this.getUserType === this.$const.common.STOCKIST) {
          this.lockShipping = true
        }
      },
      paymentSectionRestrictionStatus() {
        this.lockPayment = this.isSaleOrderStatusCancelled || this.isSaleOrderStatusVoid || this.isSaleOrderStatusRejected
      },
      getMember(query) {
        if (!this.isFalsy(query)) {
          query = {
            upline_id: this.salesData.sponsor_member_id !== '' ? this.salesData.sponsor_member_id : this.orderData.uplineUserID,
            user_id: this.salesData.downline_member_id !== '' ? this.salesData.downline_member_id : this.orderData.downlineUserID,
            self: 0
          }
        }
        // Remove null property
        this.getMemberByUserIdAction(this.removeFalsyValues(query)).then((res) => {
          this.show = true
        }).catch(() => {
          this.skipDirtyAlert = false
          this.invalidRequest()
        })
      },
      changeCurrentTab(tab) {
        if (tab !== '') {
          this.currentTab = tab
        }
      },
      setStockLocations(locationId) {
        let query = {
          location_id: locationId
        }
        this.getStockLocations(query).then(() => {
          if (!this.lockSalesOrder) {
            this.salesData.stock_location_id = ''
            this.salesData.stock_location_id = this.stocklocationsOptionsByCountry[0].value
          }
        })
      },
      refreshSales() {
        this.response = false
        this.initSetupArea()
      },
      processForm: function (formFieldData) {
        if (!this.lockSalesOrder) {
          let validationFailedCount = 0
          if (this.cartPromotionalRowCurrentStatus.length > 0) {
            validationFailedCount = this.cartPromotionalRowCurrentStatus.filter(x => x.valid === false).length
          }
          if (validationFailedCount < 1) {
            this.$v.salesData.$touch()
            return new Promise((resolve, reject) => {
              if (!this.$v.salesData.$error && !this.addressesValidationStatus) {
                this.postSalesAction({sales_data: formFieldData}).then((res) => {
                  let error = typeof res.data.error !== 'undefined' ? res.data.error : ''
                  if (error !== '') {
                    Dialog.create({
                      title: 'Error',
                      buttons: [
                        {
                          label: 'Ok',
                          handler: () => {
                            this.invalidRequest()
                          }
                        }
                      ],
                      noBackdropDismiss: true,
                      noEscDismiss: true,
                      message: `Error Occurred ! eSac redemption creation saved partially.Refer this error with system support Error : ` + error
                    })
                  } else {
                    // Update vuex saveData
                    // Wrap response with data {} object to ensure follow API request standard
                    this.$v.$reset()
                    this.manipulateSaveData(RESPONSE)
                    this.currentTab = 'payments'
                  }
                  resolve(res)
                }).catch(error => {
                  if (typeof error.response !== 'undefined' && error.response.status === 422) {
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
                  this.currentTab = 'items'
                })
              } else {
                reject(this.$v.salesData.$error)
                this.setNotificationHandler()
                this.currentTab = 'items'
              }
            })
          } else {
            return new Promise((resolve, reject) => {
              Dialog.create({
                title: 'Attention !',
                noBackdropDismiss: true,
                noEscDismiss: true,
                message: `Promotional items selection invalid - Please choose missing promotional items ! [Follow YELLOW color indicator]`
              })
              this.currentTab = 'items'
            })
          }
        } else {
          return new Promise((resolve, reject) => {
            this.$v.salesData.$touch()
            if (this.saleID && !this.$v.salesData.$error) {
              formFieldData.status = 'save'
              this.putSalesAction({sales_data: formFieldData}).then((res) => {
                this.manipulateSaveData(RESPONSE)
                resolve(res)
              })
            } else {
              reject(this.$v.salesData.$error)
              this.setNotificationHandler()
            }
          })
        }
      },
    },
    destroyed: function () {
      // Clear all data before exit sales area
      this.unSetOrderData({uplineUserID: '', downlineUserID: '', downlineOrder: false, orderID: '', newOrder: false})
      this.unsetMemberData()
      this.unsetPromotionalRowCurrentStatus()
      if (!this.lockSalesOrder) {
        this.unsetCartPwpItemTempList()
        this.unsetCartPwpValidationIds()
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
</style>
