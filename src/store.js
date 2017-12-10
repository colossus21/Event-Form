import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = {
    state: {
        uid: null
    },
    mutations: {
        update(state,uid) {
            state.uid = uid;
        }
    },
    getters: {

    },
    actions: {
        //asynch
    }
}
