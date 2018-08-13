import vuexI18n from 'vuex-i18n'
import store from '../store'
import axios from 'axios'

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {
  Vue.use(vuexI18n.plugin, store)
  let locale = localStorage.getItem('Lang') ? localStorage.getItem('Lang') : 'en'
  Vue.i18n.set(locale)
  axios.defaults.headers.common['Accept-Language'] = locale
  document.querySelector('html').setAttribute('lang', locale)
  import(/* webpackChunkName: "lang-[request]" */ `src/resources/locales/locale-${locale}.json`).then(items => {
    Vue.i18n.add(locale, items.default)
  })
}
