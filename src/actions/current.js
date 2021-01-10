import stage from '../utils/stage.js';

export default {
    namespaced: true,

    modules: {
        stage: stage
    },

    getters: {
        stage(state, getters) {
            return {
                data: getters['stage/data'],
            }
        },
    }
}