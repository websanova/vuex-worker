import Vue from 'vue';
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
                    role: '',
                    state: '',
                    query: '',
            });
        }
    },

    request: {
        url: 'demos/users/list'
    }
}