import Vue from 'vue';

export default {
    namespaced: true,

    state() {
        return {
            previous: {},

            fields: {}
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
                    show: filters[i].show
                };
            }

            Vue.set(state, 'fields', fields);
        },

        previous(state) {
            Vue.set(state, 'previous', JSON.parse(JSON.stringify(state.fields)));
        },

        update(state, fields) {
            Vue.set(state, 'fields', fields);
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
                fields = JSON.parse(JSON.stringify(ctx.state.fields));

            ctx.commit('previous');

            for (i in filters) {
                if (fields[i]) {
                    fields[i].value = filters[i];
                }

                if (
                    fields.page &&
                    i !== 'page'
                ) {
                    fields.page.value = 1;
                }
            }

            ctx.commit('update', fields);
            
            ctx.dispatch('path');
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