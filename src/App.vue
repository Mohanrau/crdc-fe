<template>
    <div id="q-app" class="loader">
        <transition
                enter-active-class="animated fadeIn"
                leave-active-class="animated fadeOut"
                mode="out-in"
                :duration="300"
                @leave="resetScroll"
        >
            <router-view/>
        </transition>
    </div>
</template>

<script>
  import {NotificationMixin} from 'src/application/global/mixins'
  import axios from 'axios'
  import {getRefreshToken, isTokenExpired} from 'src/services/authService'
  import {mapActions, mapState} from 'vuex'
  /*
   * Root component
   */
  export default {
    name: 'App',
    mixins: [NotificationMixin],
    created() {
      // Add mobile browser addressBar color
      this.$q.addressbarColor.set('#12256b')
    },
    mounted() {
      axios.interceptors.response.use(response => {
        return response
      }, error => {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message)
        } else {
          const {config, response: {status, data}} = error
          const originalRequest = config
          // Todo make generic notification
          //Setup Generic Response Messages
          if (status === 401) {
            console.log('Unauthorized')
          } else if (status === 403) {
            console.log('Forbidden')
          } else if (status === 404) {
            console.log('API Route is Missing or Undefined')
          } else if (status === 405) {
            console.log('API Route Method Not Allowed')
          } else if (status === 422) {
            //Validation Message
          } else if (status >= 500) {
            console.log('Server Error')
          }
          if (getRefreshToken() !== null && (status === 422 || status === 401) && (typeof data.error !== 'undefined' && (typeof data.error.message !== 'undefined' && data.error.message === 'Unauthenticated.' || data.error === 'Unauthenticated.'))) {
            if (!this.isRefreshing) {
              this.isRefreshing = true
              const refreshToken = `${getRefreshToken()}`
              let query = {
                refresh_token: refreshToken
              }
              this.refreshTokenAction(query)
                .then(newToken => {
                  this.isRefreshing = false
                  this.onRrefreshed(newToken)
                })
                .catch(() => {
                  this.logoutAction({expired: isTokenExpired()}).then(() => {
                    this.$router.push({name: 'Auth'})
                  })
                })
            }
            const retryOrigReq = new Promise((resolve) => {
              this.subscribeTokenRefresh(token => {
                // replace the expired token and retry
                // Pass new access token
                originalRequest.headers['Authorization'] = `Bearer ${token.access_token}`
                resolve(axios(originalRequest))
              })
            })
            return retryOrigReq
          } else {
            return Promise.reject(error)
          }
        }
      })
    },
    computed: {
      ...mapState({
        auth: state => state.loginCMP.auth,
        roles: state => state.globalCMP.roles
      }),
    },
    data: () => ({
      isRefreshing: false,
      refreshSubscribers: []
    }),
    methods: {
      ...mapActions([
        'refreshTokenAction',
        'logoutAction'
      ]),
      /**
       *
       * @param el
       * @param done
       */
      resetScroll(el, done) {
        document.documentElement.scrollTop = 0
        document.body.scrollTop = 0
        done()
      },
      /**
       * Refresh token callback temp holder
       * @param cb
       */
      subscribeTokenRefresh(cb) {
        this.refreshSubscribers.push(cb)
      },
      /**
       * Refresh token remap token
       * @param token
       */
      onRrefreshed(token) {
        this.refreshSubscribers.map(cb => cb(token))
      }
    }
  }
</script>