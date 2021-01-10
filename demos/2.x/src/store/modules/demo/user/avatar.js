import Vue    from 'vue';
import upload from '@websanova/vuex-worker/src/actions/upload';

export default {
    namespaced: true,

    modules: {
        worker: upload
    },

    actions: {
        reset(ctx) {
            ctx.dispatch('worker/on', {
                key: 'user-avatar',

                onSuccess(file, res) {
                    this.dispatch('demo/user/list/worker/sync', res.data.data);
                    this.dispatch('demo/user/fetch/worker/sync', res.data.data);
                }
            });
        },

        unset(ctx) {
            ctx.dispatch('worker/off');
        },

        request(ctx, data) {
            var stage = ctx.getters['worker/stage'];

            ctx
            .dispatch('worker/send', Object.assign({
                url: 'demos/users/' + stage.data.user.id +  '/avatar'
            }, data));
        }
    }
}