<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SalesForm"
                    :formTitle="$t('sales.newSales.title')"
                    :backgroudColor="false"
                    v-bind:formFieldData="salesData"
                    urlResetPathName="New Sales & Order History"
                    formAction="salesOrderAction"
                    :disableSubmit="!isDirty && !SalesOrderConversionCheck()"
                    :buttonOneCaption="saleID ? SalesOrderConversionCheck() ? 'Convert Sales' : $t('Common.Update.Btn') : $t('Common.Save.Btn')"
                    :buttonTwoCaption="saleID ? SalesOrderConversionCheck() ? 'Convert Sales And Close' : $t('Common.UpdateClose.Btn') : $t('Common.SaveClose.Btn')"
                    :formSubmit="processForm">
            <template slot="form">
                <div class="form-holder">
                    <div class="row">
                        <div class="col-lg-12 shadow-1">
                            <div class="row justify-end">
                                <div class="col-lg-7">
                                    <q-card square flat color="white" class="full-height">
                                        <q-card-main class="text-black full-height">
                                            <div class="row items-start full-height content-between">
                                                <div class="col-lg-6 col-md-12 col-xs-12 personal-data-holder">
                                                    <q-list no-border
                                                            dense
                                                            v-if="typeof memberDetails !== 'undefined' && Object.keys(memberDetails).length > 0">
                                                        <q-item tag="label" multiline
                                                                v-if="typeof memberDetails.upline.name !== 'undefined' && memberDetails.upline.name !== null && salesData.sponsor_member_id !== ''">
                                                            <q-item-main>
                                                                <q-item-tile label>Sponsor</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    {{ typeof memberDetails.upline.name !== 'undefined' && memberDetails.upline.name !== null ? memberDetails.upline.name : '-- N/A --'
                                                                    }}
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item-separator
                                                                v-if="salesData.sponsor_member_id ===  salesData.downline_member_id"/>
                                                        <q-item v-if="!memberChange && salesData.skip_downline && this.salesData.sponsor_member_id !== ''"
                                                                tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile right>
                                                                    <q-btn-group outline>
                                                                        <q-btn @click="activateMemberChange(memberChange)"
                                                                               outline
                                                                               size="sm"
                                                                               color="negative"
                                                                               icon="swap_horiz"
                                                                               label="Change Member">
                                                                        </q-btn>
                                                                        <q-btn @click="removeSponsor()"
                                                                               outline
                                                                               size="sm"
                                                                               color="negative"
                                                                               icon="close"
                                                                               label="Remove Sponsor">
                                                                        </q-btn>
                                                                    </q-btn-group>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item v-if="memberChange && salesData.skip_downline"
                                                                tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile right>
                                                                    <q-input v-model.trim="terms"
                                                                             clearable
                                                                             inverted-light
                                                                             color="white text-black"
                                                                             class="no-shadow custom-input-border"
                                                                             autofocus
                                                                             :placeholder="$t('members.iboIbName.placeholder.label')">
                                                                        <q-autocomplete
                                                                                @search="(terms, done) => search(terms, done, 'terms')"
                                                                                @selected="(item, keyboard) => selected(item, 'terms', keyboard)"
                                                                        />
                                                                    </q-input>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
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
                                                <div class="col-lg-6 col-md-12 col-xs-12 order-data-holder">
                                                    <q-list no-border dense>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Trans Date</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input
                                                                            inverted-light
                                                                            color="white text-black"
                                                                            class="no-shadow custom-input-border relative-position"
                                                                            clearable
                                                                            disable
                                                                            :value="lockSalesOrder ? formatDate(salesData.transaction_date, 'DD/MM/YYYY') : getCurrentDate('DD/MM/YYYY')"
                                                                            type="text"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Trans Location</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-select
                                                                            inverted-light
                                                                            color="white text-black"
                                                                            class="no-shadow custom-input-border"
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
                                                                            inverted-light
                                                                            color="white text-black"
                                                                            class="no-shadow custom-input-border relative-position"
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
                                                                            inverted-light
                                                                            color="white text-black"
                                                                            class="no-shadow custom-input-border"
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
                                                                            inverted-light
                                                                            color="white text-black"
                                                                            class="no-shadow custom-input-border relative-position"
                                                                            clearable
                                                                            :disable="lockSalesOrder"
                                                                            v-model="salesData.remarks"
                                                                            type="textarea"
                                                                            :max-height="350"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                    </q-list>
                                                </div>
                                                <div class="col-lg-12 col-md-12 col-xs-12 documents-data-holder"
                                                     v-if="!(isProcessingForm || isProcessingCart || isProcessingSection || isProcessingTable)">
                                                    <div class="row">
                                                        <div class="col-lg-4 col-md-12 col-xs-12 document-data-holder">
                                                            <div class="row col">
                                                                <q-list no-border dense class="fit">
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
                                                                                        @click="$can($apply('invoice|download')) ? getDocuments(salesData.sale_id, 'preOrderNote') : ''">
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
                                                        <div class="col-lg-4 col-md-12 col-xs-12 document-data-holder">
                                                            <div class="row">
                                                                <q-list no-border dense class="fit">
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
                                                        <div class="col-lg-4 col-md-12 col-xs-12 document-data-holder">
                                                            <div class="row">
                                                                <q-list no-border dense class="fit">
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
                                                      <div class="col-lg-4 col-md-12 col-xs-12 document-data-holder" v-if="salesData.has_virtual_invoice && salesData.invoice !== null && salesData.invoice !== undefined">
                                                        <div class="row">
                                                          <q-list no-border dense class="fit">
                                                            <q-item tag="div" data-schema="invoice|download"
                                                                    multiline
                                                                    :class="{'disabled' : !$can($apply('invoice|download'))}">
                                                              <q-item-main>
                                                                <q-item-tile sublabel>AMP</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                  <q-chip class="cursor-pointer fit"
                                                                          square small
                                                                          icon="launch"
                                                                          color="primary"
                                                                          @click="$can($apply('invoice|download')) ? getDocuments(salesData.invoice_id,'ampInvoice') : ''">
                                                                    Download Invoice
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
                                <div class="col-lg-5 col-md-12 col-xs-12">
                                    <q-card flat square color="white" class="full-height no-padding">
                                        <q-card-main class="text-black no-padding full-height">
                                            <div class="row full-height">
                                                <div class="col-4">
                                                    <div class="row no-margin content-stretch cv-boxes full-height">
                                                        <div class="col-12 pd-5">
                                                            <span class="text-grey-5">Total CV</span>
                                                            <h5>{{ salesData.cvs.total_cv }}</h5>
                                                        </div>
                                                        <div class="col-12 pd-5">
                                                            <span class="text-grey-5">Total WP CV</span>
                                                            <h5>{{ salesData.cvs.total_wp_cv }}</h5>
                                                        </div>
                                                        <div class="col-12 pd-5">
                                                            <span class="text-grey-5">Total AMP CV</span>
                                                            <h5>{{ salesData.cvs.total_amp_cv }}</h5>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-8 pd-5">
                                                    <q-list no-border dense>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Total NMP (NET)
                                                                </q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input type="number" :decimals="2"
                                                                             inverted-light
                                                                             color="white text-black"
                                                                             class="no-shadow custom-input-border"
                                                                             disable
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.total_nmp"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Admin Fee</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input type="number" :decimals="2"
                                                                             @input="reCalculateCart('admin_fees')"
                                                                             inverted-light
                                                                             color="white text-black"
                                                                             class="no-shadow custom-input-border"
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
                                                                    <q-input type="number" :decimals="2"
                                                                             @input="reCalculateCart('delivery_fees')"
                                                                             inverted-light
                                                                             color="white text-black"
                                                                             class="no-shadow custom-input-border"
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
                                                                    <q-input type="number" :decimals="2"
                                                                             inverted-light
                                                                             color="white text-black"
                                                                             class="no-shadow custom-input-border"
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
                                                                    <q-input type="number" :decimals="2"
                                                                             inverted-light
                                                                             color="white text-black"
                                                                             class="no-shadow custom-input-border"
                                                                             disable
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.tax_amount"/>
                                                                </q-item-tile>
                                                            </q-item-main>
                                                        </q-item>
                                                        <q-item tag="label" multiline>
                                                            <q-item-main>
                                                                <q-item-tile label>Rounding Adj. Amount</q-item-tile>
                                                                <q-item-tile sublabel>
                                                                    <q-input type="number" :decimals="2"
                                                                             inverted-light
                                                                             color="white text-black"
                                                                             class="no-shadow custom-input-border"
                                                                             disable
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.rounding_adjustment"/>
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
                                                                    <q-input type="number" :decimals="2"
                                                                             class="no-shadow custom-input-border"
                                                                             :color="salesData.invoice_id && salesData.invoice !== null ? 'positive' : 'negative'"
                                                                             readonly
                                                                             inverted
                                                                             :prefix="currencyLabelByCountry"
                                                                             v-model="salesData.order_fees.total_gmp"/>
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
                        <div class="col-lg-12 col-md-12 col-xs-12 shadow-1 sales">
                            <q-card flat squre color="white" class="no-padding">
                                <q-card-main class="text-black no-padding">
                                    <div class="form-tabs q-mt-md text-black">
                                        <q-tabs inverted two-lines no-pane-border color="grey-7" align="left"
                                                v-model="currentTab">
                                            <q-tab default name="items" :alert="$v.salesData.products.$error"
                                                   slot="title"
                                                   label="Items"/>
                                          <q-tab default name="corporate_sales" :alert="$v.salesData.corporate_sales !== undefined && $v.salesData.corporate_sales !== null ? $v.salesData.corporate_sales.$error : false"
                                                 slot="title"
                                                 v-if="isCorporateSales"
                                                 label="Company Details"/>
                                            <q-tab name="shipping" slot="title"
                                                   :disable="this.lockShipping"
                                                   :alert="$v.salesData.selected.shipping.$error || addressesValidationStatus"
                                                   label="Shipping"/>
                                            <q-tab name="payments" slot="title"
                                                   label="Payments"/>
                                            <q-tab name="eppMoto" slot="title" v-if="salesData.is_epp_moto_payment"
                                                   label="EPP Moto"/>
                                            <!-- Tab Content -->
                                            <q-tab-pane name="items" class="bg-white sales-items">
                                                <!-- Items Content-->
                                                <items-tab keep-alive
                                                           v-bind:salesData="salesData"
                                                           @reCalculateCart="reCalculateCart"
                                                           v-bind:memberDetails="memberDetails"
                                                           :lockSalesOrder="lockSalesOrder"
                                                           :validations="$v.salesData"
                                                           :addToCart="addToCart"></items-tab>
                                                <!-- Items Content End -->
                                            </q-tab-pane>
                                          <q-tab-pane keep-alive name="corporate_sales" class="bg-white sales-items">
                                            <!-- Company Detail Content-->
                                            <corporate-detail v-bind:salesData="salesData"
                                                              :lockSalesOrder="lockSalesOrder"
                                                              :validations="$v.salesData">
                                            </corporate-detail >
                                            <!-- Company Detail Content End -->
                                          </q-tab-pane>
                                            <q-tab-pane name="shipping" class="bg-white sales-items">
                                                <!-- Shipping Content-->
                                                <shipping-tab v-bind:salesData="salesData"
                                                              :id="saleID"
                                                              :lockShipping="lockShipping"
                                                              @checkAddressesValidationStatus="checkAddressesValidationStatus"
                                                              v-bind:memberDetails="memberDetails"
                                                              :lockSalesOrder="lockSalesOrder"
                                                              :validations="$v.salesData"
                                                              :skipDownline="isSkipDownline"
                                                ></shipping-tab>
                                                <!-- Shipping Content End -->
                                            </q-tab-pane>
                                            <q-tab-pane name="payments" class="bg-white sales-items">
                                                <!-- Payments Content-->
                                                <!--Todo callback temp fix to reload sales after payment-->
                                                <payment-tab v-bind:paymentData="salesData"
                                                             @reCalculateCart="reCalculateCart"
                                                             @changeCurrentTab="changeCurrentTab"
                                                             v-bind:memberDetails="memberDetails"
                                                             :processForm="processForm"
                                                             :initSetupArea="initSetupArea"
                                                             :callback="refreshSales"
                                                             :totalPayableAmount="salesData.order_fees.total_gmp"
                                                             :excludePaymentMode="isSkipDownline ? ['AEON', 'EPP (Moto)', 'EPP (Online)', 'EPP (Terminal)', 'MPOS', 'NETS'] : []"
                                                             :excludePaymentModeProvider="['credit_card_mega']"
                                                             :lock="lockSalesOrder"
                                                             :lockPayment="lockPayment"
                                                             :popupDialog="isSkipDownline ? confirmSalesCreationDialogConfig : confirmSalesMakePaymentDialogConfig"
                                                             :tabChanger="{emiter: 'changeCurrentTab', to: 'items', current: currentTab}"
                                                ></payment-tab>
                                                <!-- Payments Content End -->
                                            </q-tab-pane>
                                            <q-tab-pane name="eppMoto" v-if="salesData.is_epp_moto_payment"
                                                        class="bg-white sales-items">
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
  import {EppMotoTab} from 'src/application/sales/components/sales-tabs/index'
  import {ShippingTab, ItemsTab, PaymentTab, CorporateDetail} from 'src/application/global/components/common/shared-tabs'
  import {openURL, Dialog} from 'quasar'
  import {required, alphaNum, minLength, numeric, maxValue, between, email} from 'vuelidate/lib/validators'
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
      EppMotoTab,
      CorporateDetail
    },
    props: ['saleID', 'operation'],
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
            shipping: {}
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
      if (this.isCorporateSales) {
        //add corporate sales vlaidation here
        def.salesData.corporate_sales = {
          company_name: {
            required
          },
          company_address: {
            required
          },
          company_email: {
            email,
            required
          },
          person_in_charge: {
            required
          },
          contact_country_code_id: {
            required
          },
          contact_number: {
            required
          },
          company_reg_number: {
            required
          }
        }
      }
      return def
    },
    data: () => ({
      message: '',
      currentTab: '',
      lockSalesOrder: false,
      lockTransactionLocation: false,
      lockShipping: false,
      lockPayment: false,
      addressesValidationStatus: false,
      isCorporateSales: false,
      currentLineItemCount: 0,
      terms: '',
      memberChange: false,
      response: false,
      salesData: {
        skip_downline: 0,
        status: 'pending',
        country_id: '',
        function_type: 'promo',
        sponsor_member_id: '',
        is_corporate_sales: 0,
        downline_member_id: '',
        location_id: null,
        stock_location_id: null,
        cw_id: '',
        remarks: '',
        cvs: {
          total_cv: 0,
          total_qualified_cv: 0,
          total_amp_cv: 0,
          total_wp_cv: 0
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
        corporate_sales: {
          company_name: '',
          company_address: [
            {
              fields: []
            }
          ],
          company_email: '',
          person_in_charge: '',
          contact_country_code_id: '',
          contact_number: '',
          company_reg_number: ''
        },
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
      },
      confirmSalesMakePaymentDialogConfig: {title: 'Attention !', message: 'Confirm proceed to payment section ? (Note: Item change not allowed after proceeding to payment section)', disableLock: true},
      confirmSalesCreationDialogConfig: {title: 'Attention !', message: 'Confirm proceed to create sale ? (Note: Item change not allowed after sale creation)', disableLock: true},
      continueSalesCreation: true
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
      this.master.keys = [this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterKey.EPP_PAYMENT_APPROVAL_STATUS]
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
        orderData: state => state.salesCMP.orderData,
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
        'getUserType'
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
      isSkipDownline () {
        return !this.lockSalesOrder ? this.orderData.skipDownline : this.salesData.skip_downline
      }
    },
    methods: {
      ...mapActions([
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
        'getMemberSearchAction',
        'getDownlineValidationAction',
        'putSalesAction',
        'getStockLocations',
        'downloadPreOderNote',
        'convertEppMotoSalesOrderAction',
        'downloadAmpInvoice'
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
        if (!this.lockSalesOrder) {
          this.isCorporateSales = this.orderData.corporateOrder
          this.salesData.is_corporate_sales = this.isCorporateSales
          this.shippingSectionRestrictionStatus()
        }
      },
      invalidRequest() {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong OR Unauthorized Request. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.skipDirtyAlert = true
          this.$router.push({name: 'New Sales & Order History'})
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
        this.lockSalesOrder = true
        if (operation === 'RESPONSE') {
          this.response = true
          // Mixin function
          this.skipDirtyChecker()
          this.$router.replace({
            name: 'View Sales Order',
            params: {saleID: this.salesDetails.sale_id}
          })
        }
        if (typeof this.salesDetails !== 'undefined' && Object.keys(this.salesDetails).length > 0) {
          this.salesData = Object.assign({}, JSON.parse(JSON.stringify(this.salesDetails)))
          if (this.salesData.selected.shipping === null) {
            this.salesData.selected.shipping = {}
            this.salesData.selected.shipping.sale_delivery_method = 0
          }
          if (this.salesData.is_corporate_sales !== undefined && this.salesData.is_corporate_sales !== null && this.salesData.is_corporate_sales === 1) {
            this.isCorporateSales = true
            this.salesData.corporate_sales.company_address = JSON.parse(this.salesData.corporate_sales.company_address)
          }
          this.shippingSectionRestrictionStatus()
        }
      },
      setNotificationHandler() {
        this.setNotification({
          title: 'Sales Creation Failed',
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
        } else if (type === 'ampInvoice') {
          let query = {
            invoice_id: id
          }
          this.downloadAmpInvoice(query).then((res) => {
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
      search(terms, done, field) {
        let query = {
          sponsor_id: this.salesData.sponsor_member_id,
          search_text: this[field],
          limit: 10
        }
        this.getMemberSearchAction(this.removeFalsyValues(query)).then(() => {
          done(this.membersSearchData)
        })
      },
      selected(item, field, keyboard) {
        if (!keyboard) {
          let data = {upline_id: this.memberDetails.upline.user_id, user_id: item.userID}
          this.getMember(data)
          this.salesData.downline_member_id = item.userID
          this.activateMemberChange(this.memberChange)
        }
      },
      activateMemberChange(x) {
        this.memberChange = !x
      },
      changeCurrentTab(tab) {
        if (tab !== '') {
          this.currentTab = tab
        }
      },
      removeSponsor() {
        this.$q.dialog({
          title: 'Information',
          ok: 'Confirm',
          cancel: 'No',
          noBackdropDismiss: true,
          noEscDismiss: true,
          message: `Confirm Remove Sponsor`
        }).then(() => {
          this.salesData.sponsor_member_id = ''
        })
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
      async saleCreationHandler () {
        await this.$q.dialog({
          title: this.confirmSalesCreationDialogConfig.title,
          message: this.confirmSalesCreationDialogConfig.message,
          noEscDismiss: true,
          noBackdropDismiss: true,
          position: this.confirmSalesCreationDialogConfig.position ? this.confirmSalesCreationDialogConfig.position : 'top',
          ok: {
            label: this.confirmSalesCreationDialogConfig.okBtnText ? this.confirmSalesCreationDialogConfig.okBtnText : 'Yes',
            color: 'positive'
          },
          cancel: {
            label: this.confirmSalesCreationDialogConfig.cancelBtnText ? this.confirmSalesCreationDialogConfig.cancelBtnText : 'No',
            color: 'negative'
          },
        }).then(() => {
          this.continueSalesCreation = true
        }).catch(() => {
          this.continueSalesCreation = false
        })
      },
      processForm: async function (formFieldData, salesCreationDialog = true) {
        if (this.isSkipDownline && salesCreationDialog) {
          await this.saleCreationHandler()
        }
        if (this.continueSalesCreation) {
          if (!this.SalesOrderConversionCheck()) {
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
                          message: `Error Occurred ! Sale creation saved partially.Refer this error with system support Error : ` + error
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
          } else {
            return new Promise((resolve, reject) => {
              Dialog.create({
                title: this.$t('sale.order.detail.dialog.confirmSalesConversion.title'),
                message: this.$t('sale.order.detail.dialog.confirmSalesConversion.message'),
                noEscDismiss: true,
                noBackdropDismiss: true,
                position: 'top',
                ok: this.$t('sale.cancellation.detail.dialog.confirmSave.ok'),
                cancel: this.$t('sale.cancellation.detail.dialog.confirmSave.cancel')
              }).then(() => {
                // call epp convert here
                let query = {
                  sales_payments_ids: [this.salesData.epp_moto_payment.id]
                }
                this.convertEppMotoSalesOrderAction(query).then((res) => {
                  this.setNotification({
                    title: this.$t('sale.order.detail.notification.saleConversionSuccess.title'),
                    message: this.$t('sale.order.detail.notification.saleConversionSuccess.message'),
                    type: 'positive'
                  })
                  let query = {
                    sale_id: this.salesData.sale_id
                  }
                  this.getSalesDataAction(query).then(() => {
                    let manipulateSaveDataPromise = Promise.resolve(this.manipulateSaveData(REQUEST))
                    Promise.all([manipulateSaveDataPromise]).then(() => {
                      this.getAdditionalSaleDetails()
                    })
                  }).catch((error) => {
                    this.invalidRequest()
                  })
                  resolve(true)
                }).catch(error => {
                  this.setNotification({
                    title: this.$t('sale.order.detail.notification.salesConversionFailed.title'),
                    message: this.$t('sale.order.detail.notification.salesConversionFailed.message'),
                    type: 'negative'
                  })
                  reject(error)
                })
              }).catch((error) => {
                reject(error)
              })
            })
          }
        }
      },
      SalesOrderConversionCheck () {
        if (this.salesData.is_epp_moto_payment && this.isSaleOrderStatusPreOrder) {
          let paid = this.salesData.selected.payments.paid
          let paidTotal = 0.00
          paid.forEach((paidItem, paidIndex) => {
            if (paidItem.status >= 1) {
              paidTotal += parseFloat(paidItem.amount)
            }
          })
          let isFullyPaid = parseFloat(this.salesData.order_fees.total_gmp) === (parseFloat(paidTotal))
          if (isFullyPaid) {
            // has epp moto?
            if (this.salesData.epp_moto_payment !== null && this.salesData.epp_moto_payment !== undefined && this.salesData.epp_moto_payment.payment_detail !== null && this.salesData.epp_moto_payment.payment_detail !== undefined) {
              return this.salesData.epp_moto_payment.payment_detail.payment_response.approvalStatus.id ===  this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.EPP_PAYMENT_APPROVAL_STATUS, this.$const.masterData.APPROVED)
            }
          }
        }
        return false
      }
    },
    destroyed: function () {
      // Clear all data before exit sales area
      this.unSetOrderData({uplineUserID: '', downlineUserID: '', downlineOrder: false, orderID: '', newOrder: false})
      this.unsetMemberData()
      this.unsetPromotionalRowCurrentStatus()
      this.unsetCartPwpItemTempList()
      this.unsetCartPwpValidationIds()
    }
  }
</script>
<style lang="stylus">
    .cv-boxes > div
        border 1px solid #d3d3d3

    .cv-boxes > div:nth-of-type(1)
        border-top none
        border-bottom none

    .cv-boxes > div:nth-of-type(2)
        border-bottom none

    .cv-boxes > div:nth-of-type(3)
        border-bottom none

    .cv-boxes > div:nth-of-type(4)
        border-bottom none

    .form-tabs
        .active
            background-color white

    .sales
        .q-card-container
            padding 8px !important
</style>
