import list from '@websanova/vuex-worker/src/actions/list';

export default {
    namespaced: true,

    modules: {
        worker: list
    },

    actions: {
        reset(ctx) {
            ctx.dispatch('worker/filter/reset', {
                page: 1,
                query: '',
                role: {
                    default: '',
                    options: [
                        {value: '', label: 'All Roles'},
                        'super',
                        'editor',
                        'user'
                    ],
                },
                state: {
                    default: '',
                    options: [
                        {value: '', label: 'All States'},
                        'active',
                        'deleted'
                    ]
                }
            });
        },

        request(ctx, data) {
            return ctx.dispatch('worker/send', Object.assign(data, {
                url: 'demos/users/list'
            }));
        }
    }
}