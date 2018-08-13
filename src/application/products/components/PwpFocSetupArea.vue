<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="SetupForm"
                    v-if="!isLocalProcessing"
                    :backgroudColor="false"
                    formTitle="Promotion Free Item"
                    v-bind:formFieldData="pwpFocData"
                    urlResetPathName="PWP and FOC - List"
                    formAction="createPwpFocAction"
                    buttonTitleCaption="Save"
                    :formSubmit="processForm">
            <template slot="form-title" slot-scope="props">
                <div class="text-grey-7"></div>
                <div></div>
            </template>
            <template slot="form">
                <div class="pwp-foc-section mt-20 text-black">
                    <!-- content Area-->
                    <div class="configuration-content-sections shadow-1 q-pa-md bg-white">
                        <div class="row gutter-md">
                            <div class="col-lg-5 col-md-12 col-xs-12">
                                <div class="general-holder">
                                    <div class="general-item q-mb-sm relative-position">
                                        <q-select
                                                disable
                                                placeholder="Choose ..."
                                                inverted-light
                                                color="white"
                                                class="no-shadow custom-input-border"
                                                v-model="pwpFocData.country_id"
                                                :stack-label="$t('products.pwpfoc.country')"
                                                :options="countriesOptions.options"
                                        />
                                        <q-loader :visible="isProcessingSection"></q-loader>
                                    </div>
                                </div>
                                <div class="general-holder">
                                    <div class="general-item q-mb-sm">
                                        <q-field
                                                helper="*"
                                                :error="$v.pwpFocData.name.$error"
                                                error-label="Promo name is required"
                                        >
                                            <q-input v-model="pwpFocData.name"
                                                     placeholder="Type here ..."
                                                     inverted-light
                                                     color="white"
                                                     class="no-shadow custom-input-border"
                                                     type="text"
                                                     align="left"
                                                     stack-label="Promotion Name"
                                                     @input="$v.pwpFocData.name.$touch"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="row justify-between gutter-xs items-baseline">
                                    <div class="col-lg-6">
                                        <div class="general-holder">
                                            <div class="general-item q-mb-sm">
                                                <q-field
                                                        helper="*"
                                                        :error="$v.pwpFocData.start_date.$error"
                                                        error-label="Date range Invalid"
                                                >
                                                    <q-datetime align="left"
                                                                placeholder="DD-MM-YYYY"
                                                                inverted-light
                                                                color="white"
                                                                class="no-shadow custom-input-border"
                                                                monday-first
                                                                format="DD-MM-YYYY"
                                                                v-model="pwpFocData.start_date"
                                                                :stack-label="$t('products.pwpfoc.startDate')"
                                                                @input="$v.pwpFocData.start_date.$touch"
                                                    />
                                                </q-field>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="general-holder">
                                            <div class="general-item q-mb-sm">
                                                <q-field
                                                        helper="*"
                                                        :error="$v.pwpFocData.end_date.$error"
                                                        :error-label="$t('products.dataRange.errorLabel')"
                                                >
                                                    <q-datetime align="left"
                                                                placeholder="DD-MM-YYYY"
                                                                :after="[ {icon: 'trending_up', handler () { setFutureDate() }}]"
                                                                inverted-light
                                                                color="white"
                                                                class="no-shadow custom-input-border"
                                                                monday-first
                                                                format="DD-MM-YYYY"
                                                                v-model="pwpFocData.end_date"
                                                                :stack-label="$t('products.pwpfoc.endDate')"
                                                                @input="$v.pwpFocData.end_date.$touch"
                                                    />
                                                    <q-tooltip>
                                                        <div class="text-weight-light">
                                                            {{ $t('Common.setFutureDate.tooltip') }}
                                                            <q-icon name="trending_up"></q-icon>
                                                        </div>
                                                    </q-tooltip>
                                                </q-field>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="general-holder">
                                    <div class="general-label text-grey-5">
                                        <div>{{$t('products.pwpfoc.promoType')}}</div>
                                    </div>
                                    <div class="general-item q-mb-sm">
                                        <q-option-group
                                                type="radio"
                                                color="white text-grey-6"
                                                inline
                                                v-model="pwpFocData.promo_type_id"
                                                :options="masterDataOptionsCreator('promotion_free_items_promo_types')"
                                        />
                                    </div>
                                </div>
                                <div class="general-holder">
                                    <div class="general-item q-mb-sm">
                                        <q-field helper="*"
                                                 :error="$v.pwpFocData.pwp_value.$error"
                                                 :error-label="$t('products.pwpfoc.pwpValue.errorLabel')"
                                        >
                                            <q-input v-model="pwpFocData.pwp_value"
                                                     placeholder="Type here ..."
                                                     inverted-light
                                                     color="white"
                                                     class="no-shadow custom-input-border"
                                                     type="number"
                                                     :disable="!hideFields('pwp_value',pwpFocData.promo_type_id)"
                                                     align="left" :prefix="id ? currencyLabel : currencyLabelByCountry"
                                                     :stack-label="$t('products.pwpfoc.pwpValue')"
                                                     @input="$v.pwpFocData.pwp_value.$touch"/>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder">
                                    <div class="general-label text-grey-5">
                                        <div>{{$t('products.pwpfoc.memberType')}}</div>
                                    </div>
                                    <div class="general-item q-mb-sm relative-position">
                                        <q-option-group
                                                type="checkbox"
                                                color="white text-grey-6"
                                                v-model="pwpFocData.general.promotion_free_items_member_types"
                                                :options="masterDataOptionsCreator('promotion_free_items_member_types')"
                                        />
                                        <q-loader :visible="isProcessingSection"></q-loader>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-4 col-md-12 col-xs-12">
                                <div class="general-holder">
                                    <div class="general-item q-mb-sm relative-position">
                                        <q-chips-input
                                                readonly
                                                @blur="clear"
                                                placeholder="Choose ..."
                                                inverted-light
                                                color="white"
                                                class="no-shadow custom-input-border cursor-pointer"
                                                :value="categoryTempNames"
                                                :stack-label="$t('products.pwpfoc.byCategory')">
                                        </q-chips-input>
                                        <q-popover fit :offset="[0, 0]" ref="catPopover"
                                                   @show="buildCategoriesDropDown">
                                            <div class="category-popover">
                                                <ul>
                                                    <li v-for="level1 in tree">
                                                            <span :class="{'active': activeSelected(level1.id) }"
                                                                  class="cursor-pointer"
                                                                  @click="setCategory(level1.id, level1.name)">
                                                                <q-icon name="chevron_right"/>
                                                                <q-icon v-if="activeSelected(level1.id)"
                                                                        name="highlight_off"/>
                                                                    {{ level1.name }}
                                                                </span>
                                                        <ul>
                                                            <li v-for="level2 in level1.children">
                                                                    <span :class="{'active': activeSelected(level2.id) }"
                                                                          class="cursor-pointer"
                                                                          @click="setCategory(level2.id, level2.name)">
                                                                        <q-icon v-if="activeSelected(level2.id)"
                                                                                name="highlight_off"/>
                                                                        {{ level2.name }}
                                                                    </span>
                                                                <ul>
                                                                    <li v-for="level3 in level2.children">
                                                                            <span :class="{'active': activeSelected(level3.id) }"
                                                                                  class="cursor-pointer"
                                                                                  @click="setCategory(level3.id, level3.name)">
                                                                                <q-icon v-if="activeSelected(level3.id)"
                                                                                        name="highlight_off"/>
                                                                                {{ level3.name }}
                                                                            </span>
                                                                    </li>
                                                                </ul>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </q-popover>
                                        <q-loader :visible="isProcessingSection"></q-loader>
                                    </div>
                                </div>
                                <div class="general-holder">
                                    <div class="general-item q-mb-sm">
                                        <q-input v-model.trim="product_code"
                                                 placeholder="Type here ..."
                                                 inverted-light
                                                 color="white"
                                                 class="no-shadow custom-input-border"
                                                 :stack-label="$t('products.pwpfoc.productCode')">
                                            <q-autocomplete
                                                    :max-results="10"
                                                    @search="searchProduct"
                                                    @selected="configurationProductSelection"
                                            />
                                        </q-input>
                                        <div class="selected-products group">
                                            <q-chip closable
                                                    small
                                                    square
                                                    color="black text-white"
                                                    v-for="(item, index) in pwpFocData.product_ids.data"
                                                    :key="index"
                                                    @hide="removeConfigurationSelection('product', index)">
                                                {{ item.sku }}
                                            </q-chip>
                                        </div>
                                    </div>
                                </div>
                                <div class="general-holder">
                                    <div class="general-item q-mb-sm">
                                        <q-input v-model.trim="kitting_code"
                                                 placeholder="Type here ..."
                                                 inverted-light
                                                 color="white"
                                                 class="no-shadow custom-input-border"
                                                 :stack-label="$t('products.pwpfoc.kittingCode')">
                                            <q-autocomplete
                                                    :max-results="10"
                                                    @search="searchKitting"
                                                    @selected="configurationKitSelection"
                                            />
                                        </q-input>
                                        <div class="selected-kits group">
                                            <q-chip closable
                                                    small
                                                    square
                                                    color="black text-white"
                                                    v-for="(kit, index) in pwpFocData.kit_ids.data"
                                                    :key="index"
                                                    @hide="removeConfigurationSelection('kit', index)">
                                                {{ kit.code }}
                                            </q-chip>
                                        </div>
                                    </div>
                                </div>
                                <div class="general-holder">
                                    <div class="general-item q-mb-sm">
                                        <q-field helper="*"
                                                 :error="$v.pwpFocData.min_purchase_qty.$error"
                                                 :error-label="$t('products.pwpfoc.minPurchase.errorLabel')"
                                        >
                                            <q-input v-model="pwpFocData.min_purchase_qty"
                                                     placeholder="Type here ..."
                                                     inverted-light
                                                     color="white"
                                                     class="no-shadow custom-input-border"
                                                     type="number"
                                                     :min="1"
                                                     :disable="!hideFields('min_purchase_qty')"
                                                     :stack-label="$t('products.pwpfoc.minPurchase')"
                                                     @input="$v.pwpFocData.min_purchase_qty.$touch"/>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6 col-md-12 col-xs-12">
                                        <div class="general-holder">
                                            <div class="general-item q-mb-sm">
                                                <q-field>
                                                    <q-input v-model="pwpFocData.from_cv_range"
                                                             type="number"
                                                             placeholder="Type here ..."
                                                             inverted-light
                                                             color="white"
                                                             class="no-shadow custom-input-border"
                                                             :prefix="$t('products.pwpfoc.fromPrefix')"
                                                             :min="0"
                                                             :stack-label="$t('products.pwpfoc.byCVRange')"/>
                                                </q-field>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-6 col-md-12 col-xs-12">
                                        <div class="general-holder">
                                            <div class="general-item q-mb-sm">
                                                <q-field>
                                                    <q-input v-model="pwpFocData.to_cv_range"
                                                             type="number"
                                                             placeholder="Type here ..."
                                                             inverted-light
                                                             color="white"
                                                             class="no-shadow custom-input-border"
                                                             :prefix="$t('products.pwpfoc.toPrefix')"
                                                             :min="0"
                                                             stack-label=" "/>
                                                </q-field>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-3 col-md-12 col-xs-12">
                                <div class="general-holder mb-20">
                                    <div class="general-item q-mb-sm relative-position">
                                        <q-list link separator>
                                            <q-list-header>{{$t('products.pwpfoc.salesType')}}</q-list-header>
                                            <q-item tag="label"
                                                    v-for="saleType in masterData.sale_types"
                                                    :key="saleType.id">
                                                <q-item-side>
                                                    <q-checkbox
                                                            color="white text-grey-6"
                                                            v-model="pwpFocData.general.sale_types"
                                                            :val="saleType.id"/>
                                                </q-item-side>
                                                <q-item-main>
                                                    <q-item-tile label>{{ saleType.title }}</q-item-tile>
                                                </q-item-main>
                                            </q-item>
                                        </q-list>
                                        <q-loader :visible="isProcessingSection"></q-loader>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="condition-content-sections mt-30 shadow-1 q-pa-md bg-white">
                        <div class="row">
                            <div class="col-lg-12">
                                <q-btn @click="add('options')"
                                       color="primary"
                                       icon="add"
                                       small
                                >
                                    {{$t('products.pwpfoc.newOption')}}
                                </q-btn>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="options mt-30"
                                     v-for="(option, indexOptions) in pwpFocData.conditions.options"
                                     :key="indexOptions">
                                    <div class="options-holder mt-20 pd-10 highlight-and-fade bg-grey-1">
                                        <div class="options-title">
                                            <div class="col-lg-1">
                                                <div class="row justify-start">
                                                    <div class="col-auto">
                                                        <q-btn @click="remove('set-holder-row',indexOptions)"
                                                               flat round
                                                               small
                                                               icon="close"
                                                               color="negative" small>
                                                        </q-btn>
                                                    </div>
                                                </div>
                                            </div>
                                            <small>Option {{ indexOptions + 1 }}</small>
                                        </div>
                                        <div class="options-set" v-for="(set, optionKey) in option">
                                            <div class="options-product" v-for="(product, setKey) in set"
                                                 v-if="setKey !== 'option_id'">
                                                <div class="options-items mt-20"
                                                     v-for="(item, itemsKey) in product">
                                                    <div class="hr"></div>
                                                    <div class="row items-baseline">
                                                        <div class="col-lg-11 col-md-12 col-xs-12">
                                                            <div class="row gutter-md content-between">
                                                                <div class="col-lg-2 col-md-12 col-xs-12">
                                                                    <q-input v-model.trim="item.product.sku"
                                                                             placeholder="Type here ..."
                                                                             inverted-light
                                                                             color="white"
                                                                             class="no-shadow custom-input-border"
                                                                             :placeholder="$t('products.pwpfoc.productCode')">
                                                                        <q-autocomplete
                                                                                :max-results="10"
                                                                                @search="searchProduct"
                                                                                @selected="(item, keyboard) => conditionProductSelection(item, indexOptions, optionKey, setKey, itemsKey, keyboard)"
                                                                                value-field="icon"
                                                                        />
                                                                    </q-input>
                                                                </div>
                                                                <div class="col-lg-8 col-md-12 col-xs-12">
                                                                    <q-input v-model.trim="item.product.name"
                                                                             placeholder="Type here ..."
                                                                             inverted-light
                                                                             color="white"
                                                                             class="no-shadow custom-input-border"
                                                                             :placeholder="$t('products.pwpfoc.productName')">
                                                                        <q-autocomplete
                                                                                :max-results="10"
                                                                                @search="searchProduct"
                                                                                @selected="(item, keyboard) => conditionProductSelection(item, indexOptions, optionKey, setKey, itemsKey, keyboard)"
                                                                                value-field="icon"
                                                                        />
                                                                    </q-input>
                                                                </div>
                                                                <div class="col-lg-2 col-md-12 col-xs-12">
                                                                    <q-input v-model="item.quantity"
                                                                             placeholder="Type here ..."
                                                                             inverted-light
                                                                             color="white"
                                                                             class="no-shadow custom-input-border"
                                                                             type="number"
                                                                             align="left"
                                                                             :min=0
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="col-lg-1 col-md-12 col-xs-12">
                                                            <div class="row justify-end">
                                                                <div class="col-auto">
                                                                    <q-btn @click="remove('set-item-row',indexOptions ,optionKey, setKey, itemsKey)"
                                                                           flat round
                                                                           small
                                                                           icon="close"
                                                                           color="negative" small>
                                                                    </q-btn>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="options-adder">
                                                    <div class="row justify-start">
                                                        <div class="col-auto q-mt-xs">
                                                            <q-btn @click="add('item', indexOptions, optionKey, setKey)"
                                                                   flat>
                                                                <q-icon name="add"
                                                                        small
                                                                        color="grey">
                                                                </q-icon>
                                                            </q-btn>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="options-or mt-20 mb-20">
                                                    <div class="row justify-center">
                                                        <div class="col-lg-12">
                                                            <div class="hr"></div>
                                                        </div>
                                                        <div class="col-auto">
                                                            <div class="options-or-btn-decoration mt-20">
                                                                <q-btn-group>
                                                                    <q-btn color="faded"
                                                                           small
                                                                           outline
                                                                           @click="add('set', indexOptions, optionKey, setKey)">
                                                                        OR
                                                                    </q-btn>
                                                                    <q-btn color="negative"
                                                                           v-show="setKey !== 'set_1'"
                                                                           small
                                                                           @click="remove('remove-item-row', indexOptions, optionKey, setKey)">
                                                                        <q-icon name="close"></q-icon>
                                                                    </q-btn>
                                                                </q-btn-group>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-show="pwpFocData.conditions.options.length !== indexOptions + 1"
                                         class="options-and-or q-pa-xs q-mt-lg">
                                        <div class="row justify-center">
                                            <div class="col-auto">
                                                <div class="options-and-or-btn-decoration">
                                                    <q-btn-group rounded>
                                                        <q-btn :color="operatorBtnColor"
                                                               rounded
                                                               :outline="pwpFocData.conditions.operator !== 'AND'"
                                                               big
                                                               @click="changeOperator('AND')">
                                                            AND
                                                        </q-btn>
                                                        <q-btn :color="operatorBtnColor"
                                                               rounded
                                                               :outline="pwpFocData.conditions.operator !== 'OR'"
                                                               big
                                                               @click="changeOperator('OR')">
                                                            OR
                                                        </q-btn>
                                                    </q-btn-group>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- content Area End-->
                </div>
            </template>
        </basic-form>
        <q-placeholder v-else=""></q-placeholder>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import qPlaceholder from 'src/application/global/components/common/loading/placeholder'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import Vue from 'vue'
  import {date} from 'quasar'
  import _ from 'lodash'
  import {required} from 'vuelidate/lib/validators'

  // Init tempItem object
  function tempItem() {
    return {
      product_id: '',
      product: {
        sku: '',
        name: ''
      },
      quantity: 1
    }
  }

  // Init tempOptions object
  function tempOptions(index1, index2) {
    let option = 'option_' + index1
    let set = 'set_' + index2
    return {
      [option]: {
        option_id: null,
        [set]: [
          tempItem()
        ]
      }
    }
  }

  // Init tempSet object
  // eslint-disable-next-line no-unused-vars
  function tempSet(index1) {
    let set = 'set_' + index1
    return {
      [set]: [
        tempItem()
      ]
    }
  }

  // unFlatten categoryData to tree
  function unflatten(array, parent, tree) {
    return new Promise(resolve => {
      tree = typeof tree !== 'undefined' ? tree : []
      parent = typeof parent !== 'undefined' ? parent : {id: 0}

      var children = _.filter(array, function (child) {
        return child.parent_id === parent.id
      })

      if (!_.isEmpty(children)) {
        if (parent.id === 0) {
          tree = children
        } else {
          parent['children'] = children
        }
        _.each(children, function (child) {
          unflatten(array, child)
        })
      }
      tree.sort(function (a, b) {
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
      resolve(tree)
    })
  }

  export default {
    name: 'pwp-foc-setup-steps',
    components: {
      generalHeader,
      basicForm,
      qLoader,
      qPlaceholder
    },
    props: ['id'],
    mixins: [masterDataTransformarMixin],
    data: () => ({
      isLocalProcessing: false,
      tree: [],
      message: '',
      product_code: '',
      kitting_code: '',
      configurationProductsSelectionTemp: [],
      configurationKitsSelectionTemp: [],
      operatorBtnColor: 'primary',
      categoryTempNames: [],
      pwpFocData: {
        name: '',
        country_id: '',
        start_date: '',
        end_date: '',
        promo_id: '',
        promo_type_id: '',
        pwp_value: '',
        product_category_ids: {
          ids: []
        },
        product_ids: {ids: [], data: []},
        kit_ids: {ids: [], data: []},
        min_purchase_qty: '',
        from_cv_range: '',
        to_cv_range: '',
        general: {
          promotion_free_items_member_types: [],
          sale_types: []
        },
        conditions: {
          operator: 'OR',
          options: []
        }
      }
    }),
    validations: {
      pwpFocData: {
        name: {
          required
        },
        start_date: {
          required,
          isInRange(val, elm) {
            if (elm) {
              if (elm.end_date) {
                let diff = date.getDateDiff(elm.end_date, val, 'days')
                if (diff > 0) {
                  return true
                } else {
                  return false
                }
              }
            }
            return false
          }
        },
        end_date: {
          required,
          // Custom validation with function
          // val return current input value
          // elm return entire current promotion_prices array
          isInRange(val, elm) {
            if (elm) {
              if (elm.start_date) {
                let diff = date.getDateDiff(val, elm.start_date, 'days')
                if (diff > 0) {
                  return true
                } else {
                  return false
                }
              }
            }
            return false
          }
        },
        pwp_value: {
          checkType(val, elm) {
            if (val > 0) {
              return true
            }
            if (this.hideFields('pwp_value', elm.promo_type_id)) {
              return false
            } else {
              return true
            }
          }
        },
        min_purchase_qty: {
          checkLength(val, elm) {
            if (val > 0) {
              return true
            }
            if (typeof elm.product_ids.ids !== 'undefined' && elm.product_ids.ids.length > 0) {
              return false
            } else {
              return true
            }
          }
        }
      }
    },
    computed: {
      ...mapState({
        isProcessing: state => state.globalCMP.isProcessing,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        selectedFilters: state => state.globalCMP.selectedFilters,
        focData: state => state.productsCMP.saveData.data,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        productSearchData: state => state.productsCMP.productSearchData,
        masterData: state => state.globalCMP.masterData.data.list,
        categoryData: state => state.productsCMP.productCategories.list.data
      }),
      ...mapGetters([
        'currencyLabel',
        'currencyLabelByCountry'
      ])
    },
    mounted() {
      if (!this.selectedFilters.countryID > 0) {
        this.invalidRequest()
      } else {
        this.isLocalProcessing = true
        this.master.keys = [
          'promotion_free_items_promo_types',
          'promotion_free_items_member_types',
          'sale_types'
        ]
        let query = {
          for_sales: true,
          active: true,
          limit: 0
        }
        this.getProductCategoriesAction(query).then(() => {
          this.initSetupArea()
        })
      }
    },
    methods: {
      ...mapActions([
        'getProductSearchAction',
        'getPwpFocByIdAction',
        'getCountriesAction',
        'getMastersWithKey',
        'getProductCategoriesAction',
        'createPwpFocAction',
        'getKittingSearchAction',
        'getCountryRelationAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA',
        setIsProcessingSection: 'IS_PROCESSING_SECTION',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        unsetFilterData: 'UNSET_FILTER_DATA',
        setPwpFocData: 'SET_PWP_FOC_DATA'
      }),
      initSetupArea() {
        if (this.pwpFocData.country_id === '') {
          this.pwpFocData.country_id = this.selectedFilters.countryID
        }
        if (this.id) {
          let query = {
            country_id: this.selectedFilters.countryID,
            promo_id: this.id !== undefined ? this.id : null
          }
          this.getPwpFocByIdAction(query).then(() => {
            this.manipulateSaveData()
          })
        } else {
          let query1 = {
            country_id: this.selectedFilters.countryID,
            relations: ['currency']
          }
          this.getCountryRelationAction(query1)
        }
        this.isLocalProcessing = false
      },
      activeSelected(id) {
        if (typeof this.pwpFocData.product_category_ids !== 'undefined') {
          if (typeof this.pwpFocData.product_category_ids.ids !== 'undefined') {
            return this.pwpFocData.product_category_ids.ids.includes(id)
          }
        }
        return false
      },
      setCategory(id, name) {
        let catIndex = this.pwpFocData.product_category_ids.ids.findIndex(x => x === id)
        if (catIndex !== -1) {
          this.pwpFocData.product_category_ids.ids.splice(catIndex, 1)
        } else {
          this.pwpFocData.product_category_ids.ids.push(id)
        }
        this.getCategoriesNames()
      },
      getCategoriesNames() {
        if (typeof this.categoryData !== 'undefined') {
          this.categoryTempNames = []
          if (typeof this.pwpFocData.product_category_ids !== 'undefined') {
            if (typeof this.pwpFocData.product_category_ids.ids !== 'undefined') {
              this.pwpFocData.product_category_ids.ids.forEach((element) => {
                let cat = this.categoryData.find(x => x.id === element)
                this.categoryTempNames.push(cat.name)
              })
            }
          }
        }
        return this.categoryTempNames
      },
      async buildCategoriesDropDown() {
        if (this.tree.length < 1) {
          this.setIsProcessingSection(true)
          this.tree = await unflatten(this.categoryData)
          this.setIsProcessingSection(false)
        }
      },
      manipulateSaveData(operation, data) {
        if (Object.keys(this.focData).length > 0) {
          this.pwpFocData = Object.assign(JSON.parse(JSON.stringify(this.focData)))
        }
        if (typeof this.pwpFocData.product_ids === 'undefined') {
          this.pwpFocData.product_ids = []
        }
        if (typeof this.pwpFocData.kit_ids === 'undefined') {
          this.pwpFocData.kit_ids = []
        }

        let general = {}
        if (typeof this.pwpFocData.general.promotion_free_items_member_types === 'undefined') {
          general.promotion_free_items_member_types = []
        } else {
          general.promotion_free_items_member_types = this.pwpFocData.general.promotion_free_items_member_types
        }

        if (typeof this.pwpFocData.general.sale_types === 'undefined') {
          general.sale_types = []
        } else {
          general.sale_types = this.pwpFocData.general.sale_types
        }
        // Assign newly constructed general object to local standardProduct object
        if (Object.keys(general).length > 0) {
          this.pwpFocData.general = Object.assign({}, general)
        }
        this.getCategoriesNames()
      },
      searchProduct(terms, done) {
        let query = {
          country_id: this.selectedFilters.countryID,
          text: terms
        }
        this.getProductSearchAction(query).then(res => {
          done(this.productSearchData.list)
        })
      },
      searchKitting(terms, done) {
        let query = {
          country_id: this.selectedFilters.countryID,
          kitting_code: terms
        }
        this.getKittingSearchAction(query).then(res => {
          done(this.productSearchData.list)
        })
      },
      configurationProductSelection(item, keyboard) {
        if (!keyboard) {
          if (!this.pwpFocData.product_ids.ids.includes(item.value)) {
            this.pwpFocData.product_ids.ids.push(item.value)
            this.pwpFocData.product_ids.data.push({id: item.value, sku: item.label})
          }
          this.product_code = ''
        }
      },
      configurationKitSelection(item, keyboard) {
        if (!keyboard) {
          if (!this.pwpFocData.kit_ids.ids.includes(item.value)) {
            this.pwpFocData.kit_ids.ids.push(item.value)
            this.pwpFocData.kit_ids.data.push({id: item.value, code: item.label})
          }
          this.kitting_code = ''
        }
      },
      removeConfigurationSelection(type, index) {
        if (type === 'product') {
          this.pwpFocData.product_ids.ids.splice(index, 1)
          this.pwpFocData.product_ids.data.splice(index, 1)
        } else {
          this.pwpFocData.kit_ids.ids.splice(index, 1)
          this.pwpFocData.kit_ids.data.splice(index, 1)
        }
      },
      conditionProductSelection(item, indexOptions, optionKey, setKey, itemsKey, keyboard) {
        if (!keyboard) {
          this.pwpFocData.conditions.options[indexOptions][optionKey][setKey][itemsKey].product.sku = item.label
          this.pwpFocData.conditions.options[indexOptions][optionKey][setKey][itemsKey].product_id = item.value
          this.pwpFocData.conditions.options[indexOptions][optionKey][setKey][itemsKey].product.name = item.sublabel
        }
      },
      add(section, indexOptions, optionKey, setKey) {
        if (section === 'options') {
          let index1 = this.pwpFocData.conditions.options.length + 1
          let index2 = 1
          this.pwpFocData.conditions.options.push(tempOptions(index1, index2))
        } else if (section === 'item') {
          this.pwpFocData.conditions.options[indexOptions][optionKey][setKey].push(tempItem())
        } else if (section === 'set') {
          let count = Object.keys(this.pwpFocData.conditions.options[indexOptions][optionKey]).length
          // Used Spread operator to merge 2 object
          this.pwpFocData.conditions.options[indexOptions][optionKey] = {...this.pwpFocData.conditions.options[indexOptions][optionKey], ...tempSet(count)}
        }
      },
      remove(section, indexOptions, optionKey, setKey, itemKey) {
        if (section === 'set-item-row') {
          this.pwpFocData.conditions.options[indexOptions][optionKey][setKey].splice(itemKey, 1)
        }
        if (section === 'remove-item-row') {
          Vue.delete(this.pwpFocData.conditions.options[indexOptions][optionKey], [setKey])
        }
        if (section === 'set-holder-row') {
          this.pwpFocData.conditions.options.splice(indexOptions, 1)
          if (this.pwpFocData.conditions.options.length === 1) {
            this.pwpFocData.conditions.operator = 'OR'
          }
        }
      },
      changeOperator(operator) {
        if (operator === 'AND') {
          this.operatorBtnColor = 'positive'
          this.pwpFocData.conditions.operator = 'AND'
        } else {
          this.operatorBtnColor = 'negative'
          this.pwpFocData.conditions.operator = 'OR'
        }
      },
      hideFields(type, data) {
        if (type === 'pwp_value') {
          if (typeof this.masterData.promotion_free_items_promo_types !== 'undefined' && data !== '') {
            let promo = this.masterData.promotion_free_items_promo_types.filter(item => item.id === data)
            if (promo.length > 0 && promo[0].title === this.$const.masterData.FOC) {
              this.pwpFocData.pwp_value = 0
              return false
            } else {
              return true
            }
          }
          return false
        }
        if (type === 'min_purchase_qty') {
          if (typeof this.pwpFocData.product_ids.ids !== 'undefined' || typeof this.pwpFocData.kit_ids.ids !== 'undefined') {
            if (this.pwpFocData.product_ids.ids.length > 0 || this.pwpFocData.kit_ids.ids.length > 0) {
              return true
            } else {
              return false
            }
          }
        }
      },
      clear() {
        if (this.pwpFocData.category_name === '') {
          this.pwpFocData.category_id = []
        }
      },
      invalidRequest() {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'PWP and FOC - List'})
        }, 1500)
      },
      processForm: function (formFieldData) {
        this.$v.pwpFocData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.pwpFocData.$error) {
            this.pwpFocData.start_date = date.formatDate(this.pwpFocData.start_date, 'YYYY-MM-DD')
            this.pwpFocData.end_date = date.formatDate(this.pwpFocData.end_date, 'YYYY-MM-DD')
            this.createPwpFocAction(formFieldData).then((res) => {
              this.manipulateSaveData()
              resolve(res)
            })
          } else {
            this.setNotification({
              title: 'PWP & FOC Creation Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.pwpFocData.$error)
          }
        })
      },
      setFutureDate() {
        const futureDate = date.formatDate('01-01-2099', 'YYYY-MM-DD')
        this.pwpFocData.end_date = futureDate
      }
    }
  }
</script>
<style lang="stylus">
    .options-holder
        border dotted 1px lightgray

    .category-popover > ul, .category-popover > ul > li > ul, .category-popover > ul > li > ul > li > ul
        list-style none

    .category-popover > ul > li
        padding 6px
        margin-left -30px

    .category-popover .active
        color #00c853

    .category-popover span:hover
        color: #afafaf
</style>
