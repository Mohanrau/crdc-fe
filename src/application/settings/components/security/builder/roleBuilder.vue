<template>
    <div class="general-page-holder relative-position">
        <modal-form formName="roleBuilderForm"
                    :formTitle="$t('settings.roleForm.RoleBuilder.Label')"
                    v-bind:formFieldData="roleBuilderData"
                    formAction="roleBuilderAction"
                    :resetFormData="resetFormData"
                    :buttonTitleCaption="updateId ? $t('Common.Update.Btn') : $t('Common.Create.Btn')"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <div class="form-tabs mt-20 text-black">
                    <q-tabs inverted color="grey-6" align="justify">
                        <q-tab default
                               name="general"
                               slot="title"
                               default
                               icon="beenhere"
                               :label="$t('settings.roleForm.general.Label')"
                               :alert="$v.roleBuilderData.name.$error || $v.roleBuilderData.role_group_ids.$error"/>
                        <q-tab name="matrix"
                               slot="title"
                               icon="check_box"
                               :label="$t('settings.roleForm.matrix.Label')"
                               :alert="$v.roleBuilderData.permissions.$error"/>
                        <!-- Tab Content -->
                        <q-tab-pane name="general" class="no-border">
                            <!-- General Content-->
                            <div class="pd-10">
                                <general-tab :validation="$v" v-bind:roleBuilderData="roleBuilderData"></general-tab>
                            </div>
                            <!-- General Content End -->
                        </q-tab-pane>
                        <q-tab-pane keep-alive name="matrix" class="no-border">
                            <!-- Matrix Content-->
                            <div class="pd-10">
                                <matrix-tab :validation="$v" v-bind:roleBuilderData="roleBuilderData"></matrix-tab>
                            </div>
                            <!-- Matrix Content End -->
                        </q-tab-pane>
                    </q-tabs>
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
  import {
    GeneralTab,
    MatrixTab
  } from 'src/application/settings/components/security/builder/builder-tabs/index'
  import { required, minLength } from 'vuelidate/lib/validators'
  import { mapActions, mapState, mapGetters, mapMutations } from 'vuex'

  function defaultFormData () {
    return {
      label: '',
      name: '',
      country_id: '',
      prefix: '',
      active: true,
      role_group_ids: [],
      permissions: {
        ids: []
      }
    }
  }

  export default {
    name: 'role-builder-form',
    mixins: [setFormFieldErrorsMixin],
    components: {
      modalForm,
      qLoader,
      GeneralTab,
      MatrixTab
    },
    props: {
      'callback': {
        type: Function,
        required: true
      }
    },
    computed: {
      ...mapState({
        userTypeOptions: state => state.globalCMP.userTypes.data,
        formData: state => state.globalCMP.formData,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData
      }),
      ...mapGetters({
        updateId: 'currentUpdateId'
      })
    },
    watch: {
      openCloseModalForm: {
        handler (newData) {
          // Call if modal name match
          if (newData.status && newData.name === 'roleBuilderModal') {
            if (this.updateId) {
              this.setFormData()
            }
          }
        }
      }
    },
    data: () => ({
      roleBuilderData: defaultFormData()
    }),
    validations: {
      roleBuilderData: {
        name: {required},
        country_id: {required},
        role_group_ids: {},
        permissions: {
          ids: {
            required,
            minLength: minLength(1)
          }
        }
      }
    },
    methods: {
      ...mapActions([
        'loadRoleDataByIdAction',
        'roleBuilderAction',
        'roleBuilderUpdateAction'
      ]),
      ...mapMutations({
        setNotification: 'SHOW_NOTIFICATION'
      }),
      setFormData: function () {
        this.loadRoleDataByIdAction(this.updateId).then((res) => {
          // clone object assign store state to local state
          this.roleBuilderData = Object.assign({}, JSON.parse(JSON.stringify(this.formData.formData)))
          this.roleBuilderData.name = this.roleBuilderData.name.substring(this.roleBuilderData.name.indexOf('-') + 1, this.roleBuilderData.name.length)
        })
      },
      processForm: function (formModalData) {
        this.$v.roleBuilderData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.roleBuilderData.$error) {
            this.roleBuilderData.label = this.roleBuilderData.prefix + this.roleBuilderData.name
            this.roleBuilderData.name = this.roleBuilderData.prefix + this.roleBuilderData.name
            if (this.updateId) {
              this.roleBuilderUpdateAction(formModalData).then((response) => {
                this.callback()
                resolve(response)
              })
            } else {
              this.roleBuilderAction(formModalData).then((response) => {
                this.callback()
                resolve(response)
              })
            }
          } else {
            this.setNotification({
              title: 'Role Builder Failed',
              message: 'Validation Failed',
              type: 'negative'
            })
            reject(this.$v.roleBuilderData.$error)
          }
        })
      },
      // reset formdata to original state by calling default reset function
      resetFormData () {
        Object.assign(this.roleBuilderData, defaultFormData())
      }
    }
  }
</script>