<template>
    <div class="fullscreen bg-grey-2">
        <div class="fixed-center text-center bg-img-cube q-pa-md">
            <div class="q-display-3">
                <img
                        src="~assets/sad.svg"
                        style="width:30vw;max-width:150px;"
                >
            </div>
            <div class="q-title text-grey-14 q-ma-md">
                We couldn't find page you're looking for.<strong>(404)</strong>
            </div>
            <div class="q-body-1 text-faded q-ma-md">
                The page that you are looking for either removed or not exist.
            </div>
            <div class="row justify-center gutter-sm">
                <div class="col-auto">
                    <q-btn
                            icon="dashboard"
                            color="negative"
                            outline
                            label="Dashboard"
                            size="md"
                            @click="$router.push({name: 'default'})"
                    >
                    </q-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    name: 'not-found',
    computed: {
      ...mapState({
        route: state => state.route
      })
    }
  }
</script>
