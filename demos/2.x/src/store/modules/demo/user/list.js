import list from '@websanova/vuex-worker/src/actions/list';

export default {
    namespaced: true,

    modules: {
        worker: list
    },

    hooks: {
        created(ctx) {
            this.worker('demo/user/list')
                .work('filter/reset', {
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
        }
    },

    request: {
        url: 'demos/users/list'
    }
}