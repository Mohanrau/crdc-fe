<template>
  <div class="personal-info-tab">
    <div class="row gutter-md">
      <div class="row col-lg-6 col-xl-6 col-md-6 col-xs-12 gutter-sm" v-if="member_data.address !== null && member_data.address !== undefined">
        <div><p class="h6 text-blue">Permanent Address</p></div>
        <div class="col-12" v-if="selectedAddress === index1"
             v-for="(address, index1) in addresses">
          <div class="row">
            <div class="col-12 gutter-xs" v-if="address.fields.length > 0">
              <div class="dynamic-field" v-for="(field, index2) in sortDynamicFields(address.fields)"
                   :key="field.label">
                <q-field :labelWidth="3" class="capitalize" :helper="field.required ? '*' : ''"
                         :label="field.label"
                         :error="field.required ? $v.addresses.$each[index1].fields.$each[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$invalid : false"
                         :error-label="field.helper !== '' ? field.helper : 'Required Field'">
                  <q-input v-if="field.type === 'input'"
                           disable
                           @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                           v-model.trim="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                  />
                  <q-select
                    filter
                    autofocus-filter
                    :disable="field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2).length < 1 && field.type !== 'custom-select'"
                    disable
                    v-if="field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
                    @input="field.trigger === 'cities' ? setCities(addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value) : '', field.required ? addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch : false"
                    v-model="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                    :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                  />
                  <q-select v-if="field.type === 'masters-select'"
                            filter
                            autofocus-filter
                            disable
                            @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                            v-model="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                            :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                  />
                </q-field>
              </div>
            </div>
            <div class="col-lg-12 relative-position" v-else="">
              <q-field label="Please choose countries first">
                <q-select
                  filter
                  disable
                  @input="setCountrySelectionOnSelectedAddress()"
                  v-model="selectedCountry"
                  :options="countriesOptions.options"
                />
              </q-field>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-xl-6 col-md-6 col-xs-12 gutter-sm" v-if="member_data.contact_info !== null && member_data.contact_info !== undefined">
        <div><p class="h6 text-blue">Contact Info</p></div>
        <q-field
          label="Mobile Number (1)"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select disable
                        v-model="member_data.contact_info.mobile_1_country_code_id"
                        :options="masterDataOptionsCreator('country_code')"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input disable v-model="member_data.contact_info.mobile_1_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          label="Mobile Number (2)"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select disable
                        v-model="member_data.contact_info.mobile_2_country_code_id"
                        :options="masterDataOptionsCreator('country_code')"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input disable v-model="member_data.contact_info.mobile_2_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          label="Tel Office (1)"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select disable
                        v-model="member_data.contact_info.tel_office_1_country_code_id"
                        :options="masterDataOptionsCreator('country_code')"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input disable v-model="member_data.contact_info.tel_office_1_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          label="Tel Office (2)"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select disable
                        v-model="member_data.contact_info.tel_office_2_country_code_id"
                        :options="masterDataOptionsCreator('country_code')"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input disable v-model="member_data.contact_info.tel_office_2_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          label="Tel Home (1)"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select disable
                        v-model="member_data.contact_info.tel_home_1_country_code_id"
                        :options="masterDataOptionsCreator('country_code')"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input disable v-model="member_data.contact_info.tel_home_1_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          label="Fax Number"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select disable
                        v-model="member_data.contact_info.fax_country_code_id"
                        :options="masterDataOptionsCreator('country_code')"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input disable v-model="member_data.contact_info.fax_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          label="Email Address (1)"
        >
          <q-input
            disable
            v-model="member_data.contact_info.email"
          />
        </q-field>
      </div>
    </div>
  </div>
</template>

<script>
  import { AddressMixin, MasterDataTransformarMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'personal-information',
    mixins: [AddressMixin, MasterDataTransformarMixin],
    props: {
      member_data: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        languageOptions: state => state.globalCMP.languagesOptions.data
      }),
      ...mapGetters([
        'callCodeOptionsByCountry'
      ])
    },
    created () {
      // to-do change all the master data phone prefix to country call code later
      if (this.member_data.address !== null && this.member_data.address !== undefined) {
        this.addresses = JSON.parse(this.member_data.address.address_data)
        this.selectedAddress = 0
        this.setCountrySelectionOnSelectedAddress()
        this.getCountriesAction()
      }
    },
    mounted () {
      this.master.keys = [
        this.$const.masterKey.STOCKIST_PRICE_CODE,
        this.$const.masterKey.STOCKIST_STATUS,
        this.$const.masterKey.STOCKIST_TYPE,
        'country_code',
        'bank_account_type'
      ]
    },
    validations: {
      addresses: {
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
        'getLanguagesAction',
        'getCountriesAction'
      ])
    }
  }
</script>

<style scoped>

</style>
