import list from '@websanova/vuex-worker/src/actions/list';

export default {
    namespaced: true,

    modules: {
        worker: list
    },

    hooks: {
        created(ctx) {
            // ctx.worker
        }
    },

    request: {
        url: 'demos/users/list'
    },

    getters: {
        test() {
            return 'bah';
        }
    }
}