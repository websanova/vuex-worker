import Vue   from 'vue';
import form  from '../utils/form';
import stage from '../utils/stage';

export default {
    namespaced: true,

    modules: {
        form: form,
        stage: stage
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

        sync(state, data) {
            var i;

            for (i in state.data) {
                if (data[i] !== undefined) {
                    Vue.set(state.data, i, data[i]);
                }
            }
        }
    },

    actions: {
        send(ctx, data) {
            data = data || {};

            data.success = (res) => {
                ctx.commit('data', res.data.data);
            };

            return ctx
                .dispatch('form/send', data);
        },

        sync(ctx, data) {
            ctx.commit('sync', data);
        },

        data(ctx, data) {
            ctx.commit('data', data);
            ctx.dispatch('form/success');
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

        data(state) {
            return state.data;
        }
    }
}