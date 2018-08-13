<template>
  <div class="form-holder relative-position pd-5">
    <div class="row gutter-md full-width bg-white items-center md-gutter">
      <div class="col-12">
        <p class="text-gray">Country of enrollment</p>
        <q-field>
          <q-select
            clearable
            color="black"
            v-model="enrollmentData.memberData.details.country_id"
            :options="countriesOptions.options"
            @input="registrationCountrySelected"
          />
        </q-field>
      </div>
      <div class="col-12">
        <p class="text-gray">Enrollment Type</p>
        <q-field>
          <q-option-group
            v-model="enrollmentData.enrollment_type"
            @input="processEnrollmentTypeChange"
            :options="[
            {label: 'New', value: 'new'},
            {label: 'Member upgrade to BA', value: 'upgrade'},
            {label: 'Same day re-enrol', value: 're_enroll'}
            ]"
          />
        </q-field>
      </div>
      <div
        class="col-12"
        v-if="showMemberSearchField"
      >
        <p class="text-gray">Insert member details</p>
        <q-field label="Member ID">
          <q-input
            v-model="memberIDSearchTerm"
            :after="[{icon: 'search'}]"
          >
            <q-autocomplete @search="(terms, done) => search(terms, done, 'member_id')"
                            @selected="(item) => selected(item, 'member_id')"/>
          </q-input>
        </q-field>
        <q-field label="Member Name">
          <q-input disabled v-model="enrollmentData.member_name"/>
        </q-field>
      </div>
      <div
        class="col-12"
        v-if="showEnrollmentRank"
      >
        <p class="text-gray">Enrollment Rank</p>
        <q-field>
          <div v-for="enrollmentType in enrollmentTypeList">
            <q-radio v-model="enrollmentData.enrollment_rank" :val="enrollmentType.id" :label="enrollmentType.title" />
          </div>
        </q-field>
        <q-loader :visible="isProcessingSection"></q-loader>
      </div>
      <div
        class="col-12"
        v-if="showPaymentMode"
      >
        <p class="text-gray">Payment Mode</p>
        <q-field>
          <q-option-group
            :disable="enrollmentData.enrollment_type === 're_enroll'"
            v-model="enrollmentData.payment_mode"
            :options="[
            {label: 'Others', value: 'others'},
            {label: 'EPP Moto/AEON Loan', value: 'epp'}
            ]"
          />
        </q-field>
      </div>
    </div>
  </div>
</template>

<script>
  // import Vue from 'vue'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {DatesMixin, PaginationMixin} from 'src/application/global/mixins/index'

  export default {
    name: 'member-enrollment-initiation-form',
    mixins: [DatesMixin, PaginationMixin],
    components: {
      qLoader
    },
    props: {
      initiateEnrollment: {
        type: Function,
        required: true
      },
      enrollmentData: {
        type: Object,
        required: true
      },
      registrationCountrySelected: {
        type: Function,
        required: true
      }
    },
    watch: {
      openCloseModalForm: {
        handler (newData) {
          // Call if modal name match
          if (!newData.status && newData.name === 'enrollmentInitiationModal') {
            this.initiateEnrollment()
          }
        }
      }
    },
    data: () => ({
      showEnrollmentRank: true,
      showPaymentMode: true,
      showMemberSearchField: false,
      memberIDSearchTerm: ''
    }),
    computed: {
      ...mapState({
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
        selectedFilters: state => state.salesCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        enrollmentTypeList: state => state.salesCMP.enrollmentTypeList.list
      }),
      ...mapGetters({
        paginationQuery: 'pagination'
      })
    },
    mounted () {
    },
    methods: {
      ...mapActions([
        'getMemberSearchAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      beforeClose () {
        this.initiateEnrollment()
        // redirect true
        this.resetAndGo(true)
      },
      // Complete the form submission and redirect and notify
      resetAndGo (redirect) {
        if (redirect) {
          this.openCloseModal({name: this.openCloseModalForm.name, status: false})
        }
      },
      processEnrollmentTypeChange () {
        switch (this.enrollmentData.enrollment_type) {
          case 'new':
            this.showEnrollmentRank = true
            this.showMemberSearchField = false
            this.showPaymentMode = true
            break
          case 're_enroll':
            this.showEnrollmentRank = false
            this.showMemberSearchField = true
            this.showPaymentMode = true
            this.enrollmentData.payment_mode = 'others'
            break
          case 'upgrade':
            this.showEnrollmentRank = false
            this.showMemberSearchField = true
            this.showPaymentMode = true
            break
        }
      },
      processEnrollmentRankChange () {
        switch (this.enrollmentData.enrollment_rank) {
          case 'ba':
          case 'premium_member':
            this.showPaymentMode = true
            break
          case 'member':
            this.showPaymentMode = false
            break
        }
      },
      search (terms, done, field) {
        if (field === 'member_id') {
          let query = {
            country_id: this.enrollmentData.memberData.details.country_id,
            search_text: this.memberIDSearchTerm,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        }
      },
      selected (item, field) {
        if (field === 'member_id') {
          this.enrollmentData.member_id = item.value
          this.memberIDSearchTerm = item.sublabel
          this.enrollmentData.member_name = item.label
        }
      }
    }
  }
</script>

<style scoped>

</style>
