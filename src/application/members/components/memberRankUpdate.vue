<template>
    <div class="general-page-holder relative-position">
        <div class="row">
            <div class="col-lg-12" v-show="show">
                <basic-form formName="updateMemberRankForm"
                            :backgroudColor="false"
                            formTitle="Member Rank Update"
                            v-bind:formFieldData="form"
                            urlResetPathName="Member Rank List"
                            formAction="updateMemberRankAction"
                            :formSubmit="processForm">
                    <template slot="form" slot-scope="props">
                        <div class="row gutter-xs justify-start"
                             v-if="typeof memberDetails !== 'undefined' && Object.keys(memberDetails).length > 1">
                            <div class="col-lg-5">
                                <q-card color="white text-black">
                                    <q-list>
                                        <q-item class="col-12">
                                            <q-item-side class="col-4">
                                                <q-item-tile sublabel>{{ $t('members.iboId.label') }}</q-item-tile>
                                            </q-item-side>
                                            <q-item-main class="col-8">
                                                <q-item-tile sublabel>
                                                    {{ memberDetails.details.user.old_member_id }}
                                                </q-item-tile>
                                            </q-item-main>
                                        </q-item>
                                        <q-item class="col-12">
                                            <q-item-side class="col-4">
                                                <q-item-tile sublabel>{{ $t('members.iboName.label') }}</q-item-tile>
                                            </q-item-side>
                                            <q-item-main class="col-8">
                                                <q-item-tile sublabel>{{ memberDetails.details.name
                                                    }}
                                                </q-item-tile>
                                            </q-item-main>
                                        </q-item>
                                        <q-item class="col-12">
                                            <q-item-side class="col-4">
                                                <q-item-tile sublabel>{{ $t('members.joinedDate.label') }}</q-item-tile>
                                            </q-item-side>
                                            <q-item-main class="col-8">
                                                <q-item-tile sublabel>
                                                    {{ formatDate(memberDetails.details.join_date) }}
                                                </q-item-tile>
                                            </q-item-main>
                                        </q-item>
                                        <q-item class="col-12">
                                            <q-item-side class="col-4">
                                                <q-item-tile sublabel>{{ $t('members.expiryDate.label') }}</q-item-tile>
                                            </q-item-side>
                                            <q-item-main class="col-8">
                                                <q-item-tile sublabel>
                                                    {{ formatDate(memberDetails.details.expiry_date)}}
                                                    <span v-if="checkDateValidity(memberDetails.details.expiry_date)"><q-icon
                                                            color="positive" name="check_circle"></q-icon></span>
                                                    <span v-else=""><q-icon color="negative"
                                                                            name="remove_circle"></q-icon></span>
                                                </q-item-tile>
                                            </q-item-main>
                                        </q-item>
                                        <q-item class="col-12">
                                            <q-item-side class="col-4">
                                                <q-item-tile sublabel>{{ $t('members.country.label') }}</q-item-tile>
                                            </q-item-side>
                                            <q-item-main class="col-8">
                                                <q-item-tile sublabel>
                                                    {{ memberDetails.details.country.name }}
                                                </q-item-tile>
                                            </q-item-main>
                                        </q-item>
                                    </q-list>
                                </q-card>
                            </div>
                            <div class="col-lg-7">
                                <q-card color="white text-black">
                                    <div class="row pd-15">
                                        <div class="col-lg-6">
                                            <div class="col-12 text-center">
                                                <div class="col-12 text-bold">
                                                    {{ $t('members.currentRanking.label') }}
                                                </div>
                                            </div>
                                            <hr>
                                            <div class="col-12 mt-20 mb-20">
                                                    <span class="current-rank-status-label">{{ $t('members.rankEnrollment.label')
                                                        }}</span>
                                                <div class="col-12 text-bold q-mt-xs">
                                                    {{ capitalizeFirst(memberDetails.details.enrollment_rank.rank_code)
                                                    }}
                                                </div>
                                            </div>
                                            <div class="col-12 mt-20 mb-20">
                                                    <span class="current-rank-status-label">{{ $t('members.rankHighest.label')
                                                        }}</span>
                                                <div class="col-12 text-bold q-mt-xs">
                                                    {{ memberDetails.details.highest_rank.rank_name
                                                    }}
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="col-12 text-center">
                                                <div class="col-12 text-bold">{{ $t('members.newRanking.label') }}</div>
                                            </div>
                                            <hr>
                                            <div class="col-12 mt-10 mb-20">
                                                <q-field
                                                        :error="setError('enrollment_rank_id','type.exp')"
                                                        :error-label="setError('enrollment_rank_id','type.msg')"
                                                >
                                                    <q-select clearable
                                                              filter
                                                              inverted-light
                                                              class="no-shadow custom-input-border"
                                                              color="white text-black"
                                                              :placeholder="$t('general.please.select.label')"
                                                              v-model="form.enrollment_rank_id"
                                                              :options="enrollment_ranks"
                                                    />
                                                </q-field>
                                            </div>
                                            <div class="col-12 mt-10 mb-20">
                                                <q-field
                                                        :error="setError('highest_rank_id','type.exp')"
                                                        :error-label="setError('highest_rank_id','type.msg')"
                                                >
                                                    <q-select clearable
                                                              filter
                                                              inverted-light
                                                              class="no-shadow custom-input-border"
                                                              color="white text-black"
                                                              :placeholder="$t('general.please.select.label')"
                                                              v-model="form.highest_rank_id"
                                                              :options="highest_ranks"
                                                    />
                                                </q-field>
                                            </div>
                                            <div class="col-12 mt-10 mb-20">
                                                <q-field
                                                        :helper="'*'"
                                                        :error="$v.form.cw_id.$error || setError('cw_id','type.exp')"
                                                        :error-label="$v.form.cw_id.$error ? 'Please select effective CW' : setError('cw_id','type.msg')">
                                                    <q-select clearable
                                                              filter
                                                              inverted-light
                                                              class="no-shadow custom-input-border"
                                                              color="white text-black"
                                                              :placeholder="$t('members.effective.cw.label')"
                                                              v-model="form.cw_id"
                                                              :options="commissionWeeks"
                                                    />
                                                </q-field>
                                            </div>
                                            <div class="col-12 mb-20">
                                                <q-field helper="*"
                                                         :error="$v.form.case_reference_number.$error || setError('case_reference_number','type.exp')"
                                                         :error-label="$v.form.case_reference_number.$error ? 'Please insert reference number' : setError('case_reference_number','type.msg')">
                                                    <q-input
                                                            :placeholder="$t('members.caseReference.label')"
                                                            inverted-light
                                                            class="no-shadow custom-input-border"
                                                            color="white text-black"
                                                            v-model="form.case_reference_number"
                                                            type="textarea"
                                                            :max-height="20"
                                                            :min-rows="3"
                                                    />
                                                </q-field>
                                            </div>
                                        </div>
                                    </div>
                                </q-card>
                            </div>
                        </div>
                    </template>
                </basic-form>
            </div>
        </div>
        <q-loader :visible="isProcessingForm || isProcessing"></q-loader>
        <errors-modal refs="errorsModal"></errors-modal>
    </div>
</template>
<script>
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {mapState, mapActions, mapMutations} from 'vuex'
  import {GeneralsMixin, DatesMixin, SetFormFieldErrorsMixin} from 'src/application/global/mixins/index'
  import {required} from 'vuelidate/lib/validators'

  export default {
    components: {
      basicForm,
      generalHeader,
      qLoader,
      errorsModal
    },
    mixins: [GeneralsMixin, DatesMixin, SetFormFieldErrorsMixin],
    data() {
      return {
        TitleLabel: 'Member Rank Update',
        show: false,
        enrollment_ranks: [],
        highest_ranks: [],
        cw_options: [],
        form: {
          enrollment_rank_id: '',
          highest_rank_id: '',
          cw_id: '',
          case_reference_number: '',
          user_id: ''
        }
      }
    },
    validations: {
      form: {
        cw_id: {
          required
        },
        case_reference_number: {
          required
        }
      }
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessing: state => state.globalCMP.isProcessing,
        membersHighestRankData: state => state.membersCMP.highestRankList.list,
        membersEnrollmentRankData: state => state.membersCMP.enrollmentRankList.list,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        memberDetails: state => state.membersCMP.memberData.data,
        userID: state => state.globalCMP.selectedFilters.userID,
        errors: state => state.globalCMP.errors.data
      })
    },
    mounted() {
      this.initSetupArea()
    },
    methods: {
      // declare vuex actions
      ...mapActions([
        'getMemberByUserIdAction',
        'getMemberListingAction',
        'getMemberListingSearchAction',
        'updateMemberRankAction',
        'getMemberHighestRankAction',
        'getMemberEnrollmentRankAction',
        'getCommissionWeekSearchAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      initSetupArea() {
        if (this.userID === '' || this.userID === null) {
          this.invalidRequest()
        } else {
          this.getCommissionWeeksData()
          this.getMemberData()
          this.getMemberHighestRanks()
          this.getMemberEnrollmentRanks()
          this.form.user_id = this.userID
        }
      },
      getMemberData() {
        let query = {
          user_id: this.userID
        }
        this.getMemberByUserIdAction(query).then(res => {
          this.show = true
        })
      },
      getMemberHighestRanks() {
        let query = {
          order: 'asc',
          sort: 'id'
        }
        this.getMemberHighestRankAction(query).then(res => {
          this.highest_ranks = this.membersHighestRankData
        })
      },
      getMemberEnrollmentRanks() {
        let query = {
          order: 'asc',
          sort: 'id'
        }
        this.getMemberEnrollmentRankAction(query).then(res => {
          this.enrollment_ranks = this.membersEnrollmentRankData
        })
      },
      getCommissionWeeksData() {
        let query = {
          filter_type: 'current_future',
          limit: 2
        }
        this.getCommissionWeekSearchAction(query)
      },
      // Process the form values
      processForm: function (formFieldData) {
        if (this.userID !== null && this.userID !== '') {
          this.$v.$touch()
          return new Promise((resolve, reject) => {
            if (!this.$v.$error) {
              this.updateMemberRankAction(this.removeFalsyValues(formFieldData)).then((response) => {
                resolve(response)
              }).catch(error => {
                if (typeof error.response !== 'undefined' && error.response.status === 422) {
                  this.openCloseModal({name: 'errorsModal', status: true})
                }
                if (typeof error.response !== 'undefined' && error.response.status === 500) {
                  this.setNotification({
                    title: 'Uh oh! An error occured',
                    message: error.response.status + '<br>' + error.response.statusText,
                    type: 'negative'
                  })
                }
                reject(error.response)
              })
            } else {
              this.setNotification({
                title: 'Member Update Failed',
                message: 'validation.failed',
                type: 'negative'
              })
              reject(this.$v.form.$error)
            }
          })
        }
      },
      invalidRequest() {
        this.$router.replace({name: 'Member Rank List'})
        setTimeout(() => {
          this.setIsProcessingForm(false)
        }, 1500)
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
      }
    }
  }
</script>