<template>
    <div class="general-page-holder">
        <general-header genaralTitle="List of Email Reports"></general-header>
        <q-table
                :data="serverData"
                :columns="columns"
                :pagination.sync="serverPagination"
                :rows-per-page-options="appSettings.defaulted.table_rows_per_page_options"
                :separator="separator"
                :loading="isProcessingTable"
                @request="queryHandler"
                :visible-columns="visibleColumns"
                row-key="name"
                :color="appSettings.defaulted.table_color"
                dense
                class="bg-white"
        >
            <!-- Custom Slots -->
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
            <q-td slot="body-cell-action" slot-scope="props" :props="props">
                <div class="row gutter-xs no-wrap">
                    <div class="col">
                        <q-btn size="sm" outline push @click="mixActions(props.row,'info', 'reportsEmailModal')"
                               color="warning">
                            <q-tooltip :delay="1000">
                                View
                            </q-tooltip>
                            <q-icon name="visibility"/>
                        </q-btn>
                    </div>
                </div>
            </q-td>
        </q-table>
        <layout-modal refs="reportsEmailModal"
                      urlResetPathName=""
                      title="Email Details"
                      :shadow="false"
                      minWidth="70vw"
                      minHeight="90vh"
                      footerButtonTwo="Close"
                      :headerSearchBar="false"
                      :noEscDismiss="false"
                      :search="true"
                      classes="transparent text-black">
            <template slot="modal-data" slot-scope="props">
                <div class="data q-pa-lg">
                    <div class="row items-baseline justify-between">
                        <div class="q-title"> {{ modalData.subject }} </div>
                        <div class="q-caption"><q-chip tag square color="primary">{{ modalData.created_at }}</q-chip></div>
                    </div>
                    <table class="q-table-html q-mt-sm">
                        <tr>
                            <td class="bg-grey-1">Recipient</td>
                            <td>{{ modalData.to }}</td>
                        </tr>
                        <tr>
                            <td class="bg-grey-1">Sender</td>
                            <td>{{ modalData.from }}</td>
                        </tr>
                        <tr>
                            <td class="bg-grey-1">Created</td>
                            <td>{{ humanizeDateTime(modalData.created_at) }}</td>
                        </tr>
                    </table>
                    <div class="message q-mt-lg">
                        {{ modalData.body }}
                    </div>
                </div>
            </template>
        </layout-modal>
    </div>
</template>
<script>
  import Vue from 'vue'
  import { Dialog } from 'quasar'
  import generalHeader from 'src/application/global/components/common/header/generalHeader'
  import layoutModal from 'src/application/global/components/common/modal/layoutModal'
  import { PaginationMixin, DatesMixin, OpenCloseFormMixin } from 'src/application/global/mixins/index'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'EmailReportListTable',
    components: {
      generalHeader,
      layoutModal
    },
    mixins: [PaginationMixin, DatesMixin, OpenCloseFormMixin],
    computed: {
      ...mapState({
        isProcessingTable: state => state.globalCMP.isProcessingTable,
        currentUpdateId: state => state.globalCMP.currentUpdateId
      }),
      ...mapGetters({
        tableList: 'tableDataReports'
      })
    },
    data: function () {
      return {
        serverData: [],
        modalData: '',
        types: [
          {
            name: '',
            label: 'Info',
            icon: 'info'
          }
        ],
        columns: [
          {
            name: 'id',
            label: 'ID',
            field: 'id',
            width: '90px',
            sortable: true
          },
          {
            name: 'to',
            label: 'To Who',
            field: 'to',
            sortable: false
          },
          {
            name: 'from',
            label: 'From Who',
            field: 'from',
            sortable: false
          },
          {
            name: 'created_at',
            label: 'Time Created',
            field: 'created_at',
            sortable: true
          },
          {
            name: 'channel',
            label: 'Channel',
            field: 'channel',
            sortable: true
          },
          {
            name: 'action',
            align: 'center',
            label: this.$t('Common.DTableLabel.Action'),
            field: 'action'
          }
        ]
      }
    },
    mounted () {
      this.setVisibleColumns(this.columns)
      this.queryHandler(this.setDefaultPaginationAttr('reports'))
    },
    methods: {
      // Declare vuex mixActions
      ...mapActions([
        'getReportListAction'
      ]),
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM',
      }),
      queryHandler (data) {
        this.query = this.processQueryData(data)
        this.getReportListAction(this.query).then(() => {
          // Remove observers
          data = JSON.parse(JSON.stringify(data))
          this.serverPagination = data.pagination
          this.serverPagination.rowsNumber = this.tableList.list.total
          this.serverData = this.tableList.list.data
        })
      },
      mixActions (row, type, modalName) {
        if (type === 'info') {
          this.openCloseModal({name: modalName, status: true})
          this.modalData = row
        }
      }
    }
  }
</script>
