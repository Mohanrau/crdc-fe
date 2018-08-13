import {post} from '../../../helpers/api'
import {api} from '../api'
import {
  SET_TOKEN,
  VALIDATION_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  IS_PROCESSING,
  SHOW_NOTIFICATION,
  UNSET_TOKEN,
  IS_PROCESSING_REFRESH_TOKEN
} from '../../../store/types'
import Vue from 'vue'

export const loginAction = ({commit}, data) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    localStorage.removeItem('_secure__ls__url')
    post(api.login, data)
      .then(response => {
        commit(SET_TOKEN, response.data)
        commit(LOGIN_SUCCESS)
        commit(SHOW_NOTIFICATION, {
          title: Vue.prototype.$t('operations.loggedIn.welcome'),
          message: Vue.prototype.$t('operations.loggedIn.success'),
          type: 'positive'
        })
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status !== 401) {
            commit(VALIDATION_FAILED, {errors: error.response.data})
          } else {
            commit(SHOW_NOTIFICATION, {title: 'Error', message: error.response.data.error, type: 'negative'})
          }
        }
        commit(IS_PROCESSING, false)
        reject(error)
      })
  })
}
export const refreshTokenAction = ({commit}, data) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING_REFRESH_TOKEN, true)
    post(api.refreshOauthToken, data)
      .then(response => {
        commit(SET_TOKEN, response.data)
        commit(LOGIN_SUCCESS)
        commit(IS_PROCESSING_REFRESH_TOKEN, false)
        resolve(response.data)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status !== 401) {
            commit(VALIDATION_FAILED, {errors: error.response.data})
          } else {
            commit(SHOW_NOTIFICATION, {title: 'Error', message: error.response.data.error, type: 'negative'})
          }
        }
        commit(IS_PROCESSING_REFRESH_TOKEN, false)
        reject(error)
      })
  })
}

export const resetAction = ({commit}, data) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.reset, data)
      .then(response => {
        if (response.data.status) {
          commit(SHOW_NOTIFICATION, {title: 'Reset', message: response.data.status, type: 'positive'})
        }
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status !== 401) {
            commit(VALIDATION_FAILED, {errors: error.response.data})
          } else {
            commit(SHOW_NOTIFICATION, {title: 'Error', message: error.response.data.error, type: 'negative'})
          }
        }
        commit(IS_PROCESSING, false)
        reject(error)
      })
  })
}

export const updateAction = ({commit}, data) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.resetPassword, data)
      .then(response => {
        if (response.data.success) {
          commit(SHOW_NOTIFICATION, {title: 'Reset', message: response.data.success, type: 'positive'})
        }
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status !== 401) {
            commit(VALIDATION_FAILED, {errors: error.response.data})
          } else {
            commit(SHOW_NOTIFICATION, {title: 'Error', message: error.response.data.error, type: 'negative'})
          }
        }
        commit(IS_PROCESSING, false)
        reject(error)
      })
  })
}
export const resetPasswordAction = ({commit}, query) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.resetPassword, query)
      .then(response => {
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        commit(VALIDATION_FAILED, {errors: error.response.data})
        commit(IS_PROCESSING, false)
        reject(error.response.data)
      })
  })
}
export const logoutAction = ({commit}, data) => {
  commit(LOGOUT)
  commit(UNSET_TOKEN)
  if (typeof data !== 'undefined' && data.expired) {
    commit(SHOW_NOTIFICATION, {
      title: Vue.prototype.$t('operation.loggedOut.sessionExpiredTitle'),
      message: Vue.prototype.$t('operation.loggedOut.sessionExpiredMessage'),
      type: 'warning'
    })
  } else {
    commit(SHOW_NOTIFICATION, {
      title: Vue.prototype.$t('operations.loggedOut.goodBye'),
      message: Vue.prototype.$t('operations.loggedOut.success'),
      type: 'positive'
    })
  }
}

// Remove this in production
export const registerAction = ({commit}, data) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.register, data)
      .then(response => {
        commit(SHOW_NOTIFICATION, {title: 'Register', message: 'Success', type: 'positive'})
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        if (error.response) {
          if (error.response.status !== 401) {
            commit(VALIDATION_FAILED, {errors: error.response.data})
          } else {
            commit(SHOW_NOTIFICATION, {title: 'Error', message: error.response.data.error, type: 'negative'})
          }
        }
        commit(IS_PROCESSING, false)
        reject(error)
      })
  })
}
