<template>
  <div class="business-address-tab">
    <div class="row gutter-md">
      <div class="col col-lg-6 col-xl-6 col-md-6 col-xs-12 gutter-sm">
        <q-field
          :helper="'*'"
          :label="$t('stockist.registration.label.contactPerson')"
          :error="validation.stockistRegistrationData.business_address.contact_person.$error || setError('stockist_data.business_address.contact_person', 'type.exp')"
          :error-label="setError('stockist_data.business_address.contact_person', 'type.exp') ? setError('stockist_data.business_address.contact_person', 'type.msg') : $t('stockist.registration.errorMessage.contactPerson')"
        >
          <q-input
            clearable
            v-model="business_address.contact_person"
          />
        </q-field>
        <q-field
          :helper="'*'"
          :label="$t('stockist.registration.label.mobileNumber1')"
          :error="validation.stockistRegistrationData.business_address.mobile_1_country_code_id.$error || validation.stockistRegistrationData.business_address.mobile_1_num.$error"
          error-label="Please enter mobile prefix and number"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select clearable
                        v-model="business_address.mobile_1_country_code_id"
                        :options="callCodeOptionsByCountry"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input type="number" v-model="business_address.mobile_1_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          :label="$t('stockist.registration.label.mobileNumber2')"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select clearable
                        v-model="business_address.mobile_2_country_code_id"
                        :options="callCodeOptionsByCountry"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input type="number" v-model="business_address.mobile_2_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          :label="$t('stockist.registration.label.officeNumber')"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select clearable
                        v-model="business_address.telephone_office_country_code_id"
                        :options="callCodeOptionsByCountry"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input type="number" v-model="business_address.telephone_office_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          :label="$t('stockist.registration.label.faxNumber')"
        >
          <div class="row gutter-xs">
            <div class="col-xl-4 col-lg-4 col-md-6 col-xs-6">
              <q-select clearable
                        v-model="business_address.fax_country_code_id"
                        :options="callCodeOptionsByCountry"
              />
            </div>
            <div class="col-xl-8 col-lg-8 col-md-6 col-xs-6">
              <q-input type="number" v-model="business_address.fax_num"/>
            </div>
          </div>
        </q-field>
        <q-field
          :helper="'*'"
          :label="$t('stockist.registration.label.email1')"
          :error="validation.stockistRegistrationData.business_address.email_1.$error || setError('stockist_data.business_address.email_1', 'type.exp')"
          :error-label="setError('stockist_data.business_address.email_1', 'type.exp') ? setError('stockist_data.business_address.email_1', 'type.msg') : $t('Common.Validator.Email', {master:$t('stockist.registration.label.email1')})"
        >
          <q-input
            clearable
            v-model="business_address.email_1"
          />
        </q-field>
        <q-field
          :label="$t('stockist.registration.label.email2')"
          :error="validation.stockistRegistrationData.business_address.email_2.$error"
          :error-label="$t('Common.Validator.Email', {master:$t('stockist.registration.label.email2')})"
        >
          <q-input
            clearable
            v-model="business_address.email_2"
          />
        </q-field>
      </div>
      <div class="row col-lg-6 col-xl-6 col-md-6 col-xs-12 gutter-sm">
        <div class="col-12" v-if="selectedAddress === index1"
             v-for="(address, index1) in addresses">
          <div class="row">
            <div class="col-12 gutter-xs" v-if="address.fields.length > 0">
              <div class="dynamic-field" v-for="(field, index2) in sortDynamicFields(address.fields)"
                   :key="field.label">
                <q-field :labelWidth="3" class="capitalize" :helper="field.required ? '*' : ''"
                         :label="field.label"
                         :error="field.required ? validation.stockistRegistrationData.business_address.addresses.$each[index1].fields.$each[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$invalid : false"
                         :error-label="field.helper !== '' ? field.helper : $t('stockist.registration.errorMessage.requiredField')">
                  <q-input v-if="field.type === 'input'"
                           clearable
                           @input="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch"
                           v-model.trim="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                  />
                  <q-select
                    filter
                    autofocus-filter
                    :disable="field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2).length < 1 && field.type !== 'custom-select'"
                    clearable
                    v-if="field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
                    @input="field.trigger === 'cities' ? setCities(addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value) : '', field.required ? addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value.$touch : false"
                    v-model="addresses[index1].fields[setDynamicFieldIndex(addresses[index1].fields, field.index)].value"
                    :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                  />
                  <q-select v-if="field.type === 'masters-select'"
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
            <div class="col-lg-12 relative-position" v-else="">
              <q-field :label="$t('Common.address.label.selectCountry')">
                <q-select
                  filter
                  clearable
                  @input="setCountrySelectionOnSelectedAddress()"
                  v-model="selectedCountry"
                  :options="countriesOptions.options"
                />
              </q-field>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { AddressMixin, MasterDataTransformarMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'business-registered-address',
    mixins: [AddressMixin, MasterDataTransformarMixin],
    props: {
      business_address: {
        type: Object,
        required: true
      },
      validation: {
        type: Object,
        required: true
      },
      selectedFilters: {
        type: Object,
        required: true
      },
      setError: {
        type: Function,
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
      this.addresses = this.business_address.addresses
      this.selectedCountry = this.selectedFilters.countryID
      this.selectedAddress = 0
      this.setCountrySelectionOnSelectedAddress()
      this.getCountriesAction()
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
