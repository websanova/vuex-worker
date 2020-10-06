import Vue from 'vue';

export default {
    namespaced: true,

    state() {
        return {
            data: {},

            previous: {},

            timer: null
        };
    },
    
    mutations: {
        reset(state, filters) {
            var i,
                query = Vue.router.app.$route.query,
                params = Vue.router.app.$route.params,
                ddefault,
                data = {};

            for (i in filters) {
                ddefault = filters[i].default !== undefined ? filters[i].default : filters[i];

                data[i] = {
                    as: filters[i].as || i,
                    default: ddefault,
                    value: filters[i].value !== undefined ? filters[i].value : (query[i] !== undefined ? query[i] : (params[i] !== undefined ? params[i] : ddefault)),
                    show: filters[i].show,
                    reset: filters[i].reset || []
                };

                if (data[i].reset.constructor !== Array) {
                    data[i].reset = [data[i].reset];
                }

                if (i !== 'page' && !data[i].reset.length) {
                    data[i].reset = ['page'];
                }
            }

            Vue.set(state, 'data', data);
        },

        previous(state, fields) {
            Vue.set(state, 'previous', JSON.parse(JSON.stringify(fields)));
        },

        update(state, data) {
            Vue.set(state, 'data', data);
        },

        timer(state, timer) {
            state.timer = timer;
        }
    },

    actions: {
        reset(ctx, filters) {
            ctx.commit('reset', filters);

            ctx.commit('previous', ctx.getters['fields']);

            ctx.dispatch('path');
        },

        update(ctx, filters) {
            var i,
                j, jj,
                reset = null,
                timer = null,
                data = JSON.parse(JSON.stringify(ctx.state.data));

            ctx.commit('previous', ctx.getters['fields']);

            for (i in filters) {
                (function (i) {
                    if (data[i]) {
                        data[i].value = filters[i] === undefined ? data[i].default : filters[i];
                    }

                    for (j = 0, jj = data[i].reset.length; j < jj; j++) {
                        if (!filters[data[i].reset[j]]) {
                            data[data[i].reset[j]].value = data[data[i].reset[j]].default;
                        }
                    }
                })(i);
            }

            ctx.commit('update', data);
            
            if (ctx.state.timer) {
                clearTimeout(ctx.state.timer);
                ctx.commit('timer', null);
            }

            timer = setTimeout(() => {
                ctx.dispatch('path');
            }, 50);

            ctx.commit('timer', timer);
        },

        path(ctx) {
            var i,
                $route = Vue.router.app.$route,
                $router = Vue.router.app.$router,
                route = {
                    path: $route.path,
                    name: $route.name,
                    hash: $route.hash,
                    query: JSON.parse(JSON.stringify($route.query || {}))
                };

            for (i in ctx.state.data) {
                if (
                    ctx.state.data[i].show !== false &&
                    ctx.state.data[i].default !== ctx.state.data[i].value
                ) {
                    route.query[i] = ctx.state.data[i].value;
                }
                else {
                    delete route.query[i];
                }
            }

            if (ctx.getters.isChange) {
                $router
                    .push(route)
                    .catch(() => {
                        // console.log($e);
                    });
            }
        }
    },

    getters: {
        data(state) {
            return state.data;
        },

        fields(state) {
            var i,
                fields = {};

            for (i in state.data) {
                fields[i] = state.data[i].value
            }

            return fields;
        },

        isChange(state, getters) {
            return JSON.stringify(state.previous) !== JSON.stringify(getters.fields);
        }
    }
}