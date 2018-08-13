<template>
    <div class="information-tab">
        <div class="row gutter-sm">
            <div class="col-lg-8">
                <div class="col-12 q-ma-sm">
                    <q-field :label="$t('members.beneficiary.name')">
                        <q-input v-model="memberData.beneficiary.beneficiary_name"
                                 inverted-light
                                 class="no-shadow custom-input-border"
                                 color="white text-black"/>
                    </q-field>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.beneficiary.identification')">
                        <div class="row gutter-xs">
                            <div class="col-12">
                                <q-select clearable
                                          v-model="memberData.beneficiary.beneficiary_type_id"
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          :options="masterDataOptionsCreator('ic_passport_type')"
                                />
                            </div>
                            <div class="col-12">
                                <q-input :disable="memberData.beneficiary.beneficiary_type_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.beneficiary.beneficiary_ic_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.beneficiary.mobile')">
                        <div class="row gutter-xs">
                            <div class="col-5">
                                <q-select clearable
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          v-model="memberData.beneficiary.beneficiary_mobile_code_id"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-7">
                                <q-input :disable="memberData.beneficiary.beneficiary_mobile_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.beneficiary.beneficiary_phone_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.beneficiary.phoneOffice')">
                        <div class="row gutter-xs">
                            <div class="col-5">
                                <q-select clearable
                                          v-model="memberData.beneficiary.beneficiary_office_phone_code_id"
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-7">
                                <q-input :disable="memberData.beneficiary.beneficiary_office_phone_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.beneficiary.beneficiary_office_phone_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.beneficiary.phoneHome')">
                        <div class="row gutter-xs">
                            <div class="col-5">
                                <q-select clearable
                                          v-model="memberData.beneficiary.beneficiary_home_phone_code_id"
                                          inverted-light
                                          class="no-shadow custom-input-border"
                                          color="white text-black"
                                          :options="callCodeOptionsByCountry"
                                />
                            </div>
                            <div class="col-7">
                                <q-input :disable="memberData.beneficiary.beneficiary_home_phone_code_id === ''"
                                         inverted-light
                                         class="no-shadow custom-input-border"
                                         color="white text-black"
                                         v-model="memberData.beneficiary.beneficiary_home_phone_num"/>
                            </div>
                        </div>
                    </q-field>
                    <q-loader :visible="isProcessingSection"></q-loader>
                </div>
                <div class="col-12 q-ma-sm relative-position">
                    <q-field :label="$t('members.beneficiary.relation')">
                        <q-select clearable
                                  v-model="memberData.beneficiary.beneficiary_relationship_id"
                                  inverted-light
                                  class="no-shadow custom-input-border"
                                  color="white text-black"
                                  :options="masterDataOptionsCreator('relationships')"
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
    name: 'beneficiary-tab',
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
        languageOptions: state => state.globalCMP.languagesOptions.data
      })
    },
    mounted() {
      this.master.keys = [
        'relationships'
      ]
      this.getLanguagesAction()
    },
    methods: {
      ...mapActions([
        'getLanguagesAction'
      ])
    }
  }
</script>