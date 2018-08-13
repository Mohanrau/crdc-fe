<template>
    <div class="general-page-holder">
        <basic-form formName="YearlyIncomeReportsForm"
                    formTitle="Yearly Income Reports Form"
                    :backgroudColor="false"
                    v-bind:formFieldData="yearlyReportSearchData"
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
                        <div class="col-xl-6 col-lg-6 col-md-12 col-xs-12 gutter-sm">
                            <q-field
                                    :label="$t('bonus.yearlyIncome.label.reportType')"
                                    :error="$v.yearlyReportSearchData.report_type.$error || setError('yearlyReportSearchData','type.exp')"
                                    :error-label="setError('yearlyReportSearchData','type.exp') ? setError('yearlyReportSearchData','type.msg') : $t('bonus.yearlyIncome.errorMessage.selectReportType')"
                            >
                                <q-select
                                        v-model="yearlyReportSearchData.report_type"
                                        :options="masterDataOptionsCreator(this.$const.masterKey.YEARLY_REPORT_TYPE)"
                                        filter
                                        color="black"
                                        clearable
                                        :filterPlaceholder="$t('bonus.yearlyIncome.placeholder.pleaseSelectReportYear')"
                                        @change="(item) => selected(item, null, 'cw')"
                                ></q-select>
                            </q-field>
                            <q-field
                                    :label="$t('bonus.yearlyIncome.label.country')"
                                    :error="$v.yearlyReportSearchData.country_id.$error || setError('country_id','type.exp')"
                                    :error-label="setError('country_id','type.exp') ? setError('country_id','type.msg') : $t('bonus.yearlyIncome.errorMessage.selectCountry')"
                            >
                                <q-select
                                        clearable
                                        ref="salesCountrySelector"
                                        color="black"
                                        v-model="yearlyReportSearchData.country_id"
                                        :options="countriesOptions.options"
                                        :ok-label="$t('Common.Choose.Btn')"
                                        :cancel-label="$t('Common.Close.Btn')"
                                        :title="$t('general.select.country')"
                                        :message="$t('general.select.country.text')"
                                ></q-select>
                            </q-field>
                            <q-field
                                    :label="$t('bonus.yearlyIncome.label.year')"
                                    :error="$v.yearlyReportSearchData.year.$error || setError('year','type.exp')"
                                    :error-label="setError('year','type.exp') ? setError('year','type.msg') : $t('bonus.yearlyIncome.errorMessage.pleaseSelectReportYear')"
                            >
                                <q-select
                                        v-model="yearlyReportSearchData.year"
                                        :options="years"
                                        filter
                                        color="black"
                                        clearable
                                        :filterPlaceholder="$t('bonus.yearlyIncome.placeholder.pleaseSelectReportYear')"
                                        @change="(item) => selected(item, null, 'cw')"
                                ></q-select>
                            </q-field>
                        </div>
                        <div class="row gutter-sm col-lg-10 col-md-12 col-xs-12">
                            <q-list no-border class="col-12">
                                <q-field
                                        :error="$v.yearlyReportSearchData.user_ids.$error && !$v.yearlyReportSearchData.user_ids.required"
                                        :error-label="$t('bonus.yearlyIncome.errorMessage.selectMember')"
                                >
                                  <q-list-header>{{$t('bonus.yearlyIncome.label.memberIDs')}}</q-list-header>
                                    <q-item v-for="(user, index) in yearlyReportSearchData.user_ids" :key="index">
                                        <q-item-main>
                                            <q-item-tile>
                                                <q-field
                                                        :error="$v.yearlyReportSearchData.user_ids.$each[index].$error || setError(user.user_id,'type.exp')"
                                                        :error-label="setError(user.user_id,'type.exp') ?  setError(user.user_id,'type.msg') : 'Please select a member'"
                                                >
                                                    <q-input v-model="user.user_name"
                                                             clearable
                                                             :disable="user.hasUserSelected"
                                                             :placeholder="$t('bonus.yearlyIncome.placeholder.searchMember')"
                                                             @change="$v.yearlyReportSearchData.user_ids.$each[index].$touch()"
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
                                        :disable="yearlyReportSearchData.user_ids.length >= 10"
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
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import { mapActions, mapState, mapMutations } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { MasterDataTransformarMixin } from 'src/application/global/mixins/index'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'

  export default {
    name: 'cw-income-bonus-statement',
    mixins: [setFormFieldErrorsMixin, MasterDataTransformarMixin],
    components: {
      genaralHeader,
      basicForm,
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        errors: state => state.globalCMP.errors.data
      })
    },
    mounted: function () {
      this.master.keys = [this.$const.masterKey.YEARLY_REPORT_TYPE]
      this.getCountriesAction()
      this.generateYearSelection()
    },
    data: () => ({
      years: [],
      yearlyReportSearchData: {
        report_type: '',
        country_id: '',
        year: '',
        user_ids: [
          {
            user_id: '',
            user_name: '',
            hasUserSelected: false
          }
        ]
      }
    }),
    validations: {
      yearlyReportSearchData: {
        report_type: {
          required
        },
        country_id: {
          required
        },
        year: {
          required
        },
        user_ids: {
          required,
          minLength: minLength(1),
          $each: {
            user_name: {
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
        'getYearlyIncomeReportAction'
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
        this.yearlyReportSearchData.user_ids.push(this.getAdditionalIBO())
      },
      removeMemberInSearch (user, index) {
        // make sure the error messages doesn't reappear after removing the text field to ensure validation consistency
        this.$v.yearlyReportSearchData.user_ids.$reset()
        this.yearlyReportSearchData.user_ids.splice(this.yearlyReportSearchData.user_ids.indexOf(user), 1)
      },
      processForm () {
        this.$v.yearlyReportSearchData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.yearlyReportSearchData.$error) {
            this.getYearlyIncomeReportAction(this.yearlyReportSearchData).then((res) => {
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
            reject(this.$v.yearlyReportSearchData.$error)
          }
        })
      }
    }
  }
</script>
