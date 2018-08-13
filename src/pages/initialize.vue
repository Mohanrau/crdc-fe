<template>
    <!--make it empty always-->
</template>
<script>
  import {
    Loading,
    QSpinnerTail
  } from 'quasar'
  import { EventBus } from 'src/services/eventService'
  import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapState({
        appSettings: state => state.globalCMP.appSettings,
        selectedFilters: state => state.globalCMP.selectedFilters,
        userInfo: state => state.globalCMP.userInfo.data,
        acl: state => state.globalCMP.acl
      }),
      ...mapGetters([
        'getSelectedFilters'
      ]),
      aclModuleDisable () {
        if (this.userInfo !== undefined && this.userInfo.user_type !== undefined && this.userInfo.user_type === 'root') {
          return true
        } else {
          return false
        }
      },
      schemaManagerModuleEnable () {
        if (this.userInfo !== undefined && this.userInfo.user_type !== undefined && this.userInfo.user_type === 'root') {
          return true
        }
        return false
      },
      getUserPermissions () {
        if (this.userInfo !== undefined && this.userInfo.permissions !== undefined && this.userInfo.permissions !== null) {
          return this.userInfo.permissions
        }
        return []
      },
      getUserCountry () {
        if (this.userInfo !== undefined && this.userInfo.staff !== undefined) {
          return this.userInfo.staff.country_id
        } else if (this.userInfo !== undefined && this.userInfo.stockist !== undefined) {
          return this.userInfo.stockist.country_id
        } else if (this.userInfo !== undefined && this.userInfo.member !== undefined) {
          return this.userInfo.member.country_id
        } else {
          return 1
        }
      }
    },
    created () {
      Loading.show({
        spinner: QSpinnerTail,
        message: 'Initializing Application ! This might take few moments',
        messageColor: 'white q-body-1',
        spinnerSize: 70, // in pixels
        spinnerColor: 'white',
      })
    },
    mounted () {
      this.getUserDetailsAction().then(() => {
        if (this.getSelectedFilters.countryID === null) {
          this.setFilterData({countryID: this.getUserCountry})
        }
        this.aclSchema = this.acl.schema
        this.schemaMap = this.acl.schema
        this.aclAccess = this.getUserPermissions
        this.aclCountry = this.selectedFilters.countryID
        this.schemaManagerEnable = this.schemaManagerModuleEnable
        this.aclDisable = this.aclModuleDisable
      }).catch(() => {
        Loading.hide()
        this.$router.push({name: 'error'})
      })
      // Rebuild routes based on user selected country
      EventBus.$on('buildRoutesEvent', () => {
        let buildDone = this.buildRoutes()
        // Check rebuild routes with current user route
        buildDone.then(() => {
          // If current route dosen't has permission object re route to deny page
          if (this.$route.meta.permission === undefined) {
            this.$router.push({name: 'deny'})
          }
        })
      })
    },
    methods: {
      ...mapActions([
        'isProcessingAction',
        'getUserDetailsAction'
      ]),
      ...mapMutations({
        setFilterData: 'SET_FILTER_DATA'
      }),
      buildRoutes () {
        let routes
        const getDefaultNavigation = this.$router.options.routes.filter((item) => item.name === 'default')
        if (getDefaultNavigation.length > 0) {
          routes = getDefaultNavigation[0].children
        }
        var saveGuardPromise = new Promise((resolve) => {
          resolve(this.saveGuardNavigation(routes))
        })
        saveGuardPromise.then(() => {
          this.aclAssignComplete = true
          Loading.hide()
        })
        return saveGuardPromise
      },
      /**
       * Initiate navigation saveGuard
       * @param data
       * @returns {*}
       */
      saveGuardNavigation (data) {
        data.forEach((navigation) => {
          let permissions = [...this.getUserPermissions]
          let filteredPermission = permissions.filter((x) => {
            // Break permission by country eg.sales.management.list.[1].superadmin.view, replace 1 with #
            const breakIndex = x.split(/[0-9]/).join('!').indexOf('!')
            // Break permission by # index
            const comparePath = x.substring(0, breakIndex - 1).split('.').join('/')
            // Remove url placeholders eg.sales/management/view/[:saleID] replace [:saleID] to /* from routes [] as identifier
            const navigationReplacePlaceholders = navigation.path.replace(/\s*([:[0-9a-zA-z]+])\s*/g, '*')
            // Remove url placeholders eg.sales/management/view/[:saleID] => /management/view/*  remove /* => /management/view
            const navigationFilterPlaceholders = navigationReplacePlaceholders.replace(/\/\*/g, '')
            // Remove / from string to match /sales/management/view/[1] => sales/management/view/[1]
            const navigationRoutePath = navigationFilterPlaceholders.substring(1, navigationFilterPlaceholders.length - 1)
            if (comparePath === navigationRoutePath) {
              return x
            }
          })
          if (filteredPermission.length > 0) {
            let filterAllowedDataByCountry = filteredPermission.filter((allow) => {
              // return permission that allowed for user selected country
              return allow.indexOf(this.selectedFilters.countryID) !== -1
            })
            if (filterAllowedDataByCountry.length > 0) {
              navigation.meta.permission = filterAllowedDataByCountry
            } else {
              delete  navigation.meta.permission
            }
          }
          if (typeof navigation.children !== 'undefined') {
            this.saveGuardSubNavigation(navigation.children, 0)
          }
        })
        const guardedRoutes = [...data]
        return guardedRoutes
      },
      /**
       * Assign subNavigation saveGuard
       * @param current
       * @param depth
       */
      saveGuardSubNavigation (current, depth) {
        let subNavigation = current
        for (var i = 0, len = subNavigation.length; i < len; i++) {
          this.saveGuardSubNavigation(subNavigation[i], depth + 1)
          let permissions = [...this.getUserPermissions]
          let filteredPermission = permissions.filter((x) => {
            // Break permission by country eg.sales.management.list.[1].superadmin.view, replace 1 with #
            const breakIndex = x.split(/[0-9]/).join('!').indexOf('!')
            // Break permission by # index
            const comparePath = x.substring(0, breakIndex - 1).split('.').join('/')
            // Remove url placeholders eg.sales/management/view/[:saleID] replace [:saleID] to /* from routes [] as identifier
            const subNavigationReplacePlaceholders = subNavigation[i].path.replace(/\s*([:[0-9a-zA-z]+])\s*/g, '*')
            // Remove url placeholders eg.sales/management/view/[:saleID] => /management/view/*  remove /* => /management/view
            const subNavigationFilterPlaceholders = subNavigationReplacePlaceholders.replace(/\/\*/g, '')
            // Remove / from string to match /sales/management/view/[1] => sales/management/view/[1]
            const subNavigationRoutePath = subNavigationFilterPlaceholders.substring(1, subNavigationFilterPlaceholders.length)
            if (comparePath === subNavigationRoutePath) {
              return x
            }
          })
          if (filteredPermission.length > 0) {
            let filterAllowedDataByCountry = filteredPermission.filter((allow) => {
              // return permission that allowed for user selected country
              return allow.indexOf(this.selectedFilters.countryID) !== -1
            })
            if (filterAllowedDataByCountry.length > 0) {
              subNavigation[i].meta.permission = filteredPermission
            } else {
              delete  subNavigation[i].meta.permission
            }
          }
          // Todo fix n-depth child
          if (typeof subNavigation[i].children !== 'undefined') {
            // this.saveGuardSubNavigation(subNavigation[i].children, 0)
            // console.log(subNavigation[i].children)
          }
        }
      }
    }
  }
</script>