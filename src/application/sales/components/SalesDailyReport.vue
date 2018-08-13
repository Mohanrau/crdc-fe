<template>
  <div class="general-page-holder">
    <basic-form formName="YearlyIncomeReportsForm"
                formTitle="Yearly Income Reports Form"
                :backgroudColor="false"
                v-bind:formFieldData="dailySalesReportSearchData"
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
                :label="$t('sales.dailySalesReport.reportType')"
              >
                <q-select
                  v-model="dailySalesReportSearchData.type"
                  :options="reportTypes"
                />
              </q-field>
            </div>
            <div class="col-12">
              <q-field
                label-width="3"
                :label="$t('sales.dailySalesReport.label.country')"
              >
                <q-select
                  color="black"
                  v-model="dailySalesReportSearchData.country_id"
                  :options="countriesOptions.options"
                  @input="salesCountryChange"
                ></q-select>
              </q-field>
            </div>
            <div class="col-12">
              <q-field
                label-width="3"
                :label="$t('sales.dailySalesReport.label.transactionLocations')"
              >
                <q-select
                  multiple
                  v-model="dailySalesReportSearchData.location_ids"
                  :options="locationsOptionsByCountry"
                />
              </q-field>
            </div>
            <div class="col-12">
              <div class="row gutter-xs">
                <div class="col-lg-6 col-xs-12">
                  <q-field
                    label-width="6"
                    :label="$t('sales.dailySalesReport.label.transactionDateFrom')"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="dailySalesReportSearchData.from_date"
                                />
                  </q-field>
                </div>
                <div class="col-lg-6 col-xs-12">
                  <q-field
                    label-width="6"
                    :label="$t('sales.dailySalesReport.label.transactionDateTo')"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="dailySalesReportSearchData.to_date"
                                />
                  </q-field>
                </div>
              </div>
            </div>
            <div class="row gutter-sm col-lg-10 col-md-12 col-xs-12">
              <q-list no-border class="col-12">
                <q-field>
                  <q-list-header>{{$t('sales.dailySalesReport.label.salesCreationStaff')}}</q-list-header>
                  <q-item v-for="(user, index) in dailySalesReportSearchData.user_ids" :key="index">
                    <q-item-main>
                      <q-item-tile>
                        <q-field
                          :error="$v.dailySalesReportSearchData.user_ids.$each[index].$error"
                          :error-label="$t('sales.dailySalesReport.errorLabel.salesCreationStaff')"
                        >
                          <q-input v-model="user.user_name"
                                   clearable
                                   :disable="user.hasUserSelected"
                                   :placeholder="$t('bonus.yearlyIncome.placeholder.searchMember')"
                                   @change="$v.dailySalesReportSearchData.user_ids.$each[index].$touch()"
                          >
                            <q-autocomplete
                              @search="(terms, done) => search(terms, done, user, 'user_id')"
                              @selected="(item) => selected(item, user, 'user_id')"
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
                  :disable="dailySalesReportSearchData.user_ids.length >= 10"
                  @click="addMemberInSearch"
                >
                </q-btn>
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
  import Vue from 'vue'
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { DatesMixin } from 'src/application/global/mixins/index'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'

  const RECEIPT = 'receipt'
  const TRANSACTION = 'transaction'

  export default {
    name: "sales-daily-reciept-report",
    mixins: [DatesMixin, setFormFieldErrorsMixin],
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
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        errors: state => state.globalCMP.errors.data,
        appSettings: state => state.globalCMP.appSettings
      }),
      ...mapGetters([
        'locationsOptionsByCountry',
        'userListSearchResult'
      ])
    },
    mounted: function () {
      this.dailySalesReportSearchData.country_id = this.selectedFilters.countryID
      this.dailySalesReportSearchData.from_date = this.getCurrentDate()
      this.dailySalesReportSearchData.to_date = this.getCurrentDate()
      this.getCountriesAction()
      this.generateYearSelection()
      this.salesCountryChange()
    },
    data: () => ({
      years: [],
      reportTypes: [
        {
          label: Vue.prototype.$t('sales.dailySalesReport.receiptReport'),
          value: RECEIPT
        },
        {
          label: Vue.prototype.$t('sales.dailySalesReport.transactionReport'),
          value: TRANSACTION
        }
      ],
      dailySalesReportSearchData: {
        country_id: '',
        location_ids: [],
        from_date: '',
        to_date: '',
        type: RECEIPT,
        user_ids: [
        ]
      }
    }),
    validations: {
      dailySalesReportSearchData: {
        country_id: {
          required
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
        'getUsersListAction',
        'getDailySalesReportAction',
        'getCountryRelationAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      search (terms, done, user, field) {
        if (field === 'user_id') {
          let query = {
            search: user.user_name,
            location_ids: this.dailySalesReportSearchData.location_ids,
            user_type_id: this.appSettings.report.dailySalesReport.userTypeId,
            limit: 10
          }
          this.getUsersListAction(query).then(res => {
            done(this.userListSearchResult)
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
      selected (item, user, field) {
        this[field] = item.sublabel
        if (field === 'user_id') {
          user.user_id = item.value
          user.user_name = item.label
          user.hasUserSelected = true
        }
      },
      getAdditionalIBO () {
        return {
          user_id: '',
          user_name: '',
          hasUserSelected: false
        }
      },
      salesCountryChange () {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.dailySalesReportSearchData.country_id)
        if (getCountryName.length > 0) {
          this.setFilterData({
            countryID: this.dailySalesReportSearchData.country_id,
            filterCountryName: getCountryName[0].label,
            filterCountryCode: getCountryName[0].code
          })
        }
        if (this.dailySalesReportSearchData.country_id > 0) {
          this.dailySalesReportSearchData.location_ids = []
          let query1 = {
            country_id: this.dailySalesReportSearchData.country_id,
            relations: ['entity.locations']
          }
          this.getCountryRelationAction(query1)
        }
      },
      addMemberInSearch () {
        this.dailySalesReportSearchData.user_ids.push(this.getAdditionalIBO())
      },
      removeMemberInSearch (user, index) {
        // make sure the error messages doesn't reappear after removing the text field to ensure validation consistency
        this.$v.dailySalesReportSearchData.user_ids.$reset()
        this.dailySalesReportSearchData.user_ids.splice(this.dailySalesReportSearchData.user_ids.indexOf(user), 1)
      },
      processForm () {
        this.$v.dailySalesReportSearchData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.dailySalesReportSearchData.$error) {
            this.dailySalesReportSearchData.from_date = this.formatDate(this.dailySalesReportSearchData.from_date, 'YYYY-MM-DD')
            this.dailySalesReportSearchData.to_date = this.formatDate(this.dailySalesReportSearchData.to_date, 'YYYY-MM-DD')
            let user_id_array = this.dailySalesReportSearchData.user_ids.map((user) => user.user_id)
            let query = {
              country_id: this.dailySalesReportSearchData.country_id,
              location_ids: this.dailySalesReportSearchData.location_ids,
              from_date: this.dailySalesReportSearchData.from_date,
              to_date: this.dailySalesReportSearchData.to_date,
              type: this.dailySalesReportSearchData.type,
              user_ids: user_id_array
            }
            this.getDailySalesReportAction(query).then((res) => {
              this.processRetrievedDocument(res)
              resolve(res)
            }).catch(error => {
              reject(error)
            })
          } else {
            this.setNotification({
              title: $t('bonus.yearlyIncome.notification.yearlyReportRequestFail.title'),
              message: $t('bonus.yearlyIncome.notification.yearlyReportRequestFail.message'),
              type: 'negative'
            })
            reject(this.$v.dailySalesReportSearchData.$error)
          }
        })
      },
      processRetrievedDocument (res) {
        let pdfUrl = res
        if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '' && pdfUrl.length > 0) {
          pdfUrl.forEach((pdf) => {
            if (pdf.download_link !== undefined && pdf.download_link !== null) {
              openURL(pdf.download_link)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
