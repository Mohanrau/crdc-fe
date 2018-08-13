<template>
    <div class="banking-tab relative-position">
        <div v-if="memberData.banking.payment_data.bank_data.length > 0" class="content">
            <div class="row generic-margin items-center">
                <div class="col-lg-auto fit" v-show="validation.memberData.banking.payment_data.bank_data.$error">
                    <q-list>
                        <q-item>
                            <q-item-side left icon="info"></q-item-side>
                            <q-item-main label="Remove bank data if not required to proceed save"/>
                            <q-item-side right>
                                <q-btn color="negative" @click="clearData" icon="clear">Remove</q-btn>
                            </q-item-side>
                        </q-item>
                    </q-list>
                </div>
                <div class="col-lg-auto banking-holder cursor-pointer q-mt-md q-mb-md" @click="setBankingType(banking.id)"
                     v-for="(banking, index) in memberData.banking.payment_data.bank_data">
                    <q-card flat class="custom-border" :color="memberData.banking.payment_data.selected === banking.id ? 'positive text-white' : ''">
                        <q-card-title>
                            <div class="row group items-center">
                                <div class="col-auto">
                                    <div>
                                        <q-icon name="account_balance"></q-icon>
                                    </div>
                                </div>
                                <div class="col-auto"><div>{{ banking.title }}</div></div>
                                <div class="col-auto">
                                    <div>
                                        <q-icon v-if="memberData.banking.payment_data.selected === banking.id"
                                                color="white"
                                                slot="right"
                                                name="check_circle"/>
                                    </div>
                                </div>
                            </div>
                        </q-card-title>
                    </q-card>
                </div>
            </div>
            <hr>
            <div class="row">
                <div class="col-lg-8" v-if="memberData.banking.payment_data.selected === banking.id"
                     v-for="(banking, index1) in memberData.banking.payment_data.bank_data">
                    <q-card square class="fit no-box-shadow">
                        <q-card-main>
                            <div class="row gutter-sm">
                                <div class="col-12" v-if="banking.fields.length > 0">
                                    <div class="row">
                                        <div class="dynamic-field q-ma-sm"
                                             :class="{'col-6': typeof field.share !== 'undefined' && field.share.pos !=='C', 'col-12': typeof field.share === 'undefined', 'col-3': typeof field.share !== 'undefined' && field.share.pos ==='C'}"
                                             v-for="(field, index2) in sortDynamicFields(banking.fields)"
                                             :key="field.label">
                                            <q-field :labelWidth="field.share ? 6 : 3" class="capitalize"
                                                     :helper="field.required ? '*' : ''"
                                                     :label="typeof field.share !== 'undefined' && field.share.pos ==='C' ? '' : field.label"
                                                     :error="field.required ? validation.memberData.banking.payment_data.bank_data.$each[index1].fields.$each[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value.$error : false"
                                                     error-label="Required field missing">
                                                <q-input v-if="field.type === 'input'"
                                                         clearable
                                                         inverted-light
                                                         class="no-shadow custom-input-border"
                                                         color="white text-black"
                                                         :type="field.input_type ? field.input_type : 'text'"
                                                         :disable="field.readonly ? field.readonly : false"
                                                         @input="field.readonly ?  setInheritFieldValue(index1, field.inherit_index, field.inherit_column) : '', memberData.banking.payment_data.bank_data[index1].fields[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value.$touch"
                                                         v-model.trim="typeof field.autofill !== 'undefined' && memberData.banking.payment_data.bank_data[index1].fields[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value === ''  ? getAutoFill(field.autofill, index1, field.index) : memberData.banking.payment_data.bank_data[index1].fields[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value"
                                                />
                                                <q-select
                                                        :disable="field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2).length < 1 && field.type !== 'custom-select'"
                                                        inverted-light
                                                        class="no-shadow custom-input-border"
                                                        color="white text-black"
                                                        clearable
                                                        filter
                                                        v-if="field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
                                                        :float-label="field.placeholder ? field.placeholder : ''"
                                                        @input="field.trigger ? triggerInherit(index1, field.trigger, field.key, field.value) : '', field.required ? memberData.banking.payment_data.bank_data[index1].fields[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value.$touch : false"
                                                        v-model="memberData.banking.payment_data.bank_data[index1].fields[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value"
                                                        :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, index1, index2)"
                                                />
                                                <q-select v-if="field.type === 'masters-select'"
                                                          clearable
                                                          filter
                                                          inverted-light
                                                          class="no-shadow custom-input-border"
                                                          color="white text-black"
                                                          @input="field.trigger ? triggerInherit(index1, field.trigger) : '', memberData.banking.payment_data.bank_data[index1].fields[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value.$touch"
                                                          v-model="memberData.banking.payment_data.bank_data[index1].fields[setDynamicFieldIndex(memberData.banking.payment_data.bank_data[index1].fields, field.index)].value"
                                                          :options="field.options ? field.options : masterDataOptionsCreator(field.identifier)"
                                                />
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
            <div class="row justify-center">
                <div class="col-lg-auto">
                    <q-btn icon="refresh" color="positive" @click="initSetupArea()">Undo</q-btn>
                </div>
            </div>
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
    name: 'banking-tab',
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
      selectedCountryByIndex: []
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
        citiesOptions: state => state.globalCMP.citiesOptions.data,
        banksOptions: state => state.globalCMP.banksOptions.data
      })
    },
    mounted () {
      this.master.keys = ['bank_account_type']
      this.initSetupArea()
    },
    methods: {
      ...mapActions([
        'getLanguagesAction',
        'getDynamicContentAction',
        'getStateAction',
        'getCitiesAction',
        'getCountriesBankAction'
      ]),
      initSetupArea () {
        this.getLanguagesAction()
        let query = {
          country_id: this.memberData.details.country_id,
          relations: ['banks']
        }
        this.getCountriesBankAction(query)
        this.setPayoutTypesFields()
      },
      setBankingType (id) {
        this.memberData.banking.payment_data.selected = id
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
        let field = this.memberData.banking.payment_data.bank_data[index].fields.find(x => x.index === triggerIndex)
        if (Object.keys(field).length > 0) {
          data = this.setDynamicFieldKeyOptionsData(key).filter(x => x.value === value)
        }
        if (data.length > 0) {
          let triggeredFieldIndex = this.memberData.banking.payment_data.bank_data[index].fields.findIndex(x => x.index === triggerIndex)
          if (triggeredFieldIndex !== -1) {
            this.memberData.banking.payment_data.bank_data[index].fields[triggeredFieldIndex].value = data[0][field.inherit_column]
          }
        }
        return ''
      },
      triggerInherit (index, triggerIndex, key, value) {
        this.setInheritFieldValue(index, triggerIndex, key, value)
      },
      setPayoutTypesFields () {
        if (this.memberData.banking.payment_data.bank_data.length < 1) {
          let query = {
            country_id: this.memberData.details.country_id,
            types: ['member_payout_options']
          }
          this.getDynamicContentAction(query).then((res) => {
            if (typeof this.dynamicContentData !== 'undefined' && this.dynamicContentData.member_payout_options.length > 0) {
              this.memberData.banking.payment_data = (JSON.parse(this.dynamicContentData.member_payout_options))
            }
          })
        }
      },
      getAutoFill (key, index, fieldIndex) {
        var value = key.split('.').reduce((a, b) => a[b], this.memberData)
        if (value !== '' || value !== null) {
          this.memberData.banking.payment_data.bank_data[index].fields[this.setDynamicFieldIndex(this.memberData.banking.payment_data.bank_data[index].fields, fieldIndex)].value = value
        }
      },
      clearData () {
        this.memberData.banking = {
          payment_data: {
            selected: '',
            bank_data: []
          }
        }
      }
    }
  }
</script>
<style lang="stylus">
    .banking-field
        margin 0 0 0 0 !important
</style>