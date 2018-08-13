<template>
    <div class="sales-items-tab">
        <div class="content">
            <div class="row">
                <div class="col-lg-12 full-height">
                    <q-card color="white" class="full-height full-width">
                        <q-card-title class="text-black">
                            <q-field
                                    :error="!hasReturnQuantity"
                                    error-label="Please return at least one product"
                            >
                                {{$t('sale.exchange.detail.tableTitle.return')}}
                            </q-field>
                        </q-card-title>
                        <q-card-main>
                            <table class="text-black col-lg-10 q-table-html bordered cell-separator fit responsive">
                                <thead class="bg-grey-4">
                                <tr>
                                    <th class="text-center" v-for="th in returnTableTh">
                                        {{ th }}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr
                                        v-if="exchangeData.sale !== undefined && exchangeData.sale !== null
                              && exchangeData.sale.products !== undefined && exchangeData.sale.products !== null
                              && exchangeData.sale.products.length > 0"
                                        v-for="(product,product_index) in exchangeData.sale.products"
                                >
                                    <td align="center"></td>
                                    <td align="left">{{product.sku}}</td>
                                    <td align="left">{{product.name}}</td>
                                    <td align="center">
                                        <q-select
                                                v-model="product.transaction_type_id"
                                                :options="masterDataOptionsCreator('sale_types')"
                                                filter
                                                color="black"
                                                disable
                                                @input="(item) => selected(item, 'transaction_type')"
                                        ></q-select>
                                    </td>
                                    <td align="center">{{product.quantity}}</td>
                                    <td align="center">{{product.available_quantity}}</td>
                                    <td align="center">{{product.base_price.gmp_price_tax | formatPriceDouble }}
                                    <td align="center">
                                        {{product.base_price.gmp_price_tax * product.quantity | formatPriceDouble }}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        <q-input
                                                type="number"
                                                v-model="product.return_quantity"
                                                v-if="product.product_type !== 'promoProduct'"
                                                @input="processQuantityChange(product, 'return'), validator.exchangeData.sale.products.$each[product_index].$touch()"
                                                :error="validator.exchangeData.sale.products.$each[product_index].$error"
                                                :disable="lockProductExchange"
                                                color="black"
                                        >
                                        </q-input>
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(product, null, 'products', 'return_quantity')}}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        {{product.return_amount | formatPriceDouble }}
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(product, null, 'products', 'return_amount') | formatPriceDouble}}
                                    </td>
                                </tr>
                                </tbody>
                                <tbody
                                        v-if="exchangeData.sale !== undefined && exchangeData.sale !== null
                              && exchangeData.sale.kitting !== undefined && exchangeData.sale.kitting !== null
                              && exchangeData.sale.kitting.length > 0"
                                        v-for="(kitting,product_index) in exchangeData.sale.kitting"
                                >
                                <tr>
                                    <td align="center">
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
                                    <td align="center">
                                        <q-select
                                                v-model="kitting.transaction_type_id"
                                                :options="masterDataOptionsCreator('sale_types')"
                                                filter
                                                color="black"
                                                disable
                                                @input="(item) => selected(item, 'transaction_type')"
                                        ></q-select>
                                    </td>
                                    <td align="center">{{kitting.quantity}}</td>
                                    <td align="center">{{kitting.available_quantity}}</td>
                                    <td align="center">{{kitting.kitting_price.gmp_price_tax | formatPriceDouble }}
                                    <td align="center">
                                        {{kitting.kitting_price.gmp_price_tax * kitting.quantity | formatPriceDouble }}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        <q-input
                                                type="number"
                                                v-model="kitting.return_quantity"
                                                v-if="kitting.product_type !== 'promoProduct'"
                                                @input="processQuantityChange(kitting, 'return'), validator.exchangeData.sale.kitting.$each[product_index].$touch()"
                                                :error="validator.exchangeData.sale.kitting.$each[product_index].$error"
                                                :disable="lockProductExchange"
                                                color="black"
                                        >
                                        </q-input>
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(kitting, null, 'kitting', 'return_quantity')}}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        {{kitting.return_amount | formatPriceDouble }}
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(kitting, null, 'kitting', 'return_amount') | formatPriceDouble}}
                                    </td>
                                </tr>
                                <tr
                                        v-for="(productInKitting, kitting_index) in kitting.kitting_products"
                                        v-if="!hideKittingItems.includes(product_index)"
                                        class="bg-green-1">
                                    <td></td>
                                    <td align="left">{{productInKitting.product.sku}}</td>
                                    <td align="left">{{productInKitting.product.name}}</td>
                                    <td align="center">
                                        <q-select
                                                v-model="productInKitting.product.transaction_type_id"
                                                :options="masterDataOptionsCreator('sale_types')"
                                                filter
                                                color="black"
                                                disable
                                                @input="(item) => selected(item, 'transaction_type')"
                                        ></q-select>
                                    </td>
                                    <td align="center">
                                        {{productInKitting.quantity > 0 ? productInKitting.quantity : productInKitting.foc_qty}}
                                    </td>
                                    <td align="center">{{productInKitting.available_quantity}}</td>
                                    <td align="center">
                                        {{productInKitting.product.base_price.average_price_unit | formatPriceDouble }}
                                    <td align="center">{{productInKitting.product.base_price.total | formatPriceDouble
                                        }}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        <q-input
                                                type="number"
                                                v-model="productInKitting.return_quantity"
                                                @input="processQuantityChange(productInKitting,'return', kitting ), validator.exchangeData.sale.kitting.$each[product_index].kitting_products.$each[kitting_index].$touch()"
                                                :error="validator.exchangeData.sale.kitting.$each[product_index].kitting_products.$each[kitting_index].$error"
                                                :disable="lockProductExchange"
                                                color="black"
                                        >
                                        </q-input>
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(productInKitting, kitting, 'kitting_product', 'return_quantity')}}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        {{productInKitting.return_amount | formatPriceDouble }}
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(productInKitting, kitting, 'kitting_product', 'return_amount') | formatPriceDouble}}
                                    </td>
                                </tr>
                                </tbody>
                                <tbody>
                                <tr
                                        v-if="exchangeData.sale !== undefined && exchangeData.sale !== null
                              && exchangeData.sale.promotions !== undefined && exchangeData.sale.promotions !== null
                              && exchangeData.sale.promotions.length > 0"
                                        v-for="(promo, promo_index) in exchangeData.sale.promotions">
                                    <td></td>
                                    <td align="left">{{promo.sku}}</td>
                                    <td align="left">{{promo.name}}</td>
                                    <td align="center">
                                        PWP/FOC
                                    </td>
                                    <td align="center">{{promo.selected_quantity}}</td>
                                    <td align="center">{{promo.available_quantity}}</td>
                                    <td align="center">{{promo.base_price.gmp_price_tax | formatPriceDouble }}</td>
                                    <td align="center">
                                        {{promo.base_price.gmp_price_tax * promo.selected_quantity | formatPriceDouble
                                        }}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        <q-input
                                                type="number"
                                                v-model="promo.return_quantity"
                                                @input="processQuantityChange(promo, 'return'), validator.exchangeData.sale.promotions.$each[promo_index].$touch()"
                                                :error="validator.exchangeData.sale.promotions.$each[promo_index].$error"
                                                :disable="lockProductExchange"
                                                color="black"
                                        >
                                        </q-input>
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(promo, null, 'promotions', 'return_quantity')}}
                                    </td>
                                    <td align="center" v-if="!lockProductExchange">
                                        {{promo.return_amount | formatPriceDouble }}
                                    </td>
                                    <td align="center" v-if="lockProductExchange">
                                        {{getReturnQuantity(promo, null, 'promotions', 'return_amount') | formatPriceDouble}}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </q-card-main>
                    </q-card>
                    <q-card color="white" class="full-height full-width">'
                        <q-card-title class="text-black">{{$t('sale.exchange.detail.tableTitle.exchange')}}
                        </q-card-title>
                        <q-card-main>
                            <div class="action-bar" v-if="!lockProductExchange">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="row items-baseline justify-start gutter-sm">
                                            <div class="col-lg-4">
                                                <q-input v-model="terms"
                                                         autofocus
                                                         inverted
                                                         :disable="lockProductExchange"
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
                                                               :disable="lockProductExchange"
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
                                            <th class="text-center" v-for="th in exchangeTableTH">
                                                {{ th }}
                                            </th>
                                            </thead>
                                            <tbody>
                                            <tr class="highlight-and-fade standard-product"
                                                v-for="(product, index) in exchangeData.exchange_products">
                                                <td class="text-left" :data-th="exchangeTableTH[0]">
                                                    <q-checkbox v-if="!lockProductExchange"
                                                                :val="product.product_id"
                                                                v-model="cartSelectedProductIDs"/>
                                                    <q-btn color="blue" flat
                                                           v-if="typeof product.general !== 'undefined' && typeof product.general.product_additional_requirements !== 'undefined'"
                                                           @click="mixActions('standardProductModal', 'standard', product, product.name)">
                                                        <q-icon name="add_circle_outline"></q-icon>
                                                    </q-btn>
                                                </td>
                                                <td :data-th="exchangeTableTH[1]">{{ product.sku }}</td>
                                                <td :data-th="exchangeTableTH[2]">{{ product.name }}</td>
                                                <!--<td class="text-left" :data-th="exchangeTableTH[3]">-->
                                                <!--<q-select-->
                                                <!--:disable="lockProductExchange"-->
                                                <!--v-model="lockProductExchange ? product.transaction_type_id : product.transaction_type"-->
                                                <!--:options="masterDataOptionsCreator('sale_types',  typeof product.general !== 'undefined' ? product.general.sale_types : [])"-->
                                                <!--/>-->
                                                <!--</td>-->
                                                <td width="10%" :data-th="exchangeTableTH[3]">
                                                    <q-input type="number"
                                                             v-model="product.quantity"
                                                             :error="validator.exchangeData.exchange_products.$each[index].quantity.$error"
                                                             :disable="lockProductExchange"
                                                             @input="processQuantityChange (product, 'exchange'), resetAdditionalRequirementItems(product.product_id, product.kitting_id, getProductAdditionalRequirementByMasterTitle(product.general.product_additional_requirements)), validator.exchangeData.exchange_products.$each[index].quantity.$touch"
                                                             :after="[{icon: 'warning', error: true, handler () {}}]"
                                                             align="center"></q-input>
                                                </td>
                                                <td :data-th="exchangeTableTH[4]">
                                                    {{ product.base_price.gmp_price_tax | formatPriceDouble }}
                                                </td>
                                                <td :data-th="exchangeTableTH[5]">
                                                    {{ product.chargedQuantity !== undefined ? product.base_price.gmp_price_tax * product.chargedQuantity : product.base_price.gmp_price_tax * product.quantity | formatPriceDouble
                                                    }}
                                                </td>
                                            </tr>
                                            <tr class="highlight-and-fade kitting-product"
                                                v-for="(kitting, index) in exchangeData.exchange_kitting">
                                                <td class="text-left" width="12%" :data-th="exchangeTableTH[0]">
                                                    <q-checkbox v-if="!lockProductExchange"
                                                                :val="kitting.kitting_id"
                                                                v-model="cartSelectedKittingIDs"/>
                                                    <q-btn color="blue" flat
                                                           @click="mixActions('kittingProductsListModal', 'kitting', kitting.kitting_products, kitting.name, kitting.code, kitting.kitting_id, kitting.quantity), kittingDefaultTab = 'kitComponents'">
                                                        <q-icon name="add_circle_outline"></q-icon>
                                                    </q-btn>
                                                </td>
                                                <td :data-th="exchangeTableTH[1]">{{ kitting.code }}</td>
                                                <td :data-th="exchangeTableTH[2]">{{ kitting.name }}</td>
                                                <!--<td class="text-left" :data-th="exchangeTableTH[3]">-->
                                                <!--<q-select-->
                                                <!--:disable="lockProductExchange"-->
                                                <!--v-model="lockProductExchange ? kitting.transaction_type_id : kitting.transaction_type"-->
                                                <!--:options="masterDataOptionsCreator('sale_types', typeof kitting.general !== 'undefined' ? kitting.general.sale_types : [], kitting.name)"-->
                                                <!--/>-->
                                                <!--</td>-->
                                                <td width="10%" :data-th="exchangeTableTH[3]">
                                                    <q-input type="number" v-model="kitting.quantity"
                                                             :disable="lockProductExchange"
                                                             :error="validator.exchangeData.exchange_kitting.$each[index].quantity.$error"
                                                             :after="[{icon: 'warning', error: true, handler () {}}]"
                                                             @input="processQuantityChange(kitting, 'exchange'), resetAdditionalRequirementItems(kitting.product_id, kitting.kitting_id), getProductAdditionalRequirementByMasterTitle(kitting.general.product_additional_requirements), validator.exchangeData.exchange_kitting.$each[index].quantity.$touch"

                                                             align="center"></q-input>
                                                </td>
                                                <td :data-th="exchangeTableTH[4]">
                                                    {{ kitting.kitting_price.gmp_price_tax | formatPriceDouble
                                                    }}
                                                </td>
                                                <td :data-th="exchangeTableTH[5]">
                                                    {{ kitting.kitting_price.gmp_price_tax * kitting.quantity | formatPriceDouble
                                                    }}
                                                </td>
                                            </tr>
                                            <!--<tr v-show="exchangeData.products.length <= 0 && exchangeData.kittings.length <= 0 && exchangeData.promotion.length <= 0">-->
                                            <!--<td :colspan="lockProductExchange ? 10 : 9">-->
                                            <!--<q-field error-label="Minimum 1 product required or missing required fields"-->
                                            <!--helper="*"-->
                                            <!--:error="validations.exchangeData.products.$error || validations.exchangeData.kittings.$error">-->
                                            <!--<empty-list></empty-list>-->
                                            <!--</q-field>-->
                                            <!--</td>-->
                                            <!--</tr>-->
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
                                        <q-tabs v-model="kittingDefaultTab" class="no-shadow" inverted color="grey-7"
                                                align="left">
                                            <q-tab default name="kitComponents"
                                                   slot="title"
                                                   :label="$t('Common.tab.items.label.kitComponents')"/>
                                            <q-tab name="redemption" slot="title"
                                                   :hidden="!kittingRedemptionEligibility(kittingModalData.items)"
                                                   :label="$t('Common.tab.items.label.redemption')"/>
                                            <q-tab-pane name="kitComponents"
                                                        class="no-border bg-white sales-items shadow-1 no-padding">
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
                                                        <td>
                                                            {{ !lockProductExchange ? item.quantity !== 0 ? item.quantity * kittingModalData.kittingQty : item.foc_qty * kittingModalData.kittingQty : item.quantity !== 0 ? item.quantity : item.foc_qty
                                                            }} <span class="text-grey-5"
                                                                     v-if="item.foc_qty > 0"> (FOC) </span>
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
                                                <div class="row justify-between evoucher-selection fas fa-border pd-10">
                                                    <div class="col-lg-auto">
                                                        eVoucher (For future redemption)
                                                    </div>
                                                    <div class="col-lg-auto">
                                                        <q-checkbox
                                                                :val="true"
                                                                :value="checkEvoucherCondition(kittingModalData.productID, kittingModalData.kittingID, 'kitting')"
                                                                @blur="addEvoucherProducts(kittingModalData.productID, kittingModalData.kittingID, 'sizes', 'kitting', kittingModalData.items)"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="row mt-20">
                                                    <div class="col-lg-12 text-center">
                                                        <h5>OR</h5>
                                                    </div>
                                                </div>
                                                <div class="mt-20">
                                                    <div v-for="item in kittingModalData.items">
                                                        <sizes-attributes v-bind:exchangeData="exchangeData"
                                                                          v-bind:standardProductModalData="remapKittingProductData(item, kittingModalData.kittingQty)"
                                                                          v-bind:exchangeTableTH="exchangeTableTH"></sizes-attributes>
                                                    </div>
                                                </div>
                                                <!-- Redemption End -->
                                            </q-tab-pane>
                                        </q-tabs>
                                    </div>
                                </template>
                            </layout-modal>
                            <layout-modal refs="standardProductModal"
                                          urlResetPathName=""
                                          :title="standardProductModalData.title"
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
                                        <div class="row">
                                            <div class="col-lg-12 sizes-area"
                                                 v-if="typeof standardProductModalData.item.general !== 'undefined' && typeof standardProductModalData.item.general.product_additional_requirements !== 'undefined' && getProductAdditionalRequirementByMasterTitle(standardProductModalData.item.general.product_additional_requirements).filter(x => x.title === 'sizes').length > 0">
                                                <div class="row justify-between evoucher-selection fas fa-border pd-10 mt-20">
                                                    <div class="col-lg-auto">
                                                        eVoucher (For future redemption)
                                                    </div>
                                                    <div class="col-lg-auto">
                                                        <q-checkbox
                                                                :val="true"
                                                                :value="checkEvoucherCondition(standardProductModalData.item.product_id, standardProductModalData.item.kitting_id, 'kitting')"
                                                                @blur="addEvoucherProducts(standardProductModalData.item.product_id, standardProductModalData.item.kitting_id, 'sizes')"
                                                        />
                                                    </div>
                                                </div>
                                                <div class="row mt-20">
                                                    <div class="col-lg-12 text-center">
                                                        <h5>OR</h5>
                                                    </div>
                                                </div>
                                                <div class="row sizes-selection mt-20">
                                                    <sizes-attributes v-bind:exchangeData="exchangeData"
                                                                      v-bind:standardProductModalData="standardProductModalData"
                                                                      v-bind:exchangeTableTH="exchangeTableTH"></sizes-attributes>
                                                </div>
                                            </div>
                                            <div class="col-lg-12">
                                                <div class="address-area"
                                                     v-if="typeof standardProductModalData.item.general !== 'undefined' && typeof standardProductModalData.item.general.product_additional_requirements !== 'undefined' && getProductAdditionalRequirementByMasterTitle(standardProductModalData.item.general.product_additional_requirements).filter(x => x.title === 'address').length > 0">
                                                    <q-card>
                                                        <q-card-main>
                                                            <div class="row justify-between">
                                                                <div class="col-lg-3">
                                                                    Address
                                                                </div>
                                                                <div class="col-lg-8">

                                                                </div>
                                                            </div>
                                                        </q-card-main>
                                                    </q-card>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </layout-modal>
                            <layout-modal refs="productListingModal"
                                          urlResetPathName=""
                                          title="Product Listing"
                                          :shadow="false"
                                          minWidth="70vw"
                                          minHeight="90vh"
                                          footerButtonTwo="Close"
                                          :headerSearchBar="true"
                                          :noEscDismiss="false"
                                          :search="true"
                                          classes="transparent text-black">
                                <template slot="modal-data" slot-scope="props">
                                    <listing-search-form v-bind:salesData="exchangeData"
                                                         v-bind:memberDetails="memberDetails"
                                                         :addToCart="addToCart"></listing-search-form>
                                </template>
                            </layout-modal>
                            <q-loader :visible="isProcessingCart"></q-loader>
                        </q-card-main>
                    </q-card>
                    <q-loader :visible="isProcessingList"></q-loader>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import Vue from 'vue'
  import {required} from 'vuelidate/lib/validators'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import listingSearchForm from 'src/application/global/components/common/shared-forms/listingSearchForm'

  export default {
    name: 'sales-items-tab',
    components: {
      EmptyList,
      qLoader,
      listingSearchForm,
      layoutModal
    },
    mixins: [masterDataTransformarMixin],
    props: {
      exchangeData: {
        type: Object,
        required: true
      },
      productGroupings: {
        type: Array,
        required: true
      },
      memberDetails: {
        required: true
      },
      updateExchangeAmount: {
        type: Function
      },
      updateReturnAmount: {
        type: Function
      },
      validator: {
        type: Object,
        required: true
      },
      lockProductExchange: {
        type: Boolean,
        required: true
      },
      addToCart: {
        type: Function,
        required: false
      },
      processProductGroupingsContra: {
        type: Function,
        required: false
      },
      hasReturnQuantity: {
        type: Boolean,
        required: true
      }
    },
    data: function () {
      return {
        kittingDefaultTab: 'kitComponents',
        terms: '',
        cartSelectedProductIDs: [],
        cartSelectedKittingIDs: [],
        hideKittingItems: [],
        returnTableTh: [
          '',
          this.$t('sale.exchange.detail.tableLabel.productCode'),
          this.$t('sale.exchange.detail.tableLabel.productName'),
          this.$t('sale.exchange.detail.tableLabel.transactionType'),
          this.$t('sale.exchange.detail.tableLabel.purchaseQty'),
          this.$t('sale.exchange.detail.tableLabel.availableQty'),
          this.$t('sale.exchange.detail.tableLabel.unitRatioPrice'),
          this.$t('sale.exchange.detail.tableLabel.totalPrice'),
          this.$t('sale.exchange.detail.tableLabel.returnQty'),
          this.$t('sale.exchange.detail.tableLabel.returnAmount')
        ],
        exchangeTableTH: [
          ' ',
          this.$t('sale.exchange.detail.tableLabel.productCode'),
          this.$t('sale.exchange.detail.tableLabel.productName'),
          this.$t('sale.exchange.detail.tableLabel.quantity'),
          this.$t('sale.exchange.detail.tableLabel.unitPrice'),
          this.$t('sale.exchange.detail.tableLabel.totalPrice')
        ],
        newProduct: {
          id: 0,
          product_code: '',
          product_name: '',
          transaction_type: '',
          quantity: 0,
          unit_price: 0,
          total_price: 0,
          avg_price: 0
        },
        searchedProduct: undefined,
        kittingModalData: {
          items: [],
          kittingID: '',
          kittingQty: '',
          title: ''
        },
        standardProductModalData: {
          item: {},
          title: ''
        },
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
    mounted() {
      this.master.keys = [
        'sale_types',
        'promotion_free_items_promo_types'
      ]
    },
    validations: {
      newProduct: {
        product_code: {
          required
        },
        product_name: {
          required
        },
        transaction_type: {
          required
        }
      }
    },
    methods: {
      ...mapActions([
        'getSalesProductSearchAction',
        'getProductByIdAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      search(terms, done, field) {
        if (field === 'product_code' || field === 'product_name') {
          let query = {
            country_id: this.memberDetails.details.country_id,
            user_id: this.exchangeData.sale.member.user_id,
            transaction_location_id: this.exchangeData.transaction_location_id,
            text: terms
          }
          this.getSalesProductSearchAction(query).then(res => {
            done(this.listProductAndKittingSearchList.list)
          })
        }
      },
      selected(item, field) {
        if (field === 'product_name') {
          this.newProduct.product_name = item.sublabel
          this.newProduct.product_code = item.label
          this.newProduct.id = item.value
          this.fetchProductDetail()
        } else {
          this[field] = item.sublabel
        }
      },
      fetchProductDetail() {
        let query = {
          country_id: this.memberDetails.details.country_id,
          product_id: this.newProduct.id
        }
        this.getProductByIdAction(query).then(res => {
          this.searchedProduct = res
          this.newProduct.unit_price = res.base_price.nmp_price
          this.newProduct.quantity = 1
          this.processQuantityChange(this.newProduct)
        })
      },
      reset(val) {
        if (val === 'newProduct') {
          this.newProduct = {
            id: 0,
            product_code: '',
            product_name: '',
            transaction_type: '',
            quantity: 0,
            unit_price: 0,
            total_price: 0,
            avg_price: 0
          }
          this.$v.newProduct.$reset()
        }
      },
      processQuantityChange(product, type = '', productOfKitting = undefined) {
        if (type === 'return') {
          if (product.base_price !== null && product.base_price !== undefined) {
            // calculating for normal product
            this.processProductGroupingsContra(product, type)
          } else if (product.kitting_price !== null && product.kitting_price !== undefined) {
            // even out the quantity for the whole kitting
            product.return_amount = 0
            let productReturnAmount = product.return_quantity
            product.kitting_products.forEach((element) => {
              let qty = element.quantity > 0 ? element.quantity : element.foc_qty
              let qtyPerKit = qty / product.quantity
              element.return_quantity = productReturnAmount * qtyPerKit
              // dont need to traverse twice, and this guarantees the result is always correct since it is return after post processing
              product.return_amount += this.processProductGroupingsContra(element, 'return')
            })
          }
        } else if (type === 'exchange') {
          // product.total_price = product.quantity * product.unit_price
          this.processProductGroupingsContra(product, type)
        }
        // if (type !== '') {
        //   this.processProductGroupingsContra(product, type)
        // }
      },
      addToExchangeList() {
        this.$v.newProduct.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.newProduct.$error) {
            let prod = Object.assign({}, this.newProduct)
            this.exchangeData.exchange_products.push(prod)
            this.processProductGroupingsContra(prod, 'exchange')
            this.reset('newProduct')
          } else {
            reject(this.$v.newProduct.$error)
          }
        })
      },
      removeProductFromExchange(product) {
        let indexOfProduct = this.exchangeData.exchange_products.indexOf(product)
        if (indexOfProduct > -1) {
          Vue.delete(this.exchangeData.exchange_products, indexOfProduct)
          processQuantityChange(product, 'exchange')
        }
      },
      toggleShowKittingProduct(productIndex) {
        if (this.hideKittingItems.includes(productIndex)) {
          this.hideKittingItems.pop(productIndex)
        } else {
          this.hideKittingItems.push(productIndex)
        }
      },
      reCalculateCart(type) {
        // Call parent method
        this.$emit('reCalculateCart', type)
      },
      resetAdditionalRequirementItems(productID, kittingID, types, identifier) {
        productID = typeof productID !== 'undefined' ? productID : null
        kittingID = typeof kittingID !== 'undefined' ? kittingID : null
        if (typeof types !== 'undefined' && types.length > 0) {
          types.forEach((type) => {
            let items = []
            if (identifier === 'kitting') {
              items = this.exchangeData.selected.additional_requirements[type.title].filter(x => x.kitting_id === kittingID)
            } else {
              items = this.exchangeData.selected.additional_requirements[type.title].filter(x => x.product_id === productID && x.kitting_id === kittingID)
            }
            if (items.length > 0) {
              items.forEach((item) => {
                let itemIndex = this.exchangeData.selected.additional_requirements[type.title].findIndex(x => x.product_id === item.product_id && x.kitting_id === kittingID)
                this.exchangeData.selected.additional_requirements[type.title].splice(itemIndex, this.exchangeData.selected.additional_requirements[type.title].length)
              })
            }
          })
        }
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
        if (section === 'promotion') {
          if (typeof data !== 'undefined' && Object.keys(data).length > 0) {
            this.promotionsModalData.data = Object.assign({}, data)
            this.promotionsModalData.title = title
          }
        }
      },
      getProductAdditionalRequirementByMasterTitle(data) {
        let requirements = []
        if (typeof this.masterData.product_additional_requirements !== 'undefined' && typeof data !== 'undefined' && data.length > 0) {
          data.forEach((item) => {
            requirements = this.masterData.product_additional_requirements.filter(x => x.id === item)
          })
          return requirements
        }
      },
      kittingRedemptionEligibility(data) {
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
      checkEvoucherCondition(productID, kittingID, identifier) {
        // productID = typeof productID !== 'undefined' ? productID : null
        // kittingID = typeof kittingID !== 'undefined' ? kittingID : null
        // let count = 0
        // if (identifier === 'kitting') {
        //   count = this.salesData.selected.additional_requirements.evoucher.filter(x => x.kitting_id === kittingID).length
        // } else {
        //   count = this.salesData.selected.additional_requirements.evoucher.filter(x => x.product_id === productID && x.kitting_id === kittingID).length
        // }
        // if (count > 0) {
        return true
        // } else {
        //   return false
        // }
      },
      removeRowFromCart() {
        let products = this.exchangeData.exchange_products
        let kittings = this.exchangeData.exchange_kitting
        if (this.cartSelectedProductIDs.length > 0) {
          this.cartSelectedProductIDs.forEach((id) => {
            let productIndex = products.findIndex(x => x.product_id === id)
            // this.resetAdditionalRequirementItems(id, null)
            products.splice(productIndex, 1)
            // process product grouping deletion
            let productGrouping = this.productGroupings.find(group => group.exchange_products.findIndex(x => x.product_id === id) > -1)
            if (productGrouping !== null && productGrouping !== undefined) {
              let indexInGrouping = productGrouping.exchange_products.findIndex(x => x.product_id === id)
              if (indexInGrouping > -1) {
                let productToBeDeleted = productGrouping.exchange_products[indexInGrouping]
                Vue.delete(productGrouping.exchange_products, indexInGrouping)
                this.processProductGroupingsContra(productToBeDeleted, 'exchange')
              }
            }
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
        this.reCalculateCart()
      },
      getPromoTypeNameByID(id) {
        if (typeof this.masterData.promotion_free_items_promo_types !== 'undefined') {
          let type = this.masterData.promotion_free_items_promo_types.filter(x => x.id === id)
          if (type.length > 0) {
            return type[0].title
          }
        }
        return '-'
      },
      getReturnQuantity(product, kitting, productType, field) {
        let productInList = null
        if (productType === 'products') {
          productInList = this.exchangeData.return_products.find(prod => prod.sale_product_id === product.product_id)
        } else if (productType === 'kitting') {
          productInList = this.exchangeData.return_kitting.find(prod => prod.id === product.id)
        } else if (productType === 'kitting_product') {
          let kit = this.exchangeData.return_kitting.find(prod => prod.sale_kitting_id === kitting.id)
          productInList = kit.kitting_products.find(prod => prod.sale_product_id === product.id)
        } else if (productType === 'promotions') {
          productInList = this.exchangeData.return_promotions.find(prod => prod.sale_product_id === product.id)
        }
        if (productInList !== null && productInList !== undefined) {
          if (field === 'return_quantity') {
            return product.return_quantity = productInList.return_quantity
          } else if (field === 'return_amount') {
            return product.return_amount = productInList.return_amount
          }
        } else {
          return 0
        }
      }
    }
  }
</script>
