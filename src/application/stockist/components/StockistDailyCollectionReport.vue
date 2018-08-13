<template>
  <div class="general-page-holder">
    <basic-form formName="DailyCollectionReportForm"
                formTitle="Daily Collection Report Form"
                :backgroudColor="false"
                v-bind:formFieldData="dailyCollectionSearchData"
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
                  v-model="dailyCollectionSearchData.country_id"
                  :options="countriesOptions.options"
                  @input="salesCountryChange"
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
                  v-model="dailyCollectionSearchData.location_ids"
                  :options="locationsOptionsByCountry"
                />
              </q-field>
            </div>
            <div class="col-12">
              <div class="row gutter-xs">
                <div class="col-lg-6 col-xs-12">
                  <q-field
                    label-width="6"
                    label="Collection Date From"
                    :error="$v.dailyCollectionSearchData.collection_from_date.$error"
                    error-label="Collection date from must be before transaction date to"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="dailyCollectionSearchData.collection_from_date"
                                />
                  </q-field>
                </div>
                <div class="col-lg-6 col-xs-12">
                  <q-field
                    label-width="6"
                    label="  To"
                    :error="$v.dailyCollectionSearchData.collection_to_date.$error"
                    error-label="Collection Date to must be later than transaction date from, and cannot be future date"
                  >
                    <q-datetime align="left" monday-first format="DD-MM-YYYY"
                                v-model="dailyCollectionSearchData.collection_to_date"
                                />
                  </q-field>
                </div>
              </div>
            </div>
            <div class="col-12">
              <q-field
                label-width="3"
                label="User"
              >
                <div class="row gutter-xs">
                  <div class="col-11">
                    <q-input
                      v-model="dailyCollectionSearchData.user_name"
                      clearable
                      :disable="dailyCollectionSearchData.hasUserSelected"
                      :placeholder="$t('bonus.yearlyIncome.placeholder.searchMember')"
                    >
                      <q-autocomplete
                        @search="(terms, done) => search(terms, done, 'user_id')"
                        @selected="(item, keyboard) => selected(item, 'user_id', keyboard)"
                      />
                    </q-input>
                  </div>
                  <div class="col-1">
                    <q-btn
                      icon="remove"
                      round
                      small
                      @click="removeMemberInSearch()"
                    ></q-btn>
                  </div>
                </div>
              </q-field>
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
  import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { DatesMixin,MasterDataTransformarMixin } from 'src/application/global/mixins/index'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    name: "sales-daily-reciept-report",
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
      this.dailyCollectionSearchData.country_id = this.selectedFilters.countryID
      this.dailyCollectionSearchData.collection_from_date = this.getCurrentDate()
      this.dailyCollectionSearchData.collection_to_date = this.getCurrentDate()
      this.master.keys = [this.$const.masterKey.YEARLY_REPORT_TYPE]
      this.getCountriesAction()
      this.generateYearSelection()
      let query1 = {
        country_id: this.selectedFilters.countryID,
        relations: ['entity.locations']
      }
      this.getCountryRelationAction(query1)
    },
    data: () => ({
      years: [],
      dailyCollectionSearchData: {
        country_id: '',
        location_ids: [],
        collection_from_date: '',
        collection_to_date: '',
        user_id: null,
        user_name: '',
        hasUserSelected: false
      }
    }),
    validations: {
      dailyCollectionSearchData: {
        country_id: {
          required
        },
        collection_from_date: {
          isInRange (val, elm) {
            if (elm && val !== '') {
              let diff = this.getDateDiff(elm.collection_to_date, val, 'days')
              if (diff < 0) {
                return false
              }
            }
            return true
          }
        },
        collection_to_date: {
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
        }
      }
    },
    methods: {
      ...mapActions([
        'getCountriesAction',
        'getMemberSearchAction',
        'getDailyCollectionReport',
        'getCountryRelationAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION',
        setFilterData: 'SET_FILTER_DATA',
        unSetFilterData: 'UNSET_FILTER_DATA'
      }),
      search (terms, done, field) {
        if (field === 'user_id') {
          let query = {
            search_text: this.dailyCollectionSearchData.user_name,
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
      selected (item, field, keyboard) {
        if (!keyboard) {
          this[field] = item.sublabel
          if (field === 'user_id') {
            this.dailyCollectionSearchData.user_id = item.userID
            this.dailyCollectionSearchData.user_name = item.label
            this.dailyCollectionSearchData.hasUserSelected = true
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
      removeMemberInSearch () {
        // make sure the error messages doesn't reappear after removing the text field to ensure validation consistency
        this.dailyCollectionSearchData.user_id = null
        this.dailyCollectionSearchData.user_name = ''
        this.dailyCollectionSearchData.hasUserSelected = false
      },
      salesCountryChange () {
        let getCountryName = this.countriesOptions.options.filter(item => item.value === this.dailyCollectionSearchData.country_id)
        if (getCountryName.length > 0) {
          this.setFilterData({
            countryID: this.dailyCollectionSearchData.country_id,
            filterCountryName: getCountryName[0].label,
            filterCountryCode: getCountryName[0].code
          })
        }
        if (this.dailyCollectionSearchData.country_id > 0) {
          this.dailyCollectionSearchData.location_ids = []
          let query1 = {
            country_id: this.dailyCollectionSearchData.country_id,
            relations: ['entity.locations']
          }
          this.getCountryRelationAction(query1)
        }
      },
      processForm () {
        this.$v.dailyCollectionSearchData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.dailyCollectionSearchData.$error) {
            let query = {
              country_id: this.dailyCollectionSearchData.country_id,
              location_ids: this.dailyCollectionSearchData.location_ids,
              collection_from_date: this.formatDate(this.dailyCollectionSearchData.collection_from_date, 'YYYY-MM-DD'),
              collection_to_date: this.formatDate(this.dailyCollectionSearchData.collection_to_date, 'YYYY-MM-DD')
            }
            if (this.dailyCollectionSearchData.user_id !== '' && this.dailyCollectionSearchData.user_id !== null) {
              query.user_id = this.dailyCollectionSearchData.user_id
            }
            this.getDailyCollectionReport(query).then((res) => {
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
              title: $t('bonus.yearlyIncome.notification.yearlyReportRequestFail.title'),
              message: $t('bonus.yearlyIncome.notification.yearlyReportRequestFail.message'),
              type: 'negative'
            })
            reject(this.$v.dailyCollectionSearchData.$error)
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
