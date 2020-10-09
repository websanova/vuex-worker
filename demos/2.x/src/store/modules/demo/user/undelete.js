import update from '@websanova/vuex-worker/src/actions/update';

export default {
    namespaced: true,

    modules: {
        worker: update
    },

    request: {
        url(ctx, payload) {
            return 'demos/users/' + payload.stage.data.user.id +  '/undelete';
        },

        success(ctx, res) {
            var worker = this.worker('demo/user/list');
            var state  = worker.payload().filter.fields.state;
            var action = state === '' ? 'sync' : 'remove';

            this.worker('demo/user/list').work(action, res.data.data);
        }
    }
}