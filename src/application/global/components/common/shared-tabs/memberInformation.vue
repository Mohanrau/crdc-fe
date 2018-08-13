<template>
    <div class="information-tab">
        <div class="row gutter-sm">
            <div class="col-lg-6">
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.PreferredLanguage')"
                             :helper="'*'"
                             :error="validation.information.language_id.$error"
                             :error-label="$t('members.selectLanguage.errorLabel')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.language_id"
                                  :options="languageOptions.options"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm">
                    <q-field :label="$t('members.information.gender')"
                             :helper="'*'"
                             :error="validation.information.gender_id.$error"
                             :error-label="$t('members.gender.errorLabel')">
                        <q-option-group
                                inline
                                color="secondary"
                                type="radio"
                                v-model="memberData.information.gender_id"
                                :options="masterDataOptionsCreator('gender')"/>
                    </q-field>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.salutation')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.salutation_id"
                                  :options="masterDataOptionsCreator('salutation')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.ethnic')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.ethnic_group_id"
                                  :options="masterDataOptionsCreator('ethnic_group')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.religion')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.religion_id"
                                  :options="masterDataOptionsCreator('religion')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.marital')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  ref="maritalStatus"
                                  @input="checkMaritalDependency"
                                  v-model="memberData.information.martial_status_id"
                                  :options="masterDataOptionsCreator('martial_status')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div v-if="maritalDependency" class="col-12 q-ma-sm">
                    <q-field :label="$t('members.information.spouseElkenMember')">
                        <q-option-group
                                inline
                                color="secondary"
                                type="radio"
                                v-model="memberData.information.spouse.spouse_elken_member"
                                :options="[
                              {label: 'Yes', value: 1},
                              {label: 'No', value: 0}
                              ]"/>
                    </q-field>
                </div>
                <div class="marital-status-dependency" v-show="memberData.information.spouse.spouse_elken_member">
                    <div class="col-12 q-ma-sm">
                        <q-field :helper="'*'"
                                 :label="$t('members.information.spouseName')"
                                 :error="validation.information.spouse.spouse_name.$error"
                                 error-label="Please input value">
                            <q-input inverted-light
                                     class="no-shadow custom-input-border"
                                     color="white text-black"
                                     v-model="memberData.information.spouse.spouse_name"
                            />
                        </q-field>
                    </div>
                    <div class="col-12 q-ma-sm">
                        <q-field :helper="'*'"
                                 :label="$t('members.information.spouseIboId')"
                                 :error="validation.information.spouse.spouse_ibo_id.$error"
                                 error-label="Please input value">
                            <q-input inverted-light
                                     class="no-shadow custom-input-border"
                                     color="white text-black"
                                     v-model="memberData.information.spouse.spouse_ibo_id"
                            />
                        </q-field>
                    </div>
                    <div class="col-12 q-ma-sm relative-position">
                        <q-field
                                :helper="'*'"
                                :error="validation.information.spouse.ic_pass_type_id.$error || validation.information.spouse.ic_pass_type_number.$error"
                                :label="$t('members.icPassportSpouse.label')"
                                error-label="Please select type / Input value"
                        >
                            <div class="row gutter-xs">
                                <div class="col-12">
                                    <q-select clearable
                                              inverted-light
                                              class="no-shadow custom-input-border"
                                              color="white text-black"
                                              v-model="memberData.information.spouse.ic_pass_type_id"
                                              :options="masterDataOptionsCreator('ic_passport_type')"
                                    />
                                </div>
                                <div class="col-12">
                                    <q-input :disable="memberData.information.spouse.ic_pass_type_id === ''"
                                             inverted-light
                                             class="no-shadow custom-input-border"
                                             color="white text-black"
                                             v-model="memberData.information.spouse.ic_pass_type_number"/>
                                </div>
                            </div>
                        </q-field>
                        <q-loader :visible="isProcessingSection"></q-loader>
                    </div>
                </div>

                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.education')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.education_id"
                                  :options="masterDataOptionsCreator('education')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.occupation')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.occupation_id"
                                  :options="masterDataOptionsCreator('occupation')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.industry')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.industry_id"
                                  :options="masterDataOptionsCreator('industry')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.salaryRange')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.salary_range_id"
                                  :options="masterDataOptionsCreator('salary_range')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.annualRevenue')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.information.annual_revenue_id"
                                  :options="masterDataOptionsCreator('annual_revenue')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
            </div>
            <div class="col-lg-6">
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.PreferredContact')"
                             :helper="'*'"
                             :error="validation.contact_info.preferred_contact_id.$error"
                             :error-label="$t('members.PreferredContact.errorLabel')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  v-model="memberData.contact_info.preferred_contact_id"
                                  :options="masterDataOptionsCreator('preferred_contact')"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field
                            :helper="'*'"
                            :label="$t('members.information.mobile1')"
                            :error="validation.contact_info.mobile_1_country_code_id.$error || validation.contact_info.mobile_1_num.$error"
                            error-label="Please select type / Input value"
                    >
                        <div class="row gutter-xs">
                            <div class="col-6">
                                <q-select clearable
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          v-model="memberData.contact_info.mobile_1_country_code_id"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-6">
                                <q-input :disable="memberData.contact_info.mobile_1_country_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.contact_info.mobile_1_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.mobile2')">
                        <div class="row gutter-xs">
                            <div class="col-6">
                                <q-select clearable
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          v-model="memberData.contact_info.mobile_2_country_code_id"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-6">
                                <q-input :disable="memberData.contact_info.mobile_2_country_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.contact_info.mobile_2_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.phone1')">
                        <div class="row gutter-xs">
                            <div class="col-6">
                                <q-select clearable
                                          v-model="memberData.contact_info.tel_office_1_country_code_id"
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-6">
                                <q-input :disable="memberData.contact_info.tel_office_1_country_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.contact_info.tel_office_1_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.phone2')">
                        <div class="row gutter-xs">
                            <div class="col-6">
                                <q-select clearable
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          v-model="memberData.contact_info.tel_office_2_country_code_id"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-6">
                                <q-input :disable="memberData.contact_info.tel_office_2_country_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.contact_info.tel_office_2_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.fax')">
                        <div class="row gutter-xs">
                            <div class="col-6">
                                <q-select clearable
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          v-model="memberData.contact_info.fax_country_code_id"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-6">
                                <q-input :disable="memberData.contact_info.fax_country_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.contact_info.fax_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm">
                    <q-field :label="$t('members.information.email')">
                        <q-input readonly
                                 inverted-light
                                 class="no-shadow custom-input-border"
                                 color="white text-black"
                                 v-model="memberData.details.user.email"
                        />
                    </q-field>
                </div>
                <div class="col-12 q-ma-sm">
                    <q-field :label="$t('members.information.website')">
                        <q-input inverted-light
                                 class="no-shadow custom-input-border"
                                 color="white text-black"
                                 v-model="memberData.contact_info.replicator_website"
                        />
                    </q-field>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.information.residence')">
                        <q-select clearable
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  filter
                                  v-model="memberData.contact_info.country_of_residence_id"
                                  :options="countriesOptions.options"
                        />
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import masterDataTransformarMixin from 'src/application/global/mixins/masterDataTransformarMixin'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import trans from 'src/application/global/components/common/transition/transition'
  import {mapGetters, mapState, mapActions} from 'vuex'

  export default {
    name: 'information-tab',
    mixins: [masterDataTransformarMixin],
    components: {
      qLoader,
      trans
    },
    props: {
      memberData: {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      }
    },
    data: () => ({
      maritalDependency: false
    }),
    computed: {
      ...mapGetters([
        'callCodeOptionsByCountry'
      ]),
      ...mapState({
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        languageOptions: state => state.globalCMP.languagesOptions.data,
        done: state => state.globalCMP.done
      })
    },
    mounted() {
      this.master.keys = [
        'gender',
        'relationships',
        'martial_status',
        'religion',
        'ethnic_group',
        'salutation',
        'occupation',
        'education',
        'industry',
        'salary_range',
        'annual_revenue',
        'preferred_contact'
      ]
      this.getLanguagesAction()
    },
    watch: {
      done: {
        handler(objNew, objOld) {
          if (objNew) {
            this.checkMaritalDependency(this.memberData.information.martial_status_id)
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'getLanguagesAction'
      ]),
      checkMaritalDependency(value) {
        if (value !== '') {
          let maritalStatus = this.masterDataOptionsCreator('martial_status').filter(key => key.value === value)
          if (maritalStatus.length > 0) {
            if (maritalStatus[0].label === this.$const.masterKey.MARRIED) {
              this.maritalDependency = true
            } else {
              this.maritalDependency = false
            }
          }
        }
      }
    }
  }
</script>
