<template>
    <q-modal :noBackdropDismiss="noBackdropDismiss"
             :maximized="maximized"
             no-route-dismiss
             v-model="open[refs]"
             no-refocus
             :no-esc-dismiss="noEscDismiss"
             @escape-key
             @hide="beforeClose()"
             :content-css="{padding: '5px', minWidth: minWidth, minHeight: minHeight}">
        <div class="row justify-end items-center" v-if="!form">
            <div class="text-center text-grey-6 q-body-1 text-weight-regular q-pa-sm">
                [ Press ESC key to close ] <q-btn color="negative" class="on-right" @click="beforeClose()" dense icon="close"></q-btn>
            </div>
        </div>
        <slot name="modal-data" slot-scope="props"></slot>
    </q-modal>
</template>
<script>
  import { OpenCloseFormMixin } from 'src/application/global/mixins'
  import { mapActions, mapState, mapMutations } from 'vuex'
  export default {
    name: 'basic-modal',
    mixins: [OpenCloseFormMixin],
    props: {
      refs: {
        type: String,
        required: true
      },
      'urlResetPathName': {
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
      noBackdropDismiss: {
        type: Boolean,
        default: true
      },
      noEscDismiss: {
        type: Boolean,
        default: false
      },
      maximized: {
        type: Boolean,
        default: false
      },
      form: {
        type: Boolean,
        default: false
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
        this.$router.push({name: this.urlResetPathName})
      }
    }
  }
</script>