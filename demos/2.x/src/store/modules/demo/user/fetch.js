import fetch from '@websanova/vuex-worker/src/actions/fetch';

export default {
    namespaced: true,

    modules: {
        worker: fetch
    },

    actions: {
        request(ctx, data) {
            var stage = ctx.getters['worker/stage'];

            return ctx.dispatch('worker/send', Object.assign(data, {
                url: 'demos/users/' + stage.data.user.id +  '/fetch'
            }));
        }
    }
}