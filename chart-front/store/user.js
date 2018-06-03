import {config} from "../config";
import rp from "request-promise";
import { saveLocalStringCrypt, getLocalStringCrypt } from "../modules/cryptoSaveLocal";

export const userStore = {
    namespaced: true,
    state: {
        token: '',
        username: '',
        email: ''
    },
    getters: {
        // token(state) {
        //     return state.token;
        // }
    },
    mutations: {
        setTokenResponse(state, token) {
            if(token.length > 0){
                state.token = token;
                saveLocalStringCrypt('token', token);
                // console.log(getLocalStringCrypt('token'));
            }
        },
        setUserResponse(state, user) {
            if(user.username){ state.username = user.username; }
            if(user.email){ state.email = user.email; }
        }
    },
    actions: {
        clearUser(){

        },
        async initWithToken(store, token){
            console.log(token);
            let response = await rp({
                method: 'GET',
                uri: config.host+'/login',
                simple: false,
                resolveWithFullResponse: true,
                headers: {
                    "Authorization": token
                },
                body: {},
                json: true // Automatically stringifies the body to JSON
            });
            console.log(response.body);
            if(response.statusCode !== 200){
                return { ok: false };
            }else{
                store.dispatch('setDataForResponse', response.body, { root: true });
                return { ok: true };
            }
        },
        async login(store, data){
            let response = await rp({
                method: 'POST',
                uri: config.host+'/login',
                simple: false,
                resolveWithFullResponse: true,
                body: {
                    email: data.email,
                    password: data.password
                },
                json: true // Automatically stringifies the body to JSON
            });
            if(response.statusCode === 200){
                store.dispatch('setDataForResponse', response.body, { root: true });
                if(response.body.successMessages){
                    return { ok: true, messages: response.body.successMessages };
                }else{
                    return { ok: true };
                }
            }else{
                if(response.body.errorMessages){
                    return { ok: false, messages: response.body.errorMessages };
                }else{
                    return { ok: false };
                }
            }
        },
        async registration(store, data) {
            let response = await rp({
                method: 'POST',
                uri: config.host+'/registration',
                simple: false,
                resolveWithFullResponse: true,
                body: {
                    username: data.username,
                    email: data.email,
                    password: data.password
                },
                json: true // Automatically stringifies the body to JSON
            });
            if(response.statusCode === 200){
                store.dispatch('setDataForResponse', response.body, { root: true });
                if(response.body.successMessages){
                    return { ok: true, messages: response.body.successMessages };
                }else{
                    return { ok: true };
                }
            }else{
                if(response.body.errorMessages){
                    return { ok: false, messages: response.body.errorMessages };
                }else{
                    return { ok: false };
                }
            }
        },
        token(store) {
            console.log('registration');
            // store.commit('token', 'token 2');
        }
    }
};