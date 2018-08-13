import { url } from '../../global/api'

export const api = {
  'login': url.apiUrl + '/login',
  'resetPassword': url.apiUrl + '/password/reset',
  'reset': url.apiUrl + '/password/email',
  'update': url.apiUrl + '/update',
  'register': url.apiUrl + '/register',
  'refreshOauthToken': url.apiUrl + '/refresh-token'
}
