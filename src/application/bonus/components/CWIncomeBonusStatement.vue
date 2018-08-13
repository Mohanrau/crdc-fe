<template>
  <div class="general-page-holder">
    <basic-form formName="CWIncomeStatementForm"
                formTitle="CW Income Statement Form"
                :backgroudColor="false"
                v-bind:formFieldData="cwStatementSearchData"
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
            <div class="col-xl-4 col-lg-6 col-md-12 col-xs-12 gutter-sm">
              <q-field
                :label="$t('bonus.cwIncome.label.commissionWeek')"
                :error="$v.cwStatementSearchData.cw_name.$error || setError('cw_id','type.exp')"
                :error-label="setError('cw_id','type.exp') ? setError('cw_id','type.msg') : $t('bonus.cwIncome.errorMessage.selectCommissionWeek')"
              >
                  <q-select
                    v-model="cwStatementSearchData.cw_name"
                    :options="commissionWeeks"
                    filter
                    color="black"
                    clearable
                    :filterPlaceholder="$t('bonus.cwIncome.placeholder.selectCommissionWeek')"
                    @input="(item) => selected(item, null, 'cw')"
                  ></q-select>
              </q-field>
            </div>
            <div class="row gutter-sm col-lg-10 col-md-12 col-xs-12">
              <div class="col-12">
                <q-field
                  :error="$v.cwStatementSearchData.user_ids.$error && !$v.cwStatementSearchData.user_ids.required"
                  :error-label="$t('bonus.cwIncome.errorMessage.selectMember')"
                >
                  <q-list no-border class="col-12">
                    <q-field
                      :error="$v.cwStatementSearchData.user_ids.$error && !$v.cwStatementSearchData.user_ids.required"
                      :error-label="$t('bonus.cwIncome.errorMessage.selectMember')"
                    >
                      <q-list-header>{{$t('bonus.cwIncome.label.memberIDs')}}</q-list-header>
                      <q-item v-for="(user, index) in cwStatementSearchData.user_ids" :key="index">
                        <q-item-main>
                          <q-item-tile>
                            <q-field
                              :error="$v.cwStatementSearchData.user_ids.$each[index].$error || setError(''+user.user_id.toString(),'type.exp')"
                              :error-label="setError(user.user_id.toString(),'type.exp') ?  setError(user.user_id.toString(),'type.msg') : $t('bonus.cwIncome.errorMessage.selectMember')"
                            >
                              <q-input v-model="user.user_name"
                                       clearable
                                       :disable="user.hasUserSelected"
                                       :placeholder="$t('bonus.cwIncome.placeholder.searchMember')"
                                       @input="$v.cwStatementSearchData.user_ids.$each[index].$touch()"
                              >
                                <q-autocomplete @search="(terms, done) => search(terms, done, user, 'user_id')"
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
                </q-field>
              </div>
              <div class="col-12">
                <q-btn
                  flat
                  round
                  icon="add"
                  :disable="cwStatementSearchData.user_ids.length >= 10"
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
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import { openURL } from 'quasar'
  import { required, minLength } from 'vuelidate/lib/validators'
  import { mapActions, mapState, mapMutations } from 'vuex'

  export default {
    name: 'cw-income-bonus-statement',
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
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        errors: state => state.globalCMP.errors.data
      })
    },
    mounted: function () {
      this.getCommissionWeeksData()
    },
    data: () => ({
      cwStatementSearchData: {
        cw_id: '',
        cw_name: '',
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
      cwStatementSearchData: {
        cw_name: {
          required
        },
        user_ids: {
          required,
          minLength: minLength(1),
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
        'getCommissionWeekSearchAction',
        'getCWIncomeStatementAction',
        'getMemberSearchAction'
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
      selected (item, user, field, keyboard) {
        if (!keyboard) {
          this[field] = item.sublabel
          if (field === 'user_id') {
            user.user_id = item.userID
            user.user_name = item.label
            user.hasUserSelected = true
          } else if (field === 'cw') {
            this.cwStatementSearchData.cw_id = item
            this.$v.cwStatementSearchData.cw_name.$touch()
          }
          this.togglePopupSearch = true
        }
      },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'past',
          limit: 15,
          sort: 'date_from',
          order: 'desc'
        }
        this.getCommissionWeekSearchAction(query)
      },
      getAdditionalIBO () {
        return {
          user_id: '',
          user_name: '',
          hasUserSelected: false
        }
      },
      addMemberInSearch () {
        this.cwStatementSearchData.user_ids.push(this.getAdditionalIBO())
      },
      removeMemberInSearch (user, index) {
        // make sure the error messages doesn't reappear after removing the text field to ensure validation consistency
        this.$v.cwStatementSearchData.user_ids.$reset()
        this.cwStatementSearchData.user_ids.splice(this.cwStatementSearchData.user_ids.indexOf(user), 1)
      },
      resetForm () {
        this.cwStatementSearchData.cw_id = ''
        this.cwStatementSearchData.cw_name = ''
        this.cwStatementSearchData.user_ids = []
      },
      processForm () {
        this.$v.cwStatementSearchData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.cwStatementSearchData.$error) {
            this.getCWIncomeStatementAction(this.cwStatementSearchData).then((res) => {
              let pdfUrl = res
              if (pdfUrl !== undefined && pdfUrl !== null && pdfUrl !== '' && pdfUrl.length > 0) {
                pdfUrl.forEach((pdf) => {
                  if (pdf.download_link !== undefined && pdf.download_link !== null) {
                    pdf.download_link.forEach((download_link) => {
                      openURL(download_link.download_link)
                    })
                  }
                })
              }
            }).catch(error => {
              reject(error)
            })
          } else {
            this.setNotification({
              title: $t('bonus.cwIncome.notification.incomeReportRequestFail.title'),
              message: $t('bonus.cwIncome.notification.incomeReportRequestFail.message'),
              type: 'negative'
            })
            reject(this.$v.cwStatementSearchData.$error)
          }
        })
      }
    }
  }
</script>
