import fetch from '@websanova/vuex-worker/src/actions/fetch';

export default {
    namespaced: true,

    modules: {
        worker: fetch
    },

    request: {
        url(ctx, payload) {
            return 'demos/users/' + payload.stage.data.user.id +  '/fetch';
        }
    }
}