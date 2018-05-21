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

// import {store} from './store/index';

const routes = [
    {
        name: 'main',
        path: '/',
        component: main
    },
    {
        name: 'login',
        path: '/login',
        component: login
    },
    {
        name: 'registration',
        path: '/registration',
        component: registration
    },
    {
        name: 'chart',
        path: '/chart',
        component: chart
    },
    {
        name: 'data',
        path: '/data',
        component: data
    },
    {
        name: 'profile',
        path: '/profile',
        component: profile
    },
    {
        name: 'types',
        path: '/types',
        component: types
    },
    {
        path: '*',
        component: E404
    }
];

export const router = new VueRouter({
    routes,
    mode: 'history'
});