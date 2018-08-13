<template>
  <div class="general-page-holder">
    <basic-form formName="CWIncomeStatementForm"
                formTitle="CW Income Statement Form"
                :backgroudColor="false"
                v-bind:formFieldData="stockistCommissionSearchData"
                urlResetPathName=""
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :resetForm="resetForm"
                :buttonOneVisibility="true"
                :buttonOneCaption="$t('bonus.cwIncome.button.printStatement')"
                buttonOneIcon="print"
                :buttonTwoVisibility="false"
                buttonThreeCaption="Reset"
                buttonThreeIcon="autorenew"
                :buttonThreeVisibility="false">
      <template slot="form">
        <div class="form-holder layout-padding docs-input bg-white shadow-1">
          <div class="row gutter-md">
            <div class="col-xl-7 col-lg-8 col-md-12 col-xs-12">
              <q-field
                :label="$t('general.select.country')"
                :error="$v.stockistCommissionSearchData.country_id.$error"
                :error-label="$t('general.select.country.error')">
                <q-select
                  clearable
                  ref="salesCountrySelector"
                  color="black"
                  v-model="stockistCommissionSearchData.country_id"
                  :options="countriesOptions.options"
                  @input="salesCountryChange"
                />
              </q-field>
            </div>
            <div class="col-xl-7 col-lg-8 col-md-12 col-xs-12">
              <q-field
                :label="$t('bonus.cwIncome.label.commissionWeek')"
                :error="$v.stockistCommissionSearchData.cw_name.$error || setError('cw_id','type.exp')"
                :error-label="setError('cw_id','type.exp') ? setError('cw_id','type.msg') : $t('bonus.cwIncome.errorMessage.selectCommissionWeek')"
              >
                  <q-select
                    v-model="stockistCommissionSearchData.cw_name"
                    :options="commissionWeeks"
                    filter
                    color="black"
                    clearable
                    :filterPlaceholder="$t('bonus.cwIncome.placeholder.selectCommissionWeek')"
                    @input="(item) => selected(item, 'cw')"
                  ></q-select>
              </q-field>
            </div>
            <div class="row gutter-sm col-lg-10 col-md-12 col-xs-12">
              <div class="col-12">
                  <q-list no-border class="col-12">
                      <q-list-header>{{$t('bonus.cwIncome.label.memberIDs')}}</q-list-header>
                      <q-item>
                        <q-item-main>
                          <q-item-tile>
                            <q-field
                              :disable="!countrySelected"
                              :error="$v.stockistCommissionSearchData.stockist_info.$error || setError(stockistCommissionSearchData.stockist_info.stockist_id.toString(),'type.exp')"
                              :error-label="setError(stockistCommissionSearchData.stockist_info.stockist_id.toString(),'type.exp') ?  setError(stockistCommissionSearchData.stockist_info.stockist_id.toString(),'type.msg') : $t('bonus.cwIncome.errorMessage.selectMember')"
                            >
                              <q-input v-model="stockistCommissionSearchData.stockist_info.stockist_name"
                                       clearable
                                       :disable="!countrySelected || stockistCommissionSearchData.stockist_info.hasUserSelected"
                                       :placeholder="$t('bonus.cwIncome.placeholder.searchMember')"
                                       @input="$v.stockistCommissionSearchData.stockist_info.$touch()"
                              >
                                <q-autocomplete @search="(terms, done) => search(terms, done, 'stockist_id')"
                                                @selected="(item) => selected(item, 'stockist_id')"
                                />
                              </q-input>
                            </q-field>
                          </q-item-tile>
                        </q-item-main>
                        <q-item-side right>
                          <q-item-tile>
                            <q-btn
                              icon="remove"
                              round
                              small
                              :disable="!countrySelected"
                              @click="clearStockistSearch()"
                            ></q-btn>
                          </q-item-tile>
                        </q-item-side>
                      </q-item>
                  </q-list>
              </div>
            </div>
          </div>
        </div>
      </template>
    <q-loader :visible="isProcessingForm"></q-loader>
    </basic-form>
  </div>
</template>
<script>
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'
  import { mapActions, mapState, mapMutations } from 'vuex'

  export default {
    name: 'stockist-commission-statement',
    mixins: [setFormFieldErrorsMixin],
    components: {
      genaralHeader,
      basicForm,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        stockistSearchData: state => state.stockistCMP.stockistSearchData,
        errors: state => state.globalCMP.errors.data
      })
    },
    mounted: function () {
      this.getCountriesAction()
      this.getCommissionWeeksData()
    },
    data: () => ({
      countrySelected: false,
      stockistCommissionSearchData: {
        country_id: '',
        cw_id: '',
        cw_name: '',
        stockist_info: {
          stockist_id: '',
          stockist_name: '',
          hasUserSelected: false
        }
      }
    }),
    validations: {
      stockistCommissionSearchData: {
        country_id: {
          required
        },
        cw_name: {
          required
        },
        stockist_info: {
          stockist_id: {
            required
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'getCommissionWeekSearchAction',
        'getStockistCommissionReportAction',
        'getCountriesAction',
        'getStockistSearchAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      search (terms, done, field) {
        if (field === 'stockist_id') {
          let query = {
            country_id: this.stockistCommissionSearchData.country_id,
            search_text: this.stockistCommissionSearchData.stockist_info.stockist_name,
            limit: 10
          }
          this.getStockistSearchAction(query).then(res => {
            done(this.stockistSearchData.list)
          })
        }
      },
      selected (item, field) {
        this[field] = item.sublabel
        if (field === 'stockist_id') {
          this.stockistCommissionSearchData.stockist_info.stockist_id = item.stockist_id
          this.stockistCommissionSearchData.stockist_info.stockist_name = item.label
          this.stockistCommissionSearchData.stockist_info.hasUserSelected = true
        } else if (field === 'cw') {
          this.stockistCommissionSearchData.cw_id = item
          this.$v.stockistCommissionSearchData.cw_name.$touch()
        }
        this.togglePopupSearch = true
      },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'current_past',
          limit: 30,
          sort: 'date_from',
          order: 'desc'
        }
        this.getCommissionWeekSearchAction(query)
      },
      clearStockistSearch () {
        // make sure the error messages doesn't reappear after removing the text field to ensure validation consistency
        this.$v.stockistCommissionSearchData.stockist_info.$reset()
        this.stockistCommissionSearchData.stockist_info.stockist_id = ''
        this.stockistCommissionSearchData.stockist_info.stockist_name = ''
        this.stockistCommissionSearchData.stockist_info.hasUserSelected = false
      },
      resetForm () {
        this.stockistCommissionSearchData.cw_id = ''
        this.stockistCommissionSearchData.cw_name = ''
        this.stockistCommissionSearchData.stockist_ids = []
      },
      processForm () {
        this.$v.stockistCommissionSearchData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.stockistCommissionSearchData.$error) {
            let query = {
              cw_id: this.stockistCommissionSearchData.cw_id,
              stockist_id: this.stockistCommissionSearchData.stockist_info.stockist_id
            }
            this.getStockistCommissionReportAction(query).then((res) => {
              let pdfUrl = res
              if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '' && pdfUrl.length > 0) {
                pdfUrl.forEach((pdf) => {
                  if (pdf.download_link !== undefined && pdf.download_link !== null) {
                    openURL(pdf.download_link)
                  }
                })
              } else {
                this.setNotification({
                  title: 'Commission Report Not Found',
                  message: 'No commission statement found for the selected stockist and CW',
                  type: 'negative'
                })
                reject(true)
              }
            }).catch(error => {
              this.setNotification({
                title: 'Commission Report Request Failed',
                message: 'Some error has occurred',
                type: 'negative'
              })
              reject(error)
            })
          } else {
            this.setNotification({
              title: 'Commission Report Request Failed',
              message: 'Please enter all required field to retrieve commission report',
              type: 'negative'
            })
            reject(this.$v.stockistCommissionSearchData.$error)
          }
        })
      },
      salesCountryChange () {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.stockistCommissionSearchData.country_id)
        if (getCountryName.length > 0) {
          this.countrySelected = true
        }
      }
    }
  }
</script>
