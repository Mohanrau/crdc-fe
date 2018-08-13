<template>
    <div class="general-page-holder relative-position">
        <basic-form formName="createModuleForm"
                    :formTitle="$t('general.create_module.text')"
                    v-bind:formFieldData="moduleData"
                    urlResetPathName="Module Setup"
                    formAction="createModuleAction"
                    :buttonTitleCaption="$t('Common.CreateBtn')"
                    :backgroudColor="false"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <!-- content Area-->
                <div class="content-sections mt-20 pd-10 bg-white shadow-1">
                    <div class="row gutter-sm">
                        <div class="col-lg-12">
                            <div class="row gutter-sm">
                                <div class="col-lg-4 col-md-12 col-xs-12">
                                    <q-field :error="setError('parent_id','type.exp')"
                                             :error-label="setError('parent_id','type.msg')"
                                    >
                                        <q-select v-model="moduleData.parent_id"
                                                  :options="modulesOptions.options"
                                                  filter
                                                  clearable
                                                  :stack-label="$t('general.modules.text')"
                                                  :filterPlaceholder="$t('general.searchModule.placeholder')"
                                        ></q-select>
                                    </q-field>
                                </div>

                                <div class="col-lg-4 col-md-12 col-xs-12">
                                    <q-field helper="*"
                                             :error="$v.moduleData.label.$error || setError('label','type.exp')"
                                             :error-label="$t('Common.address.errorLabel.requiredField') || setError('label','type.msg')"
                                    >
                                        <q-input name="label" v-model="moduleData.label"
                                                 clearable
                                                 :stack-label="$t('general.modulesLabel.text')"></q-input>
                                    </q-field>
                                </div>
                                <div class="col-lg-4 col-md-12 col-xs-12">
                                    <q-field helper="*"
                                             :error="$v.moduleData.alias.$error || setError('label','type.exp')"
                                             :error-label="$t('Common.address.errorLabel.requiredField') || setError('label','type.msg')"
                                    >
                                        <q-input name="label" v-model="moduleData.alias"
                                                 clearable
                                                 prefix="@/"
                                                 :stack-label="$t('general.modulesAliasLabel.text')"></q-input>
                                    </q-field>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row gutter-sm">
                                <div class="col-lg-12 col-md-12 col-xs-12">
                                    <q-field>
                                        <q-input :min-rows="5" type="textarea" name="description"
                                                 v-model="moduleData.description"
                                                 :stack-label="$t('general.moduleDescription.label')"></q-input>
                                    </q-field>
                                </div>
                                <div class="col-lg-6 col-md-12 col-xs-12">
                                    <q-field :label="$t('Common.DTableLabel.Active')">
                                        <q-toggle v-model="moduleData.active"
                                                  name="active"
                                                  checked-icon="visibility"
                                                  unchecked-icon="visibility_off"
                                                  left-label
                                                  style="margin-top: 5px"
                                        ></q-toggle>
                                    </q-field>
                                </div>
                                <div class="col-lg-6 col-md-12 col-xs-12">
                                    <q-field helper="*"
                                             :label="$t('general.moduleOperations.label')"
                                             :error="$v.moduleData.operations.$error || setError('operations','type.exp')"
                                             :error-label="$t('Common.address.errorLabel.requiredField') || setError('operations','type.msg')"
                                    >
                                        <q-option-group type="checkbox"
                                                        name="operations"
                                                        @input="addRemoveOperations"
                                                        v-model="moduleData.operations"
                                                        :options="operationsOptions.options"
                                        ></q-option-group>
                                    </q-field>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="row gutter-sm">
                                <div class="col-lg-12 col-md-12 col-xs-12">
                                    <q-list dense>
                                        <q-list-header>
                                            Selected Operations
                                            <div class="q-caption text-red">
                                                * Main module @alias auto append just input selected operation @alias
                                            </div>
                                        </q-list-header>
                                        <q-item tag="label"
                                                v-if="moduleData.selected_operations !== undefined && moduleData.selected_operations.length > 0"
                                                v-for="(operation, index) in moduleData.selected_operations"
                                                :key="index">
                                            <q-item-main>
                                                <q-item-tile>{{ operation.label }}
                                                </q-item-tile>
                                                <q-item-tile sublabel>
                                                    <q-field helper="*"
                                                             :error="$v.moduleData.selected_operations.$each[index].alias.$error"
                                                             :error-label="$t('Common.address.errorLabel.requiredField')">
                                                        <q-input name="label" v-model="operation.alias"
                                                                 clearable
                                                                 :prefix="`@${moduleData.alias}/`"
                                                                 :stack-label="$t('general.modulesAliasLabel.text')"></q-input>
                                                    </q-field>
                                                </q-item-tile>
                                            </q-item-main>
                                        </q-item>
                                        <empty v-if="moduleData.selected_operations === undefined || moduleData.selected_operations.length < 1"></empty>
                                    </q-list>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </basic-form>
        <q-loader :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import basicForm from '../../../../global/components/common/forms/basicForm'
  import { SetFormFieldErrorsMixin } from 'src/application/global/mixins'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import empty from 'src/application/global/components/common/empty/emptyList.vue'
  import { required } from 'vuelidate/lib/validators'
  import { mapActions, mapState, mapMutations } from 'vuex'

  export default {
    name: 'create-module-form',
    components: {
      BasicForm: basicForm,
      qLoader,
      empty
    },
    mixins: [SetFormFieldErrorsMixin],
    props: ['moduleId'],
    computed: {
      ...mapState({
        modulesOptions: state => state.settingsCMP.modulesOptions.data,
        operationsOptions: state => state.settingsCMP.operationsOptions.data,
        errors: state => state.globalCMP.errors.data,
        formData: state => state.globalCMP.formData,
        currentUpdateId: state => state.globalCMP.currentUpdateId,
        isProcessingForm: state => state.globalCMP.isProcessingForm
      })
    },
    validations () {
      let def = {
        moduleData: {
          label: {
            required
          },
          alias: {
            required
          },
          operations: {
            required
          },
          selected_operations: {}
        }
      }

      if (this.moduleData.selected_operations.length > 0) {
        def.moduleData.selected_operations = {
          $each: {
            alias: {
              required
            }
          }
        }
      }
      return def
    },
    mounted: function () {
      // Set form data on mount
      if (this.moduleId) {
        this.setFormData()
      }
      this.getOptionsAction()
      this.getOperationsAction()
    },
    data: () => ({
      moduleData: {
        parent_id: '',
        label: '',
        alias: '',
        description: '',
        operations: [],
        selected_operations: [],
        active: true
      }
    }),
    methods: {
      ...mapActions([
        'createModuleAction',
        'updateModuleAction',
        'getOptionsAction',
        'getOperationsAction',
        'loadModuleDataByIdAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION',
        setIsProcessingForm: 'IS_PROCESSING_FORM',
      }),
      addRemoveOperations (value) {
        if (Array.isArray(value)) {
          value.forEach((selected) => {
            let addIndex = this.moduleData.selected_operations.findIndex((item) => item.id === selected)
            if (addIndex === -1) {
              let data = {
                id: selected,
                label: this.operationsOptions.options.find((x) => x.value === selected).label,
                alias: ''
              }
              this.moduleData.selected_operations.push(data)
            }
          })
        }
        this.moduleData.selected_operations.forEach((selected) => {
          let removeIndex = this.moduleData.operations.findIndex(x => x === selected.id)
          if (removeIndex === -1) {
            this.moduleData.selected_operations.splice(removeIndex, 1)
          }
        })
      },
      invalidRequest () {
        this.setIsProcessingForm(true)
        this.message = 'Oops something went wrong. Redirecting ...'
        this.show = false
        setTimeout(() => {
          this.setIsProcessingForm(false)
          this.$router.push({name: 'Module List'})
        }, 1500)
      },
      setFormData: function () {
        this.getOptionsAction()
        this.getOperationsAction()
        this.loadModuleDataByIdAction(this.moduleId).then((res) => {
          // clone object assign store state to local state
          this.moduleData = Object.assign({}, this.formData.formData)
        }).catch((error) => {
          if (error.status === 404) {
            this.setNotification({
              title: 'Uh oh! An error occured',
              message: error.data.error,
              type: 'negative'
            })
          }
          this.invalidRequest()
        })
      },
      processForm: function (formFieldData) {
        this.$v.moduleData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.moduleData.$error) {
            if (this.moduleId) {
              this.updateModuleAction(formFieldData).then((response) => {
                resolve(response)
              })
            } else {
              this.createModuleAction(formFieldData).then((response) => {
                this.$router.push({name: 'Update Module', params: {moduleId: response.id}})
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'Module Creation Failed',
              message: this.$t('validation.failed'),
              type: 'negative'
            })
            reject(this.$v.moduleData.$error)
          }
        })
      }
    }
  }
</script>