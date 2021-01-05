import update from '@websanova/vuex-worker/src/actions/update';

export default {
    namespaced: true,

    modules: {
        worker: update
    },

    // request: {
    //     url(ctx, payload) {
    //         return 'demos/users/' + payload.stage.data.user.id +  '/delete';
    //     },

    //     success(ctx, res) {
    //         var worker = this.worker('demo/user/list');
    //         var state  = worker.payload().filter.fields.state;
    //         var action = state === '' ? 'sync' : (state === 'deleted' ? 'prepend': 'remove');

    //         worker.work(action, res.data.data);
    //     }
    // }

    actions: {
        request(ctx, data) {
            var stage = ctx.getters['worker/stage'];

            return ctx.dispatch('worker/send', Object.assign(data, {
                url: 'demos/users/' + stage.data.user.id +  '/delete'
            }));
        }
    }
}