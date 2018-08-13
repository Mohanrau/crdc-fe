<template>
  <div class="fullscreen dimmed" v-if="isProcessing">
    <q-loader class="z-max" :visible="isProcessing" :message="$t('operation.progress')"></q-loader>
  </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { openURL } from 'quasar'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: "inventory-management",
    components: {
      qLoader
    },
    computed: {
      ...mapState({
        isProcessing: state => state.globalCMP.isProcessing
      })
    },
    mounted: function () {
      this.initRedirect()
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'getInventoryProcurementSystemAccessTokenAction'
      ]),
      async initRedirect () {
        this.getInventoryProcurementSystemAccessTokenAction().then(res => {
          if (res !== null && res !== undefined && res.auth_access_token !== null && res.auth_access_token !== undefined) {
            openURL('http://elken.sage9.com/auth.php?' + res.auth_access_token)
          }
          this.$router.push({name: 'default'})
        })
      }
    }
  }
</script>

<style scoped>

</style>
