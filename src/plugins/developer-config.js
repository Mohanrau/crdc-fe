// import something here
import constants from 'src/global/const'
import jquery from 'jquery'
import VueOffline from 'vue-offline'
import VueClipboard from 'vue-clipboard2'

// leave the export, even if you don't use it
export default ({app, router, Vue}) => {
  Vue.config.productionTip = false
  // something to do
  // Constant
  constants.install = function () {
    Object.defineProperty(Vue.prototype, '$const', {
      get () { return constants }
    })
  }
  Vue.use(constants)
  // Jquery
  var $ = jquery
  window.$ = $
  // Filters
  Vue.filter('formatPriceDouble', function (value) {
    if (value) {
      let priceWithDecimal = parseFloat(value).toFixed(2)
      // split number to before and after decimal point
      let x = priceWithDecimal.split('.')
      let x1 = x[0]
      let x2 = x.length > 1 ? '.' + x[1] : ''
      var rgx = /(\d+)(\d{3})/
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2')
      }
      // add the complete number back again
      return x1 + x2
    }
    return parseFloat(0.00)
  })
  Vue.filter('uppercase', function (value) {
    if (!value) return ''
    return value.toUpperCase()
  })
  Vue.prototype.$first = function (item, list) {
    return item === list[0]
  }
  Vue.prototype.$last = function (item, list) {
    return item === list[list.length - 1]
  }

  Vue.use(require('vue-shortkey'))
  Vue.use(VueOffline)
  Vue.use(VueClipboard)
}
