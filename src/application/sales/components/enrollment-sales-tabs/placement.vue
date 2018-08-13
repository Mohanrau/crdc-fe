<template>
  <div class="placement-tab">
    <div class="row pd-10 gutter-md">
      <div class="col-12">
        <div>
          <p class="q-title text-blue">Sponsor</p>
        </div>
        <div class="row gutter-md full-width">
          <q-field
            class="col-lg-3 col-md-4 col-xs-6"
            label="IBO ID"
          >
            <q-input
              v-model="memberData.details.sponsor.member.user.old_member_id"
            >
            <q-autocomplete @search="(terms, done) => search(terms, done, 'sponsor_id')"
                            @selected="(item) => selected(item, 'sponsor_id')"/>
            </q-input>
          </q-field>
          <q-field
            class="col-lg-3 col-md-4 col-xs-6"
            label="IBO Name"
          >
            <q-input
              v-model="memberData.details.sponsor.member.name"
            >
              <q-autocomplete @search="(terms, done) => search(terms, done, 'sponsor_name')"
                              @selected="(item) => selected(item, 'sponsor_id')"/>
            </q-input>
          </q-field>
        </div>
      </div>
      <div class="col-12">
        <div>
          <p class="q-title text-blue">Placement</p>
        </div>
        <div>
          <q-checkbox
            label="Same as sponsor"
            v-model="memberData.details.placement.same_as_sponsor"
          />
        </div>
      </div>
      <div class="row gutter-md full-width">
        <q-field
          class="col-lg-3 col-md-8 col-xs-12"
          label="Placement Settings"
        >
          <q-select
            v-model="memberData.details.placement.leg"
            :disable="memberData.details.placement.same_as_sponsor || !hasSponsor"
            :options="[
              {label:'Auto-Optimized Pay-Leg', value:'auto'},
              {label:'Left', value:'left'},
              {label:'Right', value:'right'}
              ]"
          >
          </q-select>
        </q-field>
        <q-field
          class="col-lg-4 col-md-6 col-xs-6"
          label="Placement IBO ID"
        >
          <q-input
            :disable="true"
            v-model="memberData.details.placement.ibo"
          >

          </q-input>
        </q-field>
        <q-field
          class="col-lg-5 col-md-6 col-xs-6"
          label="Placement IBO Name"
        >
          <q-input
            :disable="true"
            v-model="memberData.details.placement.name"
          >

          </q-input>
        </q-field>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapMutations, mapGetters, mapState } from 'vuex'

  export default {
    name: "placement",
    props: {
      memberData: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
        selectedFilters: state => state.salesCMP.selectedFilters,
        membersSearchData: state => state.globalCMP.memberSearchDataGlobal
      }),
      ...mapGetters({
        paginationQuery: 'pagination'
      })
    },
    mounted () {
    },
    data: () => ({
      hasSponsor: false
    }),
    methods: {
      ...mapActions([
        'getMemberSearchAction'
      ]),
      search (terms, done, field) {
        if (field === 'sponsor_id') {
          let query = {
            search_text: this.memberData.details.sponsor.member.user.old_member_id,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        } else if (field === 'sponsor_name') {
          let query = {
            search_text: this.memberData.details.sponsor.member.name,
            limit: 10
          }
          this.getMemberSearchAction(query).then(res => {
            done(this.membersSearchData.list)
          })
        }
      },
      selected (item, field) {
        if (field === 'sponsor_id') {
          this.hasSponsor = true
          this.memberData.details.sponsor.user_id = item.value
          this.memberData.details.sponsor.member.name = item.label
          this.memberData.details.sponsor.member.user.old_member_id = item.sublabel
        }
      }
    }
  }
</script>

<style scoped>

</style>
