<template>
    <div class="location-tab">
        <div class="row gutter-xs">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
                <q-search color="white" class="no-shadow custom-input-border" inverted-light :placeholder="$t('Common.search.placeholder')" v-model="search"/>
            </div>
            <div class="col-lg-12">
                <table class="q-table-html bordered cell-separator full-width responsive">
                    <thead>
                    <tr class="header bg-grey-3" v-show="currentCountry">
                        <th  class="text-left">
                            <q-checkbox color="grey-6" :disable="search !== ''" v-model="checkAll"/>
                            {{ currentCountry[0].code }}
                            <small>(All Location) </small>
                        </th>
                        <th class="text-left">{{ currentCountry[0].label }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="row in filteredLocation">
                        <td :data-th="currentCountry[0].code" class="text-left">
                            <q-checkbox color="grey-6" :val="row.id"
                                        v-model="kittingProduct.location.selected"/>
                            {{ row.code }}
                        </td>
                        <td :data-th="currentCountry[0].label" class="text-left">{{ row.name }}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    name: 'location-tab',
    computed: {
      ...mapState({
        rows: state => state.productsCMP.saveData.data.location.list,
        countries: state => state.globalCMP.countriesOptions.data.options,
        selectedFilters: state => state.globalCMP.selectedFilters,
        saveData: state => state.productsCMP.saveData.data
      }),
      // Do searching over location list
      filteredLocation () {
        return this.rows.filter(item => {
          if (item.code.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
            return item
          }
        })
      }
    },
    props: {
      'kittingProduct': {
        type: Object,
        required: true
      }
    },
    data: () => ({
      search: '',
      checkAll: false,
      currentCountry: {}
    }),
    created () {
      // get country details
      this.currentCountry = this.countries.filter(item => item.value === this.selectedFilters.countryID)
    },
    watch: {
      checkAll: {
        handler () {
          this.locationManipulation()
        }
      }
    },
    methods: {
      locationManipulation () {
        if (this.checkAll) {
          this.rows.forEach((val) => {
            this.kittingProduct.location.selected.push(val.id)
          })
        } else {
          this.kittingProduct.location.selected = []
        }
      }
    }
  }
</script>
<style lang="stylus">
    .location-tab
        .header
            width 20%
</style>