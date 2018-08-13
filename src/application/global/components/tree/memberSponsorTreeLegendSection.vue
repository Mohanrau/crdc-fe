<template>
    <div class="legend-holder">
        <table class="q-table-html">
            <tbody>
            <tr v-for="code in colorCodes">
                <td><div class="color-code-box" v-bind:style="{ backgroundColor: code.color}"></div> </td>
                <td v-bind:style="{ color: code.color}">{{ code.title }}</td>
            </tr>
            </tbody>
        </table>
        <hr>
        <small>Sales Activity Status</small>
        <table class="q-table-html">
            <tbody>
            <tr v-for="code in activityStatus">
                <td><div class="color-code-rounded" v-bind:style="{ backgroundColor: code.color}"></div> </td>
                <td v-bind:style="{ color: code.color}">{{ code.title }}</td>
            </tr>
            </tbody>
        </table>
        <hr>
        <table class="q-table-html">
            <tbody>
            <tr v-for="code in extra">
                <td><div class="color-code-rounded" v-bind:style="{ backgroundColor: code.color}"></div> </td>
                <td v-bind:style="{ color: code.color}">{{ code.title }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    export default {
      name: 'legend-section',
      props: {
        personalData: {
          type: Object
        }
      },
      data: () => ({
        colorCodes: [
          {color: '#f2528d', title: 'Number of Direct Downline'},
          {color: '#029dd6', title: 'Number of Total Downline'},
          {color: '#0892a0', title: 'Highest Rank'},
          {color: '#08b363', title: 'Expiry Date'},
          {color: '#ff7900', title: 'Total Active Left Downlines'},
          {color: '#726a63', title: 'Total Active Right Downlines'}
        ],
        activityStatus: [
          {color: '#57d816', title: 'Active'},
          {color: '#e8373a', title: 'Inactive'}
        ],
        extra: [
          {color: '#726a63', title: 'Resigned/ Expired/ Terminated/ Suspended'}
        ]
      })
    }
</script>
<style lang="stylus">
    .color-code-box
        background-color inherit
        width 20px
        height 20px
        margin 5px
        border 1px solid rgba(0, 0, 0, .6)
    .color-code-rounded
        background-color inherit
        width 20px
        height 20px
        margin 5px
        border-radius 20px
        border 1px solid rgba(0, 0, 0, .6)
</style>