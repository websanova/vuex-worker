import Vue    from 'vue';
import form   from '../utils/form';
import stage  from '../utils/stage';
import filter from '../utils/filter';

import {findIndexByKey} from '../utils.js';

export default {
    namespaced: true,

    modules: {
        form: form,
        stage: stage,
        filter: filter
    },

    state() {
        return {
            data: {}
        };
    },
    
    mutations: {
        data(state, data) {
            Vue.set(state, 'data', data);
        },

        items(state, data) {
            Vue.set(state.data, 'items', data);
        },

        sync(state, data) {
            var i;

            for (i in state.data.items[data.index]) {
                if (data.data[i] !== undefined) {
                    Vue.set(state.data.items[data.index], i, data.data[i]);
                }
            }
        },

        prepend(state, data) {
            state.data.items.unshift(data);
        },

        append(state, data) {
            state.data.items.push(data);
        },

        remove(state, index) {
            state.data.items.splice(index, 1);  
        }
    },

    actions: {
        send(ctx, data) {
            var i,
                body,
                filters = ctx.state.filter.data;

            data = data || {};
            body = data.body || {};

            if (filters) {
                for (i in filters) {
                    if (filters[i].value !== undefined) {
                        body[i] = filters[i].value;
                    }
                }
            }

            return new Promise((resolve, reject) => {
                ctx
                .dispatch('form/send', {
                    url: data.url,
                    silent: data.silent,
                    method: data.method,
                    body: body,
                    success(res) {
                        ctx.commit('data', res.data.data);
                    }
                })
                .then(resolve, reject)
                .catch(() => {
                    // TODO: Nothing
                });
            })
        },

        prepend(ctx, data) {
            var index;

            if (
                data &&
                ctx.state.data &&
                ctx.state.data.items &&
                ctx.state.data.items.constructor === Array
            ) {
                index = findIndexByKey(ctx.state.data.items, data.id);

                if (index < 0) {
                    ctx.commit('prepend', data);
                }
            }
        },

        append(ctx, data) {
            var index;

            if (
                data &&
                ctx.state.data &&
                ctx.state.data.items &&
                ctx.state.data.items.constructor === Array
            ) {
                index = findIndexByKey(ctx.state.data.items, data.id);

                if (index < 0) {
                    ctx.commit('append', data);
                }
            }
        },

        sync(ctx, data) {
            if (
                data &&
                ctx.state.data &&
                ctx.state.data.items &&
                ctx.state.data.items.constructor === Array
            ) {
                ctx.commit('sync', {
                    index: findIndexByKey(ctx.state.data.items, data.id, 'id'),
                    data: data
                });
            }
        },

        remove(ctx, data) {
            if (
                data &&
                ctx.state.data &&
                ctx.state.data.items &&
                ctx.state.data.items.constructor === Array
            ) {
                ctx.commit('remove', findIndexByKey(ctx.state.data.items, data.id, 'id'));
            }
        },

        /**
         * Update items set.
         */ 
        items(ctx, data) {
            if (
                data &&
                ctx.state.data &&
                ctx.state.data.items &&
                ctx.state.data.items.constructor === Array
            ) {
                ctx.commit('items', data);
            }
        },

        clear(ctx) {
            ctx.commit('data', {});
        }
    },

    getters: {
        form(state, getters) {
            return {
                status: getters['form/status'],
                silent: getters['form/silent'],
                loading: getters['form/loading'],
                fields: getters['form/fields'],
                errors: getters['form/errors'],
            };
        },

        stage(state, getters) {
            return getters['stage/data'];
        },

        filter(state, getters) {
            return {
                fields: getters['filter/fields'],
            };
        },

        data(state) {
            return state.data;
        }
    }
}