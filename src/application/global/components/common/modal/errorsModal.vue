<template>
    <q-modal :maximized="maximized"
             v-model="open[refs]"
             noBackdropDismiss
             no-route-dismiss
             @escape-key="beforeClose()"
             :content-css="{padding: '15px', minWidth: minWidth, minHeight: minHeight}">
        <div class="row">
            <div class="col-12">
                <div class="row">
                    <div class="col-lg-12">
                        <div class="row justify-between">
                            <div class="col-auto text-negative">
                                <div class="q-title">
                                    Attention Required
                                </div>
                            </div>
                            <div class="col-auto">
                                <q-btn color="negative" flat round icon="close" @click="beforeClose()"></q-btn>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-12 error-list mt-10">
                        <div v-for="error in errors">
                            <div class="row items-baseline gutter-sm no-wrap" v-for="(item, key) in error" v-if="key !== 'file' && key !== 'line'">
                                <div class="col-auto error-icon">
                                    <q-icon size="25px" color="negative" name="error_outline"/>
                                </div>
                                <div class="col-auto error-msg">
                                    {{ item }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </q-modal>
</template>
<script>
  import { OpenCloseFormMixin } from 'src/application/global/mixins'
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'errors-modal',
    mixins: [OpenCloseFormMixin],
    props: {
      refs: {
        type: String,
        required: true
      },
      minWidth: {
        type: String,
        default: '50vw'
      },
      minHeight: {
        type: String,
        default: '30vw'
      },
      BackdropDismiss: {
        type: Boolean,
        default: false
      },
      maximized: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        errors: state => state.globalCMP.errors.data
      })
    },
    methods: {
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      // Complete the form submission and redirect and notify
      resetAndGo (redirect) {
        if (redirect) {
          this.openCloseModal({name: this.openCloseModalForm.name, status: false})
        }
      },
      beforeClose () {
        // redirect true
        this.resetAndGo(true)
      }
    }
  }
</script>
<style lang="stylus">
    .error-list
        padding-left 2rem
</style>