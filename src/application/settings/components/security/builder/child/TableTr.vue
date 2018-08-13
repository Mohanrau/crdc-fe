<template>
    <tr class="child">
        <td>
            <q-chip square pointing="right" color="tertiary" icon-right="navigate_next">{{ parent.label }} </q-chip>
            {{ child.label }}
        </td>
        <td class="text-center" v-for="operation in operationsList">
            <template v-for="(permission, index) in child.permissions">
                {{ setIds('horizontalIds', operation.value, permission.id, operation.value === permission.operation.id)
                }}
                {{ setIds('verticalIds', child.id, permission.id)
                }}
                <q-checkbox unchecked-icon="lock_outline"
                            checked-icon="done"
                            :key="`deep-child-${index}`"
                            color="f263b7"
                            :val="permission.id"
                            @input="indeterminateChecker(operation.value, 'horizontalIds')"
                            v-if="operation.value === permission.operation.id"
                            v-model="roleBuilderData.permissions.ids"/>
            </template>
        </td>
        <td class="text-center">
            <q-checkbox class="q-mb-sm" color="tertiary" :value="verticalCheckIds" :val="child.id"
                        :class="{'all-verticalIds-selected': indeterminateChecker(child.id, 'verticalIds')}"
                        @input="mutateVerticalCheckIds(child.id), verticalSelection(child.id)"/>
        </td>
        <!--Todo add child's deep child object-->
        <!--<table-tr :parent="item" v-for="(child, index) in child.childs" :child="child" :current="index"-->
        <!--:key="index" :roleBuilderData="roleBuilderData">-->
        <!--</table-tr>-->
    </tr>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    name: 'table-tr',
    props: {
      roleBuilderData: {
        type: Object,
        required: true
      },
      parent: {
        type: Object
      },
      child: {
        type: Object
      },
      setIds: {
        type: Function
      },
      verticalSelection: {
        type: Function
      },
      verticalCheckIds: {
        type: Array
      },
      indeterminateChecker: {
        type: Function
      },
    },
    model: 'verticalCheckIds',
    computed: {
      ...mapState({
        operationsList: state => state.settingsCMP.operationsOptions.data.options
      })
    },
    methods: {
      mutateVerticalCheckIds (id) {
        if (this.verticalCheckIds.includes(id)) {
          let removeIndex = this.verticalCheckIds.indexOf(id)
          this.verticalCheckIds.splice(removeIndex, 1)
        } else {
          this.verticalCheckIds.push(id)
        }
      }
    }
  }
</script>