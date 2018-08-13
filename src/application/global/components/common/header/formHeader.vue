<template>
    <div class="row wrap items-center">
        <!--Left Action buttons-->
        <div class="col-lg-6 col-md-12 col-xs-12">
            <q-card flat>
                <div class="row" :class="placementLeft">
                    <slot name="left-side"></slot>
                    <standard-breadcrumb></standard-breadcrumb>
                </div>
            </q-card>
        </div>
        <!--Right action buttons-->
        <div class="col-lg-6 col-md-12 col-xs-12">
            <q-card flat>
                <div class="row justify-end gutter-sm" :class="placementRight">
                    <slot name="right-side"></slot>
                    <div class="col-lg-auto col-md-12 col-xs-12" v-show="buttonOneVisibility">
                        <!--submit(false) prevent form from redirect to listing-->
                        <q-btn class="fit" v-shortkey="['ctrl', 'alt', 's']" @shortkey.native="submit(false)" glossy :icon="buttonOneIcon" size="sm" :disable="disableSubmit" color="positive"
                               @click="submit(false)">{{ buttonOneCaption }}
                        </q-btn>
                    </div>
                    <div class="col-lg-auto col-md-12 col-xs-12" v-show="buttonTwoVisibility">
                        <!--submit(true) allow form redirect to listing-->
                        <q-btn class="fit" v-shortkey="['ctrl', 'alt', 'q']" @shortkey.native="submit(true)" glossy :icon="buttonTwoIcon" :disable="disableSubmit" size="sm" color="black"
                               @click="submit(true)">
                            {{ buttonTwoCaption}}
                        </q-btn>
                    </div>
                    <div class="col-lg-auto col-md-12 col-xs-12" v-show="buttonThreeVisibility">
                        <q-btn class="fit" v-shortkey="['ctrl', 'alt', 'c']" @shortkey.native="beforeClose()"  glossy :icon="buttonThreeIcon" size="sm" color="negative" @click="beforeClose()">
                            {{ buttonThreeCaption }}
                        </q-btn>
                    </div>
                </div>
            </q-card>
        </div>
    </div>
</template>
<script>
  import { Platform } from 'quasar'
  import StandardBreadcrumb from 'src/application/global/components/common/breadcrumbs/standardBreadcrumb'
  import { mapState } from 'vuex'

  export default {
    name: 'header-form',
    components: {
      StandardBreadcrumb
    },
    computed: {
      ...mapState({
        route: state => state.route
      }),
      placementLeft () {
        if (Platform.is.desktop || Platform.is.electron) {
          return 'gutter-sm justify-start items-baseline header-row-mb'
        } else {
          return 'gutter-sm justify-between header-row-mb'
        }
      },
      placementRight () {
        if (Platform.is.desktop || Platform.is.electron) {
          return 'gutter-sm justify-end items-baseline header-row-mb'
        } else {
          return 'justify-between header-row-mb'
        }
      }
    },
    props: {
      'formTitle': {
        type: String
      },
      'formName': {
        type: String,
        required: true
      },
      'submit': {
        type: Function,
        required: true
      },
      'resetForm': {
        type: Function,
        required: true
      },
      'beforeClose': {
        type: Function,
        required: true
      },
      'disableSubmit': {
        type: Boolean,
        default: false
      },
      'buttonOneCaption': {
        type: String
      },
      'buttonOneIcon': {
        type: String
      },
      'buttonOneVisibility': {
        type: Boolean
      },
      'buttonTwoCaption': {
        type: String
      },
      'buttonTwoIcon': {
        type: String
      },
      'buttonTwoVisibility': {
        type: Boolean
      },
      'buttonThreeCaption': {
        type: String
      },
      'buttonThreeIcon': {
        type: String
      },
      'buttonThreeVisibility': {
        type: Boolean
      }
    }
  }
</script>

<style lang="stylus">
    .header-row-mb
        margin-bottom 10px
</style>