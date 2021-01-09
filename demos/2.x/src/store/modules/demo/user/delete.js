import update from '@websanova/vuex-worker/src/actions/update';

export default {
    namespaced: true,

    modules: {
        worker: update
    },

    actions: {
        request(ctx, data) {
            var stage = ctx.getters['worker/stage'];

            return ctx.dispatch('worker/send', Object.assign(data, {
                url: 'demos/users/' + stage.data.user.id +  '/delete',
                sync: 'demo/user/list'
            }));
        }
    }
}