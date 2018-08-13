<template>
    <div class="row gutter-sm justify-between">
        <div class="col-lg-6 col-md-12 col-xs-12">
            <div class="row gutter-xs justify-start">
                <div class="col-lg-12 col-md-12 col-xs-12">
                    <q-field helper="*"
                             :error="setError('country_id','type.exp') || validation.userData.country_id.$error"
                             :error-label="setError('country_id','type.msg')"
                    >
                        <q-select v-model="userData.country_id"
                                  clearable
                                  inverted-light
                                  color="white"
                                  class="no-shadow custom-input-border"
                                  :disable="lockEdit"
                                  :options="countriesOptions.options"
                                  @input="validation.userData.country_id.$touch"
                                  :placeholder="$t('Common.selectCountry.label')"
                                  :filterPlaceholder="$t('settings.roleForm.filterUserType.Label')"
                        ></q-select>
                    </q-field>
                </div>
                <div class="col-lg-12 col-md-12 col-xs-12">
                    <q-field helper="*"
                             :error="setError('name','type.exp') || validation.userData.name.$error"
                             :error-label="setError('name','type.msg')"
                    >
                        <q-input :disable="lockEdit"
                                 @input="validation.userData.name.$touch"
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 name="label"
                                 v-model="userData.name"
                                 :placeholder="$t('settings.userSetup.name.Label')"></q-input>
                    </q-field>
                </div>
                <div class="col-lg-12 col-md-12 col-xs-12">
                    <q-field helper="*"
                             :error="setError('email','type.exp') || validation.userData.email.$error"
                             :error-label="setError('email','type.msg')"
                    >
                        <q-input :disable="lockEdit"
                                 @input="validation.userData.email.$touch"
                                 name="label"
                                 v-model="userData.email"
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 :placeholder="$t('settings.userSetup.email.Label')"></q-input>
                    </q-field>
                </div>
                <div class="col-lg-12 col-md-12 col-xs-12">
                    <q-field :helper="$t('settings.stockistStaffCreation.helper')"
                             :error="setError('stockist_user_id','type.exp')"
                             :error-label="setError('stockist_user_id','type.msg')"
                    >
                        <q-input v-model.lazy="terms"
                                 :disable="userData.country_id === '' || lockEdit"
                                 clearable
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 @input="reset"
                                 @clear="reset"
                                 :placeholder="$t('stockist.list.filter.stockistSearchTerm')">
                            <q-autocomplete @search="(terms, done) => search(terms, done, 'filterTerms')"
                                            @selected="(item) => selected(item, 'stockistNumber')"/>
                        </q-input>
                    </q-field>
                </div>
                <div class="col-lg-12 col-md-12 col-xs-12">
                    <q-toggle v-model="userData.active"
                              inverted-light
                              color="positive"
                              class="no-shadow"
                              :label="$t('settings.role.activeLabel')"
                              left-label
                              checked-icon="visibility"
                              unchecked-icon="visibility_off"
                    />
                </div>
            </div>
        </div>
        <div class="col-lg-6 col-md-12 col-xs-12" :class="{'no-pointer-events' : userData.stockist_user_id !== null}">
            <div class="general-holder">
                <div class="general-item relative-position pd-10 relative-position">
                    <div class="general-label text-grey-7">
                        <div>Select role from list</div>
                        <span class="small text-negative" v-if="userData.stockist_user_id !== null">**Role selection disabled for stockist staff</span>
                    </div>
                    <q-scroll-area style="height: 55vh; max-height: 50vh;">
                        <q-list link highlight separator
                                class="no-padding no-margin">
                            <q-list-header class="bg-tertiary text-white">Role Groups
                            </q-list-header>
                            <q-item v-for="(roleGroup, index1) in roleGroupList.data"
                                    :key="`roleGroup-${index1}`"
                                    @click.native="doRoleSelection('role_groups_ids', roleGroup.id, roleGroup)"
                                    :class="{'bg-green-1' : selectedStatus('role_groups_ids', roleGroup.id)}">
                                <q-item-main :label="roleGroup.title"
                                             label-lines="2"/>
                                <q-item-side
                                        :icon="selectedStatus('role_groups_ids', roleGroup.id) ? 'check' : 'check_box_outline_blank'"></q-item-side>
                            </q-item>
                            <q-list-header class="bg-tertiary text-white">Individual roles
                            </q-list-header>
                            <q-item v-for="(role, index2) in roleList.data"
                                    :key="`role-${index2}`"
                                    @click.native="doRoleSelection('role_ids', role.id)"
                                    :class="{'bg-green-1' : selectedStatus('role_ids', role.id)}">
                                <q-item-main :label="role.name"
                                             label-lines="2"/>
                                <q-item-side
                                        :icon="selectedStatus('role_ids', role.id) ? 'check' : 'check_box_outline_blank'"></q-item-side>
                            </q-item>
                        </q-list>
                    </q-scroll-area>
                    <q-loader :visible="isProcessingList"></q-loader>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import setFormFieldErrorsMixin from 'src/application/global/mixins/setFormFieldErrorsMixin'
  import {mapState, mapActions, mapGetters} from 'vuex'

  export default {
    name: 'general-tab',
    mixins: [setFormFieldErrorsMixin],
    components: {
      qLoader
    },
    computed: {
      ...mapState({
        isProcessingList: state => state.globalCMP.isProcessingList,
        isProcessingForm: state => state.globalCMP.isProcessingForm,
        countriesOptions: state => state.globalCMP.countriesOptions.data,
        roleList: state => state.settingsCMP.roleList.list,
        roleGroupList: state => state.settingsCMP.roleGroupList.list,
        openCloseModalForm: state => state.globalCMP.openCloseModalForm.modalData,
        stockistSearchData: state => state.stockistCMP.stockistSearchData
      }),
      ...mapGetters({
        updateId: 'currentUpdateId'
      })
    },
    props: {
      'userData': {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      },
      'getUserData': {
        type: Function,
        required: true
      }
    },
    watch: {
      openCloseModalForm: {
        handler(newData) {
          // Call if modal name match
          if (newData.status && newData.name === 'createUpdateUserAndRoleModal') {
            this.initUserArea()
          }
        }
      }
    },
    data: () => ({
      lockEdit: false,
      terms: ''
    }),
    methods: {
      ...mapActions([
        'getRolesListAction',
        'getRoleGroupListAction',
        'getStockistSearchAction'
      ]),
      initUserArea() {
        // Initialize dialog modal before watch
        this.lockEdit = false,
          this.getRolesListAction()
        this.getRoleGroupListAction()
        if (this.updateId) {
          this.lockEdit = true
          this.getUserData()
        }
      },
      doRoleSelection(type, id, row) {
        // Toggle remove and add id into array based on user selection
        // check roles if user select from role groups
        if (row && row.roles.length > 0) {
          row.roles.forEach(x => {
            // if role id from role groups & role group is new entry allow to add role group role ids into role_ids
            // if role id from role groups unselected and revert role group selection then check ids and skip push into role_ids
            if (this.userData.role_ids.includes(x) || !this.userData.role_groups_ids.includes(id)) {
              this.doRoleSelection('role_ids', x)
            }
          })
        }
        if (this.userData[type].includes(id)) {
          const index = this.userData[type].indexOf(id)
          this.userData[type].splice(index, 1)
        } else {
          this.userData[type].push(id)
        }
      },
      selectedStatus(type, id) {
        return this.userData[type].includes(id)
      },
      search(terms, done, field) {
        if (field === 'filterTerms') {
          let query = {
            search_text: this.terms,
            country_id: this.userData.country_id,
            limit: 10
          }
          this.getStockistSearchAction(query).then(res => {
            done(this.stockistSearchData.list)
          })
        }
      },
      selected(item, field) {
        if (field === 'stockistNumber') {
          this.userData.stockist_user_id = item.user_id
          this.userData.role_ids = []
          this.userData.role_groups_ids = []
          this.userData.location_ids = []
          this.terms = item.label
        }
      },
      reset() {
        this.userData.stockist_user_id = null
      },
    }
  }
</script>