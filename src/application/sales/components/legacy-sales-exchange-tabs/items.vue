<template>
    <div class="sales-items-tab">
        <div class="content">
            <div class="row">
              <div class="col-lg-12 full-height">
                <q-card color="white" class="full-height full-width">
                  <q-card-title class="text-black">{{$t('sale.exchange.detail.tableTitle.return')}}</q-card-title>
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
                                         @click="mixActions('productListingModal', 'return')">Add
                                  </q-btn>
                                </div>
                                <div class="col-lg-3 col-md-6 col-xs-6">
                                  <q-btn @click="removeReturnRowFromCart"
                                         :disabled="cartSelectedReturnProductIDs.length < 1 &&  cartSelectedReturnKittingIDs.length < 1"
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
                              <th align="center" width="13%">{{$t('sale.cancellation.detail.tableLabel.unitPrice')}}</th>
                              <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.cancellationQty')}}</th>
                              <th align="center" width="8%">{{$t('sale.cancellation.detail.tableLabel.totalPrice')}}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr
                              v-if="exchangeData.legacy_return_products !== undefined && exchangeData.legacy_return_products !== null"
                              v-for="(product,product_index) in exchangeData.legacy_return_products"
                            >
                              <td align="left">
                                <q-checkbox v-if="!lockProductExchange"
                                            :val="product.product_id"
                                            v-model="cartSelectedReturnProductIDs"/>
                              </td>
                              <td>{{ product.sku }}</td>
                              <td>{{ product.name }}</td>
                              <td>
                                <q-input type="number" v-model="product.base_price.gmp_price_tax"
                                         :disable="lockProductExchange"
                                         align="center"
                                         @input="processQuantityChange(product, 'return')"
                                >
                                </q-input>
                              </td>
                              <td width="10%">
                                <q-input type="number" v-model="product.return_quantity"
                                         :disable="lockProductExchange"
                                         align="center"
                                         @input="processQuantityChange(product, 'return')"
                                ></q-input>
                                <!--:error="validator.exchangeData.sale.products.$each[index].quantity.$error"-->
                              </td>
                              <td>
                                {{ product.return_amount | formatPriceDouble }}
                              </td>
                            </tr>
                            </tbody>
                            <tbody
                              v-if="exchangeData.legacy_return_kitting !== null && exchangeData.legacy_return_kitting !== undefined"
                              v-for="(kitting,product_index) in exchangeData.legacy_return_kitting"
                            >
                            <tr align="center">
                              <td align="left">
                                <q-checkbox v-if="!lockProductExchange"
                                            :val="kitting.kitting_id"
                                            v-model="cartSelectedReturnKittingIDs"/>
                                <q-btn color="blue" flat
                                       @click="mixActions('kittingProductsListModal', 'kitting', kitting.kitting_products, kitting.name, kitting.code, kitting.kitting_id, kitting.return_quantity), kittingDefaultTab = 'kitComponents'">
                                  <q-icon name="add_circle_outline"></q-icon>
                                </q-btn>
                              </td>
                              <td>{{kitting.code}}</td>
                              <td>{{kitting.name}}</td>
                              <td>
                                <q-input type="number" v-model="kitting.kitting_price.gmp_price_tax"
                                         :disable="lockProductExchange"
                                         align="center"
                                         @input="processQuantityChange(kitting, 'return')"
                                >
                                </q-input>
                              </td>
                              <td width="10%">
                                <q-input type="number" v-model="kitting.return_quantity"
                                         :disable="lockProductExchange"
                                         align="center"
                                         @input="processQuantityChange(kitting, 'return')"
                                ></q-input>
                              </td>
                              <td align="center">{{kitting.kitting_price.gmp_price_tax * kitting.return_quantity | formatPriceDouble }}</td>
                            </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </q-card-main>
                </q-card>
                <q-card color="white" class="full-height full-width">'
                  <q-card-title class="text-black">{{$t('sale.exchange.detail.tableTitle.exchange')}}</q-card-title>
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
                                         @click="mixActions('productListingModal', 'exchange')">Add
                                  </q-btn>
                                </div>
                                <div class="col-lg-3 col-md-6 col-xs-6">
                                  <q-btn @click="removeExchangeRowFromCart"
                                         :disabled="cartSelectedExchangeProductIDs.length < 1 &&  cartSelectedExchangeKittingIDs.length < 1"
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
                                            v-model="cartSelectedExchangeProductIDs"/>
                                <q-btn color="blue" flat
                                       v-if="typeof product.general !== 'undefined' && typeof product.general.product_additional_requirements !== 'undefined'"
                                       @click="mixActions('standardProductModal', 'standard', product, product.name)">
                                  <q-icon name="add_circle_outline"></q-icon>
                                </q-btn>
                              </td>
                              <td :data-th="exchangeTableTH[1]">{{ product.sku }}</td>
                              <td :data-th="exchangeTableTH[2]">{{ product.name }}</td>
                              <td width="10%" :data-th="exchangeTableTH[3]">
                                <q-input type="number" v-model="product.quantity"
                                         :error="validator.exchangeData.exchange_products.$each[index].quantity.$error"
                                         :disable="lockProductExchange"
                                         @input="processQuantityChange(product, 'exchange')"
                                         :after="[{icon: 'warning', error: true, handler () {}}]"
                                         align="center"></q-input>
                              </td>
                              <td :data-th="exchangeTableTH[4]">{{ product.base_price.gmp_price_tax | formatPriceDouble }}
                              </td>
                              <td :data-th="exchangeTableTH[5]">
                                {{ product.base_price.gmp_price_tax * product.chargedQuantity | formatPriceDouble }}
                              </td>
                            </tr>
                            <tr class="highlight-and-fade kitting-product"
                                v-for="(kitting, index) in exchangeData.exchange_kitting">
                              <td class="text-left" width="12%" :data-th="exchangeTableTH[0]">
                                <q-checkbox v-if="!lockProductExchange"
                                            :val="kitting.kitting_id"
                                            v-model="cartSelectedExchangeKittingIDs"/>
                                <q-btn color="blue" flat
                                       @click="mixActions('kittingProductsListModal', 'kitting', kitting.kitting_products, kitting.name, kitting.code, kitting.kitting_id, kitting.quantity), kittingDefaultTab = 'kitComponents'">
                                  <q-icon name="add_circle_outline"></q-icon>
                                </q-btn>
                              </td>
                              <td :data-th="exchangeTableTH[1]">{{ kitting.code }}</td>
                              <td :data-th="exchangeTableTH[2]">{{ kitting.name }}</td>
                              <td width="10%" :data-th="exchangeTableTH[3]">
                                <q-input type="number" v-model="kitting.quantity"
                                         :disable="lockProductExchange"
                                         :error="validator.exchangeData.exchange_kitting.$each[index].quantity.$error"
                                         @input="processQuantityChange(kitting, 'exchange')"
                                         :after="[{icon: 'warning', error: true, handler () {}}]"
                                         align="center"></q-input>
                              </td>
                              <td :data-th="exchangeTableTH[4]">{{ kitting.kitting_price.gmp_price_tax | formatPriceDouble
                                }}
                              </td>
                              <td :data-th="exchangeTableTH[5]">
                                {{ kitting.kitting_price.gmp_price_tax * kitting.quantity | formatPriceDouble }}
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
                                  <td>{{ !lockProductExchange ? item.quantity !== 0 ? item.quantity * kittingModalData.kittingQty : item.foc_qty * kittingModalData.kittingQty : item.quantity !== 0 ? item.quantity : item.foc_qty
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
                                  :title="productListingModalTitle"
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
                          v-if="isExchangeModal"
                          v-bind:salesData="exchangeData"
                          v-bind:memberDetails="memberDetails"
                          :addToCart="addToExchangeCart"
                        ></listing-search-form>
                        <listing-search-form
                          v-else
                          v-bind:salesData="exchangeData"
                          v-bind:memberDetails="memberDetails"
                          :addToCart="addToReturnCart"
                        ></listing-search-form>
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
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import Vue from 'vue'
  import { required } from 'vuelidate/lib/validators'
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
      addToExchangeCart: {
        type: Function,
        required: false
      },
      addToReturnCart: {
        type: Function,
        required: false
      },
      processProductGroupingsContra: {
        type: Function,
        required: true
      }
    },
    data: () => ({
      kittingDefaultTab: 'kitComponents',
      isExchangeModal: true,
      productListingModalTitle: '',
      terms: '',
      cartSelectedReturnProductIDs: [],
      cartSelectedReturnKittingIDs: [],
      cartSelectedExchangeProductIDs: [],
      cartSelectedExchangeKittingIDs: [],
      hideKittingItems: [],
      returnTableTh: [
        '',
        Vue.prototype.$t('sale.exchange.detail.tableLabel.productCode'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.productName'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.transactionType'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.purchaseQty'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.availableQty'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.unitRatioPrice'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.totalPrice'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.returnQty'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.returnAmount')
      ],
      exchangeTableTH: [
        ' ',
        Vue.prototype.$t('sale.exchange.detail.tableLabel.productCode'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.productName'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.quantity'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.unitPrice'),
        Vue.prototype.$t('sale.exchange.detail.tableLabel.totalPrice')
      ],
      newProduct: {
        id: 0,
        product_code: '',
        product_name: '',
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
    }),
    computed: {
      ...mapState({
        isProcessingCart: state => state.globalCMP.isProcessingCart,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        selectedFilters: state => state.salesCMP.selectedFilters,
        productSearchData: state => state.productsCMP.productSearchData,
        isProcessingList: state => state.globalCMP.isProcessingList
      }),
      ...mapGetters([
        'currencyLabelByCountry',
        'listProductAndKittingSearchList'
      ])
    },
    mounted () {
      this.master.keys = [
        'sale_types'
      ]
    },
    validations: {
      newProduct: {
        product_code: {
          required
        },
        product_name: {
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
        this.processProductGroupingsContra(product, type)
      },
      removeProductFromExchange(product) {
        let indexOfProduct = this.exchangeData.exchange_products.indexOf(product)
        if (indexOfProduct > -1) {
          Vue.delete(this.exchangeData.exchange_products, indexOfProduct)
          this.reCalculateCart()
        }
      },
      reCalculateCart(type) {
        // Call parent method
        this.$emit('reCalculateCart', type)
      },
      mixActions(name, section, data, title, kittingCode, kittingID, kittingQty) {
        if (section === 'return') {
          this.isExchangeModal = false
          this.productListingModalTitle = 'Return Product Listing'
        } else if (section === 'exchange') {
          this.isExchangeModal = true
          this.productListingModalTitle = 'Exchange Product Listing'
        }
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
      getProductAdditionalRequirementByMasterTitle(data) {
        let requirements = []
        if (typeof this.masterData.product_additional_requirements !== 'undefined' && typeof data !== 'undefined' && data.length > 0) {
          data.forEach((item) => {
            requirements = this.masterData.product_additional_requirements.filter(x => x.id === item)
          })
          return requirements
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
      removeExchangeRowFromCart() {
        let products = this.exchangeData.exchange_products
        let kittings = this.exchangeData.exchange_kitting
        if (this.cartSelectedExchangeProductIDs.length > 0) {
          this.cartSelectedExchangeProductIDs.forEach((id) => {
            let productIndex = products.findIndex(x => x.product_id === id)
            products.splice(productIndex, 1)
          })
          this.cartSelectedExchangeProductIDs = []
        }
        if (this.cartSelectedExchangeKittingIDs.length > 0) {
          this.cartSelectedExchangeKittingIDs.forEach((id) => {
            let kittingIndex = kittings.findIndex(x => x.kitting_id === id)
            kittings.splice(kittingIndex, 1)
          })
          this.cartSelectedExchangeKittingIDs = []
        }
        this.reCalculateCart()
      },
      removeReturnRowFromCart() {
        let products = this.exchangeData.legacy_return_products
        let kittings = this.exchangeData.legacy_return_kitting
        if (this.cartSelectedReturnProductIDs.length > 0) {
          this.cartSelectedReturnProductIDs.forEach((id) => {
            let productIndex = products.findIndex(x => x.product_id === id)
            products.splice(productIndex, 1)
          })
          this.cartSelectedReturnProductIDs = []
        }
        if (this.cartSelectedReturnKittingIDs.length > 0) {
          this.cartSelectedReturnKittingIDs.forEach((id) => {
            let kittingIndex = kittings.findIndex(x => x.kitting_id === id)
            kittings.splice(kittingIndex, 1)
          })
          this.cartSelectedReturnKittingIDs = []
        }
        this.reCalculateCart()
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
