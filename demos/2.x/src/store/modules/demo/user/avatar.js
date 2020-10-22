import Vue    from 'vue';
import upload from '@websanova/vuex-worker/src/actions/upload';

export default {
    namespaced: true,

    modules: {
        worker: upload
    },

    hooks: {
        created(ctx) {
            ctx.dispatch('worker/on', {
                key: 'user-avatar',

                onSuccess(file, res) {
                    this.worker('demo/user/list').work('sync', res.data.data);
                    this.worker('demo/user/fetch').work('sync', res.data.data);
                }
            });
        },

        beforeDestroy(ctx) {
            ctx.dispatch('worker/off');
        }
    },

    actions: {
        send(ctx) {
            var payload = this.worker('demo/user/avatar').payload();

            ctx
            .dispatch('worker/send', {
                url: 'demos/users/' + payload.stage.data.user.id +  '/avatar'
            })
        }
    }
}