<template>
    <div class="address-tab">
        <div class="row gutter-sm">
            <div class="col-lg-3 col-md-12 col-xs-12 address-holder cursor-pointer" @click="setSelectedAddress(index1)"
                 v-for="(address, index1) in addresses">
                <q-card square flat class="fit custom-border"
                        :color="$v.addresses.$each[index1].fields.$invalid ? 'negative text-white' : selectedAddress === index1 ? 'grey-1 text-black' : ''">
                    <q-card-title>
                        <div>{{ address.title }}</div>
                        <q-icon v-if="selectedAddress === index1" color="positive" slot="right" name="check_circle"/>
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
                        <div class="address-empty full-height full-width text-center" v-else="">
                            <div class="text-grey-3">
                                <div class="q-display-3">
                                    <q-icon name="add"></q-icon>
                                </div>
                            </div>
                        </div>
                    </q-card-main>
                </q-card>
            </div>
        </div>
        <div class="row mt-20">
            <div class="col-12" v-if="selectedAddress === index1"
                 v-for="(address, index1) in addresses">
                <q-card square flat class="fit custom-border">
                    <q-card-title>
                        <div>{{ address.title }}</div>
                    </q-card-title>
                    <q-card-main>
                        <p class="animated flash text-negative" v-if="$v.addresses.$each[index1].fields.$invalid">
                                {{ $t('Common.AddressValidationError.Info.1') }} <q-btn icon="delete"
                                                                               outline
                                                                               dense
                                                                               color="negative"
                                                                               @click="changeCountry(index1)"
                                                                               v-if="address.fields.length > 0">
                        </q-btn> {{ $t('Common.AddressValidationError.Info.2', {title: address.title}) }}
                            </p>
                        <div class="row gutter-sm">
                            <div class="col-lg-8" v-if="address.fields.length > 0">
                                <div class="row actions justify-end q-ma-sm">
                                    <div class="col-auto">
                                        <q-btn-group>
                                            <q-btn color="primary"
                                                   outline
                                                   :label="$t('Common.Copy.Button')"
                                                   icon="content_copy"
                                                   ref="target">
                                                <q-popover ref="popover">
                                                    <q-list separator link>
                                                        <q-item @click.native="setAddressFields(index1, index3)"
                                                                v-if="index3 !== index1"
                                                                v-for="(address, index3) in addresses"
                                                                :key="index3">
                                                            Copy to {{ address.title }}
                                                        </q-item>
                                                    </q-list>
                                                </q-popover>
                                            </q-btn>
                                            <q-btn icon="delete"
                                                   outline
                                                   color="negative"
                                                   @click="changeCountry(index1)"
                                                   v-if="address.fields.length > 0">
                                            </q-btn>
                                        </q-btn-group>
                                    </div>
                                </div>
                                <div class="dynamic-field q-ma-sm"
                                     v-for="(field, index2) in sortDynamicFields(address.fields)"
                                     :key="field.label">
                                    <q-field :labelWidth="3" class="capitalize" :helper="field.required ? '*' : ''"
                                             :label="field.label"
                                             :error="field.required ? $v.addresses.$each[index1].fields.$each[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$invalid : false"
                                             :error-label="field.helper !== '' ? field.helper : 'Required Field'">
                                        <q-input v-if="field.type === 'input'"
                                                 inverted-light
                                                 color="white text-grey-6"
                                                 class="no-shadow custom-input-border"
                                                 clearable
                                                 @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                                                 v-model.trim="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                                        />
                                        <q-select
                                                inverted-light
                                                color="white text-grey-6"
                                                class="no-shadow custom-input-border"
                                                filter
                                                autofocus-filter
                                                :disable="field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2).length < 1 && field.type !== 'custom-select'"
                                                clearable
                                                v-if="field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
                                                @input="field.trigger === 'cities' ? setCities(addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value, index1, index2) : '', field.required ? addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch : false"
                                                v-model="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                                                :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                                        />
                                        <q-select v-if="field.type === 'masters-select'"
                                                  inverted-light
                                                  color="white text-grey-6"
                                                  class="no-shadow custom-input-border"
                                                  filter
                                                  autofocus-filter
                                                  clearable
                                                  @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                                                  v-model="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                                                  :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                                        />
                                    </q-field>
                                </div>
                            </div>
                            <div class="col-lg-6 relative-position" v-else="">
                                <q-field label="Please choose countries first">
                                    <q-select
                                            filter
                                            clearable
                                            inverted-light
                                            color="white text-grey-6"
                                            class="no-shadow custom-input-border"
                                            @input="setCountrySelectionOnSelectedAddress()"
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
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import trans from 'src/application/global/components/common/transition/transition'
  import {AddressMixin, TrashCollectorMixin} from 'src/application/global/mixins/index'
  import {Dialog, Notify} from 'quasar'
  import {mapState, mapActions} from 'vuex'

  export default {
    name: 'address-tab',
    mixins: [AddressMixin, TrashCollectorMixin],
    components: {
      qLoader,
      trans
    },
    props: {
      memberData: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        languageOptions: state => state.globalCMP.languagesOptions.data,
        appSettings: state => state.globalCMP.appSettings
      })
    },
    created() {
      this.addresses = this.memberData.address.address_data
      this.getLanguagesAction()
    },
    validations: {
      addresses: {
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
    },
    watch: {
      // Custom validator for this special case
      // update to parent with latest validation status
      $v: {
        handler(data) {
          this.$emit('checkAddressesValidationStatus', data.$invalid)
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'getLanguagesAction'
      ]),
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
          let trashUID = this.pushTrashData('member-address', this.addresses[index].fields)
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
    }
  }
</script>
<style lang="stylus">
    .address-field
        margin 0 0 0 0 !important
</style>