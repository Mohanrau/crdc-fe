import {
  SET_PRODUCT_SEARCH_DATA,
  SET_CAMPAIGN_LOCATION_LIST_DATA,
  SET_TEAM_BONUS_RANK_LIST_DATA,
  SET_ENROLLMENT_RANK_LIST_DATA,
  SET_CAMPAIGN_LIST_DATA,
  SET_CAMPAIGN_FORM_DATA,
  SET_ESAC_VOUCHER_TYPE_LIST_DATA,
  SET_ESAC_VOUCHER_TYPE_FORM_DATA,
  SET_ESAC_VOUCHER_SUB_TYPE_LIST_DATA,
  SET_ESAC_VOUCHER_SUB_TYPE_FORM_DATA,
  SET_ESAC_PROMOTION_LIST_DATA,
  SET_ESAC_PROMOTION_FORM_DATA,
  SET_ESAC_VOUCHER_LIST_DATA,
  SET_ESAC_VOUCHER_FORM_DATA,
  SET_ESAC_REDEMPTION_LIST_DATA,
  SET_ESAC_REDEMPTION_FORM_DATA,
  SET_ORDER_DATA,
  UNSET_ORDER_DATA
} from '../../../store/types'
import Vue from 'vue'

export default {
  [SET_PRODUCT_SEARCH_DATA] (state, payload) {
    Vue.set(state.productSearchData, 'list', payload.list)
  },
  [SET_CAMPAIGN_LOCATION_LIST_DATA] (state, payload) {
    Vue.set(state.campaignLocationList, 'list', payload.list)
  },
  [SET_TEAM_BONUS_RANK_LIST_DATA] (state, payload) {
    Vue.set(state.teamBonusRankList, 'list', payload.list)
  },
  [SET_ENROLLMENT_RANK_LIST_DATA] (state, payload) {
    Vue.set(state.enrollmentRankList, 'list', payload.list)
  },
  [SET_CAMPAIGN_LIST_DATA] (state, payload) {
    Vue.set(state.campaignList, 'list', payload.list)
  },
  [SET_CAMPAIGN_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_ESAC_VOUCHER_TYPE_LIST_DATA] (state, payload) {
    Vue.set(state.esacVoucherTypeList, 'list', payload.list)
  },
  [SET_ESAC_VOUCHER_TYPE_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_ESAC_VOUCHER_SUB_TYPE_LIST_DATA] (state, payload) {
    Vue.set(state.esacVoucherSubTypeList, 'list', payload.list)
  },
  [SET_ESAC_VOUCHER_SUB_TYPE_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_ESAC_PROMOTION_LIST_DATA] (state, payload) {
    Vue.set(state.esacPromotionList, 'list', payload.list)
  },
  [SET_ESAC_PROMOTION_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_ESAC_VOUCHER_LIST_DATA] (state, payload) {
    Vue.set(state.esacVoucherList, 'list', payload.list)
  },
  [SET_ESAC_VOUCHER_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_ESAC_REDEMPTION_LIST_DATA] (state, payload) {
    Vue.set(state.esacRedemptionList, 'list', payload.list)
  },
  [SET_ESAC_REDEMPTION_FORM_DATA] (state, action) {
    state.formData = action.formData
  },
  [SET_ORDER_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.set(state.orderData, key, payload[key])
    })
  },
  [UNSET_ORDER_DATA] (state, payload) {
    Object.keys(payload).forEach(function (key) {
      Vue.delete(state.orderData, key)
    })
  }
}
