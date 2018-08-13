<template>
    <div class="kitting-tab">
        <div class="row">
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12 q-mb-md">
                <div class="row gutter-sm">
                    <div class="col-12">
                        <q-field
                                helper="*"
                                :error="validation.kittingProduct.name.$error"
                                :error-label="$t('products.input.KitName.errorLabel')"
                        >
                            <q-input v-model="kittingProduct.name"
                                     type="text"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :placeholder="$t('products.kitting.KitName.label')"
                                     @input="validation.kittingProduct.name.$touch"
                            />
                        </q-field>
                    </div>
                    <div class="col-12">
                        <q-field
                                helper="*"
                                :error="validation.kittingProduct.code.$error"
                                :error-label="$t('products.input.KitCode.errorLabel')"
                        >
                            <q-input v-model="kittingProduct.code"
                                     type="text"
                                     align="left"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :placeholder="$t('products.kitting.KitCode.label')"
                                     @input="validation.kittingProduct.code.$touch"
                            />
                        </q-field>
                    </div>
                    <div class="col-12">
                        <q-field class="q-mt-md">
                            <q-toggle v-model="kittingProduct.is_esac" :true-value="1" :false-value="0"
                                      :label="$t('products.kitting.isEsac.label')"/>
                        </q-field>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                <div class="row justify-end gutter-sm">
                    <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                        <q-btn class="full-width" :disable="!this.kittingProduct.kitting_id > 0" @click="duplicate" color="primary"
                               icon="content_copy">{{ $t('products.kitting.duplicate.btn') }}
                        </q-btn>
                    </div>
                </div>
            </div>
        </div>
        <div class="row q-mt-lg">
            <div class="col-lg-12 col-md-12 col-xs-12">
                <table class="q-table-html responsive bordered cell-separator full-width table-layout-fixed">
                    <thead>
                    <tr class="header bg-grey-3">
                        <th width="20%" class="text-center">{{ $t('products.standard.ProductCode.label') }}</th>
                        <th width="30%" class="text-center">{{ $t('products.standard.ProductName.label') }}</th>
                        <th class="text-center">{{ $t('products.kitting.Quantity.label') }}</th>
                        <th class="text-center">{{ $t('products.kitting.focQty.label') }}</th>
                        <th class="text-center">{{ $t('products.kitting.unitBaseCv.label') }}</th>
                        <th class="text-center">{{ $t('products.kitting.unitWpCv.label') }}</th>
                        <th class="text-center">{{ $t('products.kitting.totalBaseCv.label') }}</th>
                        <th class="text-center">{{ $t('products.kitting.totalWpCv.label') }}</th>
                        <th class="text-center"></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="text-center">
                        <td data-th="Product code">
                            <q-search v-model.trim="adderRow.code"
                                      inverted-light
                                      color="white"
                                      class="no-shadow custom-input-border"
                                      :placeholder="$t('Common.search.placeholder')">
                                <q-autocomplete
                                        :max-results="10"
                                        @search="search"
                                        @selected="selected"
                                />
                            </q-search>
                        </td>
                        <td data-th="Product Name">
                            <q-search v-model.trim="adderRow.name"
                                      inverted-light
                                      color="white"
                                      class="no-shadow custom-input-border"
                                      :placeholder="$t('Common.search.placeholder')">
                                <q-autocomplete
                                        :max-results="10"
                                        @search="search"
                                        @selected="selected"
                                />
                            </q-search>
                        </td>
                        <td data-th="Quantity">
                            <q-input type="number"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :min="0"
                                     align="center"
                                     v-model="adderRow.quantity"
                                     @input="rowCalculation('quantity')"/>
                        </td>
                        <td data-th="FOC Qty">
                            <q-input type="number"
                                     inverted-light
                                     color="white"
                                     class="no-shadow custom-input-border"
                                     :min="0"
                                     align="center"
                                     v-model="adderRow.foc_qty"
                                     @input="rowCalculation('foc_qty')"/>
                        </td>
                        <td data-th="Unit Base CV">{{ adderRow.base_cv }}</td>
                        <td data-th="Unit WP CV">{{ adderRow.wp_cv }}</td>
                        <td data-th="Total Base CV">{{ adderRow.total_base_cv }}</td>
                        <td data-th="Total WP CV">{{ adderRow.total_wp_cv }}</td>
                        <td>
                            <q-btn :disable="!adderRow.product_id > 0" @click="addRow" color="positive" flat>
                                <q-icon name="add"/>
                            </q-btn>
                        </td>
                    </tr>
                    <tr class="text-center" v-for="(addRowTemp, index) in kittingProduct.kitting_products" :key="addRowTemp.id">
                        <td class="text-left" data-th="Product code">{{ addRowTemp.product.sku }}</td>
                        <td class="text-left" data-th="Product Name">{{ addRowTemp.product.name }}</td>
                        <td data-th="Quantity">{{ addRowTemp.quantity }}</td>
                        <td data-th="FOC Qty">{{ addRowTemp.foc_qty }}</td>
                        <td data-th="Unit Base CV">
                            {{ addRowTemp.product.product_prices_latest !== null ? addRowTemp.product.product_prices_latest.base_cv : $t('products.kitting.invalid')
                            }}
                        </td>
                        <td data-th="Unit WP CV">
                            {{ addRowTemp.product.product_prices_latest !== null ? addRowTemp.product.product_prices_latest.wp_cv : $t('products.kitting.invalid')
                            }}
                        </td>
                        <td data-th="Total Base CV">
                            {{ addRowTemp.product.product_prices_latest !== null ? addRowTemp.product.product_prices_latest.base_cv * addRowTemp.quantity : $t('products.kitting.invalid')
                            }}
                        </td>
                        <td data-th="Total WP CV">
                            {{ addRowTemp.product.product_prices_latest !== null ? addRowTemp.product.product_prices_latest.wp_cv * addRowTemp.quantity : $t('products.kitting.invalid')}}
                        </td>
                        <td>
                            <q-btn @click="removeRow(index)" color="negative" flat>
                                <q-icon name="delete"/>
                            </q-btn>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
  import {mapState, mapActions} from 'vuex'
  import Vue from 'vue'

  // Initialize adderRow
  function initializeAdderRow() {
    return {
      code: '',
      name: '',
      product_id: 0,
      quantity: 0,
      foc_qty: 0,
      base_cv: 0,
      wp_cv: 0,
      total_base_cv: 0,
      total_wp_cv: 0
    }
  }

  export default {
    name: 'kitting-tab',
    props: {
      'kittingProduct': {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        productSearchData: state => state.productsCMP.productSearchData,
        selectedFilters: state => state.globalCMP.selectedFilters
      })
    },
    data: () => ({
      adderRow: initializeAdderRow(),
      addRowTemp: {
        product: {
          sku: '',
          name: '',
          product_prices_latest: {
            gmp_price_tax: 0,
            base_cv: 0,
            wp_cv: 0
          }
        },
        product_id: '',
        quantity: 0,
        foc_qty: 0
      }
    }),
    watch: {
      adderRow: {
        handler(val) {
          // Reset adderRow
          if (val.code === '' && val.name !== '') {
            Object.assign(this.adderRow, initializeAdderRow())
          }
          if (val.name === '' && val.code !== '') {
            Object.assign(this.adderRow, initializeAdderRow())
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'getProductSearchAction',
        'getProductLessByIdAction'
      ]),
      search(terms, done) {
        let query = {
          country_id: this.selectedFilters.countryID,
          text: terms
        }
        this.getProductSearchAction(query).then(res => {
          done(this.productSearchData.list)
        })
      },
      selected(item) {
        this.adderRow.code = item.label
        this.adderRow.name = item.sublabel
        this.adderRow.product_id = item.value
        let query = {
          product_id: item.value,
          country_id: this.selectedFilters.countryID
        }
        this.getProductLessByIdAction(query).then(res => {
          this.initRow(res)
        })
      },
      initRow(data) {
        // adderRow fill up base and wp for temporary calculation
        this.adderRow.base_cv = data.base_price.base_cv
        this.adderRow.wp_cv = data.base_price.wp_cv

        // Actual row initialization before injecting into kittingProduct
        this.addRowTemp.product.name = this.adderRow.name
        this.addRowTemp.product.sku = data.sku ? data.sku : this.adderRow.code
        this.addRowTemp.product.product_prices_latest.gmp_price_tax = data.base_price.gmp_price_tax ? data.base_price.gmp_price_tax : 0.00
        this.addRowTemp.product_id = data.product_id
        this.addRowTemp.product.product_prices_latest.base_cv = data.base_price.base_cv ? data.base_price.base_cv : 0
        this.addRowTemp.product.product_prices_latest.wp_cv = data.base_price.wp_cv ? data.base_price.wp_cv : 0
        this.addRowTemp.quantity = data.quantity ? data.quantity : 0
        this.addRowTemp.foc_qty = data.foc_qty ? data.foc_qty : 0
        this.rowCalculation()
      },
      rowCalculation(type) {
        // Reset based on user input and before calculation begin
        if (this.adderRow.quantity > 0 && type === 'quantity') {
          this.adderRow.foc_qty = 0
        } else if (this.adderRow.foc_qty > 0 && type === 'foc_qty') {
          this.adderRow.quantity = 0
        }
        if (this.adderRow.base_cv !== 0 && this.adderRow.base_cv !== '') {
          this.adderRow.total_base_cv = this.adderRow.base_cv * this.adderRow.quantity
        }
        if (this.adderRow.wp_cv !== 0 && this.adderRow.wp_cv !== '') {
          this.adderRow.total_wp_cv = this.adderRow.wp_cv * this.adderRow.quantity
        }
      },

      addRow() {
        if (this.adderRow.product_id !== '' && (this.adderRow.quantity !== 0 || this.adderRow.foc_qty !== 0)) {
          this.addRowTemp.quantity = this.adderRow.quantity
          this.addRowTemp.foc_qty = this.adderRow.foc_qty
          let index = -1
          if (this.adderRow.quantity > 0) {
            index = this.kittingProduct.kitting_products.findIndex(x => x.product_id === this.adderRow.product_id && x.quantity > 0)
          } else {
            index = this.kittingProduct.kitting_products.findIndex(x => x.product_id === this.adderRow.product_id && x.foc_qty > 0)
          }
          if (index !== -1) {
            if (this.adderRow.quantity > 0) {
              this.kittingProduct.kitting_products[index].quantity += this.adderRow.quantity
            } else {
              this.kittingProduct.kitting_products[index].foc_qty += this.adderRow.foc_qty
            }
          } else {
            this.kittingProduct.kitting_products.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.addRowTemp))))
          }
          // Reset adderRow
          Object.assign(this.adderRow, initializeAdderRow())
        }
      },
      removeRow(index) {
        this.removeRowIntegrityCheck(index)
        Vue.delete(this.kittingProduct.kitting_products, index)
      },
      removeRowIntegrityCheck(index) {
        if (this.kittingProduct.kitting_products[index].id) {
          this.kittingProduct.deleted_ids.products.push(this.kittingProduct.kitting_products[index].id)
        }
      },
      duplicate() {
        this.kittingProduct.kitting_id = null
        this.kittingProduct.code = ''
        this.kittingProduct.name = ''
        this.kittingProduct.duplicate = true
        delete this.kittingProduct.kitting_price.kitting_id
        delete this.kittingProduct.kitting_price.id
        this.kittingProduct.kitting_products.forEach((item) => {
          delete item.kitting_id
          delete item.id
        })
      }
    }
  }
</script>