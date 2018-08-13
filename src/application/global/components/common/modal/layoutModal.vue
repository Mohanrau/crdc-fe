<template>
    <q-modal :noBackdropDismiss="noBackdropDismiss"
             :no-esc-dismiss="noEscDismiss"
             no-route-dismiss
             :maximized="maximized"
             v-model="open[refs]"
             @escape-key="beforeClose()"
             @hide=""
             :content-css="{padding: '5px', minWidth: minWidth, minHeight: minHeight, maxWidth: '70vw'}">
        <q-modal-layout
                :header-class="shadow ? '' : 'no-shadow'"
                :footer-class="shadow ? '' : 'no-shadow'">
            <q-toolbar slot="header" :class="classes">
                <layout-modal-header :beforeClose="beforeClose"
                                     :title="title"
                                     :headerSearchBar="headerSearchBar"
                                     :subTitle="subTitle"></layout-modal-header>
            </q-toolbar>
            <hr class="header-line" v-if="headerLine">
            <q-toolbar slot="footer" :class="classes">
                <layout-modal-footer :beforeClose="beforeClose"
                                     :buttonOne="footerButtonOne"
                                     :buttonTwo="footerButtonTwo"></layout-modal-footer>
            </q-toolbar>
            <slot name="modal-data" slot-scope="props"></slot>
        </q-modal-layout>
    </q-modal>
</template>
<script>
  import layoutModalHeader from 'src/application/global/components/common/header/layoutModalHeader'
  import layoutModalFooter from 'src/application/global/components/common/footer/layoutModalFooter'
  import { OpenCloseFormMixin } from 'src/application/global/mixins'
  import { mapActions, mapState, mapMutations } from 'vuex'

  export default {
    name: 'layout-modal',
    components: {
      layoutModalHeader,
      layoutModalFooter
    },
    mixins: [OpenCloseFormMixin],
    props: {
      refs: {
        type: String,
        required: true
      },
      urlResetPathName: {
        type: String
      },
      minWidth: {
        type: String,
        default: '50vw'
      },
      minHeight: {
        type: String,
        default: '30vw'
      },
      noBackdropDismiss: {
        type: Boolean,
        default: true
      },
      noEscDismiss: {
        type: Boolean,
        default: true
      },
      maximized: {
        type: Boolean,
        default: false
      },
      title: {
        type: String
      },
      subTitle: {
        type: String
      },
      shadow: {
        type: Boolean,
        default: false
      },
      classes: {
        type: String
      },
      headerLine: {
        type: Boolean,
        default: true
      },
      headerSearchBar: {
        type: Boolean,
        default: false
      },
      footerButtonOne: {
        type: String
      },
      footerButtonTwo: {
        type: String
      }
    },
    computed: {
      // Assign form related data from vuex store state
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData
      })
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'openCloseModalAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      beforeClose () {
        this.openCloseModal({name: this.openCloseModalForm.name, status: false})
        if (this.urlResetPathName) {
          this.$router.replace({name: this.urlResetPathName})
        }
      }
    }
  }
</script>
<style lang="stylus">
    .header-line
        border-top 1px solid #ffffff
</style>