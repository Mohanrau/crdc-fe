import { get, post, del } from '../../../helpers/api'
import { api } from '../api'
import {
  IS_PROCESSING_FORM,
  IS_PROCESSING_TABLE,
  SET_FORM_DATA,
  SET_CAMPAIGN_LOCATION_LIST_DATA,
  SET_TEAM_BONUS_RANK_LIST_DATA,
  SET_ENROLLMENT_RANK_LIST_DATA,
  SET_CAMPAIGN_LIST_DATA,
  SET_ESAC_VOUCHER_TYPE_LIST_DATA,
  SET_ESAC_VOUCHER_SUB_TYPE_LIST_DATA,
  SET_ESAC_PROMOTION_LIST_DATA,
  SET_ESAC_VOUCHER_LIST_DATA,
  SET_ESAC_REDEMPTION_LIST_DATA,
  SHOW_NOTIFICATION,
  VALIDATION_FAILED
} from '../../../store/types'
export const getCampaignLocationListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.campaignLocationListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_CAMPAIGN_LOCATION_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getTeamBonusRankListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.teamBonusRanksList, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_TEAM_BONUS_RANK_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getEnrollmentRankListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.enrollmentRanksList, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_ENROLLMENT_RANK_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
// ------------------------------
//      CAMPAIGN
// ------------------------------
export const getCampaignListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.campaignListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_CAMPAIGN_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getCampaignAction = ({commit}, id) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    get(api.campaign + '/' + id)
      .then(response => {
        const json = response.data
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response)
      })
  })
}
export const createCampaignAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.campaign, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create Campaign', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const updateCampaignAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.campaign, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update Campaign', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const deleteCampaignAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.campaign + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete Campaign', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}

// ------------------------------
//      ESAC VOUCHER TYPE
// ------------------------------
export const getEsacVoucherTypeListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucherTypeListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_ESAC_VOUCHER_TYPE_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getEsacVoucherTypeAction = ({commit}, id) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    get(api.esacVoucherType + '/' + id)
      .then(response => {
        const json = response.data
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response)
      })
  })
}
export const createEsacVoucherTypeAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucherType, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create eSac Voucher Type', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const updateEsacVoucherTypeAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucherType, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update eSac Voucher Type', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const deleteEsacVoucherTypeAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.esacVoucherType + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete eSac Voucher Type', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}

// ------------------------------
//      ESAC VOUCHER SUB TYPE
// ------------------------------
export const getEsacVoucherSubTypeListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucherSubTypeListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_ESAC_VOUCHER_SUB_TYPE_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getEsacVoucherSubTypeAction = ({commit}, id) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    get(api.esacVoucherSubType + '/' + id)
      .then(response => {
        const json = response.data
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response)
      })
  })
}
export const createEsacVoucherSubTypeAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucherSubType, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create eSac Voucher Sub Type', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const updateEsacVoucherSubTypeAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucherSubType, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update eSac Voucher Sub Type', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const deleteEsacVoucherSubTypeAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.esacVoucherSubType + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete eSac Voucher Sub Type', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}

// ------------------------------
//      ESAC PROMOTION
// ------------------------------
export const getEsacPromotionListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.esacPromotionListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_ESAC_PROMOTION_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getEsacPromotionAction = ({commit}, id) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    get(api.esacPromotion + '/' + id)
      .then(response => {
        const json = response.data
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response)
      })
  })
}
export const createEsacPromotionAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacPromotion, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create eSac Promotion', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const updateEsacPromotionAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacPromotion, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update eSac Promotion', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const deleteEsacPromotionAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.esacPromotion + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete eSac Promotion', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}

// ------------------------------
//      ESAC VOUCHER
// ------------------------------
export const getEsacVoucherListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucherListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_ESAC_VOUCHER_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
export const getEsacVoucherAction = ({commit}, id) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    get(api.esacVoucher + '/' + id)
      .then(response => {
        const json = response.data
        commit(SET_FORM_DATA, {
          formData: json
        })
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_FORM, false)
        reject(error.response)
      })
  })
}
export const createEsacVoucherAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucher, data)
      .then(response => {
        commit(IS_PROCESSING_FORM, false)
        commit(SHOW_NOTIFICATION, {title: 'Create eSac Voucher', message: 'Operation success', type: 'positive'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const updateEsacVoucherAction = ({commit}, data) => {
  commit(IS_PROCESSING_FORM, true)
  return new Promise((resolve, reject) => {
    post(api.esacVoucher, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Update eSac Voucher', message: 'Operation success', type: 'positive'})
        commit(IS_PROCESSING_FORM, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_FORM, false)
        reject(error)
      })
  })
}
export const deleteEsacVoucherAction = ({commit}, id) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    del(api.esacVoucher + '/' + id)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        commit(SHOW_NOTIFICATION, {title: 'Delete eSac Voucher', message: 'Operation success', type: 'info'})
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}

// ------------------------------
//      ESAC REDEMPTION
// ------------------------------
export const getEsacRedemptionListAction = ({commit}, query) => {
  commit(IS_PROCESSING_TABLE, true)
  return new Promise((resolve, reject) => {
    post(api.esacRedemptionListing, query)
      .then(response => {
        commit(IS_PROCESSING_TABLE, false)
        const json = response.data
        commit(SET_ESAC_REDEMPTION_LIST_DATA, {
          list: json
        })
        resolve(response.data)
      })
      .catch(error => {
        commit(IS_PROCESSING_TABLE, false)
        reject(error)
      })
  })
}
