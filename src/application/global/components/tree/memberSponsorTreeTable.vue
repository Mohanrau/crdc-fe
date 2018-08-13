<template>
    <div class="sponsor-tree-uplines-tables">
        <table class="q-table-html Bordered highlight horizontal-separator full-width" v-if="list">
            <thead>
            <tr>
                <th class="text-center">Level</th>
                <th class="text-left">IBO ID</th>
                <th class="text-left">IBO Name</th>
                <th class="text-left">status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!item.root" v-for="(item, index) in list" :class="{'bg-green-2': $last(item, list)}">
                <td class="text-center">
                    <q-icon color="blue" :name="$last(item, list) ? 'arrow_forward' : ' '"></q-icon>
                    {{ index }}
                </td>
                <td class="text-left">{{ item.ibo_id }}</td>
                <td class="text-left">{{ item.ibo_name }}</td>
                <td class="text-left">{{ item.status.title }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
  import EmptyList from 'src/application/global/components/common/empty/emptyList'

  export default {
    name: 'member-sponsor-tree-table',
    components: {
      EmptyList
    },
    props: {
      list: Array
    }
  }
</script>