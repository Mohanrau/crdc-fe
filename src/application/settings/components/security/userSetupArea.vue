<template>
    <div class="general-page-holder">
        <genaral-header genaralTitle="List of back-office users">
            <div slot="right-side" class="col-lg-auto col-md-auto col-xs-auto">
                <q-btn color="positive" size="sm" icon="add" @click="openForm()"> {{ $t('Common.Add.Btn') }}</q-btn>
            </div>
        </genaral-header>
        <div class="filter-holder bg-white shadow-1">
            <div class="row items-center justify-between">
                <div class="col-lg-8">
                    <div class="row generic-margin gutter-xs">
                        <div class="col-lg-4">
                            <q-input v-model.lazy="terms"
                                     clearable
                                     @input="searchChange"
                                     :stack-label="$t('Common.search.placeholder')">
                            </q-input>
                        </div>
                        <div class="col-lg-4">
                            <q-select v-model="userTypeID"
                                      clearable
                                      @input="searchChange"
                                      :options="userTypeOptions.options"
                                      :stack-label="$t('settings.roleForm.userType.Label')"
                                      :filterPlaceholder="$t('settings.roleForm.filterUserType.Label')"
                            ></q-select>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="row full-height justify-end gutter-xs">
                        <div class="col-lg-1 gt-md">
                            <div class="verticle-line"></div>
                        </div>
                        <div class="col-lg-auto">
                            <q-btn glossy
                                   class="on-right full-width"
                                   color="primary"
                                   icon="add"
                                   label="Add User"
                                   @click="actions(null, 'create')"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <q-table
                dense
                ref="table"
                :data="serverData"
                :columns="columns"
                :pagination.sync="serverPagination"
                :selected.sync="selected"
                :rows-per-page-options="appSettings.defaulted.table_rows_per_page_options"
                :separator="separator"
                :loading="isProcessingTable"
                @request="queryHandler"
                :visible-columns="visibleColumns"
                row-key="field"
                :color="appSettings.defaulted.table_color"
                class="bg-white shadow-1 relative-position"
        >
            <!-- Custom renderer for "action" column with button for custom action -->
            <template slot="top-right" slot-scope="props">
                <q-table-columns
                        label="Settings"
                        color="secondary"
                        class="q-mr-sm"
                        v-model="visibleColumns"
                        :columns="columns"
                />
                <q-select
                        color="secondary"
                        v-model="separator"
                        :options="appSettings.defaulted.table_separators.options"
                        hide-underline
                />
                <q-btn
                        flat round dense
                        :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                        @click="props.toggleFullscreen"
                />
            </template>
            <!-- Custom renderer for "action" column with button for custom action -->
            <q-tr slot="body" slot-scope="props" :props="props" @click.native="actions(props.row,'update')"
                  class="cursor-pointer">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <span v-if="col.name === 'user_type.name'">
                        <q-chip dense color="grey-6">
                            {{ props.row.user_type !== undefined ? props.row.user_type.name : '-- N/A --' }}
                        </q-chip>
                    </span>
                    <span v-else-if="col.name === 'active'">
                        <q-btn class="no-pointer-events" dense size="xs" flat v-if="props.row.active" color="positive"
                               icon="lense"></q-btn>
                    <q-btn class="no-pointer-events" dense size="xs" flat v-else="" color="negative"
                           icon="lense"></q-btn>
                    </span>
                    <span v-else-if="col.name === 'action'">
                        <div class="row justify-center gutter-xs no-wrap">
                        <div class="col-auto">
                            <q-btn dense size="sm" flat @click="actions(props.row,'update')" color="amber">
                                <q-icon name="mode_edit"/>
                                <q-tooltip :delay="1000">
                                    Edit
                                </q-tooltip>
                            </q-btn>
                        </div>
                    </div>
                    </span>
                    <span v-else="">
                        {{ col.value }}
                    </span>
                </q-td>
            </q-tr>
        </q-table>
        <basic-modal refs="createUpdateUserAndRoleModal"
                     form
                     maximized
                     urlResetPathName="User Setup">
            <template slot="modal-data" slot-scope="props">
                <create-update-user-and-roles-form :callback="searchChange"
                                                   :userID="userID"></create-update-user-and-roles-form>
            </template>
        </basic-modal>
    </div>
</template>
<script>
  import basicModal from 'src/application/global/components/common/modal/basicModal'
  import createUpdateUserAndRolesForm from './forms/createUpdateUserAndRolesForm'
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import {PaginationMixin} from 'src/application/global/mixins/index'
  import {Dialog, Platform} from 'quasar'
  import Vue from 'vue'
  import {mapState, mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    name: 'ModuleListTable',
    components: {
      simplePagination,
      genaralHeader,
      basicModal,
      createUpdateUserAndRolesForm
    },
    mixins: [PaginationMixin],
    props: ['userID'],
    computed: {
      ...mapState({
        userTypeOptions: state => state.globalCMP.userTypes.data,
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        currentUpdateId: state => state.globalCMP.currentUpdateId
      }),
      ...mapGetters({
        tableList: 'tableUsersList',
        paginationQuery: 'paginationQuery'
      })
    },
    created() {
      this.searchChange()
      this.setVisibleColumns(this.columns)
    },
    data: function () {
      return {
        selected: [],
        serverData: [],
        terms: '',
        userTypeID: null,
        columns: [
          {
            name: 'id',
            label: this.$t('Common.DTableLabel.ID'),
            field: 'id',
            filter: true,
            sortable: true,
            required: true,
          },
          {
            name: 'user_type.name',
            label: this.$t('Common.DTableLabel.Type'),
            field: 'id',
            filter: true,
            sortable: true,
            required: true,
          },
          {
            name: 'name',
            label: this.$t('Common.DTableLabel.Name'),
            field: 'name',
            filter: true,
            sortable: true,
            required: true,
          },
          {
            name: 'email',
            label: this.$t('Common.DTableLabel.Email'),
            field: 'email',
            filter: true,
            sortable: true,
          },
          {
            name: 'created_at',
            label: this.$t('Common.DTableLabel.CreatedAt'),
            field: 'created_at',
            filter: true,
            sortable: true,
            format(value) {
              return new Date(value).toLocaleString()
            },
          },
          {
            name: 'active',
            label: this.$t('Common.DTableLabel.Status'),
            field: 'active',
            classes: 'text-center',
            filter: true,
            sortable: true,
            align: 'center'
          },
          {
            name: 'action',
            label: this.$t('Common.DTableLabel.Action'),
            field: 'action',
            align: 'center'
          }
        ]
      }
    },
    methods: {
      ...mapActions([
        'openCloseModalAction',
        'getUsersListAction',
        'deleteModuleAction',
        'currentUpdateIdAction',
        'getUserTypesAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      queryHandler(data) {
        /**
         * @this.query is extendable
         */
        this.query = this.processQueryData(data)
        this.query.search = this.terms
        this.query.user_type_id = this.userTypeID
        this.getUserTypesAction()
        this.getUsersListAction(this.query).then((res) => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      searchChange() {
        this.queryHandler(this.setDefaultPaginationAttr('users'))
      },
      actions(row, type) {
        if (type === 'create') {
          this.$router.push({name: 'Add User'})
          // From mixins
          this.openCloseModal({name: 'createUpdateUserAndRoleModal', status: true})
        } else if (type === 'update') {
          this.currentUpdateIdAction(row.id)
          this.$router.push({name: 'Update User', params: {userID: row.id}})
          this.openCloseModal({name: 'createUpdateUserAndRoleModal', status: true})
        } else if (type === 'delete') {
          Dialog.create({
            title: 'Warning',
            message: this.$t('Common.DeleteAlert.Text') + row.label,
            noEscDismiss: true,
            noBackdropDismiss: true,
            position: 'top',
            ok: this.$t('Common.DeleteAlert.Btn'),
            cancel: this.$t('Common.DeleteCancel.Btn'),
          }).then(() => {
            this.deleteModuleAction(row.id).then(response => {
              this.$q.notify({
                message: response.data,
                timeout: this.appSettings.notifications.timeout,
                type: 'positive',
                icon: 'done',
                position: 'top-right',
                actions: [
                  {
                    label: 'Dismiss',
                    handler: () => {
                    }
                  }
                ]
              })
              this.queryHandler(this.setDefaultPaginationAttr('users'))
            })
          }).catch(() => {
            this.$q.notify({
              message: 'Delete Operation Aborted',
              timeout: this.appSettings.notifications.timeout,
              type: 'warning',
              icon: 'priority_high',
              position: 'top-right',
              actions: [
                {
                  label: 'Dismiss',
                  handler: () => {
                  }
                }
              ]
            })
          })
        } else {
          console.log('Table Action - Unknown(500)')
        }
      }
    }
  }
</script>
