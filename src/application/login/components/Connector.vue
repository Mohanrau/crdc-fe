<template>

</template>
<script>
  import Vue from 'vue'
  import {
    Loading,
    QSpinnerTail
  } from 'quasar'

  export default {
    name: 'Connector',
    created () {
      Loading.show({
        spinner: QSpinnerTail,
        message: Vue.prototype.$t('operation.progress'),
        messageColor: 'white',
        spinnerSize: 50, // in pixels
        spinnerColor: 'white',
        customClass: 'z-top'
      })
      setTimeout(() => {
        Loading.hide()
        this.$router.push({name: 'Admin'})
      }, 1500)
    }
  }
</script>