export default {
    namespaced: true,

    state() {
        return {
            data: {}
        };
    },

    mutations: {
        data(state, data) { 
            state.data = data;
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