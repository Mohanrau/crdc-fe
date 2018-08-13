<!-- Componen HTML Area -->
<template>
    <div class="form-holder">
        <modal-header-form :formTitle="formTitle"
                           :formName="formName"
                           :buttonTitleCaption="buttonTitleCaption"
                           :submit="submit"
                           :resetForm="resetForm"
                           :autoClose="autoClose"
                           :beforeClose="beforeClose"></modal-header-form>
        <div class="row">
            <div class="col-12">
                <slot name="form-title"></slot>
                <slot name="form-navigation"></slot>
                <div :ref="formName" :name="formName" :id="formName" v-on:submit.prevent>
                    <slot name="form"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<!-- Component SCRIPT area -->
<script>
  import modalHeaderForm from 'src/application/global/components/common/header/modalFormHeader'
  import _ from 'lodash'
  import { mapState, mapActions, mapMutations } from 'vuex'

  export default {
    // Name is important do not delete
    name: 'model-form',
    components: {
      modalHeaderForm
    },
    computed: {
      // Assign form related data from vuex store state
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData
      })
    },
    // Declare component props
    props: {
      'formTitle': {
        type: String,
        required: true
      },
      'formFieldData': {
        type: Object,
        required: true,
        default: () => {}
      },
      'formName': {
        type: String,
        required: true
      },
      'formSubmit': {
        type: Function,
        required: true
      },
      'buttonTitleCaption': {
        type: String,
        required: true,
        default: 'Create'
      },
      'resetFormData': {
        type: Function,
        required: false
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    // Watch field value changes
    watch: {
      formFieldData: {
        // Clear visible validation error by field name once user correct the errors
        handler (obj) {
          var self = this
          // Todo errors object not reactive change mutation set method
          if (this.errors) {
            _.forOwn(obj, function (value, key) {
              if (typeof (value) !== 'undefined' && value && value.length !== 0 && value !== true) {
                self.clearFormFieldValidation(key)
              }
            })
          }
        },
        // Watch Objects / Array deep value changes
        deep: true
      }
    },
    methods: {
      // Declare vuex actions
      ...mapActions([
        'clearValidationAction',
        'resetErrorsAction',
        'openCloseModalAction',
        'getModuleListAction',
        'currentUpdateIdAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      // Clear server side form validation errors
      clearFormFieldValidation (name) {
        if (Object.keys(this.errors).length > 0) {
          this.clearValidationAction(name)
        }
      },
      // Reset form fields
      resetForm () {
        this.resetErrorsAction()
        if (this.resetFormData) {
          this.resetFormData()
        }
      },
      // submit any form
      submit (redirect) {
        this.formSubmit(this.formFieldData).then((response) => {
          this.resetAndGo(redirect)
        })
      },
      // Complete the form submission and redirect and notify
      resetAndGo (redirect) {
        this.resetForm()
        if (redirect) {
          this.currentUpdateIdAction()
        }
        if (redirect) {
          this.openCloseModal({name: this.openCloseModalForm.name, status: false})
        }
      },
      // Close dialog form without any operations
      beforeClose () {
        // redirect true
        this.resetAndGo(true)
      }
    }
  }
</script>
<style>
    .q-field-helper {
        color: red;
    }
</style>