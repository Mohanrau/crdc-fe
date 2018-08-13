<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="updateMasterDataForm"
                    formTitle="Master Data Update"
                    v-bind:formFieldData="masterData"
                    urlResetPathName="Masters Data List"
                    formAction="updateMasterDataAction"
                    buttonTitleCaption="Update"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="row wrap gutter-xs justify-start">
                    <div class="col-lg-6 col-md-12 col-xs-12">
                        <q-field :error="setError('id','type.exp')"
                                 :error-label="setError('id','type.msg')"
                        >
                            <q-select v-model="masterData.master_id"
                                      :options="mastersDataOptions.options"
                                      filter
                                      name="id"
                                      placeholder="Master"
                                      floatLabel="Master"
                                      filterPlaceholder="Search Master ..."
                            ></q-select>
                        </q-field>
                    </div>

                    <div class="col-lg-6 col-md-12 col-xs-12">
                        <q-field helper="*(required)"
                                 :error="setError('label','type.exp')"
                                 :error-label="setError('label','type.msg')"
                        >
                            <q-input name="label" v-model="masterData.title" float-label="Master Title"></q-input>
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
    name: 'update-master-data-form',
    components: {
      BasicForm: basicForm,
      qLoader
    },
    props: ['masterDataId'],
    computed: {
      ...mapState({
        mastersDataOptions: state => state.mastersDataCMP.mastersDataOptions.data,
        errors: state => state.globalCMP.errors.data,
        formData: state => state.globalCMP.formData,
        currentUpdateId: state => state.globalCMP.currentUpdateId,
        isProcessingForm: state => state.globalCMP.isProcessingForm
      })
    },
    mounted: function () {
      // Set form data on mount
      this.getMasterDataOptionsAction()
      if (this.masterDataId) {
        this.setFormData()
      }
    },
    data: () => ({
      masterData: {
        master_id: '',
        title: ''
      }
    }),
    methods: {
      ...mapActions([
        'updateMasterDataAction',
        'loadMasterDataByIdAction',
        'getMasterDataOptionsAction'
      ]),
      setFormData: function () {
        this.loadMasterDataByIdAction(this.masterDataId).then((res) => {
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
          this.updateMasterDataAction(formFieldData).then((response) => {
            resolve(response)
          })
        })
      }
    }
  }
</script>