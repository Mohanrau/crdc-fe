<template>
    <div class="general-page-holder">
        <genaral-header genaralTitle="List of available Modules for Roles & Permissions ">
            <div slot="right-side" class="col-lg-auto col-md-auto col-xs-auto">
                <q-btn color="positive" size="sm" glossy icon="add" @click="openForm()"> {{ $t('Common.Add.Btn') }}</q-btn>
            </div>
        </genaral-header>
        <q-table
                ref="table"
                :data="serverData"
                :columns="columns"
                :pagination.sync="serverPagination"
                :filter="filter"
                :selected.sync="selected"
                :rows-per-page-options="appSettings.defaulted.table_rows_per_page_options"
                :separator="separator"
                :loading="isProcessingTable"
                @request="queryHandler"
                :visible-columns="visibleColumns"
                row-key="name"
                :color="appSettings.defaulted.table_color"
                class="bg-white shadow-1 relative-position"
                dense
        >
            <!-- Custom renderer for "action" column with button for custom action -->
            <template slot="top-left" slot-scope="props">
                <q-search hide-underline v-model="filter"/>
            </template>
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
            <q-td slot="body-cell-active" slot-scope="props" :props="props">
                <q-btn class="no-pointer-events" size="xs" dense flat v-if="props.value" color="positive" icon="lense"></q-btn>
                <q-btn class="no-pointer-events" size="xs" dense flat v-else="" color="negative" icon="lense"></q-btn>
            </q-td>
            <q-td slot="body-cell-action" slot-scope="props" :props="props">
                <div class="row gutter-xs no-wrap">
                    <div class="col">
                        <q-btn size="sm" flat dense
                               @click="actions(props.row,'update')" color="amber">
                            <q-icon name="mode_edit"/>
                            <q-tooltip :delay="1000">
                                Edit
                            </q-tooltip>
                        </q-btn>
                    </div>
                    <div class="col">
                        <q-btn  size="sm" flat dense @click="actions(props.row,'delete')" color="negative">
                            <q-icon name="delete"/>
                            <q-tooltip :delay="1000">
                                Delete
                            </q-tooltip>
                        </q-btn>
                    </div>
                    <div class="col">
                        <q-btn  size="sm" flat dense @click="actions(props,'info')" color="purple-10">
                            <q-tooltip :delay="1000">
                                Info
                            </q-tooltip>
                            <q-icon name="info"/>
                        </q-btn>
                    </div>
                </div>
            </q-td>
        </q-table>
    </div>
</template>
<script>
  import simplePagination from 'src/application/global/components/common/pagination/simplePagination'
  import genaralHeader from 'src/application/global/components/common/header/generalHeader'
  import { PaginationMixin } from 'src/application/global/mixins/index'
  import { Dialog, Platform } from 'quasar'
  import Vue from 'vue'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'ModuleListTable',
    components: {
      simplePagination,
      genaralHeader
    },
    mixins: [PaginationMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        currentUpdateId: state => state.globalCMP.currentUpdateId
      }),
      ...mapGetters({
        tableList: 'tableModuleList',
        paginationQuery: 'paginationQuery'
      })
    },
    created () {
      this.queryHandler(this.setDefaultPaginationAttr('modules'))
      this.setVisibleColumns(this.columns)
    },
    data: function () {
      return {
        selected: [],
        serverData: [],
        filter: '',
        columns: [
          {
            name: 'id',
            label: this.$t('Common.DTableLabel.ID'),
            field: 'id',
            width: '50px',
            filter: true,
            sortable: true,
            align: 'left',
            required: true,
          },
          {
            name: 'label',
            label: this.$t('Common.DTableLabel.Label'),
            field: 'label',
            width: '80px',
            filter: true,
            sortable: true,
            align: 'left',
            required: true,
          },
          {
            name: 'description',
            label: this.$t('Common.DTableLabel.Description'),
            field: 'description',
            width: '80px',
            filter: true,
            sortable: true,
            align: 'left'
          },
          {
            name: 'created_at',
            label: this.$t('Common.DTableLabel.CreatedAt'),
            field: 'created_at',
            width: '140px',
            filter: true,
            sortable: true,
            format (value) {
              return new Date(value).toLocaleString()
            },
            align: 'left'
          },
          {
            name: 'active',
            label: this.$t('Common.DTableLabel.Active'),
            field: 'active',
            width: '50px',
            classes: 'text-center',
            filter: true,
            sortable: true,
            align: 'center'
          },
          {
            name: 'action',
            label: this.$t('Common.DTableLabel.Action'),
            width: '140px',
            field: 'action',
            align: 'center'
          }
        ]
      }
    },
    methods: {
      ...mapActions([
        'openCloseModalAction',
        'getModuleListAction',
        'deleteModuleAction'
      ]),
      openForm () {
        this.$router.push({name: 'Create Module'})
      },
      queryHandler (data) {
        /**
         * @this.query is extendable
         */
        this.query = this.processQueryData(data)
        this.getModuleListAction(this.query).then((res) => {
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      refresh (done) {
        var timer = 5000
        this.queryHandler()
        if (!this.isProcessingTable) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          done()
        }, timer)
      },
      actions (row, type) {
        if (type === 'create') {
          this.$router.push('/roles-and-permissions/modules/create')
        } else if (type === 'update') {
          this.$router.push({name: 'Update Module', params: {moduleId: row.id}})
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
              this.queryHandler(this.setDefaultPaginationAttr('modules'))
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
        } else if (type === 'info') {
          // Todo waiting for quasar datatable revamp (show netsed table)
        } else {
          console.log('Table Action - Unknown(500)')
        }
      }
    }
  }
</script>
