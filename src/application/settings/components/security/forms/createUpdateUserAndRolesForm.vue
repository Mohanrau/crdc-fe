<template>
    <div class="general-page-holder relative-position">
        <modal-form formName="createUpdateRoleGroupForm"
                    :formTitle="updateId ? $t('settings.userSetup.updateUserAndRolesForm.Label') : $t('settings.userSetup.createUserAndRolesForm.Label')"
                    v-bind:formFieldData="userData"
                    :autoClose="false"
                    formAction="createRoleGroupAction"
                    :buttonTitleCaption="updateId ? $t('Common.Update.Btn') : $t('Common.Create.Btn')"
                    :formSubmit="processForm">
            <template slot="form" slot-scope="props">
                <q-tabs inverted color="grey-6" align="justify">
                    <q-tab default
                           name="general"
                           slot="title"
                           default
                           :label="$t('settings.user.setup.tab.generalInformation.label')"
                           icon="assignment_turned_in"/>
                    <q-tab name="location"
                           :disable="userData.stockist_user_id !== null"
                           :label="$t('settings.user.setup.tab.AssignLocations.label')"
                           slot="title"
                           icon="add_location"/>
                    <q-tab-pane keep-alive name="general" class="no-border">
                        <!-- General Content-->
                        <div class="pd-10">
                            <general-tab :userData="userData" :validation="$v" :getUserData="getUserData"></general-tab>
                        </div>
                        <!-- General Content End -->
                    </q-tab-pane>
                    <q-tab-pane name="location" class="no-border">
                        <!-- Matrix Content-->
                        <div class="pd-10">
                            <location-tab :userData="userData" :userID="userID"></location-tab>
                        </div>
                        <!-- Matrix Content End -->
                    </q-tab-pane>
                </q-tabs>
            </template>
        </modal-form>
        <q-loader :visible="isProcessingForm"></q-loader>
    </div>
</template>
<script>
  import modalForm from 'src/application/global/components/common/forms/modalForm'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import { GeneralTab, LocationTab } from 'src/application/settings/components/security/users/user-setup-tabs'
  import { required, email, requiredIf } from 'vuelidate/lib/validators'
  import { mapActions, mapState, mapGetters } from 'vuex'

  function defaultFormData () {
    return {
      country_id: '',
      name: '',
      email: '',
      active: true,
      role_ids: [],
      stockist_user_id: null,
      role_groups_ids: [],
      location_ids: []
    }
  }

  export default {
    name: 'create-update-user-and-role-form',
    components: {
      LocationTab,
      GeneralTab,
      modalForm,
      qLoader
    },
    props: {
      callback: {
        type: Function,
        required: true
      },
      userID: {
        required: true
      }
    },
    watch: {
      openCloseModalForm: {
        handler(newData) {
          // Call if modal name match
          if (newData.status && newData.name === 'createUpdateUserAndRoleModal') {
            Object.assign(this.userData, defaultFormData())
          }
        }
      }
    },
    computed: {
      ...mapState({
        userTypeOptions: state => state.globalCMP.userTypes.data,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
      }),
      ...mapGetters({
        updateId: 'currentUpdateId',
        formData: 'formData'
      })
    },
    validations: {
      userData: {
        country_id: {
          required: requiredIf(false)
        },
        name: {
          required: requiredIf(false)
        },
        email: {
          required: requiredIf(false),
          email
        }
      }
    },
    data: () => ({
      userData: defaultFormData()
    }),
    methods: {
      ...mapActions([
        'loadUserByIdAction',
        'createStaffAction',
        'updateUserAction',
        'currentUpdateIdAction'
      ]),
      getUserData: function () {
        this.loadUserByIdAction(this.updateId).then((res) => {
          this.setFormData()
        })
      },
      setFormData () {
        Object.assign(this.userData, this.formData)
      },
      processForm: function (formModalData) {
        this.$v.userData.$touch()
        return new Promise((resolve, reject) => {
          if (!this.$v.userData.$error) {
            if (this.updateId) {
              this.userData.user_id = this.updateId
              this.updateUserAction(formModalData).then((response) => {
                this.callback()
                this.setFormData()
                resolve(response)
              })
            } else {
              this.createStaffAction(formModalData).then((response) => {
                this.callback()
                this.setFormData()
                resolve(response)
              })
            }
          } else {
            reject(this.$v.userData.$error)
          }
        })
      }
    }
  }
</script>