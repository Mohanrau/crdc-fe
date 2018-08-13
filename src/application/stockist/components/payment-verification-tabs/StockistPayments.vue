<template>
  <div class="stockist-payout-tab">
    <div class="row fit">
      <table class="q-table-html loose col-12 cell-separator fit responsive">
        <thead class="bg-grey-2">
          <tr class="text-grey-7">
              <!--use th array-->
              <th align="center" v-for="header in tableHeaders">
                {{header}}
              </th>
          </tr>
        </thead>
        <tbody v-if="stockist.payment_info.length > 0">
          <tr v-for="payment in stockist.payment_info" >
            <td align="center" width="9%">{{payment.transaction_date}}</td>
            <td align="center" width="12%">{{payment.payment_provider.name}}</td>
            <td align="right" width="7%">{{payment.amount | formatPriceDouble}}</td>
            <td align="right" width="7%">{{payment.paid_amount | formatPriceDouble}}</td>
            <td align="center" width="10%">
              <q-input
                align="right"
                type="number"
                v-model="payment.pay_amount">
              </q-input>
            </td>
            <!--<td align="center" width="10%">-->
              <!--<q-input-->
                <!--align="right"-->
                <!--type="number"-->
                <!--v-model="payment.adjustment_amount">-->
              <!--</q-input>-->
            <!--</td>-->
            <td align="right" :class="payment.outstanding_amount > 0 ? 'text-red': 'text-green'" width="7%">{{payment.outstanding_amount  | formatPriceDouble}}</td>
            <td align="center" width="19%">
              <q-input v-model="payment.remarks">
              </q-input>
            </td>
            <td width="10%">{{formatDate(payment.updated_at)}}</td>
            <td width="9%">{{payment.updated_by !== null && payment.updated_by !== undefined ? payment.updated_by.name : '-'}}</td>
          </tr>
        <tr>
          <td colspan="5">
          </td>
          <td align="right">Total</td>
          <td
            align="right"
            :class="stockist.totalOutstanding > 0 ? 'text-red': 'text-green'"
          >
            {{stockist.totalOutstanding | formatPriceDouble}}
          </td>
        </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="10" align="center" class="text-grey-6">
              {{$t('stockist.DTablePlaceHolder.noRecordsFound')}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import {DatesMixin} from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters } from 'vuex'
  import { date } from 'quasar'

  export default {
    name: "stockist-payments",
    mixins: [DatesMixin],
    props: {
      stockist: {
        type: Object,
        required: true
      },
      userValidation: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable
      })
    },
    data: () => ({
      tableHeaders: [
        Vue.prototype.$t('stockist.DTableLabel.transaction_date'),
        Vue.prototype.$t('stockist.DTableLabel.paymentMethod'),
        Vue.prototype.$t('stockist.DTableLabel.totalAmount'),
        Vue.prototype.$t('stockist.DTableLabel.totalPaid'),
        Vue.prototype.$t('stockist.DTableLabel.payment'),
        // Vue.prototype.$t('stockist.DTableLabel.adjustmentAmount'),
        Vue.prototype.$t('stockist.DTableLabel.currentOutstanding'),
        Vue.prototype.$t('stockist.DTableLabel.remark'),
        Vue.prototype.$t('stockist.DTableLabel.lastUpdatedTime'),
        Vue.prototype.$t('stockist.DTableLabel.lastUpdatedBy')
      ]
    }),
    methods: {
      formatDate (dateToConvert) {
        return date.formatDate(dateToConvert, 'DD/MM/YY hh:mmA')
      }
    }
  }
</script>

<style scoped>

</style>
