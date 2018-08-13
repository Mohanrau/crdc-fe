<template>
    <div class="row gutter-sm justify-between">
        <div class="col-12 relative-position">
            <div class="row align-center">
                <q-input class="fit q-mb-sm"
                         autofocus
                         color="grey-8"
                         placeholder="Search ..."
                         v-model="search"/>
            </div>
            <q-scroll-area style="height: 55vh; max-height: 55vh;" v-if="userCountryLocations.length > 0">
                <q-list v-for="(country, index1) in userCountryLocations"
                        :key="`country-${index1}`"
                        link highlight separator
                        class="no-padding no-margin">
                    <q-item class="bg-tertiary text-white">
                        <q-item-main :label="country.name | uppercase"
                                     label-lines="2"/>
                        <q-item-side
                                color="white"
                                @click.native="doAllLocationSelection(country.entity.locations)"
                                :icon="true ? 'check' : 'check_box_outline_blank'"></q-item-side>
                    </q-item>
                    <q-item v-for="(location, index2) in filterLocation(country.entity.locations)"
                            :key="`location-${index2}`"
                            @click.native="doLocationSelection(location.id)"
                            :class="{'bg-green-1' : selectedStatus(location.id)}">
                        <q-item-main :label="location.code + ' - ' + location.name | uppercase"
                                     label-lines="2"/>
                        <q-item-side
                                :icon="selectedStatus(location.id) ? 'check' : 'check_box_outline_blank'"></q-item-side>
                    </q-item>
                </q-list>
            </q-scroll-area>
            <empty-list v-else=""></empty-list>
            <q-loader :visible="isProcessingList"></q-loader>
        </div>
    </div>
</template>
<script>
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    name: 'location-tab',
    components: {
      qLoader,
      EmptyList
    },
    computed: {
      ...mapState({
        isProcessingList: state => state.globalCMP.isProcessingList,
        userCountryLocations: state => state.settingsCMP.userCountryLocations.data,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
      })
    },
    props: {
      userData: {
        type: Object,
        required: true
      },
      userID: {
        required: true
      }
    },
    watch: {
      openCloseModalForm: {
        handler (newData) {
          // Call if modal name match
          if (newData.status && newData.name === 'createUpdateUserAndRoleModal') {
            this.initLocationArea()
          }
        }
      }
    },
    data: () => ({
      search: ''
    }),
    mounted () {
      this.initLocationArea()
    },
    methods: {
      ...mapActions([
        'loadUserLocationsByIdAction'
      ]),
      ...mapMutations({
        unsetUserCountryLocationsData: 'UNSET_USER_COUNTRY_LOCATIONS_DATA'
      }),
      initLocationArea () {
        if (this.userID) {
          this.loadUserLocationsByIdAction(this.userID)
        } else {
          this.unsetUserCountryLocationsData()
        }
      },
      doLocationSelection (id) {
        // Toggle remove and add id into array based on user selection
        const index = this.userData.location_ids.indexOf(id)
        if (index !== -1) {
          this.userData.location_ids.splice(index, 1)
        } else {
          this.userData.location_ids.push(id)
        }
      },
      doAllLocationSelection (locations) {
        if(locations.length > 0) {
          locations.forEach((location) => {
            if (!this.userData.location_ids.includes(location.id)) {
              this.userData.location_ids.push(location.id)
            } else {
              let index = this.userData.location_ids.indexOf(location.id)
              if (index !== -1) {
                this.userData.location_ids.splice(index, 1)
              }
            }
          })
        }
      },
      selectedStatus (id) {
        return this.userData.location_ids.includes(id)
      },
      filterLocation (data) {
        return data.filter(location => {
          if (location.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || location.code.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
            return location
          }
        })
      }
    }
  }
</script>