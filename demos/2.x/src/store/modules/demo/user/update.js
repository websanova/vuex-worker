import update from '@websanova/vuex-worker/src/actions/update';

export default {
    namespaced: true,

    modules: {
        worker: update
    },

    actions: {
        request(ctx, data) {
            var stage = ctx.getters['worker/stage'];

            return new Promise((resolve, reject) => {
                return ctx.dispatch('worker/send', Object.assign({
                    url: 'demos/users/' + stage.data.user.id +  '/update',
                }, data))
                .then((res) => {
                    this.dispatch('demo/user/list/worker/sync', res.data.data);
                    this.dispatch('demo/user/fetch/worker/sync', res.data.data);

                    resolve(res);
                }, reject);
            });
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