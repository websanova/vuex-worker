import form   from '../utils/form.js';
import stage  from '../utils/stage.js';
import filter from '../utils/filter.js';

import {findIndexByKey} from '../lib/utils.js';

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
            state.data = data;
        },

        merge(state, data) {
            var items = state.data.items || [];

            // Get new data set and merge existing
            // into the front of the new data set.
            data.items = items.concat(data.items || []);

            state.data = data;
        },

        items(state, data) {
            this._vm.$set(state.data, 'items', data);
        },

        sync(state, data) {
            var i;

            for (i in data.data) {
                this._vm.$set(state.data.items[data.index], i, data.data[i]);
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
                _this = this,
                success,
                filters = ctx.state.filter.data;

            data      = data || {};
            data.body = data.body || {};

            if (filters) {
                for (i in filters) {
                    if (filters[i].value !== undefined) {
                        data.body[i] = filters[i].value;
                    }
                }
            }

            success = data.success;

            data.success = function (res) {
                ctx.commit(data.merge ? 'merge' : 'data', res.data.data);

                if (success) {
                    success.apply(_this, arguments);
                }
            }

            return new Promise((resolve, reject) => {
                ctx
                .dispatch('form/send', data)
                .then(resolve, reject)
                .catch(() => {
                    // TODO: Nothing
                });
            });
        },

        /**
         * This is a redundancy method meant o clean up
         * action calls and not mean to be called directly.
         */
        action(ctx, data) {
            var index;

            if (
                data.cb &&
                data.data &&
                ctx.state.data &&
                ctx.state.data.items &&
                ctx.state.data.items.constructor === Array
            ) {
                index = findIndexByKey(ctx.state.data.items, data.data.id);

                data.cb(index, data.data);
            }
        },

        prepend(ctx, data) {
            ctx.dispatch('action', {
                data: data,
                cb(index, data) {
                    if (index < 0) {
                        ctx.commit('prepend', data);
                    }
                }
            });
        },

        append(ctx, data) {
            ctx.dispatch('action', {
                data: data,
                cb(index, data) {
                    if (index < 0) {
                        ctx.commit('append', data);
                    }
                }
            });
        },

        sync(ctx, data) {
            ctx.dispatch('action', {
                data: data,
                cb(index, data) {
                    ctx.commit('sync', {
                        index: index,
                        data: data
                    });
                }
            });
        },

        remove(ctx, data) {
            ctx.dispatch('action', {
                data: data,
                cb(index, data) {
                    ctx.commit('remove', index);
                }
            });
        },

        items(ctx, data) {
            ctx.commit('items', data);
        },

        clear(ctx) {
            ctx.commit('data', {});
            ctx.dispatch('form/clear');
            ctx.dispatch('stage/clear');
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
            return {
                data: getters['stage/data'],
            }
        },

        filter(state, getters) {
            return {
                data: getters['filter/data'],
                query: getters['filter/query'],
                fields: getters['filter/fields'],
                isChange: getters['filter/isChange'],
            };
        },

        data(state) {
            return state.data;
        },

        find(state) {
            return (data) => {
                var index;

                if (state.data.items) {
                    index = findIndexByKey(state.data.items, data.id, 'id');
                    
                    return state.data.items[index];
                }
                
                return;
            };
        },
    }
}