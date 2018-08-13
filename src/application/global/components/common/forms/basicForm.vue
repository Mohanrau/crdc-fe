<!-- Componen HTML Area -->
<template>
    <div class="form-holder" :class="{'bg-white shadow-1' : backgroudColor}">
        <header-form :formTitle="formTitle"
                     :formName="formName"
                     :submit="submit"
                     :resetForm="resetForm"
                     :buttonOneCaption="buttonOneCaption"
                     :buttonOneIcon="buttonOneIcon"
                     :buttonOneVisibility="buttonOneVisibility"
                     :buttonTwoCaption="buttonTwoCaption"
                     :buttonTwoIcon="buttonTwoIcon"
                     :buttonTwoVisibility="buttonTwoVisibility"
                     :buttonThreeCaption="buttonThreeCaption"
                     :buttonThreeIcon="buttonThreeIcon"
                     :buttonThreeVisibility="buttonThreeVisibility"
                     :disableSubmit="disableSubmit"
                     :beforeClose="beforeClose"></header-form>
        <div class="row">
            <div class="col-12">
                <slot name="form-title"></slot>
                <div novalidate :ref="formName" :name="formName" :id="formName">
                    <slot name="form"></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<!-- Component SCRIPT area -->
<script>
  import HeaderForm from '../header/formHeader'
  import _ from 'lodash'
  import Vue from 'vue'
  import { mapActions, mapState } from 'vuex'

  export default {
    // Name is important do not delete
    name: 'basic-form',
    components: {
      HeaderForm
    },
    computed: {
      // Assign form related data from vuex store state
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm
      })
    },
    // Declare component props
    props: {
      'backgroudColor': {
        type: Boolean,
        default: false
      },
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
      'urlResetPathName': {
        type: String,
        required: true
      },
      'formSubmit': {
        type: Function,
        required: true
      },
      'disableSubmit': {
        type: Boolean,
        default: false
      },
      'buttonOneCaption': {
        type: String,
        required: false,
        default: Vue.prototype.$t('Common.Save.Btn')
      },
      'buttonOneIcon': {
        type: String,
        required: false,
        default: 'done'
      },
      'buttonOneVisibility': {
        type: Boolean,
        required: false,
        default: true
      },
      'buttonTwoCaption': {
        type: String,
        required: false,
        default: Vue.prototype.$t('Common.SaveClose.Btn')
      },
      'buttonTwoIcon': {
        type: String,
        required: false,
        default: 'done all'
      },
      'buttonTwoVisibility': {
        type: Boolean,
        required: false,
        default: true
      },
      'buttonThreeCaption': {
        type: String,
        required: false,
        default: Vue.prototype.$t('Common.Cancel.Btn')
      },
      'buttonThreeIcon': {
        type: String,
        required: false,
        default: 'clear'
      },
      'buttonThreeVisibility': {
        type: Boolean,
        required: false,
        default: true
      }
    },
    // Watch field value changes
    watch: {
      formFieldData: {
        // Clear visible validation error by field name once user correct the errors
        handler (obj) {
          if (this.errors) {
            _.forOwn(obj, (value, key) => {
              // For dynamic objects
              if (typeof obj[key] === 'object' && typeof obj[key].length !== 'undefined') {
                obj[key].forEach((item) => {
                  if (typeof item === 'object') {
                    _.forOwn(item, (value) => {
                      if (typeof (value) !== 'undefined' && value && value.length !== 0 && value !== true) {
                        this.clearFormFieldValidation(value)
                      }
                    })
                  } else {
                    if (typeof (item) !== 'undefined' && item && item.length !== 0 && item !== true) {
                      this.clearFormFieldValidation(item)
                    }
                  }
                })
              } else {
                if (typeof (value) !== 'undefined' && value && value.length !== 0 && value !== true) {
                  this.clearFormFieldValidation(key)
                }
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
      // Clear server side form validation errors
      clearFormFieldValidation (name) {
        if (Object.keys(this.errors).length > 0) {
          this.clearValidationAction(name)
        }
      },
      // Reset form fields
      resetForm () {
        this.resetErrorsAction()
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
        this.currentUpdateIdAction()
        if (redirect) {
          this.$router.push({name: this.urlResetPathName})
        }
      },
      // Close dialog form without any operations
      beforeClose () {
        this.resetForm()
        this.currentUpdateIdAction()
        this.$router.push({name: this.urlResetPathName})
      }
    }
  }
</script>
<style>
    .q-field-helper {
        color: red;
    }
</style>