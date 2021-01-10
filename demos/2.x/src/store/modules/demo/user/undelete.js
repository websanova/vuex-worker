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
                ctx.dispatch('worker/send', Object.assign({
                    url: 'demos/users/' + stage.data.user.id +  '/undelete'
                }, data))
                .then((res) => {
                    this.dispatch('demo/user/list/worker/sync', res.data.data);
                    this.dispatch('demo/user/fetch/worker/sync', res.data.data);

                    resolve(res);
                }, reject);
            });
        }
    }
}