<template>
  <div class="row sm-gutter">
    <div
      class="col-lg-8 col-md-12 col-xs-12"
      v-if="banks.bank_detail.banking.payment_data.bank_data.length > 0
            && banks.bank_detail.banking.payment_data.bank_data[0].fields.length > 0">
      <div class="row gutter-xs">
        <div class="dynamic-field"
             :class="{'col-6': typeof field.share !== 'undefined' && field.share.pos !=='C', 'col-12': typeof field.share === 'undefined', 'col-3': typeof field.share !== 'undefined' && field.share.pos ==='C'}"
             v-for="(field, index2) in sortDynamicFields(banks.bank_detail.banking.payment_data.bank_data[0].fields)"
             :key="field.label">
          <q-field :labelWidth="field.share ? 6 : 3" class="capitalize"
                   :helper="field.required ? '*' : ''"
                   :disable="isViewOnly"
                   :label="typeof field.share !== 'undefined' && field.share.pos ==='C' ? '' : field.label"
                   :error="field.required ? validation.stockistRegistrationData !== undefined && validation.stockistRegistrationData !== null ? validation.stockistRegistrationData.banks.bank_detail.banking.payment_data.bank_data.$each[0].fields.$each[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value.$error: false : false"
                   error-label="Required field missing">
            <q-input v-if="field.type === 'input'"
                     :disable="isViewOnly"
                     clearable
                     :type="field.input_type ? field.input_type : 'text'"
                     :readonly="field.readonly ? field.readonly : false"
                     @change="field.readonly ?  setInheritFieldValue(0, field.inherit_index, field.inherit_column) : '', banks.bank_detail.banking.payment_data.bank_data[0].fields[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value.$touch"
                     v-model.trim="typeof field.autofill !== 'undefined' && banks.bank_detail.banking.payment_data.bank_data[0].fields[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value === ''  ? getAutoFill(field.autofill, 0, field.index) : banks.bank_detail.banking.payment_data.bank_data[0].fields[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value"
            />
            <q-select
              :disable="isViewOnly || (field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, 0, index2).length < 1 && field.type !== 'custom-select')"
              clearable
              filter
              v-if="field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
              :float-label="field.placeholder ? field.placeholder : ''"
              @change="field.trigger ? triggerInherit(0, field.trigger, field.key, field.value) : '', field.required ? banks.bank_detail.banking.payment_data.bank_data[0].fields[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value.$touch : false"
              v-model="banks.bank_detail.banking.payment_data.bank_data[0].fields[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value"
              :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, 0, index2)"
            />
            <q-select v-if="field.type === 'masters-select'"
                      clearable
                      filter
                      :disable="isViewOnly"
                      @change="field.trigger ? triggerInherit(0, field.trigger) : '', banks.bank_detail.banking.payment_data.bank_data[0].fields[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value.$touch"
                      v-model="banks.bank_detail.banking.payment_data.bank_data[0].fields[setDynamicFieldIndex(banks.bank_detail.banking.payment_data.bank_data[0].fields, field.index)].value"
                      :options="field.options ? field.options : masterDataOptionsCreator(field.identifier)"
            />
          </q-field>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import trans from 'src/application/global/components/common/transition/transition'
  import EmptyList from 'src/application/global/components/common/empty/emptyList.vue'
  import { mapState, mapActions } from 'vuex'
  import _ from 'lodash'

  export default {
    name: 'bank-info',
    mixins: [masterDataTransformarMixin],
    components: {
      qLoader,
      trans,
      EmptyList
    },
    props: {
      banks: {
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
      isViewOnly: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      selectedAddress: '',
      selectedCountry: '',
      selectedCountryByIndex: []
    }),
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        masterOptions: state => state.globalCMP.masterData.data.list,
        dynamicContentData: state => state.globalCMP.dynamicContentData.data,
        statesOptions: state => state.globalCMP.statesOptions.data,
        citiesOptions: state => state.globalCMP.citiesOptions.data,
        banksOptions: state => state.globalCMP.banksOptions.data
      })
    },
    mounted () {
      this.master.keys = [
        this.$const.masterKey.STOCKIST_PRICE_CODE,
        this.$const.masterKey.STOCKIST_STATUS,
        this.$const.masterKey.STOCKIST_TYPE,
        'country_code',
        'bank_account_type'
      ]
      this.initSetupArea()
    },
    methods: {
      ...mapActions([
        'getDynamicContentAction',
        'getStateAction',
        'getCitiesAction',
        'getCountriesBankAction'
      ]),
      initSetupArea () {
        let query = {
          country_id: this.selectedFilters.countryID,
          relations: ['banks']
        }
        this.getCountriesBankAction(query)
        this.setPayoutTypesFields()
      },
      sortDynamicFields (fields) {
        return _.orderBy(fields, 'order', 'asc')
      },
      // Return back current index after sorting based on order to make sure inline with original array
      setDynamicFieldIndex (fields, index) {
        return fields.findIndex(x => x.index === index)
      },
      setDynamicFieldKeyOptionsData (key, identifier, index1, index2) {
        let name = key + 'Options'
        if (typeof this[name] !== 'undefined') {
          return this[name].options
        } else {
          return []
        }
      },
      setInheritFieldValue (index, triggerIndex, key, value) {
        let data = []
        let field = this.banks.bank_detail.banking.payment_data.bank_data[index].fields.find(x => x.index === triggerIndex)
        if (Object.keys(field).length > 0) {
          data = this.setDynamicFieldKeyOptionsData(key).filter(x => x.value === value)
        }
        if (data.length > 0) {
          let triggeredFieldIndex = this.banks.bank_detail.banking.payment_data.bank_data[index].fields.findIndex(x => x.index === triggerIndex)
          if (triggeredFieldIndex !== -1) {
            this.banks.bank_detail.banking.payment_data.bank_data[index].fields[triggeredFieldIndex].value = data[0][field.inherit_column]
          }
        }
        return ''
      },
      triggerInherit (index, triggerIndex, key, value) {
        this.setInheritFieldValue(index, triggerIndex, key, value)
      },
      setPayoutTypesFields () {
        if (this.banks.bank_detail.banking.payment_data.bank_data.length < 1) {
          let query = {
            country_id: this.selectedFilters.countryID,
            types: ['stockist_payout_options']
          }
          this.getDynamicContentAction(query).then((res) => {
            if (typeof this.dynamicContentData !== 'undefined' && this.dynamicContentData.stockist_payout_options.length > 0) {
              this.banks.bank_detail.banking.payment_data = (JSON.parse(this.dynamicContentData.stockist_payout_options))
            }
          })
        }
      },
      getAutoFill (key, index, fieldIndex) {
        var value = key.split('.').reduce((a, b) => a[b], this.banks.bank_detail)
        if (value !== '' || value !== null) {
          this.banks.bank_detail.banking.payment_data.bank_data[index].fields[this.setDynamicFieldIndex(this.banks.bank_detail.banking.payment_data.bank_data[index].fields, fieldIndex)].value = value
        }
      },
      clearData () {
        this.banks.bank_detail.banking = {
          payment_data: {
            selected: '',
            bank_data: []
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
