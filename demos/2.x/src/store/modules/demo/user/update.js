import update from '@websanova/vuex-worker/src/actions/update';

export default {
    namespaced: true,

    modules: {
        worker: update
    },

    request: {
        url(ctx, payload) {
            return 'demos/users/' + payload.stage.data.user.id +  '/update';
        },

        onSuccess(ctx, res) {
            this.worker('demo/user/list').work('sync', res.data.data);
            this.worker('demo/user/fetch').work('sync', res.data.data);
        }
    },

    actions: {
        reset(ctx, data) {
            ctx.dispatch('worker/form/update', {
                email: data.user.email,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
            });
        }
    }
}