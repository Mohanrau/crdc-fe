<template>
  <div class="personal-info-tab">
    <div class="row col-12 gutter-lg">
      <div class="col-6 gutter-md">
        <div class="col-12 gutter-xs">
          <div><p class="h6 text-blue">{{$t('stockist.registration.label.initialDeposit')}}</p></div>
          <q-field
            :label="$t('stockist.registration.label.minimum')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.minimum_initial_deposit.$error"
            :error-label="$t('stockist.registration.errorMessage.minimumInitialDeposit')"
          >
            <q-input
              type="number"
              v-model="deposits.minimum_initial_deposit"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
          <q-field
            :label="$t('stockist.registration.label.maximum')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.maximum_initial_deposit.$error"
            :error-label="$t('stockist.registration.errorMessage.maximumInitialDeposit')"
          >
            <q-input
              type="number"
              v-model="deposits.maximum_initial_deposit"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
        </div>
        <div class="col-12 gutter-xs">
          <div><p class="h6 text-blue">{{$t('stockist.registration.label.topUpDeposit')}}</p></div>
          <q-field
            :label="$t('stockist.registration.label.minimum')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.minimum_top_up_deposit.$error"
            :error-label="$t('stockist.registration.errorMessage.minimumTopUpDeposit')"
          >
            <q-input
              :label="$t('stockist.registration.label.minimum')"
              v-model="deposits.minimum_top_up_deposit"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
          <q-field
            :label="$t('stockist.registration.label.maximum')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.maximum_top_up_deposit.$error"
            :error-label="$t('stockist.registration.errorMessage.maximumTopUpDeposit')"
          >
            <q-input
              :label="$t('stockist.registration.label.maximum')"
              v-model="deposits.maximum_top_up_deposit"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
        </div>
        <div class="col-12 gutter-xs">
          <div><p class="h6 text-blue">{{$t('stockist.registration.label.refund')}}</p></div>
          <q-field
            :label="$t('stockist.registration.label.minCapping')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.minimum_capping.$error"
            :error-label="$t('stockist.registration.errorMessage.minCapping')"
          >
            <q-input
              type="number"
              v-model="deposits.minimum_capping"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-xl-6 col-xs-12 justify-start">
        <div class="col-12 gutter-xs">
          <div><p class="h6 text-blue">{{$t('stockist.registration.label.creditLimit')}}</p></div>
          <q-field
            :label="$t('stockist.registration.label.creditLimit1')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.credit_limit_1.$error"
            :error-label="$t('stockist.registration.errorMessage.creditLimit1')"
          >
            <q-input
              type="number"
              v-model="deposits.credit_limit_1"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
          <q-field
            :label="$t('stockist.registration.label.creditLimit2')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.credit_limit_2.$error"
            :error-label="$t('stockist.registration.errorMessage.creditLimit2')"
          >
            <q-input
              type="number"
              v-model="deposits.credit_limit_2"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
          <q-field
            :label="$t('stockist.registration.label.creditLimit3')"
            :helper="'*'"
            :error="validation.stockistRegistrationData.deposits.credit_limit_3.$error"
            :error-label="$t('stockist.registration.errorMessage.creditLimit3')"
          >
            <q-input
              type="number"
              v-model="deposits.credit_limit_3"
              :suffix="currencyLabelByCountry"
            />
          </q-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'deposit-credit-limit',
    props: {
      deposits: {
        type: Object,
        required: true
      },
      validation: {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapGetters({
        currencyLabelByCountry: 'currencyLabelByCountry'
      })
    }
  }
</script>

<style scoped>

</style>
