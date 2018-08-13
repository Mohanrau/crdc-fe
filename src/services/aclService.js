/* eslint-disable no-unused-vars */
'use strict'
import {logout} from './authService'
import {EventBus} from 'src/services/eventService'

class Acl {
  set router (router) {
    this.preInit(router)
  }

  preInit (router) {
    router.beforeEach((to, from, next) => {
      /** Reinit secure page */
      if (to.path === '/deny/403' && from.path === '/') {
        return next(this.secure)
      }
      if (to.meta.permission === 'public') {
        return next()
      }
      if (!this.aclCurrentAssignComplete) {
        /** Set current url if acl assign not complete yet */
        window.localStorage.setItem('next_url', to.path)
        return next(this.secure)
      }
      let fail = to.meta.fail || this.fail || from.fullPath
      if (!this.check(to.meta.permission)) {
        return next(fail)
      }
      /** Retrive URL from localStorage to redirect user to requested page */
      let returnURL = window.localStorage.getItem('next_url')
      let pass = returnURL || to.fullPath
      /** Remove localStorage URL */
      window.localStorage.removeItem('next_url')
      if (pass === to.path) {
        return next()
      }
      return next(pass)
    })
  }

  init (router, permissions, fail, secure, save) {
    let lsPermissions = ''
    this.router = router
    this.save = save
    this.aclCurrentCountry = 0
    this.aclCurrentAssignComplete = false
    this.aclCurrentSchema = []
    this.aclCurrentDisable = false
    /** Retrieve permission from localStorage */
    try {
      lsPermissions = window.localStorage.getItem('permissions')
    } catch (e) {
      lsPermissions = null
    }
    if (lsPermissions !== null) {
      permissions = lsPermissions
    }
    this.permissions = this.clearPermissions(permissions)
    this.savePermissions()
    /** failed route path */
    this.fail = fail
    /** SaveGuard dynamic route path and assign ACL status to complete */
    this.secure = secure
  }

  applySchema (schemaKeys) {
    let pathData = {}
    let actionData = {}
    let keys = schemaKeys.split('|')
    if (keys.length >= 2) {
      pathData = this.aclCurrentSchema.find(x => x.path === keys[0])
      if (pathData !== undefined) {
        if (Object.keys(pathData).length > 0) {
          actionData = pathData.items.find(y => y.action === keys[1])
        }
        if (actionData !== undefined) {
          if (Object.keys(actionData).length > 0) {
            return actionData.allowed
          }
        }
      }
    }
    return []
  }

  check (permission) {
    if (this.aclCurrentDisable) {
      return true
    } else {
      if (!permission) {
        return false
      }
      const permissions = (permission.indexOf('|') !== -1) ? permission.split('|') : [permission]
      return this.findPermission(permissions) !== undefined
    }
  }

  findPermission (checkPermissionsData) {
    return checkPermissionsData.find((permission) => {
      let allowedData = (permission.indexOf('&') !== -1) ? permission.split('&') : permission
      let filterAllowedDataByCountry = allowedData.filter((allow) => {
        /** return permission that allowed for user selected country */
        return allow.indexOf(this.aclCurrentCountry) !== -1
      })
      if (Array.isArray(filterAllowedDataByCountry)) {
        return filterAllowedDataByCountry.findIndex((allowed) => this.permissions.includes(allowed)) !== -1
      }
      return this.permissions.indexOf(filterAllowedDataByCountry) !== -1
    })
  }

  clearPermissions (permissions) {
    if (permissions.indexOf('&') !== -1) {
      permissions = permissions.split('&')
    }
    return Array.isArray(permissions) ? permissions : [permissions]
  }

  savePermissions () {
    if (this.save !== true) {
      return
    }
    let perm = this.permissions
    if (Array.isArray(this.permissions)) {
      perm = this.permissions.join('&')
    }
    if (perm !== '') {
      /** Set permissions to localStorage */
      window.localStorage.setItem('permissions', perm)
    }
  }
}

let acl = new Acl()

Acl.install = (Vue, {router, init, fail, secure, save}) => {
  acl.init(router, init, fail, secure, save)
  Vue.prototype.$can = (permission) => acl.check(permission)
  Vue.prototype.$apply = (schemaKeys) => acl.applySchema(schemaKeys)
  Vue.prototype.$aclDisable = acl.aclCurrentDisable
  Vue.mixin({
    data: () => ({
      aclAccess: acl.clearPermissions(init),
      aclCountry: '',
      aclAssignComplete: '',
      aclSchema: '',
      aclDisable: ''
    }),
    /**
     * Watch required @aclAccess & @aclCountry
     */
    watch: {
      aclAccess (newValue, oldValue) {
        this.rebuildAcl(newValue, oldValue, 'access')
      },
      aclCountry (newValue, oldValue) {
        this.rebuildAcl(newValue, oldValue, 'country')
      },
      aclAssignComplete (newValue, oldValue) {
        this.rebuildAcl(newValue, oldValue, 'complete')
      },
      aclSchema (newValue, oldValue) {
        this.rebuildAcl(newValue, oldValue, 'schema')
      },
      aclDisable (newValue, oldValue) {
        this.rebuildAcl(newValue, oldValue, 'enable')
      }
    },
    methods: {
      /**
       * Rebuild ACL based on latest data
       * @param newValue
       * @param oldValue
       * @param rebuildType
       */
      rebuildAcl (newValue, oldValue, rebuildType) {
        if (rebuildType === 'enable') {
          acl.aclCurrentDisable = newValue
          Vue.prototype.$aclDisable = acl.aclCurrentDisable
        } else if (rebuildType === 'access') {
          acl.permissions = acl.clearPermissions(newValue)
        } else if (rebuildType === 'country') {
          acl.aclCurrentCountry = newValue
          /** Emiting global events */
          if (newValue !== oldValue) {
            EventBus.$emit('buildRoutesEvent')
            EventBus.$emit('buildNavigationsEvent')
          }
        } else if (rebuildType === 'complete') {
          acl.aclCurrentAssignComplete = newValue
          acl.savePermissions()
          /** Reinit router */
          let nextURL = window.localStorage.getItem('next_url')
          if (nextURL === null) {
            this.$router.push({name: 'default'})
          } else {
            this.$router.push(nextURL)
          }
        } else {
          acl.aclCurrentSchema = newValue
        }
      }
    }
  })
}

export default Acl
