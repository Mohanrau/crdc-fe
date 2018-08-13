<template>
  <div class="background-wrapper" :class="{'show-background-img': isDesktop}">
    <div :class="{'login-area-opacity': isDesktop}"
         class="login-area row content-between window-height justify-center">
      <div class="login-area-header col-10 mt-10">
        <div class="row justify-between items-end" :class="{'justify-around': !isDesktop}">
          <div class="col-auto" :class="{'text-grey-1': isDesktop}">
            <q-btn flat class="pd-10">Credit Control v0.1</q-btn>
          </div>
          <div class="col-auto text-white">
            <language :inverted="true"></language>
          </div>
        </div>
      </div>
      <div class="login-area-body col-10">
        <transition
        appear
        enter="fadeInDown"
        leave="fadeOutUp"
        duration="1100"
        >
          <div class="row items-center justify-center full-height full-width">
            <div :class="{'shadow-16': isDesktop}" class="col-lg-4 bg-white">
              <q-card class="login-card shadow-0 text-black relative-position custom-border">
                <div v-if="isLoginAction" class="login-area-login">
                  <q-card-main>
                    <form class="form" @submit.prevent="onSubmit"
                          @keyup.enter="onSubmit"
                          @keydown="clearFormFieldValidation($event.target.name)">
                      <q-field
                      class="q-mb-md"
                      :error="setError('email','type.exp')"
                      :error-label="setError('email','type.msg')"
                      >
                        <q-input :before="[{icon: 'mail', handler () {}}]"
                                 clearable
                                 autofocus
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 :placeholder="$t('Login.Email.Helper')"
                                 name="email"
                                 v-model="form.email"/>
                      </q-field>
                      
                      <q-field :error="setError('password','type.exp')"
                               :error-label="setError('password','type.msg')"
                      >
                        <q-input :before="[{icon: 'lock', handler () {}}]"
                                 clearable
                                 name="password"
                                 inverted-light
                                 color="white"
                                 class="no-shadow custom-input-border"
                                 :placeholder="$t('Login.Password.Helper')"
                                 v-model="form.password"
                                 type="password"/>
                      </q-field>
                    </form>
                  </q-card-main>
                  <q-card-separator/>
                  <q-card-actions>
                    <div class="row full-width full-height group">
                      <div class="col-12">
                        <q-btn block
                               key="login-btn"
                               loader
                               :value="isProcessing"
                               :disabled="isProcessing"
                               class="fit bg-positive"
                               @click="onSubmit">
                        <span slot="loading">
              <q-spinner-tail class="on-left"/>
              Loading...
            </span>
                          {{ $t('Login.LoginBtn') }}
                        </q-btn>
                      </div>
                      <div class="col-12">
                        <q-btn block
                               key="reset-btn"
                               small
                               flat
                               class="fit text-f263b7"
                               @click="isLogin(false)">
                          {{ $t('Login.ResetPasswordBtn') }}
                        </q-btn>
                      </div>
                    </div>
                  </q-card-actions>
                </div>
                <div v-else="" class="login-area-reset">
                  <q-card-main>
                    <form class="form" @submit.prevent="onSubmitResetOrUpdate"
                          @keyup.enter="onSubmitResetOrUpdate"
                          @keydown="clearFormFieldValidation($event.target.name)">
                      <div v-if="!isUpdateAction" class="reset-request">
                        <q-field :error="setError('email','type.exp')"
                                 :error-label="setError('email','type.msg')"
                        >
                          <q-input :before="[{icon: 'mail', handler () {}}]"
                                   clearable
                                   autofocus
                                   inverted-light
                                   color="white"
                                   class="no-shadow custom-input-border"
                                   :placeholder="$t('Login.Email.Helper')"
                                   name="email"
                                   v-model="resetUpdateForm.email"/>
                        </q-field>
                      </div>
                      <div v-else="" class="update-request">
                        <q-field
                        :error="setError('email','type.exp')"
                        :error-label="setError('email','type.msg')"
                        >
                          <q-input :before="[{icon: 'mail', handler () {}}]"
                                   clearable
                                   autofocus
                                   inverted-light
                                   color="white"
                                   class="no-shadow custom-input-border"
                                   :placeholder="$t('Login.Email.Helper')"
                                   name="email"
                                   v-model="resetUpdateForm.email"/>
                        </q-field>
                        <q-field
                        :error="setError('password','type.exp')"
                        :error-label="setError('password','type.msg')"
                        >
                          <q-input :before="[{icon: 'lock', handler () {}}]"
                                   clearable
                                   name="password"
                                   inverted-light
                                   color="white"
                                   class="no-shadow custom-input-border"
                                   :placeholder="$t('Login.NewPassword.Helper')"
                                   v-model="resetUpdateForm.password"
                                   type="password"/>
                        </q-field>
                        <q-field :error="setError('password_confirmation','type.exp')"
                                 :error-label="setError('password_confirmation','type.msg')"
                        >
                          <q-input :before="[{icon: 'lock', handler () {}}]"
                                   clearable
                                   name="password"
                                   inverted-light
                                   color="white"
                                   class="no-shadow custom-input-border"
                                   :placeholder="$t('Login.PasswordConfirmation.Helper')"
                                   v-model="resetUpdateForm.password_confirmation"
                                   type="password"/>
                        </q-field>
                        <q-field
                        :error="setError('token','type.exp')"
                        :error-label="setError('token','type.msg')"
                        >
                          <q-input :before="[{icon: 'vpn_key', handler () {}}]"
                                   clearable
                                   autofocus
                                   type="textarea"
                                   inverted-light
                                   color="white"
                                   class="no-shadow custom-input-border"
                                   :placeholder="$t('Login.Token.Helper')"
                                   :min-rows="4"
                                   v-model="resetUpdateForm.token"/>
                        </q-field>
                      </div>
                    </form>
                  </q-card-main>
                  <q-card-separator/>
                  <q-card-actions>
                    <div class="row full-width full-height group">
                      <div class="col-12">
                        <q-btn block
                               key="login-btn"
                               color="pink-12"
                               :value="isProcessing"
                               :disabled="isProcessing"
                               class="fit"
                               @click="onSubmitResetOrUpdate">
                        <span slot="loading">
              <q-spinner-tail class="on-left"/>
              Loading...
            </span>
                          {{ !isUpdateAction ? $t('Login.ResetBtn') : $t('Login.UpdateBtn')}}
                        </q-btn>
                      </div>
                      <div class="col-12">
                        <q-btn block
                               key="reset-btn"
                               small
                               flat
                               color="pink-3"
                               class="fit"
                               :disable="isProcessing"
                               @click="isLogin(true)">
                          {{ $t('Login.BackBtn') }}
                        </q-btn>
                      </div>
                    </div>
                  </q-card-actions>
                </div>
                <q-loader :visible="isProcessing"></q-loader>
              </q-card>
            </div>
          </div>
        </transition>
      </div>
      <div class="login-area-footer col-10 pd-10 desktop-show" :class="{'text-grey-1': isDesktop}">
        <div class="row justify-center text-center">
          <div class="col-12">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // Import dependencies
  import Translation from 'src/application/global/components/common/translations/translation'
  import {clearReturnURL, getReturnURL} from 'src/services/authService'
  import qLoader from 'src/application/global/components/common/loading/loader'
  import {date, Platform} from 'quasar'
  import {SetFormFieldErrorsMixin} from 'src/application/global/mixins/index'
  import {mapActions, mapState} from 'vuex'
  
  export default {
    name: 'Login',
    components: {
      'language': Translation,
      qLoader
    },
    mixins: [SetFormFieldErrorsMixin],
    computed: {
      ...mapState({
        auth: state => state.loginCMP.auth,
        errors: state => state.globalCMP.errors.data,
        isProcessing: state => state.globalCMP.isProcessing,
        route: state => state.route
      }),
      // Get screen height based on platform
      isDesktop () {
        if (Platform.is.desktop) {
          return true
        }
        return false
      }
    },
    mounted () {
      if (typeof this.route.params.email !== 'undefined' && typeof this.route.params.token !== 'undefined') {
        this.resetUpdateForm.email = this.route.params.email
        this.resetUpdateForm.token = this.route.params.token
        this.isLoginAction = false
        this.isUpdateAction = true
      }
      if (this.route.path.includes('reset')) {
        this.isLoginAction = false
        this.isUpdateAction = false
      }
    },
    methods: {
      ...mapActions([
        'loginAction',
        'resetAction',
        'updateAction',
        'clearValidationAction',
        'resetErrorsAction'
      ]),
      getCurrentYear () {
        let now = Date.now()
        return date.formatDate(now, 'YYYY')
      },
      isLogin (state) {
        this.resetErrorsAction()
        this.isLoginAction = state
        if (state) {
          this.$router.push({name: 'Admin'})
        } else {
          this.$router.push({name: 'Reset'})
        }
      },
      // Submit login form
      onSubmit () {
        this.loginAction(this.form).then(() => {
          let returnURL = getReturnURL()
          if (returnURL !== null && returnURL !== '') {
            this.$router.push(returnURL)
            clearReturnURL()
          } else {
            this.$router.push({name: 'initialize'})
          }
        })
      },
      // Submit reset/update form
      onSubmitResetOrUpdate () {
        if (!this.isUpdateAction) {
          this.resetAction(this.resetUpdateForm).then(() => {
            this.isUpdateAction = true
          })
        } else {
          this.updateAction(this.resetUpdateForm).then(() => {
            this.$router.push({name: 'default'})
          })
        }
      },
      // ClearValidation
      clearFormFieldValidation (name) {
        if (typeof this.errors !== 'undefined' && Object.keys(this.errors).length > 0) {
          this.clearValidationAction(name)
        }
      }
    },
    data () {
      return {
        isLoginAction: true,
        isUpdateAction: false,
        form: {
          email: '',
          password: ''
        },
        resetUpdateForm: {
          email: '',
          password: '',
          password_confirmation: '',
          token: ''
        }
      }
    }
  }
</script>
<style lang="stylus">
  .show-background-img
    background-image url("~assets/login.jpeg")
    background-size cover
    background-position center center
  
  .login-area-opacity
    background-color rgba(0, 0, 0, 0.6)
    overflow auto

</style>
