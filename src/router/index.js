/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'

import { routes } from 'src/application/'
import global from 'src/application/global/router'
import login from 'src/application/login/router'
import { requireAuth, setReturnURL } from '../services/authService'
import Full from 'src/containers/Full'

Vue.use(VueRouter)

// Init router defaults
function createRouter () {
  const Router = new VueRouter({
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
    linkActiveClass: 'open active',
    scrollBehavior: () => ({y: 0}),
    routes: assignRoutesDefault(routes)
  })
  // Capture route transition
  Router.beforeEach((to, from, next) => {
    // Check meta.requiresAuth if yes allow user to next level
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!requireAuth()) {
        setReturnURL(to.path)
        return next({path: '/auth'})
      } else {
        return next()
      }
    }
    // Access public pages
    if (to.matched.some(record => record.meta.requiresNotAuth)) {
      if (requireAuth()) {
        return next({path: '/'})
      }
    }
    // Without checks
    next()
  })
  return Router
}

function assignRoutesDefault (routes) {
  let defaultRoutesData = [
    login,
    {
      path: '/',
      component: Full,
      name: 'default',
      redirect: '/dashboard',
      meta: {
        menuItem: false,
        requiresAuth: true,
        permission: 'public'
      },
      children: [...routes]
    }
  ]
  const mergedRoutesData = [...defaultRoutesData, ...global]
  return mergedRoutesData
}

export default createRouter()
