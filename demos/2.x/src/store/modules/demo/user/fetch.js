import fetch from '@websanova/vuex-worker/src/actions/fetch';

export default {
    namespaced: true,

    modules: {
        worker: fetch
    },

    request: {
        url(ctx, stage) {
            return 'demos/users/' + stage.data.user.id +  '/fetch';
        }
    }
}