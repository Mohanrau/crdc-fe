<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createMasterDataForm"
                    :formTitle="$t('masters.create.masterData.title')"
                    v-bind:formFieldData="masterData"
                    urlResetPathName="Masters Data List"
                    formAction="createMasterDataAction"
                    :buttonTitleCaption="$t('Common.CreateBtn')"
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
                                      :placeholder="$t('general.master.text')"
                                      :floatLabel="$t('general.master.text')"
                                      :filterPlaceholder="$t('masters.search.master.label')"
                            ></q-select>
                        </q-field>
                    </div>

                    <div class="col-lg-6 col-md-12 col-xs-12">
                        <q-field helper="*(required)"
                                 :error="setError('title','type.exp')"
                                 :error-label="setError('title','type.msg')"
                        >
                            <q-input name="label" v-model="masterData.title" :float-label="$t('masters.createMaster.masterTile.label')"></q-input>
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
    name: 'create-master-data-form',
    components: {
      BasicForm: basicForm,
      qLoader
    },
    props: {},
    computed: {
      ...mapState({
        mastersDataOptions: state => state.mastersDataCMP.mastersDataOptions.data,
        errors: state => state.globalCMP.errors.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm
      })
    },
    mounted: function () {
      this.getMasterDataOptionsAction()
    },
    data: () => ({
      masterData: {
        master_id: '',
        title: ''
      }
    }),
    methods: {
      ...mapActions([
        'createMasterDataAction',
        'getMasterDataOptionsAction'
      ]),
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
          this.createMasterDataAction(formFieldData).then((response) => {
            resolve(response)
          })
        })
      }
    }
  }
</script>