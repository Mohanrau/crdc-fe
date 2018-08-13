/* eslint-disable no-unused-vars */
import axios from 'axios'
import { getAccessToken } from 'src/services/authService'

// Fallback of setAuth set default token if user refresh the page
axios.defaults.headers.common['Authorization'] = `Bearer ${getAccessToken()}`
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

const CancelToken = axios.CancelToken
let cancel

export function get (url) {
  return axios({
    method: 'GET',
    url: url,
    withCredentials: false,
    responseType: 'json',
    // validateStatus: (status) => {
    //   return true // I'm always returning true, you may want to do it depending on the status received
    // },
    cancelToken: new CancelToken(function executor (c) {
      // An executor function receives a cancel function as a parameter
      cancel = c
    }),
    maxRedirects: 5
  })
}

export function post (url, payload) {
  return axios({
    method: 'POST',
    url: url,
    data: payload,
    withCredentials: false,
    responseType: 'json',
    // validateStatus: function (status) {
    //   return status >= 200 && status < 300 // default
    // },
    cancelToken: new CancelToken(function executor (c) {
      // An executor function receives a cancel function as a parameter
      cancel = c
    }),
    maxRedirects: 5
  })
}

export function put (url, payload) {
  return axios({
    method: 'PUT',
    url: url,
    data: payload,
    withCredentials: false,
    responseType: 'json',
    // validateStatus: function (status) {
    //   return status >= 200 && status < 300 // default
    // },
    maxRedirects: 5
  })
}

export function patch (url, payload) {
  return axios({
    method: 'PATCH',
    url: url,
    data: payload,
    withCredentials: false,
    responseType: 'json',
    // validateStatus: function (status) {
    //   return status >= 200 && status < 300 // default
    // },
    maxRedirects: 5
  })
}

// delete is reserved keyword
export function del (url) {
  return axios({
    method: 'DELETE',
    url: url,
    withCredentials: false,
    responseType: 'json',
    // validateStatus: function (status) {
    //   return status >= 200 && status < 300 // default
    // },
    maxRedirects: 5
  })
}
