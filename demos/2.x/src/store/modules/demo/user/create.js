import create from '@websanova/vuex-worker/src/actions/create';

export default {
    namespaced: true,

    modules: {
        worker: create
    },

    request: {
        url: 'demos/users/create',

        success(ctx, res) {
            var worker = this.worker('demo/user/list');
            var role   = worker.payload().filter.fields.role;
            var state  = worker.payload().filter.fields.state;
            
            if (
                (role === '' || res.data.data.role === role) &&
                (state === '' || state === 'active')
            ) {
                worker.work('prepend', res.data.data);
            }
        }
    }
}