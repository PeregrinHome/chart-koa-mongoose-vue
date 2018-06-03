import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import E404 from '../src/components/E404';
import login from '../src/components/login';
import registration from '../src/components/registration';
import chart from '../src/components/chart';
import data from '../src/components/data';
import profile from '../src/components/profile';
import types from '../src/components/types';
import main from '../src/components/main';

import {store} from '../store/index';
import {getLocalStringCrypt} from "../modules/cryptoSaveLocal";

const routes = [
    {
        name: 'main',
        path: '/',
        component: main,
        beforeEnter: (to, from, next) => {
            let token = getLocalStringCrypt("token");
            if(token){
                store.dispatch('userStore/initWithToken', token, { root: true }).then((res)=>{
                    if(!res.ok){
                        next('login');
                    }else{
                        // token = store.getters('userStore/token');
                        // console.log(token);
                        next();
                    }
                });
            }else{
                next('login');
            }
        }
    },
    {
        name: 'login',
        path: '/login',
        component: login,
        beforeEnter: (to, from, next) => {
            next();
            // let token = getLocalStringCrypt("token");
            // if(token){
            //     store.dispatch('userStore/initWithToken', token, { root: true }).then((res)=>{
            //         if(!res.ok){
            //             next();
            //         }else{
            //             next('/');
            //         }
            //     });
            // }else{
            //     next();
            // }
        }
    },
    {
        name: 'registration',
        path: '/registration',
        component: registration,
        beforeEnter: (to, from, next) => {
            let token = getLocalStringCrypt("token");
            if(token){
                store.dispatch('userStore/initWithToken', token, { root: true }).then((res)=>{
                    if(!res.ok){
                        next();
                    }else{
                        next('/');
                    }
                });
            }else{
                next();
            }
        }
    },
    {
        name: 'chart',
        path: '/chart',
        component: chart,
        beforeEnter: (to, from, next) => {
            let token = getLocalStringCrypt("token");
            if(token){
                store.dispatch('userStore/initWithToken', token, { root: true }).then((res)=>{
                    if(!res.ok){
                        next('login');
                    }else{
                        next();
                    }
                });
            }else{
                next('login');
            }
        }
    },
    {
        name: 'data',
        path: '/data',
        component: data,
        beforeEnter: (to, from, next) => {
            let token = getLocalStringCrypt("token");
            if(token){
                store.dispatch('userStore/initWithToken', token, { root: true }).then((res)=>{
                    if(!res.ok){
                        next('login');
                    }else{
                        next();
                    }
                });
            }else{
                next('login');
            }
        }
    },
    {
        name: 'profile',
        path: '/profile',
        component: profile,
        beforeEnter: (to, from, next) => {
            let token = getLocalStringCrypt("token");
            if(token){
                store.dispatch('userStore/initWithToken', token, { root: true }).then((res)=>{
                    if(!res.ok){
                        next('login');
                    }else{
                        next();
                    }
                });
            }else{
                next('login');
            }
        }
    },
    {
        name: 'types',
        path: '/types',
        component: types,
        beforeEnter: (to, from, next) => {
            let token = getLocalStringCrypt("token");
            if(token){
                store.dispatch('userStore/initWithToken', token, { root: true }).then((res)=>{
                    if(!res.ok){
                        next('login');
                    }else{
                        next();
                    }
                });
            }else{
                next('login');
            }
        }
    },
    {
        path: '*',
        component: E404,
        beforeEnter: (to, from, next) => {
            next();
        }
    }
];

export const router = new VueRouter({
    routes,
    mode: 'history'
});