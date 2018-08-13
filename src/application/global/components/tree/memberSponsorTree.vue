<template>
    <div class="q-tree">
        <ul v-if="tree">
            <tree-item
                    v-for="(downlines, index) in tree.downlines"
                    :key="index"
                    :model="downlines">
            </tree-item>
        </ul>
    </div>
</template>
<script>
  import TreeItem from 'src/application/global/components/tree/memberSponsorTreeItem'

  export default {
    name: 'member-sponsor-tree',
    components: {
      TreeItem
    },
    props: {
      tree: {
        type: Object
      }
    }
  }
</script>
<style lang="stylus">
    .q-tree
        overflow hidden

    .q-tree ul li
        width 900px
</style>