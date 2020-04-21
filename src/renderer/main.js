import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// Bulma
import 'bulma/css/bulma.css';

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faTimesCircle, faGripVertical, faChevronRight, faChevronLeft, faCog, faUsers, faExclamationCircle, faUtensils, faSignOutAlt, faUser, faTrashAlt, faCheckCircle, faRobot, faSignInAlt, faBackspace, faGripLinesVertical } from '@fortawesome/free-solid-svg-icons'

library.add([faTimesCircle, faUsers, faGripVertical, faChevronRight, faChevronLeft, faGripLinesVertical, faCog, faExclamationCircle, faUtensils, faSignOutAlt, faUser, faTrashAlt, faCheckCircle, faRobot, faSignInAlt, faBackspace])

// Socket.io
import io from './utils/socket.js'

Vue.component('font-awesome-icon', FontAwesomeIcon)

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

export const bus = new Vue();

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
