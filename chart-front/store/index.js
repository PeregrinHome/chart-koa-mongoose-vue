import Vue from "vue";
import Vuex from "vuex";

import {userStore} from "./user";
import {dataStore} from "./data";

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
    },
    modules: {
        userStore,
        dataStore
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    }
});