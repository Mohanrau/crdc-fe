<template>
    <div class="general-page-holder">
        <general-header :genaralTitle="$t('settings.security.roles.setup.title')"></general-header>
        <div class="row gutter-sm relative-position">
            <div class="col-lg-5 col-md-12 col-xs-12">
                <div class="mt-10 bg-white shadow-1 pd-10">
                    <div class="row justify-between items-center">
                        <div class="col-auto">
                            <div class="q-heading">{{ $t('settings.rolesGroup.title') }}</div>
                        </div>
                        <div class="col-auto">
                            <q-btn icon="add" glossy size="sm" color="primary"
                                   @click="actions(null, 'create', 'roleGroup')">{{ $t('settings.addGroup.btn') }}
                            </q-btn>
                        </div>
                    </div>
                    <div class="col-12 mt-10">
                        <q-scroll-area style="height: 64vh; max-height: 70vh;">
                            <q-list v-if="tableDataRoleGroup.list.data.length > 0" link highlight no-border
                                    class="no-padding no-margin">
                                <q-item v-for="item in tableDataRoleGroup.list.data"
                                        :key="item.id">
                                    <q-item-side :class="{'text-positive': item.active, 'text-negative': !item.active }"
                                                 icon="lens"/>
                                    <q-item-main :label="item.title | uppercase"
                                                 label-lines="2"
                                                 @click="actions(item, 'update', 'roleGroup')"/>
                                    <q-item-side>
                                        <q-btn glossy size="sm"
                                               :disable="true"
                                               color="grey-8"
                                               @click="actions(item, 'update','roleGroup')">
                                            <q-icon name="mode_edit"></q-icon>
                                        </q-btn>
                                    </q-item-side>
                                    <q-item-side right>
                                        <q-btn glossy size="sm"
                                               :disable="true"
                                               color="grey-8"
                                               @click="actions(item, 'delete', 'roleGroup')">
                                            <q-icon name="delete"></q-icon>
                                        </q-btn>
                                    </q-item-side>
                                </q-item>
                            </q-list>
                            <empty-list v-else=""></empty-list>
                        </q-scroll-area>
                    </div>
                    <div class="col-12">
                        <div class="row justify-center">
                            <div class="col-auto" v-show="tableDataRoleGroup.list.data.length > 0" >
                                <simple-pagination uuid="role_group_listing" class="mt-10" v-if="tableDataRoleGroup"
                                                   :maxPages="tableDataRoleGroup.list.total"
                                                   :perPage="10"
                                                   :paginationHandler="handleQueryChange"></simple-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-7 col-md-12 col-xs-12">
                <div class="mt-10 bg-white shadow-1 pd-10">
                    <div class="row justify-between items-center">
                        <div class="col-auto">
                            <div class="q-heading">{{ $t('settings.Role.text') }}</div>
                        </div>
                        <div class="col-auto">
                            <q-btn v-if="selectedRolesIds.length > 0" icon="delete" glossy size="sm" color="negative"
                                   @click="actions(null, 'delete', 'role')">Delete
                            </q-btn>
                            <q-btn icon="add" glossy size="sm" color="primary"
                                   @click="actions(null, 'create', 'role')">{{ $t('settings.addRole.btn') }}
                            </q-btn>
                        </div>
                    </div>
                    <div class="col-12 mt-10 relative-position">
                        <q-scroll-area style="height: 64vh; max-height: 70vh;">
                            <table class="q-table-html bordered cell-separator full-width mt-10" v-if="tableDataRoles.list.data.length > 0">
                                <thead class="header bg-grey-3">
                                <tr>
                                    <th class="text-left">{{ $t('settings.role.idLabel') }}</th>
                                    <th class="text-left">{{ $t('settings.role.roleLabel') }}</th>
                                    <th class="text-center">{{ $t('settings.role.activeLabel') }}</th>
                                    <th class="text-center">{{ $t('settings.role.actionLabel') }}</th>
                                    <th class="text-center" v-if="false"></th>
                                </tr>
                                </thead>
                                <tbody v-for="role in tableDataRoles.list.data">
                                <tr>
                                    <td class="text-left">{{ role.id }}</td>
                                    <td class="text-left">{{ role.name | uppercase }}</td>
                                    <td class="text-center">
                                        <q-icon :class="{'text-positive': role.active === 1, 'text-negative': role.active === 0}"
                                                name="lens"></q-icon>
                                    </td>
                                    <td class="text-center" width="25%">
                                        <div class="col-auto">
                                            <q-btn glossy size="sm"
                                                   color="grey-8"
                                                   @click="actions(role, 'update', 'role')">
                                                <q-icon name="mode_edit"></q-icon>
                                            </q-btn>
                                            <q-btn glossy size="sm" disable
                                                   color="grey-8">
                                                <q-icon name="delete"></q-icon>
                                            </q-btn>
                                        </div>
                                    </td>
                                    <td class="text-center" width="5%" v-if="false">
                                        <q-checkbox :val="role.id" v-model="selectedRolesIds"></q-checkbox>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <empty-list v-if="tableDataRoles.list.data.length < 1"></empty-list>
                        </q-scroll-area>
                    </div>
                    <div class="col-12">
                        <div class="row justify-center">
                            <div class="col-auto" v-show="tableDataRoles.list.data.length > 0">
                                <simple-pagination uuid="role_listing" class="mt-10" v-if="tableDataRoles"
                                                   :maxPages="tableDataRoles.list.total"
                                                   :perPage="10"
                                                   :paginationHandler="handleQueryChange"></simple-pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <q-loader :visible="isProcessingList"></q-loader>
        </div>
        <basic-modal refs="createUpdateRoleGroupModal"
                     form
                     urlResetPathName="Roles Setup">
            <template slot="modal-data" slot-scope="props">
                <create-update-role-group-form :callback="handleQueryChange"></create-update-role-group-form>
            </template>
        </basic-modal>
        <basic-modal refs="roleBuilderModal"
                     minWidth="80vw"
                     minHeight="80vh"
                     maximized
                     form
                     urlResetPathName="Roles Setup">
            <template slot="modal-data" slot-scope="props">
                <role-builder :callback="handleQueryChange"></role-builder>
            </template>
        </basic-modal>
    </div>
</template>
<script>
  import basicModal from 'src/application/global/components/common/modal/basicModal'
  import createUpdateRoleGroupForm from './forms/createUpdateRoleGroupForm'
  import roleBuilder from './builder/roleBuilder'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import emptyList from 'src/application/global/components/common/empty/emptyList'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'roles-setup',
    components: {
      generalHeader,
      qLoader,
      basicModal,
      createUpdateRoleGroupForm,
      roleBuilder,
      simplePagination,
      emptyList
    },
    data: () => ({
      terms: '',
      selectedRolesIds: []
    }),
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        isProcessingList: state => state.globalCMP.isProcessingList,
        currentUpdateId: state => state.globalCMP.currentUpdateId
      }),
      ...mapGetters({
        tableDataRoleGroup: 'tableDataRoleGroup',
        tableDataRoles: 'tableDataRoles',
        query: 'paginationQuery'
      })
    },
    mounted () {
      this.handleQueryChange()
    },
    methods: {
      ...mapActions([
        'getRoleGroupListAction',
        'setSimplePaginationAction',
        'currentUpdateIdAction',
        'deleteRoleGroupAction',
        'getRolesListAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      handleQueryChange (type) {
        type === undefined || type === 'role_group_listing' ? this.getRoleGroupListAction(this.query('role_group_listing')) : ''
        type === undefined || type === 'role_listing' ? this.getRolesListAction(this.query('role_listing')) : ''
      },
      // simple pagination global search term
      // todo waiting for search api
      search () {
        if (this.terms.length > 3) {
          let data = {'search': this.terms}
          this.setSimplePaginationAction(data)
          this.handleQueryChange()
        }
      },
      actions (row, type, section) {
        if (type === 'create') {
          if (section === 'roleGroup') {
            this.$router.push({name: 'Role Group Create'})
            // From mixins
            setTimeout(() => {
              this.openCloseModal({name: 'createUpdateRoleGroupModal', status: true})
            }, 200)
          } else if (section === 'role') {
            this.$router.push({name: 'Role Builder'})
            // From mixins
            setTimeout(() => {
              this.openCloseModal({name: 'roleBuilderModal', status: true})
            }, 200)
          }
        } else if (type === 'update') {
          if (section === 'roleGroup') {
            this.currentUpdateIdAction(row.id)
            this.$router.push({name: 'Role Group Update', params: {roleGroupID: row.id}})
            // From mixins
            setTimeout(() => {
              this.openCloseModal({name: 'createUpdateRoleGroupModal', status: true})
            }, 200)
          } else if (section === 'role') {
            this.currentUpdateIdAction(row.id)
            this.$router.push({name: 'Role Update', params: {roleID: row.id}})
            // From mixins
            setTimeout(() => {
              this.openCloseModal({name: 'roleBuilderModal', status: true})
            }, 200)
          }
        } else if (type === 'delete') {
          this.$q.dialog({
            title: 'Warning',
            message: this.$t('Common.DeleteAlert.Text') + row.title,
            noEscDismiss: true,
            noBackdropDismiss: true,
            position: 'top',
            ok: this.$t('Common.DeleteAlert.Btn'),
            cancel: this.$t('Common.DeleteCancel.Btn'),
          }).then(() => {
            if (section === 'roleGroup') {
              this.deleteRoleGroupAction(row.id).then(response => {
                this.handleQueryChange()
              })
            }
          }).catch(() => {
          })
        } else if (type === 'info') {
          // Todo waiting for quasar datatable revamp (show netsed table)
        } else {
          console.log('Table Action - Unknown(200)')
        }
      }
    }
  }
</script>
<style>
    .list-enter-active {
        transition: all 1s;
    }

    .list-enter {
        background: yellow;
    }
</style>