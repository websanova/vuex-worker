import Vue from 'vue';

export default {
    namespaced: true,

    state() {
        return {
            data: {}
        };
    },

    mutations: {
        data(state, data) {
            var i;

            for (i in data) {
                Vue.set(state.data, i, data[i]);
            }
        }
    },

    actions: {
        update(ctx, data) {
            ctx.commit('data', data);
        },

        clear(ctx) {
            ctx.commit('data', {});
        }
    },

    getters: {
        data(state) {
            return state.data;
        }
    }
}