import Vue from 'vue';

export default {
    namespaced: true,

    state() {
        return {
            previous: {},

            fields: {},

            timer: null
        };
    },
    
    mutations: {
        reset(state, filters) {
            var i,
                query = Vue.router.app.$route.query,
                params = Vue.router.app.$route.params,
                ddefault,
                fields = {};

            for (i in filters) {
                ddefault = filters[i].default !== undefined ? filters[i].default : filters[i];

                fields[i] = {
                    as: filters[i].as || i,
                    default: ddefault,
                    value: filters[i].value !== undefined ? filters[i].value : (query[i] !== undefined ? query[i] : (params[i] !== undefined ? params[i] : ddefault)),
                    show: filters[i].show,
                    reset: filters[i].reset || []
                };

                if (fields[i].reset.constructor !== Array) {
                    fields[i].reset = [fields[i].reset];
                }

                if (i !== 'page' && !fields[i].reset.length) {
                    fields[i].reset = ['page'];
                }
            }

            Vue.set(state, 'fields', fields);
        },

        previous(state) {
            Vue.set(state, 'previous', JSON.parse(JSON.stringify(state.fields)));
        },

        update(state, fields) {
            Vue.set(state, 'fields', fields);
        },

        timer(state, timer) {
            state.timer = timer;
        }
    },

    actions: {
        reset(ctx, filters) {
            ctx.commit('reset', filters);

            ctx.commit('previous');

            ctx.dispatch('path');
        },

        update(ctx, filters) {
            var i,
                j, jj,
                reset = null,
                timer = null,
                fields = JSON.parse(JSON.stringify(ctx.state.fields));

            ctx.commit('previous');

            for (i in filters) {
                (function (i) {
                    if (fields[i]) {
                        fields[i].value = filters[i] === undefined ? fields[i].default : filters[i];
                    }

                    for (j = 0, jj = fields[i].reset.length; j < jj; j++) {
                        if (!filters[fields[i].reset[j]]) {
                            fields[fields[i].reset[j]].value = fields[fields[i].reset[j]].default;
                        }
                    }
                })(i);
            }

            ctx.commit('update', fields);
            
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

            for (i in ctx.state.fields) {
                if (
                    ctx.state.fields[i].show !== false &&
                    ctx.state.fields[i].default !== ctx.state.fields[i].value
                ) {
                    route.query[i] = ctx.state.fields[i].value;
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
        fields(state) {
            return state.fields;
        },

        isChange(state) {
            return JSON.stringify(state.previous) !== JSON.stringify(state.fields);
        }
    }
}