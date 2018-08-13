import { logout, setAuth } from 'src/services/authService'
import {
  SET_TOKEN,
  LOGIN_SUCCESS,
  LOGOUT,
  UNSET_TOKEN
} from '../../../store/types'

export default {
  [SET_TOKEN] (state, data) {
    let accessToken = data.access_token
    let expiresIn = data.expires_in
    let refreshToken = data.refresh_token
    state.auth = {
      accessToken: accessToken,
      expiresIn: expiresIn,
      refreshToken: refreshToken
    }
    setAuth(state.auth)
  },
  [LOGIN_SUCCESS] (state) {
    state.isLoggedIn = true
  },
  [LOGOUT] (state) {
    state.isLoggedIn = false
    logout()
  },
  [UNSET_TOKEN] (state) {
    state.auth = {}
  }

}
