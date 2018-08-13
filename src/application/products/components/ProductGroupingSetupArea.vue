<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SetupForm"
                    v-if="show"
                    :backgroudColor="false"
                    :formTitle="$t('products.productGrouping.setup.title')"
                    v-bind:formFieldData="productGroupingData"
                    urlResetPathName="Product Grouping List"
                    formAction="createProductGroupingAction"
                    buttonTitleCaption="Save"
                    :formSubmit="processForm">
            <template slot="form">
                <div class="form-tabs mt-20 text-black">
                    <!-- content Area-->
                    <div class="product-tab-content-sections q-pa-md bg-white shadow-1">
                        <div class="row">
                            <div class="col-lg-4 col-md-12 col-sm-12 col-xs-12">
                                <div class="row gutter-sm">
                                    <div class="col-12">
                                        <q-field
                                                helper="*"
                                                :error="$v.productGroupingData.dmy_code.$error || setError('dmy_code','type.exp')"
                                                :error-label="setError('dmy_code','type.exp') ? setError('dmy_code','type.msg') : $t('products.productGrouping.setup.dmyCode.errorLabel')"
                                        >
                                            <q-input v-model="productGroupingData.dmy_code"
                                                     type="text"
                                                     align="left"
                                                     inverted-light
                                                     color="white text-black"
                                                     class="no-shadow custom-input-border"
                                                     :placeholder="$t('products.productGrouping.setup.dmyCode')"
                                                     @input="$v.productGroupingData.dmy_code.$touch"
                                            />
                                        </q-field>
                                    </div>
                                    <div class="col-12">
                                        <q-field
                                                helper="*"
                                                :error="$v.productGroupingData.dmy_name.$error || setError('dmy_name','type.exp')"
                                                :error-label="setError('dmy_name','type.exp') ? setError('dmy_name','type.msg') : $t('products.productGrouping.setup.dmyName.errorLabel')"
                                        >
                                            <q-input v-model="productGroupingData.dmy_name"
                                                     type="text"
                                                     align="left"
                                                     inverted-light
                                                     color="white text-black"
                                                     class="no-shadow custom-input-border"
                                                     :placeholder="$t('products.productGrouping.setup.dmyName')"
                                                     @input="$v.productGroupingData.dmy_name.$touch"
                                            />
                                        </q-field>
                                    </div>
                                    <div class="col-12">
                                        <q-field class="q-mt-md">
                                            <q-toggle v-model="productGroupingData.active" :true-value="1" :false-value="0"
                                                      label="Active"/>
                                        </q-field>
                                    </div>
                                    <div class="col-12">
                                        <q-field class="q-mt-md">
                                            <q-toggle v-model="productGroupingData.is_lingerie" :true-value="1" :false-value="0"
                                                      label="Sizes Grouping"/>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="product-tab-content-sections mt-10">
                        <q-field
                                helper="*"
                                :error="$v.productGroupingData.dummy_products.products.$error"
                                :error-label="$t('products.productGrouping.setup.product.errorLabel')"
                        >
                            <table class="q-table-html responsive bordered highlight cell-separator full-width bg-white">
                                <thead>
                                <tr class="bg-grey-3">
                                    <th width="30%" class="text-left">{{$t('products.standard.ProductCode.label')}}</th>
                                    <th width="65%" class="text-left">{{$t('products.standard.ProductName.label')}}</th>
                                    <th width="5%" class="text-left"></th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td data-th="Product SKU">
                                        <q-search v-model.trim="adderRow.sku"
                                                  inverted-light
                                                  color="white text-grey-6"
                                                  class="no-shadow custom-input-border"
                                        >
                                            <q-autocomplete
                                                    :max-results="10"
                                                    @search="search"
                                                    @selected="selected"
                                                    value-field="icon"
                                            />
                                        </q-search>
                                    </td>
                                    <td data-th="Product Name">
                                        <q-search v-model.trim="adderRow.name"
                                                  inverted-light
                                                  color="white text-grey-6"
                                                  class="no-shadow custom-input-border">
                                            <q-autocomplete
                                                    :max-results="10"
                                                    @search="search"
                                                    @selected="selected"
                                                    value-field="icon"
                                            />
                                        </q-search>
                                    </td>
                                    <td>
                                        <q-btn :disable="!adderRow.product_id > 0" @click="addRow" color="positive"
                                               flat>
                                            <q-icon name="add"/>
                                        </q-btn>
                                    </td>
                                </tr>
                                <tr :class="{'bg-negative text-white': highlightRow === index || setError('dummy_products.product_ids.' + index ,'type.exp'), 'disabled' : itemTempDeleted(item.id !== undefined ? item.id : item.product_id)}"
                                    v-for="(item, index) in productGroupingData.dummy_products.products"
                                    :key="item.id">
                                    <td data-th="Product SKU" class="text-left">{{ item.sku }}</td>
                                    <td data-th="Product Name" class="text-left">{{ item.name }}
                                        <br>
                                        <div class="animated flash q-body-1 q-mt-md">
                                            {{ setError('dummy_products.product_ids.' + index, 'type.msg') }}
                                        </div>
                                    </td>
                                    <td class="text-left bg-white">
                                        <q-btn :disable="highlightRow === index || itemTempDeleted(item.id !== undefined ? item.id : item.product_id)"
                                               @click="removeRow(index, item.id !== undefined ? item.id : item.product_id, setError('dummy_products.product_ids.' + index ,'type.exp'))"
                                               color="negative" flat>
                                            <q-icon name="delete"/>
                                        </q-btn>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </q-field>
                    </div>
                    <!-- content Area end-->
                </div>
            </template>
        </basic-form>
        <q-placeholder v-else=""></q-placeholder>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>

<script>
  import {mapState, mapActions, mapMutations} from 'vuex'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import qPlaceholder from 'src/application/global/components/common/loading/placeholder'
  // eslint-disable-next-line no-unused-vars
  import {required, minLength} from 'vuelidate/lib/validators'
  import {SetFormFieldErrorsMixin} from 'src/application/global/mixins/index'
  import Vue from 'vue'

  const REQUEST = 'REQUEST'
  const RESPONSE = 'RESPONSE'

  // Initialize adderRow
  function initializeAdderRow() {
    return {
      sku: '',
      name: '',
      product_id: ''
    }
  }

  export default {
    name: 'product-grouping-setup-area',
    components: {
      generalHeader,
      basicForm,
      qLoader,
      qPlaceholder
    },
    mixins: [SetFormFieldErrorsMixin],
    props: ['id'],
    computed: {
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        selectedFilters: state => state.globalCMP.selectedFilters,
        productSearchData: state => state.productsCMP.productSearchData,
        productGroupingStateData: state => state.productsCMP.saveData.data
      })
    },
    mounted() {
      if (!this.selectedFilters.countryID > 0) {
        this.invalidRequest()
      } else {
        this.initSetupArea()
      }
    },
    data: () => ({
      message: '',
      show: false,
      adderRow: initializeAdderRow(),
      highlightRow: '',
      tempDeleteIDs: [],
      productGroupingData: {
        dmy_code: '',
        dmy_name: '',
        is_lingerie: 1,
        active: 1,
        dummy_products: {
          product_ids: [],
          products: []
        }
      }
    }),
    validations: {
      productGroupingData: {
        dmy_code: {required},
        dmy_name: {required},
        dummy_products: {
          products: {
            required,
            minLength: minLength(2)
          }
        }
      }
    },
    watch: {
      adderRow: {
        handler(val) {
          // Reset adderRow
          if (val.sku === '' && val.name !== '') {
            Object.assign(this.adderRow, initializeAdderRow())
          }
          if (val.name === '' && val.sku !== '') {
            Object.assign(this.adderRow, initializeAdderRow())
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'createProductGroupingAction',
        'getProductSearchAction',
        'getProductGroupingDetailByIdAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        unsetFilterData: 'UNSET_FILTER_DATA',
        setGroupingData: 'SET_PRODUCT_GROUPING_DATA'
      }),
      initSetupArea() {
        let query = {
          country_id: this.selectedFilters.countryID,
          dummy_id: this.id !== undefined ? this.id : null
        }
        this.getProductGroupingDetailByIdAction(query).then(res => {
          this.manipulateSaveData(REQUEST)
        }).catch((e) => {
          this.invalidRequest()
        })
      },
      manipulateSaveData(operation, data) {
        if (operation === 'RESPONSE') {
          this.setGroupingData(data)
        }
        this.productGroupingData = Object.assign({}, JSON.parse(JSON.stringify(this.productGroupingStateData)))
        this.show = true
      },
      search(terms, done) {
        let query = {
          country_id: this.selectedFilters.countryID,
          text: terms
        }
        this.getProductSearchAction(query).then(res => {
          done(this.productSearchData.list)
        })
      },
      selected(item, keyboard) {
        if (!keyboard) {
          this.adderRow.sku = item.label
          this.adderRow.name = item.sublabel
          this.adderRow.product_id = item.value
        }
      },
      addRow() {
        let match = this.productGroupingData.dummy_products.products.filter(item => item.product_id === this.adderRow.product_id || item.id === this.adderRow.product_id).length
        if (this.adderRow.product_id !== '' && match < 1) {
          this.productGroupingData.dummy_products.product_ids.push(this.adderRow.product_id)
          this.productGroupingData.dummy_products.products.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.adderRow))))
          // Reset adderRow
          Object.assign(this.adderRow, initializeAdderRow())
        } else {
          const matchIndex = this.productGroupingData.dummy_products.products.findIndex(item => item.product_id === this.adderRow.product_id || item.id === this.adderRow.product_id)
          this.highlightRow = matchIndex
          setTimeout(() => {
            this.highlightRow = ''
          }, 1500)
        }
      },
      removeRow(index, id, hasError = false) {
        if (hasError) {
          this.tempDeleteIDs.push(id)
        } else {
          this.productGroupingData.dummy_products.product_ids.splice(index, 1)
          Vue.delete(this.productGroupingData.dummy_products.products, index)
        }
      },
      itemTempDeleted(productID) {
        return this.tempDeleteIDs.includes(productID)
      },
      invalidRequest() {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Product Grouping List'})
        }, 1500)
      },
      processForm: async function (formFieldData) {
        if (this.tempDeleteIDs.length > 0) {
          this.tempDeleteIDs.forEach(async (id) => {
            let itemIndex1 = this.productGroupingData.dummy_products.product_ids.findIndex((x) => x === id)
            let itemIndex2 = this.productGroupingData.dummy_products.products.findIndex((x) => x.id === id)
            if (itemIndex1 !== -1) {
              await this.productGroupingData.dummy_products.product_ids.splice(itemIndex1, 1)
            }
            if (itemIndex2 !== -1) {
              await this.productGroupingData.dummy_products.products.splice(itemIndex2, 1)
            }
          })
        }
        this.tempDeleteIDs = []
        this.$v.productGroupingData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.productGroupingData.$error) {
            this.createProductGroupingAction(formFieldData).then((res) => {
              // Update vuex saveData
              // Wrap response with data {} object to ensure follow API request standard
              this.manipulateSaveData(RESPONSE, {data: res})
              resolve(res)
            })
          } else {
            this.setNotification({
              title: 'products.productGrouping.creation.failed',
              message: 'validation.failed',
              type: 'negative'
            })
            reject(this.$v.productGroupingData.$error)
          }
        })
      }
    },
    beforeDestroy: function () {
      this.unsetFilterData({productGroupingID: '', productGroupingCode: '', productGroupingName: ''})
    }
  }
</script>
<style lang="stylus">
    #SetupForm
        .ellipsis
            overflow visible
</style>
