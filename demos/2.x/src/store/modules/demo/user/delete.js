import update from '@websanova/vuex-worker/src/actions/update';

export default {
    namespaced: true,

    modules: {
        worker: update
    },

    request: {
        url(ctx, payload) {
            return 'demos/users/' + payload.stage.data.user.id +  '/delete';
        },

        success(ctx, res) {
            var payload = this.worker('demo/user/list').payload();
            var action  = payload.filter.fields.state === 'deleted' ? 'prepend': 'remove';

            this.worker('demo/user/list').work(action, payload.stage.data.user);
        }
    }
}