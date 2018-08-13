<template>
    <layout-modal refs="showSchemaManagerModal"
                  title="Assign Roles To Elements"
                  headerSearchBar
                  :search="true"
                  :shadow="false"
                  minWidth="70vw"
                  minHeight="90vh"
                  maximized
                  footerButtonOne="Close"
                  classes="transparent text-black manager">
        <template slot="modal-data" slot-scope="props">
            <div class="row q-ma-md group" v-if="typeof $schemaData !== 'undefined'">
                <div class="col-12">
                    <div class="element-header" v-if="search !== ''">
                        {{ $t('Common.search.label') }} :
                        <q-chip closable color="primary" @hide="clearSearch()">
                            {{ search }}
                        </q-chip>
                    </div>
                </div>
                <div class="col-6">
                    <div class="elements-body">
                        <q-list separator>
                            <q-collapsible :key="`schema-${index}`" :opened="index === 0"
                                           v-for="(schema, index) in filterSchema" icon="verified_user"
                                           :label="schema.path.replace(/[.]/g, '/')">
                                <div class="q-pa-xs">
                                    <q-scroll-area style="height: 60vh; max-height: 65vh;">
                                        <q-list dense link highlight separator
                                                v-for="(item, index) in schema.items"
                                                :key="index"
                                                class="no-padding no-margin">
                                            <q-list-header class="bg-black text-white">
                                                <q-btn round color="positive" icon="add" class="on-left"></q-btn>
                                                {{ item.action }}
                                            </q-list-header>
                                            <q-item
                                                    :class="{'bg-green-1' : true}"
                                                    v-for="(opt, index) in item.allowed"
                                                    :key="index">
                                                <q-item-main :label="opt"
                                                             label-lines="1"/>
                                                <q-item-side
                                                        :icon="true ? 'check' : 'check_box_outline_blank'"></q-item-side>
                                            </q-item>
                                        </q-list>
                                    </q-scroll-area>
                                </div>
                            </q-collapsible>
                        </q-list>
                    </div>
                </div>
                <div class="col-6">
                </div>
            </div>
        </template>
    </layout-modal>
</template>
<script>
  import LayoutModal from 'src/application/global/components/common/modal/layoutModal.vue'
  import { mapState, mapMutations } from 'vuex'
  import { EventBus } from 'src/services/eventService'

  export default {
    components: {LayoutModal},
    name: 'schema-manager',
    componets: {
      LayoutModal
    },
    computed: {
      ...mapState({
        headerSearchBarField: state => state.globalCMP.headerSearchBarField
      }),
      filterSchema () {
        if (this.search !== '') {
          let explode = this.search.split('|')
          let result = this.$schemaData.filter((x) => x.path.match(explode[0]) && x.items.filter((y) => y.action.match(explode[1])))
          return result
        } else {
          return this.$schemaData
        }
      }
    },
    watch: {
      headerSearchBarField: {
        handler (val) {
          this.search = val
        }
      }
    },
    mounted () {
      EventBus.$on('showSchemaManager', data => {
        this.search = data
        this.openCloseModal({name: 'showSchemaManagerModal', status: true})
      })
    },
    data: () => ({
      open: false,
      search: ''
    }),
    methods: {
      ...mapMutations({
        openCloseModal: 'OPEN_CLOSE_MODAL_FORM'
      }),
      clearSearch () {
        this.search = ''
      }
    }
  }
</script>
