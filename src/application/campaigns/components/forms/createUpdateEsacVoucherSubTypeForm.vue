<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createUpdateEsacVoucherSubTypeForm"
                    :backgroudColor="false"
                    :formTitle="$t('campaigns.esacVoucherSubTypeNew.title')"
                    v-bind:formFieldData="esacVoucherSubTypeData"
                    urlResetPathName="eSac Voucher Sub Type List"
                    formAction="createEsacVoucherSubTypeAction"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="pwp-foc-section">
                    <div class="configuration-content-sections shadow-1 pd-10  bg-white">
                        <div class="row gutter-sm">
                            <div class="col-lg-6">
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('voucher_type_id')"
                                                 :error-label="getErrorMessage('voucher_type_id')"
                                        >
                                            <q-select
                                                    name="voucherTypeInput"
                                                    color="primary"
                                                    v-model="esacVoucherSubTypeData.voucher_type_id"
                                                    :stack-label="$t('campaigns.esacVoucherSubType.esacVoucherType')"
                                                    :options="esacVoucherTypesOptions"
                                            />
                                        </q-field>
                                    </div>
                                </div>
                                <div class="general-holder q-ma-sm">
                                    <div class="general-item relative-position">
                                        <q-field helper="*"
                                                 :error="getErrorState('name')"
                                                 :error-label="getErrorMessage('name')"
                                                 :count="50"
                                        >
                                            <q-input name="nameInput" v-model="esacVoucherSubTypeData.name"
                                                     :stack-label="$t('campaigns.esacVoucherSubType.name')"></q-input>
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
                                                     :max-height="80" v-model="esacVoucherSubTypeData.description"
                                                     :stack-label="$t('campaigns.esacVoucherSubType.description')"></q-input>
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
  import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

  export default {
    name: 'create-update-esac-voucher-type-form',
    components: {
      BasicForm: basicForm,
      qLoader
    },
    mixins: [masterDataTransformarMixin],
    props: ['esacVoucherSubTypeId'],
    computed: {
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        selectedFilters: state => state.globalCMP.selectedFilters,
        formData: state => state.globalCMP.formData,
      }),
      ...mapGetters({
        esacVoucherTypeList: 'tableDataEsacVoucherTypes',
        paginationQuery: 'pagination'
      })
    },
    mounted: function () {
      this.master.keys = [this.$const.masterKey.SALE_TYPES]
      if (this.esacVoucherSubTypeId) {
        this.setFormData()
      }
      else {
        this.esacVoucherSubTypeData.country_id = this.selectedFilters.countryID
        this.countryChange()
      }
    },
    data: () => ({
      message: '',
      headers: {
        Accept: 'form-data',
        Authorization: 'Bearer' + ' ' + localStorage.getItem('accessToken')
      },
      esacVoucherTypesOptions: [],
      esacVoucherSubTypeData: {
        country_id: null,
        voucher_type_id: null,
        name: null,
        description: null,
        active: 1
      }
    }),
    validations: {
      esacVoucherSubTypeData: {
        country_id: {
          required,
          numeric,
          between: between(1, 9999999999)
        },
        voucher_type_id: {
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
        'getCountriesAction',
        'getEsacVoucherTypeListAction',
        'createEsacVoucherSubTypeAction',
        'updateEsacVoucherSubTypeAction',
        'getEsacVoucherSubTypeAction'
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
          this.$router.push({name: 'eSac Voucher Sub Type List'})
        }, 1500)
      },
      setFormData: function () {
        this.getEsacVoucherSubTypeAction(this.esacVoucherSubTypeId).then((res) => {
          // clone object assign store state to local state
          this.esacVoucherSubTypeData = Object.assign({}, this.formData.formData)
          this.countryChange()
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
        if (this.$v.esacVoucherSubTypeData[name] !== undefined) {
          isError = this.$v.esacVoucherSubTypeData[name].$error
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
        if (this.$v.esacVoucherSubTypeData[name] !== undefined) {
          if (this.$v.esacVoucherSubTypeData[name].$error) {
            if (this.$v.esacVoucherSubTypeData[name].hasOwnProperty('required')) {
              if (this.$v.esacVoucherSubTypeData[name].required === false) {
                errorMessage = 'Required'
              }
            }
            if (this.$v.esacVoucherSubTypeData[name].hasOwnProperty('minLength')) {
              if (this.$v.esacVoucherSubTypeData[name].minLength === false) {
                errorMessage = 'Minimum length'
              }
            }
            if (this.$v.esacVoucherSubTypeData[name].hasOwnProperty('maxLength')) {
              if (this.$v.esacVoucherSubTypeData[name].maxLength === false) {
                errorMessage = 'Maximum length'
              }
            }
            if (this.$v.esacVoucherSubTypeData[name].hasOwnProperty('numeric')) {
              if (this.$v.esacVoucherSubTypeData[name].numeric === false) {
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
      countryChange () {
        if (this.esacVoucherSubTypeData.country_id > 0) {
          this.query = {}
          this.query.country_id = this.esacVoucherSubTypeData.country_id
          this.getEsacVoucherTypeListAction(_(this.query).omitBy(_.isUndefined).omitBy(_.isNull).value()).then(() => {
            this.data = JSON.parse(JSON.stringify(this.esacVoucherTypeList.list.data))
            this.esacVoucherTypesOptions = []
            if (this.data.length > 0) {
              this.data.forEach(x => {
                this.esacVoucherTypesOptions.push({
                  label: x.name,
                  value: x.id
                })
              })
            }
          })
        } else {
          this.esacVoucherTypesOptions = []
          this.disable = true
        }
      },
      processForm: function (formFieldData) {
        return new Promise((resolve, reject) => {
          this.$v.esacVoucherSubTypeData.$touch()
          if (!this.$v.esacVoucherSubTypeData.$error) {
            if (this.esacVoucherSubTypeId) {
              this.updateEsacVoucherSubTypeAction(formFieldData).then((response) => {
                resolve(response)
              }).catch(error => {
                if (typeof error.response !== 'undefined' && error.response.status === 422) {
                  if (typeof error.response.data !== 'undefined' && typeof error.response.data.id !== 'undefined') {
                    this.setNotification({
                      title: 'eSac Voucher Sub Type Editing Failed',
                      message: error.response.data.id[0],
                      type: 'negative'
                    })
                  }
                }
              })
            } else {
              this.createEsacVoucherSubTypeAction(formFieldData).then((response) => {
                this.esacVoucherSubTypeData = Object.assign({}, JSON.parse(JSON.stringify(response)))
                if (typeof this.esacVoucherSubTypeData.errors !== 'undefined') {
                  delete this.esacVoucherSubTypeData.errors
                }
                if (typeof this.esacVoucherSubTypeData.country_id === 'undefined') {
                  if ((typeof this.esacVoucherSubTypeData.esac_voucher_type !== 'undefined') && (typeof this.esacVoucherSubTypeData.esac_voucher_type.country_id !== 'undefined')) {
                    this.esacVoucherSubTypeData.country_id = this.esacVoucherSubTypeData.esac_voucher_type.country_id;
                  }
                  else {
                    this.esacVoucherSubTypeData.country_id = this.selectedFilters.countryID
                  }
                  this.countryChange()
                }
                this.$router.push({ name: 'Update eSac Voucher Sub Type', params: { esacVoucherSubTypeId: response.id }})
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'eSac Voucher Sub Type Creation Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.esacVoucherSubTypeData.$error)
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
