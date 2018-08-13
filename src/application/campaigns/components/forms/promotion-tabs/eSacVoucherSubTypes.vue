<template>
    <div class="sub_types-tab">
        <div class="row">
            <div class="col-12">
                <q-field
                        helper="*"
                >
                    <table class="q-table-html bordered cell-separator full-width mt-10">
                        <thead>
                        <tr class="header bg-grey-3">
                            <th width="20%" class="text-center">{{ $t('campaigns.esacPromotion.voucherSubType') }}</th>
                            <th width="50%" class="text-center">{{ $t('campaigns.esacPromotion.voucherPeriod') }}</th>
                            <th width="20%" class="text-center">{{ $t('campaigns.esacPromotion.voucherAmount') }} ({{currencyLabel}})</th>
                            <th width="20%" class="text-center">{{ $t('campaigns.esacPromotion.minPurchaseAmount') }} ({{currencyLabel}})</th>
                            <th width="10%" class="text-center"></th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td data-th="Voucher Sub Type">
                                <q-select
                                        color="primary"
                                        v-model="adderRow.voucher_sub_type"
                                        :options="esacVoucherSubTypesOptions"
                                />
                            </td>
                            <td data-th="Voucher Period">
                                <q-select
                                        color="primary"
                                        v-model="adderRow.voucher_period"
                                        :options="voucherPeriodsOptions"
                                />
                            </td>
                            <td data-th="Voucher Amount">
                                <q-input v-model="adderRow.voucher_amount"
                                    type="number"></q-input>
                            </td>
                            <td data-th="Min Purchase Amount">
                                <q-input v-model="adderRow.min_purchase_amount"
                                    type="number"></q-input>
                            </td>
                            <td>
                                <q-btn @click="addRow" color="positive" flat>
                                    <q-icon name="add"/>
                                </q-btn>
                            </td>
                        </tr>
                        <tr v-for="(item, index) in esacPromotionData.esac_promotion_voucher_sub_types">
                            <td data-th="Voucher Sub Type">{{ item.voucher_sub_type_name }}</td>
                            <td data-th="Voucher Period">{{ item.voucher_period_name }}</td>
                            <td data-th="Voucher Amount">{{ item.voucher_amount }}</td>
                            <td data-th="Min Purchase Amount">{{ item.min_purchase_amount }}</td>
                            <td>
                                <q-btn @click="removeRow(index)" color="negative" flat>
                                    <q-icon name="delete"/>
                                </q-btn>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </q-field>
            </div>
        </div>
    </div>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
  import Vue from 'vue'

  // Initialize adderRow
  function initializeAdderRow () {
    return {
      voucher_sub_type: null,
      voucher_sub_type_id: 0,
      voucher_sub_type_name: '',
      voucher_period: null,
      voucher_period_id: 0,
      voucher_period_name: '',
      voucher_amount: 0,
      min_purchase_amount: 0
    }
  }

  export default {
    name: 'voucher_sub_types-tab',
    props: {
      'esacPromotionData': {
        type: Object,
        required: true
      },
      'esacVoucherSubTypesOptions' : {
        type: Array,
        required: true
      },
      'voucherPeriodsOptions' : {
        type: Array,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      },
      'currencyLabel': {
        type: String,
        required: true
      }
    },
    computed: {
      ...mapState({
        productSearchData: state => state.productsCMP.productSearchData,
        masterData: state => state.globalCMP.masterData.data.list,
        selectedFilters: state => state.globalCMP.selectedFilters
      })
    },
    data: () => ({
      adderRow: initializeAdderRow()
    }),
    methods: {
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION'
      }),
      addRow () {
        if (this.adderRow.voucher_sub_type !== null && this.adderRow.voucher_period != null) {
          this.adderRow.voucher_sub_type_id = this.adderRow.voucher_sub_type.value
          this.adderRow.voucher_sub_type_name = this.adderRow.voucher_sub_type.label
          this.adderRow.voucher_period_id = this.adderRow.voucher_period.value
          this.adderRow.voucher_period_name = this.adderRow.voucher_period.label
          let duplicated = false;
          this.esacPromotionData.esac_promotion_voucher_sub_types.forEach(element => {
            if(element.voucher_sub_type_id === this.adderRow.voucher_sub_type_id) {
              duplicated = true;
            }
          });
          if(duplicated) {
            this.setNotification({
              title: 'Duplicated',
              message: 'Duplicated',
              type: 'negative'
            })
          }
          else {
            this.esacPromotionData.esac_promotion_voucher_sub_types.push(Vue.util.extend({}, JSON.parse(JSON.stringify(this.adderRow))))
            // Reset adderRow
            Object.assign(this.adderRow, initializeAdderRow())
          }
        }
      },
      removeRow (index) {
        Vue.delete(this.esacPromotionData.esac_promotion_voucher_sub_types, index)
      }
    }
  }
</script>