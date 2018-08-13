<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="updateMasterForm"
                    formTitle="Master Update"
                    v-bind:formFieldData="masterData"
                    urlResetPathName="Masters List"
                    formAction="updateMasterAction"
                    buttonTitleCaption="Update"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="row wrap gutter-xs justify-start">

                    <div class="col-lg-6 col-md-12 col-xs-12">
                        <q-field helper="*(required)"
                                 :error="setError('title','type.exp')"
                                 :error-label="setError('title','type.msg')"
                        >
                            <q-input name="label" v-model="masterData.title" float-label="Master Title"></q-input>
                        </q-field>
                    </div>

                    <div class="col-lg-3 col-md-12 col-xs-12">
                        <q-field icon="account circle"
                                 label="Active">
                            <q-toggle v-model="masterData.active"
                                      name="active"
                                      checked-icon="visibility"
                                      unchecked-icon="visibility_off"
                                      left-label
                                      style="margin-top: 5px"
                            ></q-toggle>
                        </q-field>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import basicForm from '../../../../global/components/common/forms/basicForm'
  import { mapActions, mapState } from 'vuex'
  import qLoader from 'src/application/global/components/common/loading/loader'

  export default {
    name: 'update-master-form',
    components: {
      BasicForm: basicForm,
      qLoader
    },
    props: ['masterId'],
    computed: {
      ...mapState({
        errors: state => state.globalCMP.errors.data,
        formData: state => state.globalCMP.formData,
        currentUpdateId: state => state.globalCMP.currentUpdateId,
        isProcessingForm: state => state.globalCMP.isProcessingForm
      })
    },
    mounted: function () {
      // Set form data on mount
      if (this.masterId) {
        this.setFormData()
      }
    },
    data: () => ({
      masterData: {
        id: '',
        title: '',
        active: true
      }
    }),
    methods: {
      ...mapActions([
        'updateMasterAction',
        'loadMasterByIdAction'
      ]),
      setFormData: function () {
        this.loadMasterByIdAction(this.masterId).then((res) => {
          // clone object assign store state to local state
          this.masterData = Object.assign({}, this.formData.formData)
        })
      },
      // Return error boolean expression
      // Passing name and type
      setError: function (name, type) {
        // Check type and process
        if (type === 'type.exp') {
          // Check this.errors contains name key inside object
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            return true
          } else {
            return false
          }
        }
        // Check type and process
        if (this.errors !== undefined && this.errors.hasOwnProperty(name) && type === 'type.msg') {
          // Check this.errors contains name key inside object
          if (this.errors.hasOwnProperty(name)) {
            return this.errors[name][0]
          } else {
            return ''
          }
        }
      },
      processForm: function (formFieldData) {
        return new Promise((resolve) => {
          this.updateMasterAction(formFieldData).then((response) => {
            resolve(response)
          })
        })
      }
    }
  }
</script>