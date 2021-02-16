import list from '@websanova/vuex-worker/src/actions/list.js';

export default {
    namespaced: true,

    modules: {
        worker: list
    },

    actions: {
        reset(ctx, filters) {
            ctx.dispatch('worker/filter/reset', {
                page: 1,
                query: '',
                role: {
                    default: '',
                    value: filters.role || '',
                    options: [
                        {value: '', label: 'All Roles'},
                        'super',
                        'editor',
                        'user'
                    ],
                },
                state: {
                    default: '',
                    value: filters.state || '',
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