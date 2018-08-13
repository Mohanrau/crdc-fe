// Configuration for your app
const env = require('dotenv').config()
const Dotenv = require('dotenv-webpack')

module.exports = function (ctx) {
  return {
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      'mdi',
      'ionicons',
      'fontawesome'
    ],
    supportIE: true,
    build: {
      scopeHoisting: true,
      vueRouterMode: ctx.prod ? 'history' : 'history',
      extendWebpack (cfg) {
        cfg.module.rules.push(
          {
            enforce: 'pre',
            test: /\.(js|vue)$/,
            loader: 'eslint-loader',
            exclude: /(node_modules|quasar)/
          }
        )
        // Load .env variables into node env
        cfg.plugins.push(new Dotenv({
          path: './.env', // Path to .env file (this is the default)
          safe: false // load .env.example (defaults to "false" which does not use dotenv-safe)
        }))
      }
    },
    plugins: ['vuex-i18n', 'axios', 'vuelidate', 'vuex-router-sync', 'developer-config', 'acl', 'addressbar-color', 'vue-flag-icons', 'schema-manager'],
    devServer: {
      open: false,
      port: env.parsed.APP_PORT
    },
    framework: 'all',
    animations: 'all',
    pwa: {
      cacheExt: 'js,html,css,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        name: 'Quasar Play',
        short_name: 'Quasar-Play',
        description: 'Quasar Framework Showcase',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ],
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3'
      }
    },
    cordova: {
      // id: 'org.cordova.quasar.application'
    },
    electron: {
      packager: {
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Window only
        // win32metadata: { ... }
      }
    }
  }
}
