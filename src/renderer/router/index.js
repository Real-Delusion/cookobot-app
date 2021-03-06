import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

// Routes
export default new Router({
  routes: [
    {
      path: '/dashboard',
      name: 'dashboard',
      component: require('@/views/Dashboard').default,
      beforeEnter: checkAuth
    },
    {
      path: '/',
      name: 'login',
      component: require('@/views/Login').default
    },
    {
      path: '/users',
      name: 'users',
      component: require('@/views/Users').default,
      beforeEnter: checkAdmin
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

function checkAuth(to, from, next) {
  // Read current auth state from Vuex store
  let auth = store.state.auth;
  if (!auth) {
    next(from)  // they are not authorized, so redirect to login

  } else {
    next() // we are authorized, continue on to the requested route
  }
}

function checkAdmin(to, from, next) {
  // Read current user type
  let userType = store.state.user_type;
  let auth = store.state.auth;

  if (userType <= 0 || auth == false) {
    next(from)  // they are not authorized, so redirect to login

  } else {
    next() // we are authorized, continue on to the requested route
  }
}
