<template>
    <div class="tax-tab relative-position">
        <div v-if="memberData.tax.tax_data.length > 0" class="content">
            <div class="row">
                <div class="col-lg-8">
                    <q-card square class="fit no-box-shadow">
                        <q-card-main>
                            <div class="row gutter-sm">
                                <div class="col-lg-12">
                                    <div class="row">
                                        <div class="dynamic-field q-ma-sm"
                                             :class="{'col-6': typeof field.share !== 'undefined' && field.share.pos !=='C', 'col-12': typeof field.share === 'undefined', 'col-3': typeof field.share !== 'undefined' && field.share.pos ==='C'}"
                                             v-for="(field, index) in sortDynamicFields(memberData.tax.tax_data)"
                                             :key="field.label">
                                            <q-field :labelWidth="field.share ? 11 : 3" class="capitalize"
                                                     :helper="field.required ? '*' : ''"
                                                     :label="typeof field.share !== 'undefined' && field.share.pos ==='C' ? '' : field.label"
                                                     :error="field.required ? validation.memberData.tax.tax_data.$each[setDynamicFieldIndex(memberData.tax.tax_data[index], field.index)].value.$error : false"
                                                     error-label="Required field missing">
                                                <q-input v-if="field.type === 'input'"
                                                         clearable
                                                         inverted-light
                                                         class="no-shadow custom-input-border"
                                                         color="white text-black"
                                                         :disable="disabled"
                                                         :type="field.input_type ? field.input_type : 'text'"
                                                         :readonly="field.readonly ? field.readonly : false"
                                                         @input="field.readonly ?  setInheritFieldValue(field.inherit_index, field.inherit_column) : '', memberData.tax.tax_data[index].value.$touch"
                                                         v-model.trim="memberData.tax.tax_data[setDynamicFieldIndex(memberData.tax.tax_data, field.index)].value"
                                                />
                                                <q-select
                                                        :disable="setDynamicFieldKeyOptionsData(field.key, field.identifier, index).length < 1 && field.type !== 'custom-select' || disabled"
                                                        clearable
                                                        inverted-light
                                                        class="no-shadow custom-input-border"
                                                        color="white text-black"
                                                        filter
                                                        v-if="field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
                                                        @input="field.trigger ? triggerInherit(index, field.trigger, field.key, field.value) : '', field.required ? memberData.tax.tax_data[index].value.$touch : false"
                                                        v-model="memberData.tax.tax_data[setDynamicFieldIndex(memberData.tax.tax_data, field.index)].value"
                                                        :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index)"
                                                />
                                                <q-select v-if="field.type === 'masters-select'"
                                                          clearable
                                                          :disable="disabled"
                                                          filter
                                                          @input="field.trigger ? triggerInherit(index, field.trigger) : '', memberData.tax.tax_data[index].value.$touch"
                                                          v-model="memberData.tax.tax_data[setDynamicFieldIndex(memberData.tax.tax_data, field.index)].value"
                                                          :options="field.options ? field.options : masterDataOptionsCreator(field.identifier)"
                                                />
                                                <q-option-group
                                                        v-if="field.type === 'radio', typeof field.trigger !== 'undefined' ? triggerRadio(field.trigger, memberData.tax.tax_data[setDynamicFieldIndex(memberData.tax.tax_data, field.index)].value): true"
                                                        inline
                                                        type="radio"
                                                        :disable="field.trigger ? false : disabled"
                                                        @input="typeof field.trigger !== 'undefined' ? triggerRadio(field.trigger, memberData.tax.tax_data[setDynamicFieldIndex(memberData.tax.tax_data, field.index)].value): ''"
                                                        v-model="memberData.tax.tax_data[setDynamicFieldIndex(memberData.tax.tax_data, field.index)].value"
                                                        :options="field.options ? field.options : []"
                                                />
                                                <q-datetime v-if="field.type === 'date'"
                                                            align="left"
                                                            inverted-light
                                                            class="no-shadow custom-input-border"
                                                            color="white text-black"
                                                            :disable="disabled"
                                                            monday-first
                                                            format="DD-MM-YYYY"
                                                            v-model="memberData.tax.tax_data[setDynamicFieldIndex(memberData.tax.tax_data, field.index)].value"
                                                            type="date"/>
                                            </q-field>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </q-card-main>
                    </q-card>
                </div>
            </div>
        </div>
        <div v-else="" class="empty relative-position">
            <empty-list></empty-list>
            <q-loader :visible="isProcessingSection"></q-loader>
        </div>
        <q-loader :visible="isProcessingSection"></q-loader>
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
    name: 'tax-tab',
    mixins: [masterDataTransformarMixin],
    components: {
      qLoader,
      trans,
      EmptyList
    },
    props: {
      memberData: {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      }
    },
    data: () => ({
      selectedAddress: '',
      selectedCountry: '',
      selectedCountryByIndex: [],
      disabled: false
    }),
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        languageOptions: state => state.globalCMP.languagesOptions.data,
        masterOptions: state => state.globalCMP.masterData.data.list,
        dynamicContentData: state => state.globalCMP.dynamicContentData.data,
        statesOptions: state => state.globalCMP.statesOptions.data,
        citiesOptions: state => state.globalCMP.citiesOptions.data
      })
    },
    mounted () {
      this.master.keys = []
      this.getLanguagesAction()
      this.setTaxpayerFields()
    },
    methods: {
      ...mapActions([
        'getLanguagesAction',
        'getDynamicContentAction',
        'getStateAction',
        'getCitiesAction',
        'getCountriesBankAction'
      ]),
      sortDynamicFields (fields) {
        return _.orderBy(fields, 'order', 'asc')
      },
      // Return back current index after sorting based on order to make sure inline with original array
      setDynamicFieldIndex (fields, index) {
        return fields.findIndex(x => x.index === index)
      },
      setDynamicFieldKeyOptionsData (key, identifier, index) {
        let name = key + 'Options'
        if (typeof this[name] !== 'undefined') {
          if (key === 'states') {
            let countryFieldIndex = this.memberData.tax.tax_data.findIndex(x => x.key === 'countries')
            return this[name].options.filter((item) => item.country_id === this.memberData.tax.tax_data[countryFieldIndex].value)
          }
          if (key === 'cities') {
            let stateFieldIndex = this.memberData.tax.tax_data.findIndex(x => x.key === 'states')
            return this[name].options.filter((item) => item.state_id === this.memberData.tax.tax_data[stateFieldIndex].value)
          }
          return this[name].options
        } else {
          return []
        }
      },
      setInheritFieldValue (index, triggerIndex, key, value) {
        let data = []
        let field = this.memberData.tax.tax_data.find(x => x.index === triggerIndex)
        if (typeof field !== 'undefined' && Object.keys(field).length > 0) {
          data = this.setDynamicFieldKeyOptionsData(key).filter(x => x.value === value)
        }
        if (data.length > 0 && typeof data[0][field.inherit_column] !== 'undefined') {
          let triggeredFieldIndex = this.memberData.tax.tax_data.findIndex(x => x.index === triggerIndex)
          if (triggeredFieldIndex !== -1) {
            this.memberData.tax.tax_data[triggeredFieldIndex].value = data[0][field.inherit_column]
          }
        }
        return ''
      },
      triggerInherit (index, triggerIndex, key, value) {
        if (triggerIndex === 'states') {
          this.selectedCountry = value
          this.setStates(value)
        } else if (triggerIndex === 'cities') {
          this.setCities(value)
        } else {
          this.setInheritFieldValue(index, triggerIndex, key, value)
        }
      },
      setTaxpayerFields () {
        if (this.memberData.tax.tax_data.length < 1) {
          let query = {
            country_id: this.memberData.details.country_id,
            types: ['taxpayer_info']
          }
          this.getDynamicContentAction(query).then((res) => {
            if (typeof this.dynamicContentData !== 'undefined' && this.dynamicContentData.taxpayer_info.length > 0) {
              this.memberData.tax.tax_data = (JSON.parse(this.dynamicContentData.taxpayer_info))
            }
          })
        }
      },
      setStates (id) {
        if (id !== null) {
          let query = {
            country_id: id,
            relations: ['states']
          }
          this.getStateAction(query)
        }
      },
      setCities (val) {
        if (typeof val !== 'undefined' && val !== null) {
          let query = {
            state_id: val
          }
          this.getCitiesAction(query)
        }
      },
      triggerRadio (trigger, fieldValue) {
        if (trigger === 'disableFields') {
          if (fieldValue) {
            this.disabled = false
          } else {
            this.disabled = true
          }
        }
        // always return true to keep if condition true always
        return true
      }
    }
  }
</script>
<style lang="stylus">
    .tax-field
        margin 0 0 0 0 !important
</style>