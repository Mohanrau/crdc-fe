<template>
  <div class="personal-info-tab">
    <div class="row fit">
      <q-table
        class="col-12"
        :data="updates"
        :columns="columns"
        row-key="name"
      />
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'update-history',
    props: {
      updates: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      columns: [
        {
          label: Vue.prototype.$t('stockist.DTableLabel.updateDate'),
          name: 'updated_at',
          field: 'updated_at',
          sort: false,
          align: 'center'
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.stockistType'),
          name: 'stockist_type',
          field: 'stockist_type',
          align: 'center',
          sort: false,
          format (element) {
            return element !== null && element !== undefined ? element.title : '-'
          }
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.ratio'),
          name: 'stockist_ratio',
          field: 'stockist_ratio',
          align: 'center',
          sort: false,
          type: 'String',
          format (element) {
            return element !== null && element !== undefined ? element : '-'
          }
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.ibsOnline'),
          name: 'ibs_online',
          field: 'ibs_online',
          align: 'center',
          sort: false,
          format (element, row) {
            return element === 1 ? 'YES' : 'NO'
          }
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.status'),
          name: 'status',
          field: 'status',
          align: 'center',
          sort: false,
          format (element) {
            return element !== null && element !== undefined ? element.title : '-'
          }
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.updateBy'),
          name: 'created_by',
          field: 'created_by',
          align: 'center',
          format (element, row) {
            return element.name
          }
        },
        {
          label: Vue.prototype.$t('stockist.DTableLabel.remark'),
          name: 'remark',
          field: 'remark',
          align: 'center',
          sort: false
        }
      ]
    })
  }
</script>

<style scoped>

</style>
