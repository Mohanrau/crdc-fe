<template>
  <div class="sales-shipping-tab">
    <div class="row">
      <div class="col-lg-12">
        <q-card square flat class="relative-position">
          <q-card-main>
            <div class="row items-center gutter-sm">
              <div class="col-lg-auto">
                <q-field :error-label="$t('Common.address.errorLabel.selectShippingType')"
                         :error="validations.salesData.selected.shipping.sale_delivery_method.$error">
                  <q-option-group
                    :disable="lockProductExchange"
                    color="secondary"
                    type="radio"
                    v-model="salesData.selected.shipping.sale_delivery_method"
                    inline
                    @input="initAddressMixin(), validations.salesData.selected.shipping.sale_delivery_method.$touch"
                    :options="masterDataOptionsCreator(this.$const.masterKey.SALE_DELIVERY_METHOD)"
                  />
                </q-field>
              </div>
              <div class="col-lg-auto">
                <q-btn flat round icon="info">
                  <q-tooltip>
                    <div class="info" v-for="opt in masterDataOptionsCreator(this.$const.masterKey.SHIPPING_METHOD_INFO)">
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
    <div class="sales-shipping-content"
         v-show="salesData.selected.shipping.sale_delivery_method !== ''"
         v-if="getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === salesData.selected.shipping.sale_delivery_method">
      <div class="row bg-grey-1 group justify-start">
        <div class="col-lg-2 address-holder cursor-pointer"
             :class="{'col-lg-3 no-pointer-events' : lockProductExchange}"
             v-if="addresses.length > 0"
             @click="checkSetSelectedAddressCondition(index1), applyRecipientAddress(index1)"
             v-for="(address, index1) in addresses">
          <q-card square :flat="selectedAddress === index1" class="fit"
                  :color="selectedAddress === index1 ? 'white text-black' : 'white text-black'">
            <q-card-title>
              <q-icon v-if="selectedAddress === index1" color="positive" slot="right"
                      name="check_circle"/>
              <div class="col-lg-12" v-if="!lockProductExchange">
                <div class="q-title">{{ address.title }}</div>
              </div>
              <div v-else="">
                <div class="text-grey-5"><small>{{$t('Common.address.label.recipient')}}</small></div>
                <div class="text-green-7">{{ salesData.selected.shipping.recipient_name }}</div>
                <div class="q-title"><small>{{ salesData.selected.shipping.recipient_mobile_phone_number}}</small></div>
              </div>
            </q-card-title>
            <q-card-main>
              <div class="address-holder" v-if="address.fields.length > 0">
                <div class="address-field light-paragraph"
                     v-for="(field, index2) in sortDynamicFields(address.fields)"
                     v-show="field.value !== ''"
                     :key="field.label">
                  <span v-if="field.type === 'select'"> {{ setSelectDataValue(field.value, field.key, field.type)}}</span>
                  <span v-else>{{ removeLastComma(field.value) }}</span>
                  <span v-if="index2 !== address.fields.length - 1">,</span>
                  <span v-else="">.</span>
                </div>
              </div>
              <div class="empty col-lg-12" v-else="">
                <empty-list></empty-list>
              </div>
            </q-card-main>
          </q-card>
        </div>
        <div class="col-lg-2 address-holder cursor-pointer"
             v-if="addresses.length < 5 && addresses.length !== 1"
             @click="setCustomAddress()">
          <q-card square class="fit"
                  color="white text-black">
            <q-card-main class="fit">
              <div class="row fit justify-center">
                <div class="text-grey-3 self-center">
                  <q-field :error-label="$t('Common.address.errorLabel.selectShippingInfo')"
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
      <div class="row mt-10" v-if="addresses.length > 0 && !lockProductExchange">
        <div class="col-lg-5">
          <q-card square flat class="full-height">
            <q-card-title>
              <p class="q-title">$t('Common.address.label.recipientDetail')</p>
            </q-card-title>
            <q-card-main>
              <div class="row gutter-sm">
                <div class="col-12">
                  <q-field :label="$t('Common.address.label.recipientName')"
                           :error="validations.salesData.selected.shipping.recipient_name.$error">
                    <q-input :disable="lockProductExchange" clearable
                             v-model="salesData.selected.shipping.recipient_name"
                             @input="validations.salesData.selected.shipping.recipient_name.$touch"
                    />
                  </q-field>
                </div>
                <div class="col-12 relative-position">
                  <q-field :label="$t('Common.address.label.phoneNumber')"
                           :error="validations.salesData.selected.shipping.recipient_mobile_country_code_id.$error || validations.salesData.selected.shipping.recipient_mobile_phone_number.$error"
                           :error-label="$t('Common.address.errorLabel.insertPhoneNumber')"
                  >
                    <div class="row gutter-xs">
                      <div class="col-6">
                        <q-select clearable
                                  :disable="lockProductExchange"
                                  @input="validations.salesData.selected.shipping.recipient_mobile_country_code_id.$touch"
                                  v-model="salesData.selected.shipping.recipient_mobile_country_code_id"
                                  :options="masterDataOptionsCreator('country_code')"
                        />
                      </div>
                      <div class="col-6">
                        <q-input
                          clearable
                          @input="validations.salesData.selected.shipping.recipient_mobile_phone_number.$touch"
                          :disable="salesData.selected.shipping.recipient_mobile_country_code_id === '' || lockProductExchange"
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
        <div class="col-lg-7" v-if="selectedAddress === index1"
             v-for="(address, index1) in addresses">
          <q-card square flat class="full-height">
            <q-card-title v-if="address.fields.length > 0">
              <p class="q-title">{{$t('Common.address.label.recipientShippingAddress')}}</p>
              <q-btn-group outline slot="right">
                <q-btn icon="close" @click="removeCustomAddress(index1)"
                       color="negative"
                       v-if="address.title.includes('Custom')">
                  <q-tooltip>
                    <small>{{$t('Common.address.tooltip.removeCountry')}}</small>
                  </q-tooltip>
                </q-btn>
                <q-btn icon="undo" @click="changeCountry(index1)"
                       color="warning"
                       v-if="address.title.includes('Custom')">
                  <q-tooltip>
                    <small>{{$t('Common.address.tooltip.changeCountry')}}</small>
                  </q-tooltip>
                </q-btn>
              </q-btn-group>
            </q-card-title>
            <q-card-main>
              <div class="row margin">
                <div class="col-lg-12 pd-10" v-if="address.fields.length > 0"
                     :class="{'bg-grey-1 no-pointer-events not-allowed': !address.title.includes('Custom') }">
                  <div class="locked" v-if="!address.title.includes('Custom')">
                    <div class="row items-baseline justify-end text-grey-5">
                      <div class="col-auto">
                        <q-icon name="lock"></q-icon>
                      </div>
                      <div class="col-auto">
                        <small>{{$t('Common.address.label.sectionLocked')}}</small>
                      </div>
                    </div>
                  </div>
                  <div class="dynamic-field"
                       v-for="(field, index2) in sortDynamicFields(address.fields)"
                       :key="field.label">
                    <q-field :labelWidth="3" class="capitalize" :helper="field.required ? '*' : ''"
                             :label="field.label"
                             :error="field.required && address.title.includes('Custom') ? $v.addresses.$each[index1].fields.$each[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$invalid : false"
                             :error-label="field.helper !== '' ? field.helper : $t('Common.address.errorLabel.requiredField')">
                      <q-input v-if="field.type === 'input'"
                               clearable
                               :readonly="!address.title.includes('Custom')"
                               @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                               v-model.trim="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                      />
                      <q-select
                        :disable="field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2).length < 1 && field.type !== 'custom-select'"
                        clearable
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
                  <q-field class="animate-blink"
                           :label="$t('Common.address.label.selectCountry')"
                           :error-label="$t('Common.address.errorLabel.selectCountry')"
                           :error="validations.salesData.selected.shipping.recipient_addresses.$error">
                    <q-select
                      filter
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
    TrashCollectorMixin,
    MasterDataTransformarMixin,
    GeneralsMixin
  } from 'src/application/global/mixins/index'
  import { Dialog } from 'quasar'
  import { mapState, mapActions, mapMutations } from 'vuex'

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
      lockProductExchange: {
        type: Boolean,
        required: true
      },
      validations: {
        type: Object,
        required: true
      },
      memberData: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        masterData: state => state.globalCMP.masterData.data.list,
        storeAddresses: state => state.salesCMP.salesAddresses,
        appSettings: state => state.globalCMP.appSettings
      })
    },
    data: () => ({
      methodID: 0
    }),
    created () {
      console.log(this.memberData)
      let salesSelectedRecipientAddress = []
      if (this.lockProductExchange && this.salesData.selected.shipping.recipient_addresses.length > 0) {
        salesSelectedRecipientAddress = JSON.parse(this.salesData.selected.shipping.recipient_addresses)
      }
      if (salesSelectedRecipientAddress.length > 0 && salesSelectedRecipientAddress !== '' && salesSelectedRecipientAddress !== null && this.lockProductExchange) {
        this.addresses = salesSelectedRecipientAddress
      } else {
        if (this.addresses.length < 1
          && this.memberData !== null
          && this.memberData !== undefined
          && this.memberData.address !== null
          && this.memberData.address !== undefined
          && this.memberData.address !== ''
          && Object.keys(this.memberData.address).length > 0
          && this.storeAddresses.length < 1) {
          if (typeof this.memberData.address.address_data !== 'object') {
            this.addresses = JSON.parse(this.memberData.address.address_data)
          } else {
            this.addresses = this.memberData.address.address_data
          }
        } else {
          if (this.storeAddresses.length > 0) {
            this.addresses = JSON.parse(JSON.stringify(this.storeAddresses))
          }
        }
      }
      if (this.memberData.information !== null && this.memberData.information !== '' && !this.lockProductExchange) {
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
      if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method) {
        this.enableMixinInitCheck = true
      }
      if (this.salesData.selected.shipping.recipient_selected_shipping_index !== '') {
        this.selectedAddress = this.salesData.selected.shipping.recipient_selected_shipping_index
      }
    },
    mounted () {
      this.master.keys = [
        this.$const.masterKey.SALE_TYPES,
        this.$const.masterKey.PWP_FREE_ITEMS_PROMO_TYPES,
        this.$const.masterKey.COUNTRY_CODE,
        this.$const.masterKey.SALE_DELIVERY_METHOD,
        this.$const.masterKey.SHIPPING_METHOD_INFO
      ]
      if (!this.lockProductExchange && this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method && this.salesData.selected.shipping.recipient_selected_shipping_index !== '') {
        this.selectedAddress = this.salesData.selected.shipping.recipient_selected_shipping_index
        this.applyRecipientAddress(this.salesData.selected.shipping.recipient_selected_shipping_index)
      }
    },
    validations () {
      let def = {
        addresses: {}
      }
      if (this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method && this.addresses.length > 0 && !this.lockProductExchange) {
        def.addresses = {
          $each: {
            fields: {
              $each: {
                value: {
                  check (val, elm) {
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
        handler (data) {
          this.$emit('checkAddressesValidationStatus', data.$invalid)
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
      // apply recipient address after
      applyRecipientAddress (index) {
        if (!this.lockProductExchange) {
          if (this.addresses.length > 0 && index >= 0 && index !== '') {
            this.salesData.selected.shipping.recipient_selected_shipping_index = index
            this.salesData.selected.shipping.recipient_addresses = []
            this.salesData.selected.shipping.recipient_addresses.push(this.addresses[index])
          }
        }
      },
      // validate selectable addresses
      checkSetSelectedAddressCondition (index) {
        if (!this.lockProductExchange) {
          if ((typeof this.addresses[index].fields !== 'undefined' && this.addresses[index].fields.length > 0) || index > 3) {
            this.setSelectedAddress(index)
          }
        }
      },
      setCustomAddress () {
        let addNewCustomAddress = {
          'title': 'Custom',
          'fields': []
        }
        this.addresses.push(addNewCustomAddress)
        this.selectedAddress = this.addresses.length - 1
        this.applyRecipientAddress(this.addresses.length - 1)
      },
      changeCountry (index) {
        Dialog.create({
          title: $t('Common.address.dialogTitle.warning'),
          message: $t('Common.address.dialogMessage.dataLostWarning'),
          noEscDismiss: true,
          noBackdropDismiss: true,
          position: 'top',
          ok: $t('Common.address.dialogButton.ok'),
          cancel: $t('Common.address.dialogButton.cancel'),
        }).then(() => {
          let trashUID = this.pushTrashData('shipping-address', this.addresses[index].fields)
          this.setCountrySelectionOnSelectedAddress()
          this.selectedCountry = ''
          this.addresses[index].fields = []
          this.$q.notify({
            message: $t('Common.address.notification.undo.itemMovedToBin'),
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
                    message: $t('Common.address.notification.undo.actionUndone'),
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
      initAddressMixin () {
        let status = this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method
        this.initMixin(status)
      },
      removeCustomAddress (index) {
        this.addresses.splice(index, 1)
      }
    },
    beforeDestroy: function () {
      if (!this.lockProductExchange && this.getMasterDataIdByKeyAndTitle(this.$const.masterKey.SALE_DELIVERY_METHOD, this.$const.masterData.DELIVERY) === this.salesData.selected.shipping.sale_delivery_method && this.salesData.selected.shipping.recipient_selected_shipping_index !== '') {
        this.setSalesAddresses(this.addresses)
      }
    }
  }
</script>
