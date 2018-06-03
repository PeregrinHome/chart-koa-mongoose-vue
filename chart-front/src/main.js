import Vue from 'vue';
import App from './App.vue';

import {store} from '../store';
import {router} from '../routes';

Vue.config.productionTip = false;


import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
Vue.use(Vuetify);

import Vuelidate from 'vuelidate';
Vue.use(Vuelidate);

import { getLocalStringCrypt, saveLocalStringCrypt } from "../modules/cryptoSaveLocal";

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');
