<template>
    <div class="general-page-holder">
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center gutter-xs justify-between">
                <div class="col-lg-2 col-xs-2">
                    <q-btn  color="grey-6" icon="info" flat>
                        <q-tooltip anchor="center right" self="center left" :offset="[10, 10]">
                            <span class="text-muted">{{ getsubtractFromDate(this.getCurrentDate(), this.datesBeforeDays, 'MMMM DD, YYYY') }} - {{ this.getCurrentDate('MMMM DD, YYYY') }}</span>
                        </q-tooltip>
                    </q-btn>
                </div>
                <div class="col-lg-4 col-md-10 col-sm-10 col-xs-10">
                    <q-select
                            clearable
                            filter
                            inverted-light
                            color="white text-grey-6"
                            class="no-shadow custom-input-border"
                            autofocus-filter
                            ref="transactionLocationIDSelector"
                            v-model="transactionLocationID"
                            :options="locationsOptionsByCountry"
                            :placeholder="$t('general.select.transactionLocation')"
                            @input="getCharts"
                    />
                </div>
            </div>
        </div>
        <div class="bg-white shadow-1">
            <div class="row">
                <div class="col-12 relative-position">
                    <wave-chart class="chart q-pa-md"
                                :labels="recentSales.labels"
                                :legend="true"
                                :title="true"
                                :titleText="$t('Dashboard.Chart.RecentSales')"
                                :data="recentSales.data"
                                :chartData="recentSales.data"
                                :callback="recentSales.callback">
                    </wave-chart>
                    <q-loader :visible="isProcessing"></q-loader>
                </div>
            </div>
        </div>
        <div v-if="showStockistChart" class="bg-white shadow-1 q-mt-md">
            <div class="row">
                <div class="col-12 relative-position">
                    <bar-chart class="chart q-pa-md"
                               :labels="totalSponsored.labels"
                               :legend="true"
                               :title="true"
                               :titleText="$t('Dashboard.Chart.Commissions')"
                               :data="totalSponsored.data"
                               :callback="totalSponsored.callback">
                    </bar-chart>
                    <q-loader :visible="isProcessing"></q-loader>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import {WaveChart, BarChart} from 'src/application/global/components/common/charts'
  import {DatesMixin} from 'src/application/global/mixins'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {mapState, mapGetters, mapActions} from 'vuex'

  export default {
    components: {
      BarChart,
      WaveChart,
      qLoader
    },
    mixins: [DatesMixin],
    async mounted() {
      this.recentSales.data = [this.recentSalesData, this.todaySalesData]
      await this.getCountryRelationAction({
        country_id: this.selectedFilters.countryID,
        relations: ['entity.locations']
      })
      await this.initDashboard()
    },
    data() {
      return {
        recentSalesData: {
          label: this.$t('Dashboard.Chart.RecentSales'),
          data: [],
          borderColor: '--q-color-primary',
          backgroundColor: 'rgba(0,0,0,0)',
          pointBackgroundColor: '--q-color-primary'
        },
        todaySalesData: {
          label: this.$t('Dashboard.Chart.TodaySales'),
          data: [],
          borderDash: [5, 5],
          backgroundColor: 'rgba(0,0,0,0)',
          pointBackgroundColor: '--q-color-primary'
        },
        commisionsData: {
          label: this.$t('Dashboard.Chart.Commissions'),
          data: [],
          borderColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
          backgroundColor: ['--q-color-primary', '--q-color-primary', '--q-color-primary', '--q-color-primary', '--q-color-primary', '--q-color-primary', '--q-color-primary']
        },
        totalSponsored: {
          labels: ['2017-22', '2017-23', '2017-24', '2018-01', '2018-02', '2018-03', '2018-04'],
          legends: [
            {
              title: this.$t('Dashboard.Chart.Commissions'),
              color: 'q-color-primary'
            }
          ],
          data: [],
          callback: function (value) {
            return (value % 1 === 0) ? value : null
          }
        },
        recentSales: {
          labels: ['15 May', '16 May', '17 May', '18 May', '19 May', '20 May', '21 May'],
          legends: [
            {
              title: this.$t('Dashboard.Chart.RecentSales'),
              color: 'q-color-dark'
            }
          ],
          data: [],
          callback: (value) => {
            return (value % 1000 === 0) ? (value / 1000) + this.$t('Dashboard.Chart.Thousands') : null
          }
        },
        showStockistChart: false,
        transactionLocationID: '',
        datesBeforeDays: 14
      }
    },
    computed: {
      ...mapState({
        isProcessing: state => state.globalCMP.isProcessing,
        selectedFilters: state => state.globalCMP.selectedFilters,
        userType: state => state.globalCMP.userInfo.data.user_type
      }),
      ...mapGetters([
        'locationsOptionsByCountry'
      ])
    },
    methods: {
      ...mapActions([
        'getStockLocations',
        'getCountryRelationAction',
        'dashboardAction'
      ]),
      initDashboard () {
        // set default value for chart
        if (this.locationsOptionsByCountry.length > 0) {
          this.transactionLocationID = this.locationsOptionsByCountry[0].value
          this.getCharts(this.locationsOptionsByCountry[0].value)
        }
      },
      getCharts(locationID) {
        let locationData = this.locationsOptionsByCountry.find((x) => x.value === locationID)
        if (locationID !== null) {
          this.updateRecentSalesChart(locationID)
          if (locationData.type_id === 3) {
            this.showStockistChart = true
            this.updateCommisionsChart(locationID)
          } else {
            this.showStockistChart = false
          }
        }
      },
      updateRecentSalesChart(locationId) {
        this.dashboardAction({
          location_id: locationId,
          request_type: 'recent_sales',
          start_date: this.getsubtractFromDate(this.getCurrentDate(), this.datesBeforeDays),
          end_date: this.getCurrentDate()
        }).then(resp => {
          // Processing new label
          let newLabels = []
          let newData = []
          let todayData = []
          if (typeof resp.recent_sales.dates !== 'undefined' && resp.recent_sales.dates.length > 0) {
            resp.recent_sales.dates.forEach(item => {
              let temp = item.split(' ')
              newLabels.push(temp[0] + ' ' + temp[1])
              newData.push(resp.recent_sales.values[item])
              todayData.push(resp.recent_sales.values[item])
            })
            this.recentSales.labels = newLabels
          }
          // Update new sales data
          this.recentSalesData.data = newData.fill(null, newData.length - 1)
          this.todaySalesData.data = todayData.fill(null, 0, newData.length - 2)
          this.recentSales.data = [this.recentSalesData, this.todaySalesData]
        })
      },
      updateCommisionsChart(locationId) {
        this.dashboardAction({
          location_id: locationId,
          request_type: 'commissions',
          start_date: this.getsubtractFromDate(this.getCurrentDate(), this.datesBeforeDays),
          end_date: this.getCurrentDate()
        }).then(resp => {
          // Processing new label
          let newLabels = []
          let newData = []
          if (typeof resp.commissions !== 'undefined') {
            resp.commissions.cw_names.forEach(item => {
              newLabels.push(item)
              newData.push(resp.commissions.values[item])
            })
            this.totalSponsored.labels = newLabels
          }
          // Update new commisions data
          this.commisionsData.data = newData
          this.totalSponsored.data = [this.commisionsData]
        })
      }
    }
  }
</script>
