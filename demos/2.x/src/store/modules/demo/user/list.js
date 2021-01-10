import list from '@websanova/vuex-worker/src/actions/list';

export default {
    namespaced: true,

    modules: {
        worker: list
    },

    actions: {
        reset(ctx) {
            var filter = ctx.getters['worker/filter/fields'];

            ctx.dispatch('worker/filter/reset', {
                page: 1,
                query: '',
                role: {
                    default: '',
                    value: filter.role || '',
                    options: [
                        {value: '', label: 'All Roles'},
                        'super',
                        'editor',
                        'user'
                    ],
                },
                state: {
                    default: '',
                    value: filter.state || '',
                    options: [
                        {value: '', label: 'All States'},
                        'active',
                        'deleted'
                    ]
                }
            });
        },

        request(ctx, data) {
            return ctx.dispatch('worker/send', Object.assign({
                url: 'demos/users/list'
            }, data));
        }
    }
}