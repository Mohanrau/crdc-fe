<template>
    <div class="shared-shipping-tab">
        <div class="row">
            <div class="col-lg-12 col-md-12 col-xs-12">
                <q-card square flat class="relative-position">
                    <q-card-main>
                        <div class="row items-center">
                            <div class="col-auto">
                                <q-field error-label="Please choose shipping type"
                                         :error="validations.salesData.selected.shipping.sale_delivery_method.$error">
                                    <q-radio class="on-left"
                                             :key="index"
                                             :disable="deliveryMethodEnabler(method.value)"
                                             @input="resetAddress()"
                                             v-for="(method, index) in masterDataOptionsCreator($const.masterKey.SALE_DELIVERY_METHOD)"
                                             v-model="salesData.selected.shipping.sale_delivery_method"
                                             color="secondary"
                                             :val="method.value"
                                             :label="method.label"/>
                                </q-field>
                            </div>
                            <div class="col-auto">
                                <q-btn flat round icon="info">
                                    <q-tooltip>
                                        <div class="info"
                                             v-for="opt in masterDataOptionsCreator($const.masterKey.SHIPPING_METHOD_INFO)">
                                            {{ opt.label }}
                                        </div>
                                    </q-tooltip>
                                </q-btn>
                            </div>
                        </div>
                    </q-card-main>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </q-card>
            </div>
        </div>
        <div class="shared-shipping-content"
             v-show="salesData.selected.shipping.sale_delivery_method !== ''"
             v-if="getMasterDataIdByKeyAndTitle($const.masterKey.SALE_DELIVERY_METHOD, $const.masterData.DELIVERY) === salesData.selected.shipping.sale_delivery_method">
            <div class="row bg-grey-1 group justify-start">
                <div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 address-holder cursor-pointer"
                     :class="{'col-lg-4 no-pointer-events' : lockSalesOrder && !skipDownline}"
                     v-if="addresses.length > 0"
                     @click="checkSetSelectedAddressCondition(index1), applyRecipientAddress(index1)"
                     v-for="(address, index1) in addresses">
                    <q-card square flat class="fit custom-border"
                            :color="selectedAddress === index1 ? 'white text-black' : 'white text-black'">
                        <q-card-title>
                            <q-icon v-if="selectedAddress === index1" color="positive" slot="right"
                                    name="check_circle"/>
                            <div class="col-lg-12"
                                 v-if="(!lockSalesOrder || skipDownline)">
                                <div class="q-title">{{ address.title }}</div>
                            </div>
                            <div v-else="">
                                <div class="text-grey-5">
                                    <small class="q-title">Recipient</small>
                                </div>
                                <div class="text-green-7">{{ salesData.selected.shipping.recipient_name }}</div>
                                <div class="q-title">
                                    <small>{{ getCallCodeLabel()
                                        }}{{ salesData.selected.shipping.recipient_mobile_phone_number}}
                                    </small>
                                </div>
                            </div>
                        </q-card-title>
                        <q-card-main>
                            <div class="address-holder" v-if="address.fields.length > 0">
                                <div class="address-field light-paragraph text-grey-8"
                                     v-for="(field, index2) in sortDynamicFields(address.fields)"
                                     v-show="field.value !== ''"
                                     :key="field.label">
                  <span
                          v-if="field.type === 'select'"> {{ setSelectDataValue(field.value, field.key, field.type)}}</span>
                                    <span v-else>{{ removeLastComma(field.value) }}</span>
                                    <span v-if="index2 !== address.fields.length - 1">,</span>
                                    <span v-else="">.</span>
                                </div>
                            </div>
                            <div class="empty col-lg-12" v-else="">
                                <empty-list v-if="!address.title.includes('Custom')"></empty-list>
                                <div v-else="" class="row fit justify-center">
                                    <div class="text-grey-3 self-center">
                            <span class="q-display-3">
                                <q-icon name="add"></q-icon>
                            </span>
                                    </div>
                                </div>
                            </div>
                        </q-card-main>
                    </q-card>
                </div>
                <div class="col-lg-2 col-md-12 col-sm-12 col-xs-12 address-holder cursor-pointer"
                     v-if="addresses.length < 5 && addresses.length !== 1"
                     @click="setCustomAddress()">
                    <q-card square flat class="fit custom-border"
                            color="white text-black">
                        <q-card-main class="fit">
                            <div class="row fit justify-center">
                                <div class="text-grey-3 self-center">
                                    <q-field error-label="Please choose shipping from available list OR Create new"
                                             :error="validations.salesData.selected.shipping.recipient_addresses.$error">
                                        <span class="q-display-3">
                                            <q-icon name="add"></q-icon>
                                        </span>
                                    </q-field>
                                </div>
                            </div>
                        </q-card-main>
                    </q-card>
                </div>
            </div>
            <div class="row mt-10"
                 v-if="addresses.length > 0 && ((!lockSalesOrder || (salesData.is_rental_sale_order ===  1 && !(isSaleOrderStatusComplete || isSaleOrderStatusCancelled))) || (lockSalesOrder && skipDownline))">
                <div class="col-lg-5 col-md-12 col-sm-12 col-xs-12">
                    <q-card square flat class="full-height">
                        <q-card-title>
                            <p class="q-title">Recipient Details</p>
                        </q-card-title>
                        <q-card-main>
                            <div class="row gutter-xs">
                                <div class="col-12">
                                    <q-field label="Recipient Name"
                                             :label-width="3"
                                             helper="*"
                                             :error="validations.salesData.selected.shipping.recipient_name.$error">
                                        <q-input clearable
                                                 inverted-light
                                                 color="white"
                                                 class="no-shadow custom-input-border"
                                                 v-model="salesData.selected.shipping.recipient_name"
                                                 @input="validations.salesData.selected.shipping.recipient_name.$touch"
                                        />
                                    </q-field>
                                </div>
                                <div class="col-12 relative-position">
                                    <q-field label="Phone Number"
                                             :label-width="3"
                                             helper="*"
                                             :error="validations.salesData.selected.shipping.recipient_mobile_country_code_id.$error || validations.salesData.selected.shipping.recipient_mobile_phone_number.$error"
                                             error-label="Phone Number Required"
                                    >
                                        <div class="row gutter-xs">
                                            <div class="col-6">
                                                <q-select clearable
                                                          inverted-light
                                                          color="white"
                                                          class="no-shadow custom-input-border"
                                                          @input="validations.salesData.selected.shipping.recipient_mobile_country_code_id.$touch"
                                                          v-model="salesData.selected.shipping.recipient_mobile_country_code_id"
                                                          :options="callCodeOptionsByCountry"
                                                />
                                            </div>
                                            <div class="col-6">
                                                <q-input
                                                        clearable
                                                        inverted-light
                                                        color="white"
                                                        class="no-shadow custom-input-border"
                                                        @input="validations.salesData.selected.shipping.recipient_mobile_phone_number.$touch"
                                                        :disable="salesData.selected.shipping.recipient_mobile_country_code_id === ''"
                                                        v-model="salesData.selected.shipping.recipient_mobile_phone_number"/>
                                            </div>
                                        </div>
                                    </q-field>
                                    <q-loader :visible="isProcessingSection"></q-loader>
                                </div>
                            </div>
                        </q-card-main>
                    </q-card>
                </div>
                <div class="col-lg-7 col-md-12 col-sm-12 col-xs-12" v-if="selectedAddress === index1"
                     v-for="(address, index1) in addresses">
                    <q-card square flat class="full-height">
                        <q-card-title>
                            <p class="q-title">Recipient Shipping Address</p>
                            <q-btn-group outline slot="right">
                                <q-btn icon="close" @click="removeCustomAddress(index1)"
                                       color="negative"
                                       v-if="address.title.includes('Custom')">
                                    <q-tooltip>
                                        <small>Remove country</small>
                                    </q-tooltip>
                                </q-btn>
                                <q-btn icon="undo" @click="changeCountry(index1)"
                                       color="warning"
                                       v-if="address.title.includes('Custom')">
                                    <q-tooltip>
                                        <small>Change country</small>
                                    </q-tooltip>
                                </q-btn>
                            </q-btn-group>
                        </q-card-title>
                        <q-card-main>
                            <div class="row gutter-sm" :class="{'lock disabled': !address.title.includes('Custom')}">
                                <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" v-if="address.fields.length > 0"
                                     :class="{'no-pointer-events not-allowed': !address.title.includes('Custom') }">
                                    <div class="dynamic-field"
                                         v-for="(field, index2) in sortDynamicFields(address.fields)"
                                         :key="field.label">
                                        <q-field :labelWidth="3" class="capitalize q-mb-sm"
                                                 :helper="field.required ? '*' : ''"
                                                 :label="field.label"
                                                 :error="field.required && address.title.includes('Custom') ? $v.addresses.$each[index1].fields.$each[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$invalid : false"
                                                 :error-label="field.helper !== '' ? field.helper : 'Required Field'">
                                            <q-input v-if="field.type === 'input'"
                                                     clearable
                                                     inverted-light
                                                     color="white"
                                                     class="no-shadow custom-input-border"
                                                     :readonly="!address.title.includes('Custom')"
                                                     @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                                                     v-model.trim="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                                            />
                                            <q-select
                                                    :disable="field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2).length < 1 && field.type !== 'custom-select'"
                                                    clearable
                                                    inverted-light
                                                    color="white"
                                                    class="no-shadow custom-input-border"
                                                    filter
                                                    autofocus-filter
                                                    :filter-placeholder="'Filter ' + field.label"
                                                    :readonly="!address.title.includes('Custom')"
                                                    v-if="field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
                                                    @input="field.trigger === 'cities' ? setCities(addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value) : '', field.required ? addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch : false"
                                                    v-model="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                                                    :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                                            />
                                            <q-select v-if="field.type === 'masters-select'"
                                                      clearable
                                                      inverted-light
                                                      color="white"
                                                      class="no-shadow custom-input-border"
                                                      filter
                                                      :filter-placeholder="'Filter ' + field.label"
                                                      autofocus-filter
                                                      :disable="true"
                                                      :readonly="!address.title.includes('Custom')"
                                                      @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                                                      v-model="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                                                      :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="col-lg-12 relative-position" v-else="">
                                    <q-field class="animate-blink" label="Please choose country first"
                                             error-label="Please choose shipping country to key-in details"
                                             :error="validations.salesData.selected.shipping.recipient_addresses.$error">
                                        <q-select
                                                filter
                                                inverted-light
                                                color="white"
                                                class="no-shadow custom-input-border"
                                                clearable
                                                @input="setCountrySelectionOnSelectedAddress(), validations.salesData.selected.shipping.recipient_addresses.$touch"
                                                v-model="selectedCountry"
                                                :options="countriesOptions.options"
                                        />
                                    </q-field>
                                    <q-loader :visible="isProcessingSection"></q-loader>
                                </div>
                            </div>
                        </q-card-main>
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import {
    AddressMixin,
    GeneralsMixin,
    MasterDataTransformarMixin,
    TrashCollectorMixin
  } from 'src/application/global/mixins/index'
  import {Dialog} from 'quasar'
  import {mapGetters, mapActions, mapMutations, mapState} from 'vuex'

  export default {
    name: 'sales-shipping-tab',
    mixins: [MasterDataTransformarMixin, AddressMixin, TrashCollectorMixin, GeneralsMixin],
    components: {
      EmptyList,
      qLoader
    },
    props: {
      salesData: {
        type: Object,
        required: true
      },
      addToCart: {
        type: Function,
        required: true
      },
      lockSalesOrder: {
        type: Boolean,
        required: true
      },
      validations: {
        type: Object,
        required: true
      },
      skipDownline: {
        default: false
      }
    },
    computed: {
      ...mapGetters([
        'callCodeOptionsByCountry'
      ]),
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        memberData: state => state.membersCMP.memberData.data,
        storeAddresses: state => state.salesCMP.salesAddresses,
        appSettings: state => state.globalCMP.appSettings
      }),
      isSaleOrderStatusCancelled() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.CANCELED))
      },
      isSaleOrderStatusPreOrder() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.PRE_ORDER))
      },
      isSaleOrderStatusComplete() {
        return (this.salesData.order_status_id && this.salesData.order_status_id === this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_ORDER_STATUS, this.$const.masterData.COMPLETED))
      }
    },
    created () {
      this.initAddressArea()
    },
    mounted() {
      this.master.keys = [
        this.$const.masterKey.SALE_TYPES,
        this.$const.masterKey.PWP_FREE_ITEMS_PROMO_TYPES,
        this.$const.masterKey.COUNTRY_CODE,
        this.$const.masterKey.SALE_DELIVERY_METHOD,
        this.$const.masterKey.SHIPPING_METHOD_INFO
      ]
      if ((!this.lockSalesOrder || this.skipDownline) && this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method && this.salesData.selected.shipping.recipient_selected_shipping_index !== '') {
        this.selectedAddress = this.salesData.selected.shipping.recipient_selected_shipping_index
        this.applyRecipientAddress(this.salesData.selected.shipping.recipient_selected_shipping_index)
      }
    },
    validations() {
      let def = {
        addresses: {}
      }
      if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method && this.addresses.length > 0 && (!this.lockSalesOrder || this.skipDownline)) {
        def.addresses = {
          $each: {
            fields: {
              $each: {
                value: {
                  check(val, elm) {
                    if (elm.required || elm.min) {
                      if (elm.value === '' || elm.value === null) {
                        return false
                      }
                      if (typeof elm.min !== 'undefined') {
                        if (val.length < elm.min) {
                          return false
                        }
                      }
                    }
                    return true
                  }
                }
              }
            }
          }
        }
      }
      return def
    },
    watch: {
      // Custom validator for this special case
      // update to parent with latest validation status
      $v: {
        handler(data) {
          this.$emit('checkAddressesValidationStatus', data.$invalid)
        },
        deep: true
      },
      memberData: {
        handler() {
          // Reset if member changed for skip downline
          this.addresses = []
          this.initAddressArea()
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'getSalesProductSearchAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
        setCartPwpValidationIds: 'SET_CART_PWP_VALIDATION_IDS',
        unsetCartPwpValidationIds: 'UNSET_CART_PWP_VALIDATION_IDS',
        setCartPwpItemTempList: 'SET_CART_PWP_ITEM_TEMP_LIST',
        unsetCartPwpItemList: 'UNSET_CART_PWP_ITEM_TEMP_LIST',
        setSalesAddresses: 'SET_SALES_ADDRESSES_DATA'
      }),
      initAddressArea() {
        let salesSelectedRecipientAddress = []
        if ((this.lockSalesOrder && !this.skipDownline) && this.salesData.selected.shipping.recipient_addresses.length > 0 && (this.salesData.is_rental_sale_order !== 1 || (this.isSaleOrderStatusComplete || this.isSaleOrderStatusCancelled))) {
          salesSelectedRecipientAddress = JSON.parse(this.salesData.selected.shipping.recipient_addresses)
        }
        if (salesSelectedRecipientAddress.length > 0 && salesSelectedRecipientAddress !== '' && salesSelectedRecipientAddress !== null && (this.lockSalesOrder && !this.skipDownline)) {
          this.addresses = salesSelectedRecipientAddress
        } else {
          if (this.addresses.length < 1 && this.memberData.address !== null && this.memberData.address !== '' && Object.keys(this.memberData.address).length > 0 && this.storeAddresses.length < 1) {
            this.addresses = JSON.parse(this.memberData.address.address_data)
          } else {
            if (this.storeAddresses.length > 0) {
              this.addresses = JSON.parse(JSON.stringify(this.storeAddresses))
            }
          }
        }
        if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method) {
          this.enableMixinInitCheck = true
        }
        if (this.salesData.selected.shipping.recipient_selected_shipping_index !== '') {
          this.selectedAddress = this.salesData.selected.shipping.recipient_selected_shipping_index
        }
        this.setDeliveryInfo()
      },
      // apply recipient address after
      applyRecipientAddress(index) {
        if (!this.lockSalesOrder || this.skipDownline) {
          if (this.addresses.length > 0 && index >= 0 && index !== '') {
            this.salesData.selected.shipping.recipient_selected_shipping_index = index
            this.salesData.selected.shipping.recipient_addresses = []
            this.salesData.selected.shipping.recipient_addresses.push(this.addresses[index])
          }
        }
      },
      // validate selectable addresses
      checkSetSelectedAddressCondition(index) {
        if (!this.lockSalesOrder || this.skipDownline || !(this.isSaleOrderStatusCancelled || this.isSaleOrderStatusComplete)) {
          if ((typeof this.addresses[index].fields !== 'undefined' && this.addresses[index].fields.length > 0) || index > 3) {
            this.setSelectedAddress(index)
          }
        }
      },
      setCustomAddress() {
        let addNewCustomAddress = {
          'title': 'Custom',
          'fields': []
        }
        this.addresses.push(addNewCustomAddress)
        this.selectedAddress = this.addresses.length - 1
        this.applyRecipientAddress(this.addresses.length - 1)
      },
      changeCountry(index) {
        Dialog.create({
          title: 'Warning',
          message: 'Your are about to loose existing data',
          noEscDismiss: true,
          noBackdropDismiss: true,
          position: 'top',
          ok: 'Ok',
          cancel: 'Cancel',
        }).then(() => {
          let trashUID = this.pushTrashData('shipping-address', this.addresses[index].fields)
          this.setCountrySelectionOnSelectedAddress()
          this.selectedCountry = ''
          this.addresses[index].fields = []
          this.$q.notify({
            message: 'The item has been moved to the Bin',
            icon: 'warning',
            timeout: this.appSettings.notifications.timeout,
            position: 'bottom-left',
            color: 'tertiary',
            actions: [
              {
                label: 'Undo',
                handler: () => {
                  let trashData = this.getTrashDataById(trashUID)
                  this.addresses[index].fields = JSON.parse(JSON.stringify(trashData))
                  let stateId = this.addresses[index].fields.filter(x => x.key === 'states')
                  this.setStates(stateId[0].value)
                  this.$q.notify({
                    message: 'Your action has been undo',
                    icon: 'warning',
                    color: 'black',
                    timeout: this.appSettings.notifications.timeout,
                    position: 'bottom-left',
                  })
                }
              }
            ]
          })
        })
      },
      // Init mixin preload city and states when needed
      initAddressMixin() {
        let status = this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method
        this.initMixin(status)
      },
      removeCustomAddress(index) {
        this.addresses.splice(index, 1)
      },
      deliveryMethodEnabler(value) {
        if (this.salesData.is_rental_sale_order === 1) {
          if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.SELF_PICK_UP) === value) {
            // always disable self pickup cos that is invalid for rental sales
            return true
          } else if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.WITHOUT_SHIPPING) === value) {
            // if there's a sponsor member, only enable this
            if (this.skipDownline) {
              if (this.lockSalesOrder && (this.isSaleOrderStatusCancelled || this.isSaleOrderStatusComplete)) {
                return true
              }
            } else {
              return true
            }
          } else if ((this.lockSalesOrder && (this.isSaleOrderStatusCancelled || this.isSaleOrderStatusComplete)) || this.skipDownline) {
            return true
          }
        } else {
          if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.WITHOUT_SHIPPING) === value) {
            if (this.lockSalesOrder && this.skipDownline) {
              return true
            }
            if (!this.lockSalesOrder && !this.skipDownline) {
              return true
            }
            if (this.lockSalesOrder && !this.skipDownline) {
              return true
            }
          } else {
            if (this.lockSalesOrder && !this.skipDownline) {
              if (this.salesData.sponsor_member_id === this.salesData.downline_member_id) {
                return true
              } else {
                if (this.salesData.sponsor_member_id === '') {
                  return false
                } else {
                  return true
                }
              }
            }
            if (!this.lockSalesOrder && this.skipDownline) {
              return true
            }
            if (this.salesData.sponsor_member_id === this.salesData.downline_member_id) {
              return true
            }
          }
        }
      },
      setDeliveryInfo() {
        if (this.memberData.information !== null && this.memberData.information !== '' && (!this.lockSalesOrder || this.skipDownline) && this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method) {
          this.initMixin(true)
          if (this.salesData.selected.shipping.recipient_name === '') {
            this.salesData.selected.shipping.recipient_name = this.memberData.details.name
          }
          if (this.salesData.selected.shipping.recipient_mobile_country_code_id === '') {
            this.salesData.selected.shipping.recipient_mobile_country_code_id = this.memberData.contact_info.mobile_1_country_code_id
          }
          if (this.salesData.selected.shipping.recipient_mobile_phone_number === '') {
            this.salesData.selected.shipping.recipient_mobile_phone_number = this.memberData.contact_info.mobile_1_num
          }
        }
      },
      getCallCodeLabel() {
        let label = '--??--'
        let item = this.callCodeOptionsByCountry.find((x) => x.value === this.salesData.selected.shipping.recipient_mobile_country_code_id)
        if (item !== undefined) {
          label = item.label
        }
        return label
      },
      resetAddress() {
        if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) !== this.salesData.selected.shipping.sale_delivery_method) {
          this.salesData.selected.shipping.recipient_name = ''
          this.salesData.selected.shipping.recipient_mobile_country_code_id = ''
          this.salesData.selected.shipping.recipient_mobile_phone_number = ''
        } else {
          this.setDeliveryInfo()
        }
      }
    },
    beforeDestroy: function () {
      if ((!this.lockSalesOrder || this.skipDownline) && this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method && this.salesData.selected.shipping.recipient_selected_shipping_index !== '') {
        this.setSalesAddresses(this.addresses)
      }
    }
  }
</script>
