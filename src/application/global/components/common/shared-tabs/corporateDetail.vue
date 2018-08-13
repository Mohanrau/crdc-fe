<template>
  <div class="information-tab">
    <div class="row gutter-sm">
      <div class="col-lg-6">
        <div class="col-12 q-ma-sm relative-position">
          <q-field :label="$t('sales.salesOrder.corporateSales.companyName')"
                   :helper="'*'"
                   :error="validations.corporate_sales.company_name.$error"
                   :error-label="$t('sales.salesOrder.corporateSales.companyName.errorLabel')">
            <q-input inverted-light
                     :disable="lockSalesOrder"
                     class="no-shadow custom-input-border"
                     color="white text-black"
                     v-model="salesData.corporate_sales.company_name"
            />
          </q-field>
        </div>
        <div class="col-12 q-ma-sm relative-position">
          <q-field :label="$t('sales.salesOrder.corporateSales.company_reg_number')"
                   :helper="'*'"
                   :error="validations.corporate_sales.company_reg_number.$error"
                   :error-label="$t('sales.salesOrder.corporateSales.company_reg_number.errorLabel')">
            <q-input inverted-light
                     :disable="lockSalesOrder"
                     class="no-shadow custom-input-border"
                     color="white text-black"
                     v-model="salesData.corporate_sales.company_reg_number"
            />
          </q-field>
        </div>
        <div class="col-12 q-ma-sm relative-position">
          <q-field :label="$t('sales.salesOrder.corporateSales.company_email')"
                   :helper="'*'"
                   :error="validations.corporate_sales.company_email.$error"
                   :error-label="$t('sales.salesOrder.corporateSales.company_email.errorLabel')">
            <q-input inverted-light
                     :disable="lockSalesOrder"
                     class="no-shadow custom-input-border"
                     color="white text-black"
                     v-model="salesData.corporate_sales.company_email"
            />
          </q-field>
        </div>
        <div class="col-12 q-ma-sm relative-position">
          <q-field :label="$t('sales.salesOrder.corporateSales.personInCharge')"
                   :helper="'*'"
                   :error="validations.corporate_sales.person_in_charge.$error"
                   :error-label="$t('sales.salesOrder.corporateSales.personInCharge.errorLabel')">
            <q-input inverted-light
                     :disable="lockSalesOrder"
                     class="no-shadow custom-input-border"
                     color="white text-black"
                     v-model="salesData.corporate_sales.person_in_charge"
            />
          </q-field>
        </div>
        <div class="col-12 q-ma-sm relative-position">
          <q-field
            :helper="'*'"
            :label="$t('members.information.mobile1')"
            :error="validations.corporate_sales.contact_country_code_id.$error || validations.corporate_sales.contact_number.$error"
            :error-label="$t('sales.salesOrder.corporateSales.personInCharge.mobile1')"
          >
            <div class="row gutter-xs">
              <div class="col-6">
                <q-select clearable
                          :disable="lockSalesOrder"
                          inverted-light
                          class="no-shadow custom-input-border"
                          color="white text-black"
                          v-model="salesData.corporate_sales.contact_country_code_id"
                          :options="callCodeOptionsByCountry"
                />
              </div>
              <div class="col-6">
                <q-input :disable="lockSalesOrder || salesData.corporate_sales.contact_country_code_id === ''"
                         inverted-light
                         class="no-shadow custom-input-border"
                         color="white text-black"
                         v-model="salesData.corporate_sales.contact_number"/>
              </div>
            </div>
          </q-field>
          <q-loader :visible="isProcessingSection"></q-loader>
        </div>
      </div>
      <div class="col-lg-6" v-if="addresses.length > 0">
        <!--address here-->
        Company Address
        <div class="dynamic-field q-ma-sm"
             v-for="(field, index2) in sortDynamicFields(addresses[0].fields)"
             :key="field.label">
          <q-field :labelWidth="3" class="capitalize" :helper="field.required ? '*' : ''"
                   :label="field.label"
                   :error="field.required ? $v.addresses.$each[0].fields.$each[setDynamicFieldIndex(addresses[0].fields, field.index)].value.$invalid : false"
                   :error-label="field.helper !== '' ? field.helper : 'Required Field'">
            <q-input v-if="field.type === 'input'"
                     inverted-light
                     color="white text-grey-6"
                     class="no-shadow custom-input-border"
                     :disable="lockSalesOrder"
                     clearable
                     @input="addresses[0].fields[setDynamicFieldIndex(addresses[0].fields, field.index)].value.$touch"
                     v-model.trim="addresses[0].fields[setDynamicFieldIndex(addresses[0].fields, field.index)].value"
            />
            <q-select
              inverted-light
              color="white text-grey-6"
              class="no-shadow custom-input-border"
              filter
              autofocus-filter
              :disable="lockSalesOrder || field.key === 'countries' || setDynamicFieldKeyOptionsData(field.key, field.identifier, 0, index2).length < 1 && field.type !== 'custom-select'"
              clearable
              v-if="lockSalesOrder || field.type === 'select' || field.type === 'custom-select' && field.type !== 'masters-select'"
              @input="field.trigger === 'cities' ? setCities(addresses[0].fields[setDynamicFieldIndex(addresses[0].fields, field.index)].value, 0, index2) : '', field.required ? addresses[0].fields[setDynamicFieldIndex(addresses[0].fields, field.index)].value.$touch : false"
              v-model="addresses[0].fields[setDynamicFieldIndex(addresses[0].fields, field.index)].value"
              :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, 0, index2)"
            />
            <q-select v-if="field.type === 'masters-select'"
                      inverted-light
                      color="white text-grey-6"
                      class="no-shadow custom-input-border"
                      filter
                      autofocus-filter
                      :disable="lockSalesOrder"
                      clearable
                      @input="addresses[0].fields[setDynamicFieldIndex(addresses[0].fields, field.index)].value.$touch"
                      v-model="addresses[0].fields[setDynamicFieldIndex(addresses[0].fields, field.index)].value"
                      :options="field.options ? field.options : setDynamicFieldKeyOptionsData(field.key, field.identifier, 0, index2)"
            />
          </q-field>
        </div>
      </div>
    </div>
    <q-loader :visible="isProcessingSection"></q-loader>
  </div>
</template>

<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import trans from 'src/application/global/components/common/transition/transition'
  import {AddressMixin, MasterDataTransformarMixin} from 'src/application/global/mixins/index'
  import {Dialog, Notify} from 'quasar'
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    name: "cooperate-detail",
    mixins: [MasterDataTransformarMixin, AddressMixin],
    components: {
      qLoader,
      trans
    },
    props: {
      salesData: {
        type: Object,
        required: true
      },
      validations: {
        type: Object,
        required: true
      },
      lockSalesOrder: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({
    }),
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
    computed: {
      ...mapGetters([
        'callCodeOptionsByCountry'
      ]),
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        languageOptions: state => state.globalCMP.languagesOptions.data,
        appSettings: state => state.globalCMP.appSettings,
        done: state => state.globalCMP.done
      })
    },
    mounted() {
      this.addresses = this.salesData.corporate_sales.company_address
      this.selectedCountry = this.salesData.country_id
      this.selectedAddress = 0
      this.setCountrySelectionOnSelectedAddress()
      this.getLanguagesAction()
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
      }
    }
  }
</script>

<style scoped>

</style>
