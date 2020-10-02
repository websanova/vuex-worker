export default {
    namespaced: true,

    state: {
        current: false
    },
    
    mutations: {
        show(state, name) {
            state.current = name || true;
        },

        hide(state) {
            state.current = false;
        }
    },

    actions: {
        show(ctx, name) {
            ctx.commit('show', name);
        },

        hide(ctx) {
            ctx.commit('hide');
        }
    },

    getters: {
        current(state) {
            return state.current;
        }
    }
}