<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createUpdateEsacVoucherTypeForm"
                    :backgroudColor="false"
                    :formTitle="$t('campaigns.esacVoucherTypeNew.title')"
                    v-bind:formFieldData="esacVoucherTypeData"
                    urlResetPathName="eSac Voucher Type List"
                    formAction="createEsacVoucherTypeAction"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="pwp-foc-section">
                    <div class="configuration-content-sections shadow-1 pd-10  bg-white">
                        <div class="row gutter-sm">
                            <div class="col-lg-6">
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('name')"
                                                 :error-label="getErrorMessage('name')"
                                                 :count="50"
                                        >
                                            <q-input name="nameInput" v-model="esacVoucherTypeData.name"
                                                     :stack-label="$t('campaigns.esacVoucherType.name')"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('description')"
                                                 :error-label="getErrorMessage('description')"
                                                 :count="500"
                                        >
                                            <q-input name="descriptionInput" type="textarea" :min-rows="5"
                                                     :max-height="80" v-model="esacVoucherTypeData.description"
                                                     :stack-label="$t('campaigns.esacVoucherType.description')"></q-input>
                                        </q-field>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :message="message" :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import _ from 'lodash'
  import { api } from '../../api'
  import { required, minLength, maxLength, between, numeric, url } from 'vuelidate/lib/validators'
  import { mapActions, mapMutations, mapState } from 'vuex'

  export default {
    name: 'create-update-esac-voucher-type-form',
    components: {
      BasicForm: basicForm,
      qLoader
    },
    mixins: [masterDataTransformarMixin],
    props: ['esacVoucherTypeId'],
    computed: {
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        selectedFilters: state => state.globalCMP.selectedFilters,
        formData: state => state.globalCMP.formData,
      })
    },
    mounted: function () {
      this.master.keys = [this.$const.masterKey.SALE_TYPES]
      if (this.esacVoucherTypeId) {
        this.setFormData()
      }
      else {
        this.esacVoucherTypeData.country_id = this.selectedFilters.countryID
      }
    },
    data: () => ({
      message: '',
      headers: {
        Accept: 'form-data',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
      },
      esacVoucherTypeData: {
        country_id: null,
        name: null,
        description: null,
        active: 1
      }
    }),
    validations: {
      esacVoucherTypeData: {
        country_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        name: {
          required,
          minLength: minLength(3),
          maxLength: maxLength(50)
        },
        description: {
          required,
          minLength: minLength(1),
          maxLength: maxLength(500)
        },
        active: {
          required
        }
      }
    },
    methods: {
      ...mapActions([
        'createEsacVoucherTypeAction',
        'updateEsacVoucherTypeAction',
        'getEsacVoucherTypeAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
      }),
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'eSac Voucher Type List'})
        }, 1500)
      },
      setFormData: function () {
        this.getEsacVoucherTypeAction(this.esacVoucherTypeId).then((res) => {
          // clone object assign store state to local state
          this.esacVoucherTypeData = Object.assign({}, this.formData.formData)
        }).catch((error) => {
          if (error.status === 404) {
            this.setNotification({
              title: 'Uh oh! An error occured',
              message: error.data.error,
              type: 'negative'
            })
          }
          this.invalidRequest()
        })
      },
      getErrorState: function (name) {
        var isError = false
        if (this.$v.esacVoucherTypeData[name] !== undefined) {
          isError = this.$v.esacVoucherTypeData[name].$error
        }
        if (isError === false) {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            isError = true
          } else {
            isError = false
          }
        }
        return isError
      },
      getErrorMessage: function (name) {
        var errorMessage = ''
        if (this.$v.esacVoucherTypeData[name] !== undefined) {
          if (this.$v.esacVoucherTypeData[name].$error) {
            if (this.$v.esacVoucherTypeData[name].hasOwnProperty('required')) {
              if (this.$v.esacVoucherTypeData[name].required === false) {
                errorMessage = 'Required'
              }
            }
            if (this.$v.esacVoucherTypeData[name].hasOwnProperty('minLength')) {
              if (this.$v.esacVoucherTypeData[name].minLength === false) {
                errorMessage = 'Minimum length'
              }
            }
            if (this.$v.esacVoucherTypeData[name].hasOwnProperty('maxLength')) {
              if (this.$v.esacVoucherTypeData[name].maxLength === false) {
                errorMessage = 'Maximum length'
              }
            }
            if (this.$v.esacVoucherTypeData[name].hasOwnProperty('numeric')) {
              if (this.$v.esacVoucherTypeData[name].numeric === false) {
                errorMessage = 'Must be numeric value'
              }
            }
          }
        }
        if (errorMessage === '') {
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            if (this.errors.hasOwnProperty(name)) {
              errorMessage = this.errors[name][0]
            }
          }
        }
        return errorMessage
      },
      processForm: function (formFieldData) {
        return new Promise((resolve, reject) => {
          this.$v.esacVoucherTypeData.$touch()
          if (!this.$v.esacVoucherTypeData.$error) {
            if (this.esacVoucherTypeId) {
              this.updateEsacVoucherTypeAction(formFieldData).then((response) => {
                resolve(response)
              }).catch(error => {
                if (typeof error.response !== 'undefined' && error.response.status === 422) {
                  if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                    this.setNotification({
                      title: 'eSac Voucher Type Editing Failed',
                      message: error.response.data.id[0],
                      type: 'negative'
                    })
                  }
                }
              })
            } else {
              this.createEsacVoucherTypeAction(formFieldData).then((response) => {
                this.esacVoucherTypeData = Object.assign({}, JSON.parse(JSON.stringify(response)))
                if (typeof this.esacVoucherTypeData.errors !== 'undefined') {
                  delete this.esacVoucherTypeData.errors
                }
                this.$router.replace({ name: 'Update eSac Voucher Type', params: { esacVoucherTypeId: response.id }})
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'eSac Voucher Type Creation Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.esacVoucherTypeData.$error)
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
    .options-holder
        border dotted 1px lightgray
</style>
