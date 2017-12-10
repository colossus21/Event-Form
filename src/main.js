import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"

import App from './App.vue'
import VueFire from 'vuefire'
import Firebase from 'firebase'
import front from './front.vue'
import my_events from './myEvents.vue'
import register from './register.vue'
import add_event from './placeEvent.vue'
import profile from './profile.vue'


import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import {store} from './store'


Vue.use(VueRouter)
Vue.use(BootstrapVue)
Vue.use(VueResource)



const routes = [
    { path: '/', component: front },
    { path: '/register', component: register },
    { path: '/add_event', component: add_event },
    { path: '/profile', component: profile },
    { path: '/my_events', component: my_events }
]

const router = new VueRouter({
    mode: 'history',
    routes
})

let config = {apiKey: 'AIzaSyBheytMOL89gaxMPznek96VYoWvvHJo3wI',
    authDomain: 'cse391-4808e.firebaseapp.com',
    databaseURL: 'https://cse391-4808e.firebaseio.com',
    projectId: 'cse391-4808e',
    storageBucket: 'cse391-4808e.appspot.com'}

let app = Firebase.initializeApp(config)

new Vue({
    el: '#app',
    render: h => h(App),
    router,
    store
})
