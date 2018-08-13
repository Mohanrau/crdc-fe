<template>
    <div class="general-page-holder relative-position">
        <modal-form formName="createUpdateRoleGroupForm"
                    :formTitle="updateId ? $t('settings.roleForm.updateRoleGroup.Label') : $t('settings.roleForm.createRoleGroup.Label')"
                    v-bind:formFieldData="roleGroupData"
                    formAction="createRoleGroupAction"
                    :buttonTitleCaption="updateId ? $t('Common.Update.Btn') : $t('Common.Create.Btn')"
                    :resetFormData="resetFormData"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="row wrap gutter-xs justify-start">
                    <div class="col-lg-5 col-md-12 col-xs-12">
                        <q-field helper="*"
                                 :error="setError('user_type_id','type.exp')"
                                 :error-label="setError('user_type_id','type.msg')"
                        >
                            <q-select v-model="roleGroupData.country_id"
                                      :options="countriesOptions.options"
                                      @input="setPrefix('country')"
                                      :stack-label="$t('settings.role.prefix')"
                                      :filterPlaceholder="$t('settings.roleForm.filterUserType.Label')"
                            ></q-select>
                        </q-field>
                    </div>
                    <div class="col-lg-7 col-md-12 col-xs-12">
                        <q-field helper="*"
                                 :error="setError('user_type_id','type.exp')"
                                 :error-label="setError('user_type_id','type.msg')"
                        >
                            <q-select v-model="roleGroupData.user_type_id"
                                      :options="userTypeOptions.options"
                                      @input="setPrefix('userType')"
                                      :stack-label="$t('settings.roleForm.userType.Label')"
                                      :filterPlaceholder="$t('settings.roleForm.filterUserType.Label')"
                            ></q-select>
                        </q-field>
                    </div>
                    <div class="col-lg-12 col-md-12 col-xs-12">
                        <q-field helper="*"
                                 :error="setError('title','type.exp') || $v.roleGroupData.title.$error"
                                 :error-label="setError('title','type.msg') || $v.roleGroupData.title.$error ? 'Alpha characters only, spaces not allowed here' : ''"
                        >
                            <q-input @input="$v.roleGroupData.title.$touch" :prefix="'@' + roleGroupData.prefix" name="label" v-model="roleGroupData.title" :stack-label="$t('settings.roleForm.roleGroupName.Label')"></q-input>
                        </q-field>
                    </div>
                    <div class="col-lg-12 col-md-12 col-xs-12">
                        <q-toggle v-model="roleGroupData.active"
                                  :label="$t('settings.role.activeLabel')"
                                  left-label
                                  checked-icon="visibility"
                                  unchecked-icon="visibility_off"
                        />
                    </div>
                </div>
            </template>
        </modal-form>
        <q-loader :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import modalForm from 'src/application/global/components/common/forms/modalForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import { required, alpha } from 'vuelidate/lib/validators'
  import { mapActions, mapState, mapGetters } from 'vuex'

  function defaultFormData () {
    return {
      country_id: '',
      prefix: '',
      user_type_id: '',
      title: '',
      active: true
    }
  }

  export default {
    name: 'create-update-role-group-form',
    mixins: [setFormFieldErrorsMixin],
    components: {
      modalForm,
      qLoader
    },
    props: {
      callback: {
        type: Function,
        required: true
      }
    },
    computed: {
      ...mapState({
        userTypeOptions: state => state.globalCMP.userTypes.data,
        formData: state => state.globalCMP.formData,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
      }),
      ...mapGetters({
        updateId: 'currentUpdateId'
      })
    },
    watch: {
      openCloseModalForm: {
        handler (newData) {
          // Call if modal name match
          if (newData.status && newData.name === 'createUpdateRoleGroupModal') {
            // Initialize dialog modal before watch
            this.getUserTypesAction()
            if (this.updateId) {
              this.setFormData()
            }
          }
        }
      }
    },
    validations: {
      roleGroupData: {
        title: {
          required,
          alpha
        }
      }
    },
    data: () => ({
      userTypePrefix: '',
      countryPrefix: '',
      roleGroupData: defaultFormData()
    }),
    methods: {
      ...mapActions([
        'createRoleGroupAction',
        'updateRoleGroupAction',
        'loadRoleGroupDataByIdAction',
        'getUserTypesAction'
      ]),
      setPrefix (type) {
        if (type === 'userType') {
          this.userTypePrefix = this.userTypeOptions.options.find(x => x.value === this.roleGroupData.user_type_id).label
        } else {
          this.countryPrefix = this.countriesOptions.options.find(x => x.value === this.roleGroupData.country_id).code
        }
        this.roleGroupData.prefix = this.countryPrefix.toUpperCase() + '-' + this.userTypePrefix.toUpperCase() + '-'
      },
      setFormData: function () {
        this.loadRoleGroupDataByIdAction(this.updateId).then((res) => {
          // clone object assign store state to local state
          this.roleGroupData = Object.assign({}, JSON.parse(JSON.stringify(this.formData.formData)))
          this.roleGroupData.title = this.roleGroupData.title.substring(this.roleGroupData.title.lastIndexOf('-') + 1, this.roleGroupData.title.length)
        })
      },
      processForm: function (formModalData) {
        this.roleGroupData.title = this.roleGroupData.prefix + this.roleGroupData.title
        return new Promise((resolve) => {
          if (this.updateId) {
            this.updateRoleGroupAction(formModalData).then((response) => {
              this.callback()
              resolve(response)
            })
          } else {
            this.createRoleGroupAction(formModalData).then((response) => {
              this.callback()
              resolve(response)
            })
          }
        })
      },
      // reset formdata to original state by calling default reset function
      resetFormData () {
        Object.assign(this.roleGroupData, defaultFormData())
      }
    }
  }
</script>