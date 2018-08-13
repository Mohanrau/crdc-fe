<template>
    <div class="row wrap gutter-md justify-between">
        <div class="col-lg-12 relative-position">
            <q-field
                    helper="*"
                    :error="validation.roleBuilderData.permissions.$error"
                    error-label="Please choose atleast 1"
            >
                <div class="matrix">
                    <table class="q-table-html fit cell-separator">
                        <thead class="bg-grey-3">
                        <tr>
                            <th>
                                <div class="row align-center items-baseline">
                                    <q-input inverted-light
                                             color="white text-black"
                                             class="no-shadow custom-input-border fit"
                                             autofocus
                                             placeholder="Search Modules ..."
                                             v-model="search"/>
                                </div>
                            </th>
                            <th class="text-center" v-for="operation in operationsList">
                                <div class="row justify-center items-start">
                                    <q-checkbox
                                            :class="{'all-horizontalIds-selected': indeterminateChecker(operation.value, 'horizontalIds')}"
                                            color="tertiary"
                                            :val="operation.value" v-model="horizontalCheckIds"
                                            :disable="filterModules.length !== allModulesList.length"
                                            @input="horizontalSelection(operation.value)" class="q-mb-sm"/>
                                </div>
                                {{ capitalize(operation.label) }}
                            </th>
                            <th class="text-center">
                                <div class="row justify-center">
                                    <q-checkbox color="tertiary" class="q-mb-sm" v-model="selectAllCheck"
                                                :disable="filterModules.length !== allModulesList.length"
                                                @input="allSelection"/>
                                </div>
                                Select All
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-for="(item, indexMain) in filterModules" v-if="item.parent_id === 0">
                            <tr>
                                <td>
                                    {{ item.label }}
                                </td>
                                <td width="7%" class="text-center" v-for="operation in operationsList">
                                    <template v-for="(permission, index) in item.permissions">
                                        {{ setIds('horizontalIds', operation.value, permission.id, operation.value === permission.operation.id)
                                        }}
                                        {{ setIds('verticalIds', item.id, permission.id)
                                        }}
                                        <q-checkbox unchecked-icon="lock_outline"
                                                    checked-icon="done"
                                                    color="f263b7"
                                                    :key="`parent-${index}`"
                                                    v-if="operation.value === permission.operation.id"
                                                    :val="permission.id"
                                                    @input="indeterminateChecker(operation.value, 'horizontalIds')"
                                                    v-model="roleBuilderData.permissions.ids"/>
                                    </template>
                                </td>
                                <td class="text-center">
                                    <q-checkbox color="tertiary" class="q-mb-sm" v-model="verticalCheckIds"
                                                :val="item.id"
                                                :class="{'all-verticalIds-selected': indeterminateChecker(item.id, 'verticalIds')}"
                                                @input="verticalSelection(item.id)"/>
                                </td>
                            </tr>
                            <table-tr :parent="item"
                                      :setIds="setIds"
                                      :verticalSelection="verticalSelection"
                                      :verticalCheckIds.sync="verticalCheckIds"
                                      :indeterminateChecker="indeterminateChecker"
                                      v-for="(child, index2) in item.childs"
                                      :child="child"
                                      :key="`child-${index2}-${indexMain}`" :roleBuilderData="roleBuilderData">
                            </table-tr>
                        </template>
                        </tbody>
                    </table>
                </div>
            </q-field>
            <q-loader :visible="isProcessingSection"></q-loader>
        </div>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {format} from 'quasar'
  import _ from 'lodash'
  import TableTr from 'src/application/settings/components/security/builder/child/TableTr'
  import {mapState, mapActions} from 'vuex'

  const {capitalize} = format

  export default {
    name: 'matrix-tab',
    components: {
      qLoader,
      TableTr
    },
    props: {
      'roleBuilderData': {
        type: Object,
        required: true
      },
      'validation': {
        type: Object,
        required: true
      }
    },
    computed: {
      ...mapState({
        isProcessingSection: state => state.globalCMP.isProcessingSection,
        allModulesList: state => state.settingsCMP.allModulesList.list.data,
        operationsList: state => state.settingsCMP.operationsOptions.data.options
      }),
      filterModules() {
        return this.allModulesList.filter(item => {
          if (item.label.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
            return item
          }
        })
      }
    },
    mounted() {
      this.getAllModuleListAction()
      this.getOperationsAction()
    },
    data: () => ({
      search: '',
      indet: null,
      selectAllCheck: false,
      horizontalCheckIds: [],
      horizontalIds: {},
      verticalCheckIds: [],
      verticalIds: {}
    }),
    methods: {
      ...mapActions([
        'getAllModuleListAction',
        'getOperationsAction'
      ]),
      capitalize,
      horizontalSelection(id) {
        if (id > 0 && id !== undefined) {
          if (this.horizontalIds[id] !== undefined && this.horizontalIds[id].length > 0) {
            this.horizontalIds[id].forEach((x) => {
              if (this.horizontalCheckIds.includes(id)) {
                if (!this.roleBuilderData.permissions.ids.includes(x)) {
                  this.roleBuilderData.permissions.ids.push(x)
                }
              } else {
                let removeIndex = this.roleBuilderData.permissions.ids.indexOf(x)
                if (removeIndex !== -1) {
                  this.roleBuilderData.permissions.ids.splice(removeIndex, 1)
                }
              }
            })
          }
        }
      },
      verticalSelection(id) {
        if (id > 0 && id !== undefined) {
          if (this.verticalIds[id] !== undefined && this.verticalIds[id].length > 0) {
            this.verticalIds[id].forEach((x) => {
              if (this.verticalCheckIds.includes(id)) {
                if (!this.roleBuilderData.permissions.ids.includes(x)) {
                  this.roleBuilderData.permissions.ids.push(x)
                }
              } else {
                let removeIndex = this.roleBuilderData.permissions.ids.indexOf(x)
                if (removeIndex !== -1) {
                  this.roleBuilderData.permissions.ids.splice(removeIndex, 1)
                }
              }
            })
          }
        }
      },
      allSelection() {
        if (Object.keys(this.horizontalIds).length > 0) {
          for (let key in this.horizontalIds) {
            if (!this.horizontalCheckIds.includes(key)) {
              this.horizontalCheckIds.push(parseInt(key))
            }
            if (this.horizontalIds[key].length > 0) {
              this.horizontalIds[key].forEach((horizontalId) => {
                if (this.selectAllCheck) {
                  this.roleBuilderData.permissions.ids.push(horizontalId)
                } else {
                  let removeIndex = this.horizontalCheckIds.indexOf(key)
                  if (removeIndex !== -1) {
                    this.horizontalCheckIds.splice(removeIndex, 1)
                  }
                  this.roleBuilderData.permissions.ids = []
                }
              })
            }
          }
        }
        if (Object.keys(this.verticalIds).length > 0) {
          for (let key in this.verticalIds) {
            if (!this.selectAllCheck) {
              let removeIndex = this.verticalCheckIds.indexOf(key)
              if (removeIndex !== -1) {
                this.verticalCheckIds.splice(removeIndex, 1)
              }
            } else {
              if (!this.verticalCheckIds.includes(key)) {
                this.verticalCheckIds.push(parseInt(key))
              }
            }
          }
        }
      },
      setIds(type, value, id, bool) {
        if (type === 'horizontalIds' && bool) {
          if (this.horizontalIds[value] === undefined) {
            this.$set(this.horizontalIds, value, [])
          }
          if (!this.horizontalIds[value].includes(id)) {
            this.horizontalIds[value].push(id)
          }
        } else if (type === 'verticalIds') {
          if (this.verticalIds[value] === undefined) {
            this.$set(this.verticalIds, value, [])
          }
          if (this.verticalIds[value] !== undefined && !this.verticalIds[value].includes(id)) {
            this.verticalIds[value].push(id)
          }
        }
      },
      // Todo has performance issue enhance later
      indeterminateChecker(id, type) {
        let horizontalCount = null
        let verticalCount = null
        if (type === 'horizontalIds') {
          horizontalCount = _.differenceWith(this.horizontalIds[id], this.roleBuilderData.permissions.ids, _.isEqual).length
          if (horizontalCount === 0) {
            if (!this.horizontalCheckIds.includes(id) && this.horizontalIds[id] !== undefined) {
              this.horizontalCheckIds.push(parseInt(id))
            }
            return true
          } else {
            let removeIndex = this.horizontalCheckIds.indexOf(id)
            if (removeIndex !== -1) {
              this.horizontalCheckIds.splice(removeIndex, 1)
            }
          }
        }
        if (type === 'verticalIds') {
          verticalCount = _.differenceWith(this.verticalIds[id], this.roleBuilderData.permissions.ids, _.isEqual).length
          if (verticalCount === 0) {
            if (!this.verticalCheckIds.includes(id) && this.verticalIds[id] !== undefined) {
              this.verticalCheckIds.push(parseInt(id))
            }
            return true
          } else {
            let removeIndex = this.verticalCheckIds.indexOf(id)
            if (removeIndex !== -1) {
              this.verticalCheckIds.splice(removeIndex, 1)
            }
          }
        }
        return false
      }
    }
  }
</script>
<style lang="stylus">
</style>