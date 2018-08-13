<template>
    <div class="general-page-holder relative-position">
        <div class="row">
            <div class="col-lg-12">
                <basic-form formName="updateMemberRankAction"
                            formTitle="Member Migration Update"
                            v-bind:formFieldData="form"
                            urlResetPathName="Member Migration"
                            formAction="updateMemberMigrationAction"
                            :formSubmit="processForm">
                    <template slot="form" slot-scope="props">
                        <div class="row wrap gutter-xs justify-start">
                            <div class="col-lg-5" v-if="typeof memberDetails !== 'undefined' && typeof memberDetails.details !== 'undefined' && Object.keys(memberDetails).length > 1">
                                <q-card class="bg-white">
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
                                                <q-item-tile sublabel>{{ memberDetails.details.name }}
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
                                                <q-item-tile sublabel v-if="memberDetails.details.country">
                                                    {{ memberDetails.details.country.name }}
                                                </q-item-tile>
                                            </q-item-main>
                                        </q-item>
                                    </q-list>
                                </q-card>
                            </div>
                            <div class="col-lg-7 col-md-12 col-xs-12">
                                <q-card class="bg-white">
                                    <div class="row pd-20">
                                        <div class="col-lg-4"
                                             v-if="typeof memberDetails !== 'undefined' && typeof memberDetails.details !== 'undefined' && Object.keys(memberDetails).length > 1">
                                            <div class="col-12 text-bold">{{ $t('members.currentCountry.label') }}</div>
                                            <div class="col-12 q-mt-md">
                                                <span>
                                                    <q-chip square color="dark">{{ memberDetails.details.country.name }}</q-chip>
                                                </span>
                                            </div>
                                        </div>
                                        <div class="col-lg-8">
                                            <div class="col-12 text-bold">{{ $t('members.newCountry.label') }}</div>
                                            <div class="col-12 q-mt-md">
                                                <q-field
                                                        :helper="'*'"
                                                        :error="$v.form.country_id.$error || setError('country_id','type.exp')"
                                                        :error-label="$v.form.country_id.$error ? 'Please select country' : setError('country_id','type.msg')">
                                                    <q-select clearable
                                                              filter
                                                              inverted-light
                                                              class="no-shadow custom-input-border"
                                                              color="white text-black"
                                                              :placeholder="$t('general.select.country')"
                                                              v-model="form.country_id"
                                                              :options="countriesOptions.options"
                                                    />
                                                </q-field>
                                            </div>
                                            <div class="col-12">
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
                                            <div class="col-12">
                                                <q-field
                                                        :helper="'*'"
                                                        :error="$v.form.reason_id.$error || setError('reason_id','type.exp')"
                                                        :error-label="$v.form.reason_id.$error ? 'Please select reason' : setError('reason_id','type.msg')">
                                                    <q-select
                                                            clearable
                                                            inverted-light
                                                            class="no-shadow custom-input-border"
                                                            color="white text-black"
                                                            :placeholder="$t('members.reason.label')"
                                                            v-model="form.reason_id"
                                                            :options="masterDataOptionsCreator('member_migrate_reason')"
                                                    />
                                                </q-field>
                                            </div>
                                            <div class="col-12">
                                                <q-field
                                                        :helper="'*'"
                                                        :error="$v.form.case_reference_number.$error || setError('case_reference_number','type.exp')"
                                                        :error-label="$v.form.case_reference_number.$error ? 'Please insert reference number' : setError('case_reference_number','type.msg')">
                                                    <q-input
                                                            inverted-light
                                                            class="no-shadow custom-input-border"
                                                            color="white text-black"
                                                            v-model="form.case_reference_number"
                                                            type="textarea"
                                                            :placeholder="$t('members.caseReference.label')"
                                                            :max-height="50"
                                                            :min-rows="5"
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
  import { required } from 'vuelidate/lib/validators'
  import {
    MasterDataTransformarMixin,
    DatesMixin,
    GeneralsMixin,
    SetFormFieldErrorsMixin
  } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    components: {
      basicForm,
      generalHeader,
      qLoader
    },
    mixins: [MasterDataTransformarMixin, DatesMixin, GeneralsMixin, SetFormFieldErrorsMixin],
    data () {
      return {
        TitleLabel: 'members.migrationUpdate.title',
        terms: '',
        form: {
          country_id: '',
          cw_id: '',
          reason_id: '',
          case_reference_number: '',
          user_id: ''
        }
      }
    },
    validations: {
      form: {
        country_id: {
          required
        },
        cw_id: {
          required
        },
        reason_id: {
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
        membersTreeSearchData: state => state.membersCMP.memberSearchData,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        userID: state => state.globalCMP.selectedFilters.userID,
        errors: state => state.globalCMP.errors.data,
        commissionWeeks: state => state.globalCMP.commissionWeeks.list,
        memberDetails: state => state.membersCMP.memberData.data
      })
    },
    mounted () {
      this.master.keys = [
        'member_migrate_reason'
      ]
      this.initSetupArea()
    },
    methods: {
      // declare vuex actions
      ...mapActions([
        'getMemberByUserIdAction',
        'getMemberListingAction',
        'getMemberListingSearchAction',
        'updateMemberDetailsAction',
        'getCountriesAction',
        'updateMemberMigrationAction',
        'getCommissionWeekSearchAction']),
      ...mapMutations({
        setIsProcessingForm: 'IS_PROCESSING_FORM',
        setNotification: 'SHOW_NOTIFICATION'
      }),
      initSetupArea () {
        if (this.userID === '' || this.userID === null) {
          this.invalidRequest()
        } else {
          this.getMemberData()
          this.getCountriesAction()
          this.getCommissionWeeksData()
          this.form.user_id = this.userID
        }
      },
      getCommissionWeeksData () {
        let query = {
          filter_type: 'current_future',
          limit: 2
        }
        this.getCommissionWeekSearchAction(query)
      },
      getMemberData () {
        if (this.userID !== null && this.userID !== '') {
          let query = {
            user_id: this.userID
          }
          this.getMemberByUserIdAction(query).then(res => {
            this.membersDetails = res.member_data
          })
        }
      },
      processForm: function (formFieldData) {
        this.$v.form.$touch()
        if (this.userID !== null && this.userID !== '') {
          return new Promise((resolve, reject) => {
            if (!this.$v.form.$error) {
              this.updateMemberMigrationAction(formFieldData).then((response) => {
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
      invalidRequest () {
        this.$router.replace({name: 'Member Migration'})
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