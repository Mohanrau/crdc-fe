<template>
    <div class="general-page-holder">
        <general-header generalTitle="List of available Master Data">
            <div slot="right-side" class="col-lg-auto col-md-auto col-xs-auto">
                <q-btn color="positive" small icon="add" @click="openForm()"> {{ $t('Common.Add.Btn') }}</q-btn>
            </div>
        </general-header>
        <q-data-table
                :data="rows"
                :config="config"
                :columns="columns"
                @refresh="refresh"
                class="bg-white shadow-1 relative-position"
        >
            <!-- Custom renderer for "action" column with button for custom action -->
            <template slot='col-action' slot-scope='cell'>
                <q-btn small push @click="actions(cell.row,'update')" color="amber">
                    <q-icon name="mode_edit"/>
                    <q-tooltip :delay="1000">
                        Edit
                    </q-tooltip>
                </q-btn>
                <q-btn small push @click="actions(cell.row,'delete')" color="negative">
                    <q-icon name="delete"/>
                    <q-tooltip :delay="1000">
                        Delete
                    </q-tooltip>
                </q-btn>
                <q-btn small push @click="actions(cell,'info')" color="purple-10">
                    <q-tooltip :delay="1000">
                        Info
                    </q-tooltip>
                    <q-icon name="info"/>
                </q-btn>
            </template>
        </q-data-table>
        <div class="row justify-end generic-margin">
            <div>
                <simple-pagination :perPage="10" :maxPages="maxPages" :paginationHandler="queryHandler"/>
            </div>
        </div>
    </div>
</template>
<script>
  import createMasterDataForm from './forms/createMasterDataForm'
  import updateMasterDataForm from './forms/updateMasterDataForm'
  import simplePagination from '../../../global/components/common/pagination/simplePagination'
  import generalHeader from '../../../global/components/common/header/generalHeader'
  import { Dialog } from 'quasar'
  import Vue from 'vue'
  import { mapState, mapActions, mapGetters } from 'vuex'

  export default {
    name: 'MasterDataListTable',
    components: {
      createMasterDataForm,
      updateMasterDataForm,
      simplePagination,
      generalHeader
    },
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        currentUpdateId: state => state.globalCMP.currentUpdateId
      }),
      ...mapGetters({
        tableList: 'tableMasterDataList',
        paginationQuery: 'paginationQuery'
      })
    },
    created () {
      this.queryHandler()
    },
    data: function () {
      return {
        minPages: 1,
        maxPages: 1,
        rows: [],
        config: {
          refresh: true,
          noHeader: false,
          columnPicker: true,
          bodyStyle: {
            maxHeight: '500px'
          },
          rowHeight: '50px',
          responsive: true,
          selection: 'multiple',
          labels: {
            search: this.$t('Common.search.placeholder'),
            columns: this.$t('Common.DTableLabel.Columns'),
            allCols: this.$t('Common.DTableLabel.AllColumns')
          }
        },
        columns: [
          {
            label: this.$t('Common.DTableLabel.ID'),
            field: 'id',
            width: '50px',
            filter: true,
            sort: true
          },
          {
            label: this.$t('Common.DTableLabel.Title'),
            field: 'title',
            width: '220px',
            filter: true,
            sort: true
          },
          {
            label: this.$t('Common.DTableLabel.CreatedAt'),
            field: 'created_at',
            width: '140px',
            filter: true,
            sort: true,
            format (value) {
              return new Date(value).toLocaleString()
            }
          },
          {
            label: this.$t('Common.DTableLabel.Action'),
            width: '140px',
            field: 'action'
          }
        ]
      }
    },
    watch: {
      tableList: {
        handler () {
          this.setUpdateTableData(true)
        },
        deep: true // must deep
      }
    },
    methods: {
      ...mapActions([
        'openCloseModalAction',
        'getMasterDataListAction',
        'deleteMasterDataAction'
      ]),
      openForm () {
        this.$router.replace('/masters-data/master-data/create')
      },
      // Query is optional parameter
      // Default ?limit=10&offset=0&sort=&order=
      queryHandler () {
        Vue.nextTick(() => {
          this.getMasterDataListAction(this.paginationQuery)
        })
      },
      // Refresh table data form store state
      setUpdateTableData () {
        // tableData set by Vue.set() sp JSON.stringify is used to remove array observer the append by Vue.set()
        this.rows = JSON.parse(JSON.stringify(this.tableList.list.data))
        this.maxPages = this.tableList.list.total
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
          this.$router.push('/masters-data/create')
        } else if (type === 'update') {
          this.$router.push('/masters-data/master-data/' + row.id + '/update')
        } else if (type === 'delete') {
          Dialog.create({
            title: 'Warning',
            message: this.$t('Common.DeleteAlert.Text') + `<br><b>` + row.title + `</b>`,
            noEscDismiss: true,
            noBackdropDismiss: true,
            position: 'top',
            buttons: [
              this.$t('Common.DeleteCancel.Btn'),
              {
                label: this.$t('Common.DeleteAlert.Btn'),
                handler: () => {
                  this.deleteMasterDataAction(row.id).then(response => {
                    this.queryHandler()
                    this.$q.notify(row.title + ' Successfully Deleted')
                  })
                }
              }
            ]
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
<style>
    .q-data-table td, .q-data-table th {
        /* don't shorten cell contents */
        /*white-space: normal !important;*/
    }
</style>
