import create from '@websanova/vuex-worker/src/actions/create.js';

export default {
    namespaced: true,

    modules: {
        worker: create
    },

    actions: {
        request(ctx, data) {
            return new Promise((resolve, reject) => {
                ctx.dispatch('worker/send', Object.assign({
                    url: 'demos/users/create',
                    clear: true
                }, data))
                .then((res) => {
                    var filter = this.getters['demo/user/list/worker/filter/fields'];

                    if (
                        (filter.role === '' || res.data.data.role === filter.role) &&
                        (filter.state === '' || filter.state === 'active')
                    ) {
                        this.dispatch('demo/user/list/prepend', res.data.data);
                    }

                    resolve();
                }, reject)
            })
        }
    }
}