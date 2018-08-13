<template>
    <div class="fullscreen bg-grey-2">
        <div class="fixed-center text-center bg-img-cube q-pa-md">
            <div class="q-display-3">
                <img
                        src="~assets/sad.svg"
                        style="width:30vw;max-width:150px;"
                >
            </div>
            <div class="q-title text-grey-14 q-ma-md">Oops, something went wrong !<strong> (422, 503, 501)</strong></div>
            <div class="q-body-1 text-faded q-ma-md">
                It is possible that the server was unable to answer the HTTP request correctly. In this case, it may be enough to just refresh the page to resolve the HTTP 503 | 422 | 501 error. To do this, simply click on the refresh button.
            </div>
            <div class="row justify-center gutter-sm">
                <div class="col-auto">
                    <q-btn
                            icon="fa fa-power-off fa-rotate-90"
                            color="negative"
                            outline
                            label="Logout"
                            size="md"
                            @click="logoutHandler()"
                    >
                    </q-btn>
                    <q-btn
                            icon="refresh"
                            color="negative"
                            outline
                            label="Refresh"
                            size="md"
                            @click="$router.push({name: 'initialize'})"
                    >
                    </q-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import { GeneralsMixin } from 'src/application/global/mixins/index'
  import { mapState } from 'vuex'

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
