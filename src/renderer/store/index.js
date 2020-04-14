import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

// Vuex Store
export default new Vuex.Store({
  modules,
  plugins: [
    createPersistedState()
    //createSharedMutations()
  ],
  state: {
    auth: false, // authenticated
    user_name: "", // user name
    user_type: 0 // user type ( 0 --> User, 1 --> Admin)
  },
  mutations: {
    auth(state, status) {
      state.auth = status;
    },
    name(state, name) {
      state.user_name = name;
    },
    type(state, type) {
      state.user_type = type;
    }
  },
  actions: {
    auth(context, status) {
      context.commit('auth', status)
    },
    name(context, status) {
      context.commit('name', status)
    },
    type(context, status) {
      context.commit('type', status)
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

