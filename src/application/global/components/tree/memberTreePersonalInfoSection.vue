<template>
    <div class="personal-data-holder relative-position">
        <table class="q-table-html" v-if="typeof personalData !== 'undefined'">
            <tbody>
            <tr>
                <td>IBO ID</td>
                <td class="uppercase">{{ personalData.member_data.details.ibo_id }}</td>
            </tr>
            <tr>
                <td>IBO Name</td>
                <td class="uppercase">{{ personalData.member_data.details.ibo_name }}</td>
            </tr>
            <tr>
                <td>Joined Date</td>
                <td class="uppercase">{{ personalData.member_data.details.joined_date }}</td>
            </tr>
            <tr>
                <td>Expiry Date</td>
                <td class="uppercase">{{ personalData.member_data.details.expiry_date }}</td>
            </tr>
            <tr>
                <td>Country</td>
                <td class="uppercase">{{ personalData.member_data.details.country.name }}</td>
            </tr>
            <tr>
                <td>Membership Type</td>
                <td class="uppercase">{{ personalData.member_data.details.membership_type.rank_code }}</td>
            </tr>
            <tr>
                <td>Highest Rank</td>
                <td class="uppercase">{{ personalData.member_data.details.highest_rank.rank_name }}</td>
            </tr>
            <tr>
                <td>Effective Rank</td>
                <td class="uppercase">{{ personalData.member_data.details.effective_rank.rank_name }}</td>
            </tr>
            <tr>
                <td>Cummulative Personal Sales (CV)</td>
                <td class="uppercase">{{ personalData.member_data.details.personal_sales_cv }} | {{ personalData.member_data.details.personal_sales_cv_percentage }}%
                </td>
            </tr>
            </tbody>
        </table>
        <div class="empty-list-holder" v-else="">
            <empty-list></empty-list>
        </div>
        <q-loader :visible="isProcessingSection"></q-loader>
    </div>
</template>
<script>
  import qLoader from 'src/application/global/components/common/loading/loader'
  import EmptyList from 'src/application/global/components/common/empty/emptyList'
  import { mapState } from 'vuex'

  export default {
    name: 'personal-info-section',
    components: {
      qLoader,
      EmptyList
    },
    props: {
      personalData: {
        type: Object
      }
    },
    computed: {
      ...mapState({
        isProcessingSection: state => state.globalCMP.isProcessingSection
      })
    }
  }
</script>