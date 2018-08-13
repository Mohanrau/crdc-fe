import { post } from '../../../helpers/api'
import { api } from '../api'
import {
  IS_PROCESSING
} from '../../../store/types'

export const dashboardAction = ({commit}, data) => {
  return new Promise((resolve, reject) => {
    commit(IS_PROCESSING, true)
    post(api.dashboard, data)
      .then(response => {
        commit(IS_PROCESSING, false)
        resolve(response.data)
      })
      .catch(error => {
        if (error.response) {
          commit(IS_PROCESSING, false)
          reject(error)
        }
      })
  })
}
