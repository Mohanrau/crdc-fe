<template>
    <div class="sales-items-tab relative-position">
        <div class="action-bar" v-if="!lockSalesOrder">
            <div class="row">
                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                    <div class="row items-baseline justify-start gutter-sm">
                        <div class="col-lg-4 col-md-12 col-xs-12">
                            <q-input v-model.trim="terms"
                                     autofocus
                                     inverted-light
                                     :disable="lockSalesOrder"
                                     :loading="isProcessingTable"
                                     color="white text-black"
                                     class="no-shadow custom-input-border"
                                     :after="[{ icon: 'search', error: true, handler () { this.search() }}]"
                                     v-on:keyup.enter="search()"
                                     :placeholder="$t('Common.tab.items.placeholder.scanBarcode')">
                            </q-input>
                        </div>
                        <div class="col-lg-8 col-md-12 col-xs-12">
                            <div class="row justify-between gutter-xs">
                                <div class="col-auto">
                                    <q-btn class="fit"
                                           v-shortkey="['ctrl', 'alt', 'a']"
                                           @shortkey.native="mixActions('productListingModal')"
                                           outline
                                           icon="add"
                                           :disable="lockSalesOrder || (isEsacRedemption && salesData.esac_vouchers_list.length === 0)"
                                           color="positive"
                                           @click="mixActions('productListingModal')">Add
                                    </q-btn>
                                </div>
                                <div class="col-auto" v-if="cartPwpItemsTempList.length > 0">
                                    <q-btn class="fit"
                                           outline
                                           icon="keyboard_arrow_down"
                                           color="primary">PWP
                                        <q-popover ref="pwpList"
                                                   anchor="bottom middle"
                                                   self="top middle">
                                            <q-list separator link>
                                                <q-item @click.native="revertBackPwpTempItemToCartByIndex(key), $refs.pwpList.close()"
                                                        v-for="(pwp, key) in cartPwpItemsTempList" :key="key">
                                                    <q-item-side icon="repeat"/>
                                                    <q-item-main>
                                                        <q-item-tile label>{{ pwp.name }}</q-item-tile>
                                                    </q-item-main>
                                                    <q-item-separator/>
                                                </q-item>
                                            </q-list>
                                        </q-popover>
                                    </q-btn>
                                </div>
                                <div class="col-auto" v-if="!isRentalSales">
                                    <q-btn-group flat>
                                        <q-btn color="grey-7" outline :label="$t('Common.RePurchase.Label')"
                                               @click="changeItemsSaleTypeByBulk($const.masterKey.REPURCHASE)"></q-btn>
                                        <q-btn color="grey-7" outline :label="$t('Common.AMP.Label')"
                                               @click="changeItemsSaleTypeByBulk($const.masterKey.AMP)"></q-btn>
                                        <q-btn color="grey-7" outline :label="$t('Common.BaUpgrade.Label')"
                                               @click="changeItemsSaleTypeByBulk($const.masterKey.BAUPGRADE)"></q-btn>
                                    </q-btn-group>
                                </div>
                                <div class="col-auto">
                                    <q-btn @click="removeRowFromCart"
                                           :disabled="cartSelectedProductIDs.length < 1 && cartPwpSelectedIDs.length < 1 && cartSelectedKittingIDs.length < 1"
                                           class="fit" outline icon="delete"
                                           color="negative">
                                    </q-btn>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="row gutter-sm q-mt-xs">
                <div class="col-lg-12 col-md-12 col-xs-12">
                    <table class="q-table-html responsive bordered cell-separator full-width table-layout-fixed text-center">
                        <thead class="bg-grey-4">
                        <th class="text-center">{{tableTh[0]}}</th>
                        <th class="text-center" v-show="isEsacRedemption">{{tableTh[1]}}</th>
                        <th class="text-center">{{tableTh[2]}}</th>
                        <th width="18%" class="text-center">{{tableTh[3]}}</th>
                        <th width="18%" class="text-center" v-show="showTransactionTypeColumn">{{tableTh[4]}}</th>
                        <th class="text-center" v-show="showAvailableQuantityColumn">{{tableTh[5]}}</th>
                        <th class="text-center">{{tableTh[6]}}</th>
                        <th class="text-center" v-show="!isEsacRedemption && showCVColumns">{{tableTh[7]}}</th>
                        <th class="text-center" v-show="!isEsacRedemption && showCVColumns">{{tableTh[8]}}</th>
                        <th class="text-center">{{tableTh[9]}} ({{currencyLabelByCountry}})</th>
                        <th class="text-center">{{tableTh[10]}} ({{currencyLabelByCountry}})</th>
                        <th class="text-center" v-show="!isEsacRedemption && lockSalesOrder && showDeliveryStageColumn">
                            {{tableTh[11]}}
                        </th>
                        </thead>
                        <tbody>
                        <tr class="highlight-and-fade standard-product"
                            v-for="(product, index) in salesData.products">
                            <td class="text-left" :data-th="tableTh[0]">
                                <q-checkbox v-if="!lockSalesOrder" :disable="cartPwpSelectedIDs.length > 0"
                                            :val="product.product_id"
                                            v-model="cartSelectedProductIDs"/>
                            </td>
                            <td :data-th="tableTh[1]" v-show="isEsacRedemption"></td>
                            <td :data-th="tableTh[2]">{{ product.sku }}</td>
                            <td class="text-left" :data-th="tableTh[3]">{{ product.name }}</td>
                            <td class="text-left" v-show="showTransactionTypeColumn" :data-th="tableTh[4]">

                                <q-select
                                        inverted-light
                                        color="white text-black"
                                        class="no-shadow custom-input-border no-margin"
                                        :disable="lockSalesOrder || isRentalSales"
                                        @input="reCalculateCart('all')"
                                        v-model="lockSalesOrder ? product.transaction_type_id : product.transaction_type"
                                        :options="masterDataOptionsCreator('sale_types',  (!isRentalSales ? (product.general !== undefined && product.general.sale_types !== undefined ? product.general.sale_types : []) : undefined))"
                                />
                            </td>
                            <td :data-th="tableTh[5]" v-show="showAvailableQuantityColumn">
                                {{ product.available_quantity !== undefined && product.available_quantity !== null ?
                              product.available_quantity : '-'
                                }}
                            </td>
                            <td :data-th="tableTh[6]">
                                <q-input type="number"
                                         v-model="product.quantity"
                                         inverted-light
                                         min="1"
                                         color="white text-black"
                                         class="no-shadow custom-input-border no-margin"
                                         :disable="(lockSalesOrder) && disableQuantityChangeConsignmentReturn"
                                         :error="validations.products.$each[index].quantity.$invalid"
                                         @input="reCalculateCart('all'), resetAdditionalRequirementItems(product.product_id, product.kitting_id, getProductAdditionalRequirementByMasterTitle(product.general !== null && product.general !== undefined ? product.general.product_additional_requirements: [])), validations.products.$each[index].quantity.$touch"
                                         :after="[{icon: 'warning', error: true, handler () {}}]"
                                         align="center"></q-input>
                            </td>
                            <td :data-th="tableTh[7]" v-show="!isEsacRedemption && showCVColumns">
                                {{ getUnitCvByTransactionType('product', product.product_id)
                                }}
                            </td>
                            <td :data-th="tableTh[8]" v-show="!isEsacRedemption && showCVColumns">
                                {{ getUnitCvByTransactionType('product', product.product_id) * product.quantity }}
                            </td>
                            <td :data-th="tableTh[9]">{{ product.base_price.gmp_price_tax | formatPriceDouble }}
                            </td>
                            <td :data-th="tableTh[10]">
                                {{ product.base_price.gmp_price_tax * (!validations.products.$each[index].quantity.$invalid ?
                              product.quantity : 0) | formatPriceDouble
                                }}
                            </td>
                            <td v-if="!isEsacRedemption && lockSalesOrder && showDeliveryStageColumn"
                                :data-th="tableTh[11]">
                                {{ typeof product.delivery_stage !== 'undefined' ? product.delivery_stage.title : '-' }}
                            </td>
                        </tr>
                        <tr class="highlight-and-fade kitting-product"
                            v-for="(kitting, index) in salesData.kittings">
                            <td class="text-left" width="12%" :data-th="tableTh[0]">
                                <q-checkbox v-if="!lockSalesOrder" :disable="cartPwpSelectedIDs.length > 0"
                                            :val="kitting.kitting_id"
                                            v-model="cartSelectedKittingIDs"/>
                                <q-btn color="blue" flat dense
                                       @click="mixActions('kittingProductsListModal', 'kitting', kitting.kitting_products, kitting.name, kitting.code, kitting.kitting_id, kitting.quantity), kittingDefaultTab = 'kitComponents'">
                                    <q-icon name="add_circle_outline"></q-icon>
                                </q-btn>
                            </td>
                            <td :data-th="tableTh[1]" v-show="isEsacRedemption"></td>
                            <td :data-th="tableTh[2]">{{ kitting.code }}</td>
                            <td class="text-left" :data-th="tableTh[3]">{{ kitting.name }}</td>
                            <td class="text-left" v-show="showTransactionTypeColumn" :data-th="tableTh[4]">
                                <q-select
                                        inverted-light
                                        color="white text-black"
                                        class="no-shadow custom-input-border no-margin"
                                        :disable="lockSalesOrder || isRentalSales"
                                        @input="reCalculateCart('all')"
                                        v-model="lockSalesOrder ? kitting.transaction_type_id : kitting.transaction_type"
                                        :options="masterDataOptionsCreator('sale_types', (kitting.general !== undefined && kitting.general.sale_types !== undefined ? kitting.general.sale_types : (lockSalesOrder ? undefined : [])))"
                                />
                            </td>
                            <td :data-th="tableTh[5]" v-show="showAvailableQuantityColumn">
                                {{ kitting.available_quantity !== undefined && kitting.available_quantity !== null ?
                              kitting.available_quantity : '-'
                                }}
                            </td>
                            <td width="10%" :data-th="tableTh[6]">
                                <q-input type="number" v-model="kitting.quantity"
                                         :disable="lockSalesOrder"
                                         min="1"
                                         :error="validations.kittings.$each[index].quantity.$invalid"
                                         @input="reCalculateCart('all'), resetAdditionalRequirementItems(kitting.product_id, kitting.kitting_id), getProductAdditionalRequirementByMasterTitle(kitting.general.product_additional_requirements), validations.kittings.$each[index].quantity.$touch"
                                         :after="[{icon: 'warning', error: true, handler () {}}]"
                                         align="center"></q-input>

                            </td>
                            <td :data-th="tableTh[7]" v-show="!isEsacRedemption && showCVColumns">
                                {{ getUnitCvByTransactionType('kitting', kitting.kitting_id)
                                }}
                            </td>
                            <td :data-th="tableTh[8]" v-show="!isEsacRedemption && showCVColumns">
                                {{ getUnitCvByTransactionType('kitting', kitting.kitting_id) * kitting.quantity}}
                            </td>
                            <td :data-th="tableTh[9]">{{ kitting.kitting_price.gmp_price_tax | formatPriceDouble
                                }}
                            </td>
                            <td :data-th="tableTh[10]">
                                {{ kitting.kitting_price.gmp_price_tax * (!validations.kittings.$each[index].quantity.$invalid ?
                              kitting.quantity : 0) | formatPriceDouble
                                }}
                            </td>
                            <td v-if="!isEsacRedemption && lockSalesOrder && showDeliveryStageColumn"
                                :data-th="tableTh[11]">
                                {{ typeof kitting.delivery_stage !== 'undefined' ? kitting.delivery_stage.title : '-' }}
                            </td>
                        </tr>
                        <tr class="highlight-and-fade promotion-product"
                            v-for="(promo, index) in salesData.promotion"
                            v-if="check = promoOptionItemRowValidationCount(promo.promo_id, promo.conditions)"
                            :class="{'bg-yellow-4': typeof check !== 'undefined' && (check.promoCount !== check.productCount)}">
                            <td class="text-left" width="12%" :data-th="tableTh[0]">
                                <span class="hidden"
                                      v-if="setPromotionalRowCurrentStatus({promoID: promo.promo_id, valid: check.promoCount === check.productCount})">
                                </span>
                                <q-checkbox v-if="!lockSalesOrder || isRentalSales"
                                            :disable="promo.pwp_value < 1 || cartSelectedProductIDs.length > 0"
                                            :val="promo.promo_id" v-model="cartPwpSelectedIDs"/>
                                <q-btn color="negative" flat dense
                                       @click="mixActions('promotionProductsListModal', 'promotion', promo, promo.name)">
                                    <q-icon name="add_circle_outline"></q-icon>
                                </q-btn>
                                <q-icon v-if="typeof check !== 'undefined' && (check.promoCount !== check.productCount)"
                                        class="animate-blink text-negative" name="priority_high"></q-icon>
                            </td>
                            <td :data-th="tableTh[1]" v-show="isEsacRedemption"></td>
                            <td :data-th="tableTh[2]">{{ getPromoTypeNameByID(promo.promo_type_id) }}</td>
                            <td class="text-left" :data-th="tableTh[3]">{{ promo.name }}</td>
                            <td :data-th="tableTh[4]" v-show="showTransactionTypeColumn"></td>
                            <td :data-th="tableTh[5]" v-show="showAvailableQuantityColumn">-</td>
                            <td :data-th="tableTh[6]" width="10%">{{ getPromoItemRowPwpItemQty(promo.promo_id) }}
                            </td>
                            <td :data-th="tableTh[7]" v-show="!isEsacRedemption && showCVColumns">-</td>
                            <td :data-th="tableTh[8]" v-show="!isEsacRedemption && showCVColumns">-</td>
                            <td :data-th="tableTh[9]">
                                {{ promo.pwp_value > 0 ? promo.pwp_value : 0.00 | formatPriceDouble
                                }}
                            </td>
                            <td :data-th="tableTh[10]">
                                {{ promo.pwp_value > 0 ? promo.pwp_value * getPromoItemRowPwpItemQty(promo.promo_id,
                              promo.promo_type_id) : 0.00 | formatPriceDouble
                                }}
                            </td>
                            <td v-if="!isEsacRedemption && lockSalesOrder && showDeliveryStageColumn"
                                :data-th="tableTh[11]">
                                {{ typeof promo.delivery_stage !== 'undefined' ? promo.delivery_stage.title : '-' }}
                            </td>
                        </tr>
                        <tr class="highlight-and-fade esac-voucher"
                            v-for="(esacVoucher, index) in salesData.esac_vouchers_list"
                            v-if="isEsacRedemption">
                            <td class="text-left" width="12%" :data-th="tableTh[0]"></td>
                            <td :data-th="tableTh[1]" v-show="isEsacRedemption">
                                {{esacVoucher.voucher_number}}
                            </td>
                            <td :data-th="tableTh[2]"></td>
                            <td class="text-left" :data-th="tableTh[3]"></td>
                            <td class="text-left" v-show="showTransactionTypeColumn" :data-th="tableTh[4]"></td>
                            <td :data-th="tableTh[5]" v-show="showAvailableQuantityColumn"></td>
                            <td :data-th="tableTh[5]">1</td>
                            <td :data-th="tableTh[6]" v-show="!isEsacRedemption && showCVColumns"></td>
                            <td :data-th="tableTh[7]" v-show="!isEsacRedemption && showCVColumns"></td>
                            <td :data-th="tableTh[8]">
                                {{ -1 * parseFloat(esacVoucher.voucher_value) | formatPriceDouble }}
                            </td>
                            <td :data-th="tableTh[9]">
                                {{ -1 * parseFloat(esacVoucher.voucher_value) | formatPriceDouble }}
                            </td>
                            <td v-if="!isEsacRedemption && lockSalesOrder && showDeliveryStageColumn"
                                :data-th="tableTh[10]"></td>
                        </tr>
                        <tr class="text-weight-bold" v-if="this.showTotalRow
                                  && this.totalGMP !== undefined
                                  && this.totalGMP !== null
                                  && (salesData.products.length > 0 || salesData.kittings.length > 0)"
                        >
                            <td align="right"
                                :colspan="9-(!showCVColumns || isEsacRedemption ? 2 : 0 )-(!showTransactionTypeColumn ? 1 : 0 )-(!isEsacRedemption ? 1:0)">
                                Total
                            </td>
                            <td>{{ this.totalGMP | formatPriceDouble }}</td>
                        </tr>
                        <tr
                                v-show="salesData.products.length <= 0 && salesData.kittings.length <= 0 && salesData.promotion.length <= 0">
                            <td :colspan="7 + (isEsacRedemption ? 1 : 2) + ((lockSalesOrder && showDeliveryStageColumn) ? 1 : 0)">
                                <q-field error-label="Minimum 1 product required or missing required fields"
                                         :error="validations.products.$error || validations.kittings.$error"
                                         helper="*">

                                    <empty-list></empty-list>
                                </q-field>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <layout-modal refs="promotionProductsListModal"
                      urlResetPathName=""
                      :title="promotionsModalData.title"
                      :shadow="false"
                      minWidth="70vw"
                      minHeight="90vh"
                      footerButtonTwo="Close"
                      :headerSearchBar="false"
                      :noEscDismiss="false"
                      :search="true"
                      classes="transparent text-black">
            <template slot="modal-data" slot-scope="props">
                <div class="pd-20 relative-position">
                    <div class="row"
                         v-if="typeof promotionsModalData.data !== 'undefined' && Object.keys(promotionsModalData.data).length > 0 && typeof promotionsModalData.data.conditions !== 'undefined'">
                        <div class="col-lg-12">
                            <div class="options"
                                 v-for="(option, indexOptions) in promotionsModalData.data.conditions.options"
                                 :key="indexOptions">
                                <div class="options-holder pd-10 highlight-and-fade fa-border fit bg-grey-1">
                                    <div class="options-set" v-for="(set, optionKey) in option">
                                        <div class="options-title">
                                            <p class="q-title text-negative">Choose</p>
                                            <p class="q-title text-weight-bold">Each@{{ currencyLabelByCountry
                                                }} {{ promotionsModalData.data.pwp_value | formatPriceDouble }}</p>
                                        </div>
                                        <div class="options-product" v-for="(product, setKey) in set"
                                             v-if="setKey !== 'option_id'">
                                            <div class="select-all" v-if="product.length > 1 && product[0]">
                                                <div class="row justify-end pwp-option">
                                                    <div class="col-lg-auto" v-if="!lockSalesOrder">
                                                        <q-btn
                                                                outline
                                                                :disable="limitBulkItemRowSelectionByOperator(product, promotionsModalData.data.conditions.operator, setKey)"
                                                                :color="getBulkSelectionButtonStatus(product, setKey) ? 'negative' : 'primary'"
                                                                @click="setBulkSelectionProducts(product, promotionsModalData.data.conditions.operator, setKey, promotionsModalData.data.pwp_value)">
                                                            {{ getBulkSelectionButtonStatus(product, setKey) ? 'Remove Selection' : 'Select'}}
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="options-items mt-20"
                                                 :class="{'bg-green-1 pd-5' : getBulkSelectionButtonStatus(product, setKey), 'bg-grey-1 pd-5 disabled' : limitBulkItemRowSelectionByOperator(product, promotionsModalData.data.conditions.operator, setKey)}"
                                                 :color="getBulkSelectionButtonStatus(product, setKey) ? 'negative' : 'primary'"
                                                 v-for="(item, itemsKey) in product">
                                                <div class="hr"></div>
                                                <div class="row items-baseline">
                                                    <div class="col-lg-9">
                                                        <div class="row gutter-md content-between items-baseline">
                                                            <div class="col-lg-2">
                                                                <q-input v-model.trim="item.product.sku"
                                                                         readonly
                                                                         hide-underline
                                                                         :placeholder="$t('products.pwpfoc.productCode')">
                                                                </q-input>
                                                            </div>
                                                            <div class="col-lg-6"
                                                                 :class="{'col-lg-8' : !getPwpPromoType(promotionsModalData.data.promo_type_id, $const.masterData.PWPN)}">
                                                                <q-input v-model.trim="item.product.name"
                                                                         readonly
                                                                         hide-underline
                                                                         :placeholder="$t('products.pwpfoc.productName')">
                                                                </q-input>
                                                            </div>
                                                            <div class="col-lg-2"
                                                                 v-if="!getPwpPromoType(promotionsModalData.data.promo_type_id, $const.masterData.PWPN)">
                                                                X {{ item.quantity }}
                                                            </div>
                                                            <div class="col-lg-4" v-else="!lockSalesOrder">
                                                                <q-select
                                                                        inverted-light
                                                                        color="white text-grey-6"
                                                                        class="no-shadow custom-input-border"
                                                                        :placeholder="$t('Common.tab.items.label.PreSelected') + (item.quantity_selected === undefined ? item.quantity : item.quantity_selected) + '/' + item.quantity"
                                                                        :disable="!getPromoOptionItemRowStatus(item.option_id, item.id, item.product_id, setKey)"
                                                                        @input="setPwpSelectedQuantity(item.promo_id ,item.option_id, item.id, item.product_id, item.quantity_selected)"
                                                                        v-model="item.quantity_selected"
                                                                        :options="quantityOptionsGenerator(item, item.quantity)"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-3" v-if="!lockSalesOrder">
                                                        <div class="row justify-end">
                                                            <div class="col-lg-auto" v-if="product.length > 1">
                                                                <q-btn disable
                                                                       class="no-pointer-events"
                                                                       outline
                                                                       v-if="!getPromoOptionItemRowStatus(item.option_id, item.id, item.product_id, setKey)"
                                                                       color="grey-6">
                                                                    {{$t('Common.tab.items.label.select')}}
                                                                </q-btn>
                                                                <q-btn color="grey-6" disable v-else="" outline>
                                                                    {{$t('Common.tab.items.label.removeSelection')}}
                                                                </q-btn>
                                                            </div>
                                                            <div class="col-lg-auto" v-else="">
                                                                <q-btn
                                                                        @click="!getPromoOptionItemRowStatus(item.option_id, item.id, item.product_id, setKey) ? setPromoOptionsItemRow(item.promo_id ,item.option_id, item.id, item.product_id, promotionsModalData.data.conditions.operator, setKey, promotionsModalData.data.pwp_value, item.quantity) : removePromoOptionItemRow(item.option_id, item.id, promotionsModalData.data.promo_id, promotionsModalData.data.conditions.operator, promotionsModalData.data.pwp_value), promoOptionItemRowValidationCount(item.promo_id, promotionsModalData.data.conditions)"
                                                                        outline
                                                                        :disable="limitPromotionItemRowSelectionByOperator(item.promo_id ,item.option_id, item.id, item.product_id, promotionsModalData.data.conditions.operator, setKey)"
                                                                        :color="getPromoOptionItemRowStatus(item.option_id, item.id, item.product_id, setKey) ? 'negative' : 'primary'">
                                                                    {{ getPromoOptionItemRowStatus(item.option_id, item.id, item.product_id, setKey) ?
                                                                  'Remove Selection' : 'Select'
                                                                    }}
                                                                </q-btn>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-3 text-right"
                                                         v-if="lockSalesOrder && getBulkSelectionButtonStatus(product, setKey)">
                                                        <q-icon name="done" class="on-left"></q-icon>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="options-or mt-10 mb-10 bg-grey-1"
                                                 v-if="setKey !== Object.keys(set).pop()">
                                                <div class="row justify-center">
                                                    <div class="col-lg-12">
                                                        <div class="hr"></div>
                                                    </div>
                                                    <div class="col-auto">
                                                        <div class="options-or-btn-decoration mt-10 mb-10">
                                                            <q-btn color="amber-14"
                                                                   disable
                                                                   class="no-shadow no-pointer-events"
                                                                   size="sm">
                                                                OR
                                                            </q-btn>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="row justify-center"
                                     v-if="promotionsModalData.data.conditions.options.length - 1 !== indexOptions">
                                    <div class="col-lg-12">
                                        <q-btn class="full-width no-shadow no-pointer-events text-black" big>
                                            {{ promotionsModalData.data.conditions.operator }}
                                        </q-btn>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else="" class="row">
                        <div class="col-lg-12 fit">
                            <empty-list></empty-list>
                        </div>
                    </div>
                    <q-loader :fixedCenter="true" :visible="isProcessingCart"></q-loader>
                </div>
            </template>
        </layout-modal>
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
                            <table class="q-table-html fit cell-separator  table-layout-fixed">
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
                                        {{ !lockSalesOrder ? (item.quantity !== 0 ? item.quantity * kittingModalData.kittingQty :
                                      item.foc_qty * kittingModalData.kittingQty) : item.quantity !== 0 ? item.quantity : item.foc_qty
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
                            <div class="sizes-area">
                                <sizes-attributes :additional_requirements="salesData.selected.additional_requirements"
                                                  :itemsData="kittingModalData.items"
                                                  :kittingQty="kittingModalData.kittingQty"
                                                  :tableTh="tableTh"></sizes-attributes>
                            </div>
                            <!-- Redemption End -->
                        </q-tab-pane>
                    </q-tabs>
                </div>
            </template>
        </layout-modal>
        <layout-modal refs="standardProductModal"
                      urlResetPathName=""
                      :title="standardProductModalData.item.sku + ' : ' + standardProductModalData.title"
                      :subTitle="'Total set Quantiy : ' + standardProductModalData.item.quantity"
                      :shadow="false"
                      minWidth="70vw"
                      minHeight="90vh"
                      footerButtonTwo="Close"
                      :headerSearchBar="false"
                      :noEscDismiss="false"
                      :search="true"
                      classes="transparent text-black">
            <template slot="modal-data" slot-scope="props">
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
                <listing-search-form
                        v-bind:salesData="salesData"
                        v-bind:memberDetails="memberDetails"
                        :addToCart="addToCart"
                        :isRentalSales="isRentalSales"
                        :excludeKittingSearch="excludeKittingSearch"
                ></listing-search-form>
            </template>
        </layout-modal>
        <q-loader :visible="isProcessingCart"></q-loader>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import {ListingSearchForm} from 'src/application/global/components/common/shared-forms/'
  import {GeneralsMixin, MasterDataTransformarMixin} from 'src/application/global/mixins'
  import {SizesAttributes} from 'src/application/global/components/common/shared-blocks/'
  import {mapActions, mapGetters, mapMutations, mapState} from 'vuex'

  export default {
    name: 'sales-items-tab',
    mixins: [MasterDataTransformarMixin, GeneralsMixin],
    components: {
      EmptyList,
      qLoader,
      layoutModal,
      ListingSearchForm,
      SizesAttributes
    },
    props: {
      salesData: {
        type: Object,
        default: () => {
        }
      },
      memberDetails: {
        default: () => {
        }
      },
      addToCart: {
        type: Function,
        required: true
      },
      lockSalesOrder: {
        type: Boolean,
        default: true
      },
      // pass in the parent structure that contains products, kittings array, not the root $v object
      validations: {
        type: Object,
        required: true
      },
      excludeKittingSearch: {
        type: Boolean,
        default: false
      },
      showTotalRow: {
        type: Boolean,
        default: false
      },
      totalGMP: {
        type: Number
      },
      showDeliveryStageColumn: {
        type: Boolean,
        default: true
      },
      showCVColumns: {
        type: Boolean,
        default: true
      },
      showTransactionTypeColumn: {
        type: Boolean,
        default: true
      },
      showAvailableQuantityColumn: {
        type: Boolean,
        default: false
      },
      isRentalSales: {
        type: Boolean,
        default: false
      },
      disableQuantityChangeConsignmentReturn: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingCart: state => state.globalCMP.isProcessingCart,
        masterData: state => state.globalCMP.masterData.data.list,
        cartPwpItemsTempList: state => state.salesCMP.cartPwpItemsTempList,
        cartPwpValidationIds: state => state.salesCMP.cartPwpValidationIds,
        productsCollection: state => state.salesCMP.salesProductSearchList.list,
        cartPromotionalRowCurrentStatus: state => state.salesCMP.cartPromotionalRowCurrentStatus,
        appSettings: state => state.globalCMP.appSettings
      }),
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry',
        paginationQuery: 'pagination'
      }),
      isEsacRedemption: function () {
        return (this.salesData.is_esac_redemption === 1)
      }
    },
    data: () => ({
      kittingDefaultTab: 'kitComponents',
      cartSelectedProductIDs: [],
      cartSelectedKittingIDs: [],
      cartPwpSelectedIDs: [],
      kittingModalData: {
        items: [],
        kittingID: '',
        kittingCode: '',
        kittingQty: '',
        title: ''
      },
      promotionsModalData: {
        data: {},
        title: ''
      },
      standardProductModalData: {
        item: {},
        title: ''
      },
      terms: '',
      attributesOptionsData: [],
      tableTh: [
        '',
        'Voucher No',
        'Product Code',
        'Product Name',
        'Trans Type',
        'Available Quantity',
        'Quantity',
        'Unit CV',
        'Total CV',
        'Unit Price',
        'Total Price',
        'Delivery Stage'
      ]
    }),
    watch: {
      kittingModalData: {
        handler() {
          if (this.selectedInstantQty === 0 && this.selectedEvoucherQty === 0) {
            this.selectedInstantQty = this.kittingModalData.kittingQty
          }
        },
        deep: true
      }
    },
    mounted() {
      this.master.keys = ['sale_types', 'promotion_free_items_promo_types', 'product_additional_requirements']
      if (this.lockSalesOrder) {
        if (this.salesData.selected.promotions !== null && this.salesData.selected.promotions.length > 0) {
          this.salesData.selected.promotions.forEach((item) => {
            this.setCartPwpValidationIds(item.promo_id)
          })
        }
      }
    },
    methods: {
      ...mapActions([
        'getSalesProductSearchAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setCartPwpValidationIds: 'SET_CART_PWP_VALIDATION_IDS',
        unsetCartPwpValidationIds: 'UNSET_CART_PWP_VALIDATION_IDS',
        setCartPwpItemTempList: 'SET_CART_PWP_ITEM_TEMP_LIST',
        unsetCartPwpItemList: 'UNSET_CART_PWP_ITEM_TEMP_LIST',
        addUpdatePromotionalRowCurrentStatus: 'ADD_UPDATE_PROMOTIONAL_ROW_CURRENT_STATUS',
        unsetPromotionalRowCurrentStatus: 'UNSET_PROMOTIONAL_ROW_CURRENT_STATUS'
      }),
      // Todo cleanup write better code
      addAdditionalRequirementProducts(productID, kittingID, type, identifier, kittingProducts) {
        productID = typeof productID !== 'undefined' ? productID : null
        kittingID = typeof kittingID !== 'undefined' ? kittingID : null
        let count = 0
        if (identifier === 'kitting') {
          count = this.salesData.selected.additional_requirements.evoucher.filter(x => x.kitting_id === kittingID).length
        } else {
          count = this.salesData.selected.additional_requirements.evoucher.filter(x => x.product_id === productID && x.kitting_id === kittingID).length
        }
        if (count < 1) {
          let row = {}
          if (identifier === 'kitting') {
            if (kittingProducts.length > 0) {
              kittingProducts.forEach((item) => {
                row = {
                  product_id: item.product_id,
                  kitting_id: kittingID
                }
                // todo waiting for jalala
                // if (typeof item.general !== 'undefined' && item.general.product_additional_requirements !== 'undefined') {
                this.salesData.selected.additional_requirements.evoucher.push(row)
                // }
              })
            }
          } else {
            row = {
              product_id: productID,
              kitting_id: kittingID
            }
            this.salesData.selected.additional_requirements.evoucher.push(row)
          }
          let selectedAttributeIndex = -1
          if (identifier === 'kitting') {
            selectedAttributeIndex = this.salesData.selected.additional_requirements[type].findIndex(x => x.kitting_id === kittingID)
          } else {
            selectedAttributeIndex = this.salesData.selected.additional_requirements[type].findIndex(x => x.product_id === productID && x.kitting_id === kittingID)
          }
          if (selectedAttributeIndex !== -1) {
            this.salesData.selected.additional_requirements[type].splice(selectedAttributeIndex, this.salesData.selected.additional_requirements[type].length)
          }
        } else {
          let items = []
          if (identifier === 'kitting') {
            items = this.salesData.selected.additional_requirements.evoucher.filter(x => x.kitting_id === kittingID)
          } else {
            items = this.salesData.selected.additional_requirements.evoucher.filter(x => x.product_id === productID && x.kitting_id === kittingID)
          }
          if (items.length > 0) {
            items.forEach((item) => {
              let itemIndex = this.salesData.selected.additional_requirements.evoucher.findIndex(x => x.product_id === item.product_id && x.kitting_id === kittingID)
              this.salesData.selected.additional_requirements.evoucher.splice(itemIndex, this.salesData.selected.additional_requirements.evoucher.length)
            })
          }
        }
      },
      checkEvoucherCondition(productID, kittingID, identifier) {
        productID = typeof productID !== 'undefined' ? productID : null
        kittingID = typeof kittingID !== 'undefined' ? kittingID : null
        let count = 0
        if (identifier === 'kitting') {
          count = this.salesData.selected.additional_requirements.evoucher.filter(x => x.kitting_id === kittingID).length
        } else {
          count = this.salesData.selected.additional_requirements.evoucher.filter(x => x.product_id === productID && x.kitting_id === kittingID).length
        }
        if (count > 0) {
          return true
        } else {
          return false
        }
      },
      getUnitCvByTransactionType(type, id) {
        if (type === 'product' && typeof this.salesData.cvs !== 'undefined' && typeof this.salesData.cvs.products !== 'undefined') {
          let index = this.salesData.cvs.products.findIndex(x => x.product_id === id)
          if (index !== -1) {
            return this.salesData.cvs.products[index].unit_cv
          }
        }
        if (type === 'kitting' && typeof this.salesData.cvs.kittings !== 'undefined') {
          let index = this.salesData.cvs.kittings.findIndex(x => x.kitting_id === id)
          if (index !== -1) {
            return this.salesData.cvs.kittings[index].unit_cv
          }
        }
        return 0
      },
      kittingRedemptionEligibility(data) {
        let count = 0
        data.forEach((item) => {
          if (item.dummy !== undefined && item.dummy !== null && item.dummy.is_lingerie === 1) {
            count += 1
          }
        })
        if (count > 0) {
          return true
        } else {
          return false
        }
      },
      resetAdditionalRequirementItems(productID, kittingID, types, identifier) {
        productID = typeof productID !== 'undefined' ? productID : null
        kittingID = typeof kittingID !== 'undefined' ? kittingID : null
        if (typeof types !== 'undefined' && types.length > 0) {
          types.forEach((type) => {
            let items = []
            if (identifier === 'kitting') {
              items = this.salesData.selected.additional_requirements[type.title].filter(x => x.kitting_id === kittingID)
            } else {
              items = this.salesData.selected.additional_requirements[type.title].filter(x => x.product_id === productID && x.kitting_id === kittingID)
            }
            if (items.length > 0) {
              items.forEach((item) => {
                let itemIndex = this.salesData.selected.additional_requirements[type.title].findIndex(x => x.product_id === item.product_id && x.kitting_id === kittingID)
                this.salesData.selected.additional_requirements[type.title].splice(itemIndex, this.salesData.selected.additional_requirements[type.title].length)
              })
            }
          })
        }
      },
      removeAdditionalRequirementItems(productID, kittingID, identifier) {
        productID = typeof productID !== 'undefined' ? productID : null
        kittingID = typeof kittingID !== 'undefined' ? kittingID : null
        let items = []
        if (identifier === 'kitting') {
          items = this.salesData.selected.additional_requirements.filter(x => x.kitting_id === kittingID)
        } else {
          items = this.salesData.selected.additional_requirements.filter(x => x.product_id === productID && x.kitting_id === kittingID)
        }
        if (items.length > 0) {
          items.forEach((item) => {
            let itemIndex = this.salesData.selected.additional_requirements.findIndex(x => x.product_id === item.product_id && x.kitting_id === kittingID)
            this.salesData.selected.additional_requirements.splice(itemIndex, this.salesData.selected.additional_requirements.length)
          })
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
      reCalculateCart(type) {
        // Call parent method
        this.$emit('reCalculateCart', type)
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
      removeRowFromCart() {
        let products = this.salesData.products
        let kittings = this.salesData.kittings
        let promotions = this.salesData.promotion
        let pwpTemp = this.cartPwpItemsTempList
        let selectedPromotions = this.salesData.selected.promotions
        if (this.cartSelectedProductIDs.length > 0) {
          this.cartSelectedProductIDs.forEach((id) => {
            let productIndex = products.findIndex(x => x.product_id === id)
            // this.resetAdditionalRequirementItems(id, null)
            products.splice(productIndex, 1)
          })
          this.cartSelectedProductIDs = []
          this.reCalculateCart('promo')
        }
        if (this.cartSelectedKittingIDs.length > 0) {
          this.cartSelectedKittingIDs.forEach((id) => {
            let kittingIndex = kittings.findIndex(x => x.kitting_id === id)
            kittings.splice(kittingIndex, 1)
          })
          this.cartSelectedKittingIDs = []
          this.reCalculateCart('promo')
        }
        if (this.cartPwpSelectedIDs.length > 0) {
          this.cartPwpSelectedIDs.forEach((id) => {
            let promoIndex = promotions.findIndex(x => x.promo_id === id)
            this.setCartPwpItemTempList(promotions[promoIndex])
            promotions.splice(promoIndex, 1)
            this.unsetPromotionalRowCurrentStatus({promoID: id})
          })
          if (pwpTemp.length > 0) {
            pwpTemp.forEach((item) => {
              let data = selectedPromotions.filter(x => x.promo_id === item.promo_id)
              if (data.length > 0) {
                data.forEach((item) => {
                  let selectedPromotionIndex = selectedPromotions.findIndex(x => x.promo_id === item.promo_id)
                  selectedPromotions.splice(selectedPromotionIndex, 1)

                  let validationIndex = this.cartPwpValidationIds.findIndex(x => x === item.promo_id)
                  this.unsetCartPwpValidationIds(validationIndex)
                })
              }
            })
            this.reCalculateCart('promo')
          }
          this.cartPwpSelectedIDs = []
        }
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
      getPromoOptionItemRowStatus(optionID, setID, productID, setKey) {
        let promo = this.salesData.selected.promotions
        let exist = promo.filter(x => x.option_id === optionID && x.set_id === setID && x.product_id === productID && x.set_key === setKey)
        if (exist.length > 0) {
          return true
        }
        return false
      },
      getBulkSelectionButtonStatus(products, setKey) {
        if (products.length > 0) {
          let selectedPromotionstions = this.salesData.selected.promotions
          let exist = selectedPromotionstions.filter(x => x.promo_id === products[0].promo_id && x.option_id === products[0].option_id && x.set_key === setKey)
          if (exist.length > 0) {
            return true
          }
        }
        return false
      },
      setBulkSelectionProducts(products, operator, setKey, pwpValue) {
        let selectedPromotionstions = this.salesData.selected.promotions
        let count = selectedPromotionstions.filter(x => x.promo_id === products[0].promo_id && x.option_id === products[0].option_id && x.set_key === setKey).length
        if (count < 1 && products.length > 0) {
          let i = 0
          products.forEach((item) => {
            i++
            this.setPromoOptionsItemRow(item.promo_id, item.option_id, item.id, item.product_id, operator, setKey, pwpValue, item.quantity, products.length, i)
          })
        } else {
          this.removeBulkSelectionProducts(products, operator, pwpValue)
        }
      },
      removeBulkSelectionProducts(products, operator, pwpValue) {
        if (products.length > 0) {
          products.forEach((item) => {
            this.removePromoOptionItemRow(item.option_id, item.id, item.promo_id, operator, pwpValue)
          })
        }
      },
      setPromoOptionsItemRow(promoID, optionID, setID, productID, operator, setkey, pwpValue, quantity, totalPwpCount, currentPwpCount) {
        let calculate = true
        if (operator === '') {
          operator = 'OR'
        }
        let item = {
          'promo_id': promoID,
          'option_id': optionID,
          'set_id': setID,
          'product_id': productID,
          'operator': operator,
          'set_key': setkey,
          'selected_quantity': quantity
        }
        let promo = this.salesData.selected.promotions
        let exist = promo.filter(x => x.promo_id === promoID && x.option_id === optionID && x.set_id === setID && x.product_id === productID)
        if (exist.length <= 0) {
          this.salesData.selected.promotions.push(item)
        }
        this.promoOptionItemRowValidation(promoID, operator)
        if (pwpValue !== '' && pwpValue > 0 && typeof totalPwpCount !== 'undefined') {
          if (totalPwpCount === currentPwpCount) {
            this.reCalculateCart(this.cartPwpItemsTempList.length > 0 ? 'promo' : 'promo_price')
          }
        } else {
          this.reCalculateCart(this.cartPwpItemsTempList.length > 0 ? 'promo' : 'promo_price')
        }
      },
      removePromoOptionItemRow(optionID, setID, promoID, operator, pwpValue) {
        if (operator === '') {
          operator = 'OR'
        }
        let selectedPromotions = this.salesData.selected.promotions
        let removeIndex = selectedPromotions.findIndex(x => x.option_id === optionID && x.set_id === setID)
        if (removeIndex >= 0) {
          selectedPromotions.splice(removeIndex, 1)
        }
        this.promoOptionItemRowValidation(promoID, operator, 'remove')
        if (pwpValue !== '' && pwpValue > 0) {
          this.reCalculateCart(this.cartPwpItemsTempList.length > 0 ? 'promo' : 'promo_price')
        }
      },
      limitPromotionItemRowSelectionByOperator(promoID, optionID, setID, productID, operator, setKey) {
        if (operator === '') {
          operator = 'OR'
        }
        let promo = this.salesData.selected.promotions
        if (typeof promo !== 'undefined' && promo.length > 0) {
          let exist = []
          if (operator === 'OR') {
            exist = promo.filter(x => x.promo_id === promoID && x.option_id === optionID && x.set_key === setKey)
            if (exist.length > 0) {
              return false
            } else {
              // special case where this promo not inside selected array
              if (promo.findIndex(x => x.promo_id === promoID) === -1) {
                return false
              }
              return true
            }
          } else if (operator === 'AND') {
            exist = promo.filter(x => x.promo_id === promoID && x.option_id === optionID)
            if (exist.length > 0) {
              let setcount = promo.filter(x => x.promo_id === promoID && x.option_id === optionID && x.set_key === setKey).length
              if (setcount > 0) {
                return false
              }
              return true
            } else {
              return false
            }
          }
        }
        return false
      },
      limitBulkItemRowSelectionByOperator(products, operator, setKey) {
        if (operator === '') {
          operator = 'OR'
        }
        let promo = this.salesData.selected.promotions
        if (typeof promo !== 'undefined' && promo.length > 0 && products.length > 0) {
          let exist = []
          if (operator === 'OR') {
            exist = promo.filter(x => x.promo_id === products[0].promo_id && x.option_id === products[0].option_id && x.set_key === setKey)
            if (exist.length > 0) {
              return false
            } else {
              // special case where this promo not inside selected array
              if (promo.findIndex(x => x.promo_id === products[0].promo_id) === -1) {
                return false
              }
              return true
            }
          } else if (operator === 'AND') {
            exist = promo.filter(x => x.promo_id === products[0].promo_id && x.option_id === products[0].option_id)
            if (exist.length > 0) {
              let setcount = promo.filter(x => x.promo_id === products[0].promo_id && x.option_id === products[0].option_id && x.set_key === setKey).length
              if (setcount > 0) {
                return false
              }
              return true
            } else {
              return false
            }
          }
        }
        return false
      },
      promoOptionItemRowValidation(promoID, operator, actionType) {
        if (operator === '') {
          operator = 'OR'
        }
        let selected = 0
        selected = this.salesData.selected.promotions.filter(x => x.promo_id === promoID).length
        if (operator === 'AND') {
          if (selected > 0 && actionType !== 'remove') {
            this.setCartPwpValidationIds(promoID)
          } else {
            var iAND = this.cartPwpValidationIds.indexOf(promoID)
            if (iAND !== -1) {
              this.unsetCartPwpValidationIds(iAND)
            }
          }
        } else if (operator === 'OR') {
          if (selected > 0 && actionType !== 'remove') {
            this.setCartPwpValidationIds(promoID)
          } else {
            var iOR = this.cartPwpValidationIds.indexOf(promoID)
            if (iOR !== -1) {
              this.unsetCartPwpValidationIds(iOR)
            }
          }
        }
      },
      promoOptionItemRowValidationCount(promoID, conditions) {
        let operator = conditions.operator
        let options = conditions.options
        let promotions = this.salesData.selected.promotions
        let productsCount = 0
        if (operator === 'OR' || operator === '') {
          if (options.length > 0) {
            options.forEach((item) => {
              let optionCount = Object.keys(item).pop().split('_')
              for (let iOR = 1; iOR <= parseInt(optionCount[1]); iOR++) {
                let optionName = 'option_' + iOR
                if (typeof item[optionName] !== 'undefined') {
                  let setCount = Object.keys(item[optionName]).pop().split('_')
                  for (let jOR = 1; jOR <= parseInt(setCount[1]); jOR++) {
                    let setName = 'set_' + jOR
                    if (!this.limitPromotionItemRowSelectionByOperator(promoID, item[optionName].option_id, '', '', operator, setName)) {
                      productsCount += (item[optionName][setName].length)
                    }
                  }
                }
              }
            })
            let promotionCount = promotions.filter(x => x.promo_id === promoID).length
            let count = {
              promoCount: promotionCount,
              productCount: productsCount
            }
            return count
          }
        } else if (operator === 'AND') {
          if (options.length > 0) {
            options.forEach((item) => {
              let optionCount = Object.keys(item).pop().split('_')
              for (let iAND = 1; iAND <= parseInt(optionCount[1]); iAND++) {
                let optionName = 'option_' + iAND
                if (typeof item[optionName] !== 'undefined') {
                  let setCount = Object.keys(item[optionName]).pop().split('_')
                  for (let jAND = 1; jAND <= parseInt(setCount[1]); jAND++) {
                    let setName = 'set_' + jAND
                    if (!this.limitPromotionItemRowSelectionByOperator(promoID, item[optionName].option_id, '', '', operator, setName)) {
                      productsCount += (item[optionName][setName].length)
                    }
                  }
                }
              }
            })
            let promotionCount = promotions.filter(x => x.promo_id === promoID).length
            let count = {
              promoCount: promotionCount,
              productCount: productsCount
            }
            return count
          }
        }
      },
      getPromoItemRowPwpItemQty(promoID, promoTypeID) {
        let promo = this.salesData.selected.promotions
        if (promo.length > 0) {
          let items = promo.filter(x => x.promo_id === promoID)
          let count = 0
          items.forEach((item) => {
            if (promoTypeID !== undefined && this.getPwpPromoType(promoTypeID, this.$const.masterData.PWPF)) {
              count = 1
            } else {
              count += item.selected_quantity ? item.selected_quantity : 0
            }
          })
          return count
        }
        return 0
      },
      revertBackPwpTempItemToCartByIndex(index) {
        let pwpTemp = this.cartPwpItemsTempList
        let promotions = this.salesData.promotion
        promotions.push(pwpTemp[index])
        this.unsetCartPwpItemList(index)
      },
      setPwpSelectedQuantity(promoID, optionID, setID, productID, quantity) {
        let promo = this.salesData.selected.promotions
        let itemIndex = promo.findIndex(x => x.promo_id === promoID && x.option_id === optionID && x.set_id === setID && x.product_id === productID)
        if (itemIndex !== -1) {
          this.salesData.selected.promotions[itemIndex].selected_quantity = quantity
          this.reCalculateCart(this.cartPwpItemsTempList.length > 0 ? 'promo' : 'promo_price')
        }
      },
      quantityOptionsGenerator(item, quantity) {
        let options = []
        if (quantity !== '' && quantity !== null) {
          for (let i = 0; i <= quantity; i++) {
            let row = {
              label: i.toString(),
              value: i
            }
            options.push(row)
          }
        }
        return options
      },
      getPwpPromoType(promoTypeID, checkingTitle) {
        let promoType = this.masterData.promotion_free_items_promo_types
        if (promoType.length > 0) {
          let row = promoType.find(x => x.id === promoTypeID)
          if (Object.keys(row).length > 0) {
            if (row.title === checkingTitle) {
              return true
            }
          }
        }
        return false
      },
      setPromotionalRowCurrentStatus(object) {
        let itemIndex = this.cartPromotionalRowCurrentStatus.findIndex(x => x.promoID === object.promoID)
        this.addUpdatePromotionalRowCurrentStatus({data: object, index: itemIndex})
      },
      async changeItemsSaleTypeByBulk(key) {
        if (this.salesData.products.length > 0 || this.salesData.kittings.length > 0) {
          let saleTypeID = this.getMasterDataIdByKeyAndTitle('sale_types', key)
          if (this.salesData.products.length > 0) {
            this.salesData.products.forEach(async (product) => {
              if (product.general !== undefined && product.general.sale_types !== undefined && product.general.sale_types.length > 0) {
                if (product.general.sale_types.includes(saleTypeID)) {
                  product.transaction_type = await saleTypeID
                }
              }
            })
          }
          if (this.salesData.kittings.length > 0) {
            this.salesData.kittings.forEach(async (kitting) => {
              if (kitting.general !== undefined && kitting.general.sale_types !== undefined && kitting.general.sale_types.length > 0) {
                if (kitting.general.sale_types.includes(saleTypeID)) {
                  kitting.transaction_type = await saleTypeID
                }
              }
            })
          }
          await this.reCalculateCart('all')
        }
      },
      search() {
        let query = {
          country_id: this.memberDetails.details.country_id,
          user_id: this.memberDetails.details.user_id,
          text: this.terms !== '' ? this.terms : null,
          limit: 1,
          mixed: true,
          transaction_location_id: this.salesData.location_id,
          stock_location_id: this.salesData.stock_location_id,
          exclude_kitting_search: this.excludeKittingSearch,
          offset: 0
        }
        if (this.terms !== '') {
          this.getSalesProductSearchAction(query).then(() => {
            this.terms = ''
            if (this.productsCollection.data !== undefined && this.productsCollection.data.length > 0) {
              if (this.productsCollection.data[0].is_kitting === 0) {
                this.addToCart('product', this.productsCollection.data[0].id)
              } else {
                this.addToCart('kitting', this.productsCollection.data[0].id)
              }
            } else {
              this.setNotification({
                title: 'Product Search Error',
                message: 'Product Not Found',
                type: 'negative'
              })
            }
          })
        }
      }
    }
  }
</script>
<style lang="stylus">
    .mb-10
        margin-bottom 10px
</style>
