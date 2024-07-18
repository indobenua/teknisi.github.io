import Vue from 'vue';

import './plugins/mq';
import './plugins/router';
import './plugins/vuetify';

import VueTypedJs from 'vue-typed-js';
Vue.use(VueTypedJs);

import VueToast from 'vue-toast-notification';
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';

import router from './pages';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

Vue.use(VueToast, {
    // One of the options
    position: 'top'
})

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
