import fetch from '@websanova/vuex-worker/src/actions/fetch.js';

export default {
    namespaced: true,

    modules: {
        worker: fetch
    },

    actions: {
        request(ctx, data) {
            var stage = ctx.getters['worker/stage'];

            return ctx.dispatch('worker/send', Object.assign({
                url: 'demos/users/' + stage.data.user.id +  '/fetch'
            }, data));
        },

        sync(ctx) {
            ctx.dispatch('worker/sync', {
                middle_name: 'Sync'
            })
        }
    }
}