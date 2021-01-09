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
                url: 'demos/users/' + stage.data.user.id +  '/update',
                sync: ['demo/user/fetch', 'demo/user/list']
            }));
        },

        reset(ctx, data) {
            ctx.dispatch('worker/form/update', {
                email: data.user.email,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
            });
        }
    }
}