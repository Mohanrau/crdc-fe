<template>
    <div class="location-tab">
        <div class="row gutter-xs">
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-4">
                <q-search color="white" inverted-light class="no-shadow custom-input-border" :placeholder="$t('Common.search.placeholder')" v-model="search"/>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <table class="q-table-html bordered cell-separator responsive full-width">
                    <thead>
                    <tr class="header bg-grey-3">
                        <th :data-th="currentCountry[0].code" class="text-left">
                            <q-checkbox color="white text-grey-8" :disable="search !== ''" v-model="checkAll"/>
                            {{ currentCountry[0].code }}
                            <small>(All Location) </small>
                        </th>
                        <th :data-th="currentCountry[0].label" class="text-left">{{ currentCountry[0].label }}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="row in filteredLocation">
                        <td class="text-left">
                            <q-checkbox color="white text-grey-6" @blur="removeLocationIds(row.id)" :val="row.id"
                                        v-model="standardProduct.location.selected"/>
                            {{ row.code }}
                        </td>
                        <td class="text-left">{{ row.name }}</td>
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
      'standardProduct': {
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
      // compare promotion_prices array add missing element into location.selected array
      if (typeof this.standardProduct !== 'undefined') {
        if (this.standardProduct.promotion_prices.length > 0) {
          this.standardProduct.promotion_prices.forEach((val) => {
            val.location_ids.forEach((val) => {
              if (!this.standardProduct.location.selected.includes(val)) {
                this.standardProduct.location.selected.push(val)
              }
            })
          })
        }
      }
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
            this.standardProduct.location.selected.push(val.id)
          })
        } else {
          this.standardProduct.location.selected = []
        }
      },
      removeLocationIds (id) {
        this.standardProduct.promotion_prices.forEach((val, index) => {
          var i = this.standardProduct.promotion_prices[index].location_ids.indexOf(id)
          if (i > -1) {
            this.standardProduct.promotion_prices[index].location_ids.splice(i, 1)
          }
        })
      }
    }
  }
</script>
<style lang="stylus">
    .location-tab
        .header
            width 20%
</style>