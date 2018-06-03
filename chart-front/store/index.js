import Vue from "vue";
import Vuex from "vuex";

import {userStore} from "./user";
import {dataStore} from "./data";

Vue.use(Vuex);

export const store = new Vuex.Store({
    namespaced: true,
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
        setDataForResponse(state, data){
            if(data.user){
                store.commit('userStore/setUserResponse', data.user, { root: true });
            }
            if(data.token){
                store.commit('userStore/setTokenResponse', data.token, { root: true });
            }
        },
    }
});