import stage from '../utils/stage.js';

export default {
    namespaced: true,

    modules: {
        stage: stage
    },

    actions: {
        clear(ctx) {
            ctx.dispatch('stage/clear');
        }
    },

    getters: {
        stage(state, getters) {
            return {
                data: getters['stage/data'],
            }
        },
    }
}