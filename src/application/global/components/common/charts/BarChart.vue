<script>
  import { Bar } from 'vue-chartjs'
  import ChartMixin from 'src/application/global/mixins/chartMixin'
  export default {
    name: 'bar-chart',
    extends: Bar,
    mixins: [ChartMixin],
    props: ['labels', 'data', 'callback'],
    mounted () {
      this.renderChart({
        labels: this.$props.labels,
        datasets: this.processColors(this.$props.data)
      }, this.chartOptions())
      this.postProcess()
    },
    watch: {
      data: function () {
        this.renderChart({
          labels: this.$props.labels,
          datasets: this.processColors(this.$props.data)
        }, this.chartOptions())
      }
    },
  }
</script>
