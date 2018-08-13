<template>
  <div class="general-page-holder">
    <basic-form formName="DailyCollectionReportForm"
                formTitle="Daily Collection Report Form"
                :backgroudColor="false"
                v-bind:formFieldData="taxInvoiceDetailSearchData"
                urlResetPathName=""
                :buttonTitleCaption="$t('Common.Save.Btn')"
                :formSubmit="processForm"
                :buttonOneVisibility="true"
                :buttonOneCaption="$t('bonus.yearlyIncome.button.printStatement')"
                buttonOneIcon="print"
                :buttonTwoVisibility="false"
                buttonThreeCaption="Reset"
                buttonThreeIcon="autorenew"
                :buttonThreeVisibility="false">
      <template slot="form">
        <div class="form-holder layout-padding docs-input bg-white shadow-1">
          <div class="row gutter-md">
            <div class="col-12">
              <q-field
                label-width="3"
                :label="$t('bonus.yearlyIncome.label.country')"
              >
                <q-select
                  clearable
                  color="black"
                  v-model="taxInvoiceDetailSearchData.country_id"
                  :options="countriesOptions.options"
                ></q-select>
              </q-field>
            </div>
            <div class="col-12">
              <q-field
                label-width="3"
                :label="$t('sale.cancellation.detail.label.transactionLocation')"
              >
                <q-select
                  multiple
                  v-model="taxInvoiceDetailSearchData.location_ids"
                  :options="locationsOptionsByCountry"
                />
              </q-field>
            </div>
            <div class="col-12">
              <div class="row gutter-xs  justify-between">
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="6"
                    label="Invoice Date From"
                    :error="$v.taxInvoiceDetailSearchData.invoice_from_date.$error"
                    error-label="Transaction date from must be before transaction date to"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="taxInvoiceDetailSearchData.invoice_from_date"
                    />
                  </q-field>
                </div>
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="3"
                    label="  To"
                    :error="$v.taxInvoiceDetailSearchData.invoice_to_date.$error"
                    error-label="Transaction Date to must be later than transaction date from, and cannot be future date"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="taxInvoiceDetailSearchData.invoice_to_date"
                    />
                  </q-field>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="row gutter-xs justify-between">
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="6"
                    label="CW From"
                    :error="$v.taxInvoiceDetailSearchData.cw_from.$error"
                    error-label="Submission date from must be before submission date to"
                  >
                    <q-select
                      v-model="taxInvoiceDetailSearchData.cw_from"
                      :options="commissionWeeks"
                      filter
                      color="black"
                    ></q-select>
                  </q-field>
                </div>
                <div class="col-lg-6 col-xs-6">
                  <q-field
                    label-width="3"
                    label="  To"
                    :error="$v.taxInvoiceDetailSearchData.cw_to.$error"
                    error-label="Submission Date to must be later than submission date from, and cannot be future date"
                  >
                    <q-select
                      v-model="taxInvoiceDetailSearchData.cw_to"
                      :options="commissionWeeks"
                      filter
                      color="black"
                    ></q-select>
                  </q-field>
                </div>
              </div>
            </div>
            <div class="col-lg-12 col-md-12 col-xs-12">
              <q-list no-border class="col-12">
                <q-field
                  :error="$v.taxInvoiceDetailSearchData.user_ids.$error && !$v.taxInvoiceDetailSearchData.user_ids.required"
                  :error-label="$t('bonus.yearlyIncome.errorMessage.selectMember')"
                >
                  <q-list-header>{{$t('bonus.yearlyIncome.label.memberIDs')}}</q-list-header>
                  <q-item v-for="(user, index) in taxInvoiceDetailSearchData.user_ids" :key="index">
                    <q-item-main>
                      <q-item-tile>
                        <q-field
                          :error="$v.taxInvoiceDetailSearchData.user_ids.$each[index].$error || setError(user.user_id,'type.exp')"
                          :error-label="setError(user.user_id,'type.exp') ?  setError(user.user_id,'type.msg') : 'Please select a member'"
                        >
                          <q-input v-model="user.user_name"
                                   clearable
                                   :disable="user.hasUserSelected"
                                   :placeholder="$t('bonus.yearlyIncome.placeholder.searchMember')"
                                   @change="$v.taxInvoiceDetailSearchData.user_ids.$each[index].$touch()"
                          >
                            <q-autocomplete
                              @search="(terms, done) => search(terms, done, user, 'user_id')"
                              @selected="(item, keyboard) => selected(item, user, 'user_id', keyboard)"
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
                          @click="removeMemberInSearch(user, index)"
                        ></q-btn>
                      </q-item-tile>
                    </q-item-side>
                  </q-item>
                </q-field>
              </q-list>
              <div class="col-12">
                <q-btn
                  flat
                  round
                  icon="add"
                  :disable="taxInvoiceDetailSearchData.user_ids.length >= 10"
                  @click="addMemberInSearch"
                >
                </q-btn>
              </div>
            </div>
            <!--<div class="col-12">-->
              <!--<q-field-->
                <!--label-width="3"-->
                <!--label="User"-->
              <!--&gt;-->
                <!--<div class="row gutter-xs">-->
                  <!--<div class="col-11">-->
                    <!--<q-input-->
                      <!--v-model="taxInvoiceDetailSearchData.user_name"-->
                      <!--clearable-->
                      <!--:disable="taxInvoiceDetailSearchData.hasUserSelected"-->
                      <!--:placeholder="$t('bonus.yearlyIncome.placeholder.searchMember')"-->
                    <!--&gt;-->
                      <!--<q-autocomplete-->
                        <!--@search="(terms, done) => search(terms, done, 'user_id')"-->
                        <!--@selected="(item) => selected(item, 'user_id')"-->
                      <!--/>-->
                    <!--</q-input>-->
                  <!--</div>-->
                  <!--<div class="col-1">-->
                    <!--<q-btn-->
                      <!--icon="remove"-->
                      <!--round-->
                      <!--small-->
                      <!--@click="removeMemberInSearch()"-->
                    <!--&gt;</q-btn>-->
                  <!--</div>-->
                <!--</div>-->
              <!--</q-field>-->
            <!--</div>-->
          </div>
        </div>
      </template>
      <q-loader :visible="isProcessingForm"></q-loader>
    </basic-form>
  </div>
</template>

<script>
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { DatesMixin,MasterDataTransformarMixin } from 'src/application/global/mixins/index'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    name: "tax-invoice-summary-report",
    mixins: [DatesMixin, setFormFieldErrorsMixin, MasterDataTransformarMixin],
    components: {
      genaralHeader,
      basicForm,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        selectedFilters: state => state.globalCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        errors: state => state.globalCMP.errors.data
      }),
      ...mapGetters([
        'locationsOptionsByCountry'
      ])
    },
    mounted: function () {
      this.taxInvoiceDetailSearchData.country_id = this.selectedFilters.countryID
      this.taxInvoiceDetailSearchData.invoice_from_date = this.getCurrentDate()
      this.taxInvoiceDetailSearchData.invoice_to_date = this.getCurrentDate()
      this.master.keys = [this.$const.masterKey.YEARLY_REPORT_TYPE]
      this.getCountriesAction()
      this.generateYearSelection()
      this.getCommissionWeeksData()
      let query1 = {
        country_id: this.selectedFilters.countryID,
        relations: ['entity.locations']
      }
      this.getCountryRelationAction(query1)
    },
    data: () => ({
      years: [],
      taxInvoiceDetailSearchData: {
        country_id: '',
        location_ids: [],
        invoice_from_date: '',
        invoice_to_date: '',
        cw_from: '',
        cw_to: '',
        invoice_status: '',
        user_ids: []
      }
    }),
    validations: {
      taxInvoiceDetailSearchData: {
        country_id: {
          required
        },
        invoice_from_date: {
          isInRange (val, elm) {
            if (elm && val !== '') {
              let diff = this.getDateDiff(elm.invoice_to_date, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        invoice_to_date: {
          isInRange (val, elm) {
            if (elm) {
              let diff = this.getDateDiff(this.getCurrentDate(), val, 'days')
              if (diff >= 0) {
                return true
              } else {
                return false
              }
            }
            return false
          }
        },
        cw_from: {
          isInRange (val, elm) {
            if (elm && val !== '') {
              let diff = this.getDateDiff(elm.cw_to, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        cw_to: {
          isInRange (val, elm) {
            if (elm) {
              let diff = this.getDateDiff(this.getCurrentDate(), val, 'days')
              if (diff >= 0) {
                return true
              } else {
                return false
              }
            }
            return false
          }
        },
        user_ids: {
          $each: {
            user_id: {
              required
            }
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getTaxInvoiceByProductReportAction',
        'getCountryRelationAction',
        'getCommissionWeekSearchAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      search (terms, done, user, field) {
        if (field === 'user_id') {
          let query = {
            search_text: user.user_name,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        }
      },
      generateYearSelection () {
        // this will be changed to be fetched from backend later, like CW
        let currentYear = new Date().getFullYear()
        let startYear = 2010
        while (startYear <= currentYear) {
          let year = currentYear--
          this.years.push({value: year, label: year.toString()})
        }
      },
      selected (item, user, field, keyboard) {
        if (!keyboard) {
          this[field] = item.sublabel
          if (field === 'user_id') {
            user.user_id = item.userID
            user.user_name = item.label
            user.hasUserSelected = true
          } else if (field === 'cw') {
            this.taxInvoiceDetailSearchData.cw_id = item
            this.$v.taxInvoiceDetailSearchData.cw_name.$touch()
          }
        }
      },
      getAdditionalIBO () {
        return {
          user_id: '',
          user_name: '',
          hasUserSelected: false
        }
      },
      addMemberInSearch () {
        this.taxInvoiceDetailSearchData.user_ids.push(this.getAdditionalIBO())
      },
      removeMemberInSearch (user, index) {
        // make sure the error messages doesn't reappear after removing the text field to ensure validation consistency
        this.$v.taxInvoiceDetailSearchData.user_ids.$reset()
        this.taxInvoiceDetailSearchData.user_ids.splice(this.taxInvoiceDetailSearchData.user_ids.indexOf(user), 1)
      },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'past',
          limit: 50,
          sort: 'date_from',
          order: 'desc'
        }
        this.getCommissionWeekSearchAction(query).then(() => {
          if (this.commissionWeeks.length > 0) {
            this.taxInvoiceDetailSearchData.cw_from = this.commissionWeeks[0].value
            this.taxInvoiceDetailSearchData.cw_to = this.commissionWeeks[0].value
          }
        })
      },
      processForm () {
        this.$v.taxInvoiceDetailSearchData.$touch()
        return new Promise((resolve, reject) => {
          let user_id_array = this.taxInvoiceDetailSearchData.user_ids.map((user) => user.user_id)
          if (!this.$v.taxInvoiceDetailSearchData.$error) {
            let query = {
              country_id: this.taxInvoiceDetailSearchData.country_id,
              location_ids: this.taxInvoiceDetailSearchData.location_ids,
              from_date: this.formatDate(this.taxInvoiceDetailSearchData.invoice_from_date, 'YYYY-MM-DD'),
              to_date: this.formatDate(this.taxInvoiceDetailSearchData.invoice_to_date, 'YYYY-MM-DD'),
              from_cw: this.taxInvoiceDetailSearchData.cw_from,
              to_cw: this.taxInvoiceDetailSearchData.cw_to,
              ibo_ids: user_id_array
            }
            this.getTaxInvoiceByProductReportAction(query).then((res) => {
              let pdfUrl = res
              if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '' && pdfUrl.length > 0) {
                pdfUrl.forEach((pdf) => {
                  if (pdf.download_link !== undefined && pdf.download_link !== null) {
                    openURL(pdf.download_link)
                  }
                })
              }
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          } else {
            this.setNotification({
              title: this.$t('bonus.yearlyIncome.notification.yearlyReportRequestFail.title'),
              message: this.$t('bonus.yearlyIncome.notification.yearlyReportRequestFail.message'),
              type: 'negative'
            })
            reject(this.$v.taxInvoiceDetailSearchData.$error)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
