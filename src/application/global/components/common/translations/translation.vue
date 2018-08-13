<template>
    <q-select
            :disable="languageOptions.options.length === 0"
            class="bg-f263b7"
            :inverted="inverted"
            v-model="lang"
            :options="languageOptions.options"
            @input="changeLanguage"
            :display-value="getLanguageKey"
    />
</template>

<script>
  import { lowerCase, lowerThenCapitalize } from 'src/helpers/filters'
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'translation',
    props: {
      inverted: Boolean,
      default: false
    },
    data () {
      return {
        lang: ''
      }
    },
    computed: {
      ...mapState({
        languageOptions: state => state.globalCMP.languagesOptions.data,
      }),
      getLanguageKey () {
        var setLang = `${this.$i18n.locale() ? this.$i18n.locale() : localStorage.getItem('Lang')}`
        return lowerThenCapitalize(setLang)
      }
    },
    mounted () {
      this.getLanguagesAction({})
    },
    methods: {
      ...mapActions([
        'getLanguagesAction',
      ]),
      changeLanguage (item) {
        if (item) {
          let result = this.languageOptions.options.find(x => x.value === item)
          let locale = lowerCase(result.key)
          this.$i18n.set(locale)
          import(/* webpackChunkName: "lang-[request]" */ `src/resources/locales/locale-${locale}.json`).then(items => {
            this.$i18n.add(locale, items.default)
          })
          if (locale !== 'undefined' && locale !== '') {
            localStorage.setItem('Lang', locale)
          }
        }
      }
    }
  }
</script>
