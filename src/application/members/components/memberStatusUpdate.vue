<template>
    <div class="general-page-holder relative-position">
        <div class="row">
            <div class="col-lg-12">
                <basic-form formName="updateMemberStatusAction"
                            formTitle="Member Status Update"
                            :backgroudColor="false"
                            v-bind:formFieldData="form"
                            urlResetPathName="Member Status"
                            formAction="updateMemberDetailsAction"
                            :formSubmit="processForm">
                    <template slot="form" slot-scope="props"
                              v-if="typeof memberDetails !== 'undefined' && Object.keys(memberDetails).length > 1">
                        <div class="row gutter-xs justify-start">
                            <div class="col-lg-5">
                                <q-card class="bg-white text-black">
                                    <q-list>
                                        <q-item class="col-12">
                                            <q-item-side class="col-4">
                                                <q-item-tile sublabel>{{ $t('members.iboId.label') }}</q-item-tile>
                                            </q-item-side>
                                            <q-item-main class="col-8">
                                                <q-item-tile sublabel>
                                                    {{ memberDetails.details.country.code
                                                    }}-{{ memberDetails.details.user.old_member_id }}
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
                                                    {{ memberDetails.details.join_date }}
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
                                <q-card class="bg-white">
                                    <div class="row pd-20">
                                        <div class="col-lg-4">
                                            <div class="col-12">
                                                <div class="col-12 text-bold q-mb-md">{{ $t('members.current.status.label') }}</div>
                                                <q-chip square color="dark">
                                                    {{ capitalizeFirst(memberDetails.details.status.title) }}</q-chip>
                                            </div>
                                            <div class="col-12" v-if="getMasterDataIdByKeyAndTitle('member_status', $const.masterKey.TERMINATED) === form.status_id ">
                                                <div class="col-12 text-bold q-mt-md q-mb-md">{{ $t('members.suspend.duration.label') }}</div>
                                                <p class="medium">{{ suspend_text }}</p>
                                            </div>
                                        </div>
                                        <div class="col-lg-8 q-mb-md">
                                            <div class="col-12 text-bold q-mb-md">{{ $t('members.newCountry.label') }}</div>
                                            <div class="col-12">
                                                <q-field helper="*"
                                                         :error="$v.form.status_id.$error || setError('status_id','type.exp')"
                                                         :error-label="$v.form.status_id.$error ? 'Please select status' : setError('status_id','type.msg')">
                                                    <q-select
                                                            :placeholder="$t('members.new.status.label')"
                                                            inverted-light
                                                            class="no-shadow custom-input-border"
                                                            color="white text-black"
                                                            :options="masterDataOptionsCreator('member_status')"
                                                            v-model="form.status_id"
                                                            clearable
                                                    />
                                                </q-field>
                                            </div>
                                            <div class="col-12 mb-20">
                                                <q-field helper="*"
                                                         :error="$v.form.effective_date.$error || setError('effective_date','type.exp')"
                                                         :error-label="$v.form.effective_date.$error ? 'Please select effective date' : setError('effective_date','type.msg')">
                                                    <q-datetime :placeholder="$t('members.effective.date.label')"
                                                                inverted-light
                                                                class="no-shadow custom-input-border"
                                                                color="white text-black"
                                                                @input="getSuspendedDateDifference()"
                                                                v-model="form.effective_date"/>
                                                </q-field>
                                            </div>
                                            <div class="col-12 mb-20">
                                                <q-field helper="*"
                                                         :label-width="12"
                                                         label="Bonus Payout Deferment"
                                                         :error="setError('bonus_payout_deferment','type.exp')"
                                                         :error-label="setError('bonus_payout_deferment','type.msg')"
                                                >
                                                    <q-radio v-model="form.bonus_payout_deferment"
                                                             @change="getCWvalueCheckIn" val="1" color="secondary"
                                                             label="Yes"/>
                                                    <q-radio v-model="form.bonus_payout_deferment" val="0"
                                                             @change="getCWvalueCheckIn" color="secondary" label="No"
                                                             style="margin-left: 10px"/>
                                                </q-field>
                                            </div>
                                            <div class="col-12" v-if="showCwField">
                                                <q-field
                                                        :helper="'*'"
                                                        :error="setError('cw_id','type.exp')"
                                                        :error-label="setError('cw_id','type.msg')">
                                                    <q-select clearable
                                                              filter
                                                              inverted-light
                                                              class="no-shadow custom-input-border"
                                                              color="white text-black"
                                                              :placeholder="$t('members.effective.cw.label')"
                                                              v-model="cw_id"
                                                              :options="commissionWeeks"
                                                              @keyup.enter="submit"
                                                    />
                                                </q-field>
                                            </div>
                                            <div class="col-12 mt-10 mb-20">
                                                <q-field helper="*"
                                                         :error="$v.form.reason_id.$error || setError('reason_id','type.exp')"
                                                         :error-label="$v.form.reason_id.$error ? 'Please select reason' : setError('reason_id','type.msg')">
                                                    <q-select
                                                            clearable
                                                            inverted-light
                                                            class="no-shadow custom-input-border"
                                                            color="white text-black"
                                                            :placeholder="$t('members.reason.label')"
                                                            :options="masterDataOptionsCreator('member_status_update_reason')"
                                                            v-model="form.reason_id"
                                                            @change=""
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
                                                            :max-height="30"
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
        <q-loader :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import basicForm from 'src/application/global/components/common/forms/basicForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import errorsModal from 'src/application/global/components/common/modal/errorsModal'
  import { mapState, mapActions, mapMutations } from 'vuex'
  import {
    GeneralsMixin,
    MasterDataTransformarMixin,
    SetFormFieldErrorsMixin,
    DatesMixin
  } from 'src/application/global/mixins/index'
  import { required } from 'vuelidate/lib/validators'

  export default {
    components: {
      basicForm,
      generalHeader,
      qLoader,
      errorsModal
    },
    mixins: [GeneralsMixin, MasterDataTransformarMixin, SetFormFieldErrorsMixin, DatesMixin],
    data () {
      return {
        TitleLabel: 'Member Status Update',
        memberCode: '',
        terms: '',
        suspend_text: '0',
        cw_id: '',
        form: {
          status_id: '',
          case_reference_number: '',
          effective_date: '',
          reason_id: '',
          bonus_payout_deferment: '0',
          user_id: ''
        },
        showCwField: false
      }
    },
    validations: {
      form: {
        status_id: {
          required
        },
        case_reference_number: {
          required
        },
        effective_date: {
          required
        },
        reason_id: {
          required
        }
      }
    },
    computed: {
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        selectedFilters: state => state.globalCMP.selectedFilters,
        userID: state => state.globalCMP.selectedFilters.userID,
        membersTreeSearchData: state => state.membersCMP.memberSearchData,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        memberDetails: state => state.membersCMP.memberData.data,
        errors: state => state.globalCMP.errors.data
      })
    },
    mounted () {
      this.master.keys = [
        'member_status',
        'member_status_update_reason'
      ]
      this.initSetupArea()
    },
    methods: {
      // declare vuex actions
      ...mapActions([
        'getMemberByUserIdAction',
        'getMemberListingAction',
        'getMemberListingSearchAction',
        'updateMemberStatusAction',
        'getCommissionWeekSearchAction'
      ]),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      initSetupArea () {
        if (this.userID === '' || this.userID === null) {
          this.invalidRequest()
        } else {
          this.getCommissionWeeksData()
          this.getMemberData()
          this.form.user_id = this.userID
        }
      },
      getMemberData () {
        let query = {
          user_id: this.selectedFilters.userID
        }
        this.getMemberByUserIdAction(query)
      },
      getSuspendedDateDifference () {
        if (this.getMasterDataIdByKeyAndTitle('member_status', this.$const.masterKey.TERMINATED) === this.form.status_id && this.form.effective_date !== '') {
          this.suspend_text = this.getDateDiff(this.formatDate(this.form.effective_date, 'YYYY-MM-DD'), null, 'days', true)
        }
      },
      getCWvalueCheckIn () {
        if (this.form.bonus_payout_deferment === '1') {
          this.showCwField = true
        } else {
          this.showCwField = false
        }
      },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'current_future',
          limit: 2
        }
        this.getCommissionWeekSearchAction(query)
      },
      processForm: function (formFieldData) {
        if (this.userID !== null && this.userID !== '') {
          this.$v.$touch()
          return new Promise((resolve, reject) => {
            if (!this.$v.$error) {
              this.updateMemberStatusAction(formFieldData).then((response) => {
                resolve(response)
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
      invalidRequest () {
        this.$router.replace({name: 'Member Status'})
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
