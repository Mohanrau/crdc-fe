<template>
    <div class="background-wrapper" :class="{'show-background-img': isDesktop}">
        <div :class="{'login-area-opacity': isDesktop}"
             class="login-area row content-between window-height justify-center">
            <div class="login-area-header col-10">
                <div class="row justify-between items-baseline" :class="{'justify-around': !isDesktop}">
                    <div class="col-auto" :class="{'text-grey-1': isDesktop}">
                        <q-btn flat class="pd-10">Elken Internal Backend </q-btn>
                    </div>
                    <div class="col-auto text-white">
                        <language :inverted="true"></language>
                    </div>
                </div>
            </div>
            <div class="login-area-body col-10">
                <q-transition
                        appear
                        enter="fadeInDown"
                        leave="fadeOutUp"
                        duration="1100"
                >
                    <div class="row items-center justify-center full-height full-width">
                        <div :class="{'shadow-16': isDesktop}" class="col-lg-4 bg-white">
                            <q-card class="login-card shadow-0 text-black relative-position">
                                <div class="login-area-login">
                                    <div class="row justify-center no-margin bg-12256b pd-20">
                                        <div class="col-4 mt-10">
                                            <img class="logo responsive" src="~assets/logo.png">
                                        </div>
                                    </div>
                                    <q-card-main>
                                        <form class="form" @submit.prevent="onSubmit"
                                              @keydown="clearFormFieldValidation($event.target.name)">
                                            <q-field
                                                    icon="email"
                                                    :helper="$t('Login.Email.Helper')"
                                                    :error="setError('email','type.exp')"
                                                    :error-label="setError('email','type.msg')"
                                            >
                                                <q-input clearable autofocus color="primary" name="email" v-model="form.email"
                                                         :float-label="$t('Login.Email.Label')"/>
                                            </q-field>

                                            <q-field
                                                    icon="lock"
                                                    :helper="$t('Login.Password.Helper')"
                                                    :error="setError('password','type.exp')"
                                                    :error-label="setError('password','type.msg')"
                                            >
                                                <q-input clearable name="password" color="primary"
                                                         :float-label="$t('Login.Password.Label')" v-model="form.password" type="password"/>
                                            </q-field>

                                            <q-field
                                                    icon="lock"
                                                    helper="Confirm Password"
                                                    :error="setError('password','type.exp')"
                                                    :error-label="setError('password','type.msg')"
                                            >
                                                <q-input clearable name="password2" color="primary" v-model="form.password_confirmation"
                                                         float-label="Confirm Password" type="password"/>
                                            </q-field>
                                        </form>
                                    </q-card-main>
                                    <q-card-separator/>
                                    <q-card-actions>
                                        <div class="row full-width full-height group">
                                            <div class="col-12">
                                                <q-btn block
                                                       key="reset-btn"
                                                       color="pink-12"
                                                       :value="isProcessing"
                                                       :disabled="isProcessing"
                                                       class="fit"
                                                       @click="onSubmit">
                                                    <span slot="loading"><q-spinner-tail class="on-left"/>Loading...</span> Reset Password
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
                            </q-card>
                        </div>
                    </div>
                </q-transition>
            </div>
        </div>
    </div>
</template>

<script>
  // Import dependencies
  import { mapActions, mapState } from 'vuex'
  import Translation from '../../global/components/common/translations/translation'
  import qLoader from '../../global/components/common/loading/loader'

  export default {
    name: 'Reset-Password',
    components: {
      'language': Translation,
      qLoader
    },
    computed: {
      ...mapState({
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
    methods: {
      ...mapActions([
        'resetPasswordAction',
        'clearValidationAction',
        'resetErrorsAction'
      ]),
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
        if (this.password_confirmation !== '' && this.password_confirmation !== null) {
          let query = {
            email: this.form.email,
            password: this.form.password,
            password_confirmation: this.form.password_confirmation,
            token: this.$route.params.key
          }
          this.resetPasswordAction(query).then(res => {
            if (res.error) {
              Dialog.create({
                title: this.TitleLabel,
                message: res.error
              })
            } else {
              Dialog.create({
                title: this.TitleLabel,
                message: res.status
              })
            }
          })
        }
      },
      // ClearValidation
      clearFormFieldValidation (name) {
        if (Object.keys(this.errors).length > 0) {
          this.clearValidationAction(name)
        }
      },
      // Return error boolean expression
      // Passing name and type
      setError (name, type) {
        // Check type and process
        if (type === 'type.exp') {
          // Check this.errors contains name key inside object
          if (this.errors !== undefined && this.errors.hasOwnProperty(name)) {
            return true
          } else {
            return false
          }
        }
        // Check type and process
        if (this.errors !== undefined && this.errors.hasOwnProperty(name) && type === 'type.msg') {
          // Check this.errors contains name key inside object
          if (this.errors.hasOwnProperty(name)) {
            return this.errors[name][0]
          } else {
            return ''
          }
        }
      }
    },
    data () {
      return {
        TitleLabel: 'Reset Password',
        form: {
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
