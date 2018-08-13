<template>
    <div class="row wrap items-center q-mb-md">
        <!--Left Action bar-->
        <div class="col-lg-6 col-md-12 col-xs-12">
            <div class="row" :class="placementLeft">
                <slot name="left-side"></slot>
                <standard-breadcrumb></standard-breadcrumb>
            </div>
        </div>
        <!--Right action bar -->
        <div class="col-lg-6 col-md-12 col-xs-12">
            <div class="row" :class="placementRight">
                <slot name="right-side"></slot>
                <div class="col-lg-auto col-md-auto col-xs-auto">
                    <q-btn glossy icon="reply" size="sm" color="black" v-go-back.single="store.backRoute">
                        {{ $t('Common.Back.Btn') }}
                    </q-btn>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import Store from 'src/services/navigationService'
  import StandardBreadcrumb from 'src/application/global/components/common/breadcrumbs/standardBreadcrumb'
  import { mapState } from 'vuex'
  import { Platform } from 'quasar'

  export default {
    name: 'header-general',
    components: {
      StandardBreadcrumb
    },
    computed: {
      ...mapState({
        route: state => state.route
      }),
      placementLeft () {
        if (Platform.is.desktop || Platform.is.electron) {
          return 'gutter-xs justify-start items-center'
        } else {
          return 'justify-between'
        }
      },
      placementRight () {
        if (Platform.is.desktop || Platform.is.electron) {
          return 'gutter-xs justify-end items-center content-center'
        } else {
          return 'justify-between'
        }
      }
    },
    props: {
      'genaralTitle': {
        type: String
      }
    },
    data: () => ({
      store: Store.state
    })
  }
</script>
<style>
</style>