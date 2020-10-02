import stage from 'LIB/store/utils/stage';

export default {
    namespaced: true,

    modules: {
        stage: stage
    },

    getters: {
        stage(state, getters) {
            return getters['stage/data'];
        }
    }
}