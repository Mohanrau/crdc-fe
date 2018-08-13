import axios from 'axios'

const EXPIRES_IN = 'expiresIn'
const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'
const RETURN_URL = 'returnUrl'
const EXPIRES_ON = 'expiresOn'
const PERMISSIONS = '_secure__ls__permission'
const META = '_secure__ls__metadata'

export function logout () {
  localStorage.clear()
}

export function requireAuth () {
  return isLoggedIn()
}

export function getExpiresIn () {
  return localStorage.getItem(EXPIRES_IN)
}

export function getAccessToken () {
  return localStorage.getItem(ACCESS_TOKEN)
}

export function getRefreshToken () {
  return localStorage.getItem(REFRESH_TOKEN)
}

export function getReturnURL () {
  return localStorage.getItem(RETURN_URL)
}

export function getExpiresOn () {
  return localStorage.getItem(EXPIRES_ON)
}

export function clearExpiresIn () {
  localStorage.removeItem(EXPIRES_IN)
}

export function clearAccessToken () {
  localStorage.removeItem(ACCESS_TOKEN)
}

export function clearRefreshToken () {
  localStorage.removeItem(REFRESH_TOKEN)
}

export function clearReturnURL () {
  localStorage.removeItem(RETURN_URL)
}

export function clearExpiresOn () {
  localStorage.removeItem(EXPIRES_ON)
}

export function clearPermissions () {
  localStorage.removeItem(PERMISSIONS)
  localStorage.removeItem(META)
}

export function setAuth (auth) {
  const currentDateTime = new Date()
  let expiry = currentDateTime.setUTCSeconds(auth.expiresIn)
  localStorage.setItem(ACCESS_TOKEN, auth.accessToken)
  localStorage.setItem(REFRESH_TOKEN, auth.refreshToken)
  localStorage.setItem(EXPIRES_IN, auth.expiresIn)
  localStorage.setItem(EXPIRES_ON, expiry)
  axios.defaults.headers.common['Authorization'] = `Bearer ${auth.accessToken}`
}

export function setReturnURL (to) {
  localStorage.setItem(RETURN_URL, to)
}

export function isLoggedIn () {
  const expiresIn = getExpiresIn()
  const expiresOn = getExpiresOn()
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (expiresIn !== null && expiresOn !== null && accessToken !== null && refreshToken !== null) {
    return true
  }
  return false
}

export function isTokenExpired () {
  const expirationDate = getExpiresOn()
  const currentDateTime = new Date()
  return expirationDate < currentDateTime
}
