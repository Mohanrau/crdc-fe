<template>
    <div class="general-page-holder">
        <div class="text-center bg-img-cube q-pa-md">
            <div class="q-display-3">
                <img
                        src="~assets/sad.svg"
                        style="width:30vw;max-width:150px;"
                >
            </div>
            <div class="q-title text-grey-14 q-ma-md">Access is denied.<strong>(403)</strong></div>
            <div class="q-body-1 text-faded q-ma-md">
                You do not have enough privilages to access this area.For more information contact your department administrator.
            </div>
        </div>
    </div>
</template>
<script>
  import {GeneralsMixin} from 'src/application/global/mixins/index'
  import {mapState} from 'vuex'

  export default {
    name: 'deny',
    mixins: [GeneralsMixin],
    computed: {
      ...mapState({
        route: state => state.route
      })
    }
  }
</script>
