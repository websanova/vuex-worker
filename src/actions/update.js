import form  from '../utils/form.js';
import stage from '../utils/stage.js';

export default {
    namespaced: true,

    modules: {
        form: form,
        stage: stage,
    },

    actions: {
        send(ctx, data) {
            data = data || {};

            data.method = data.method || 'PUT';

            return ctx.dispatch('form/send', data);
        },

        clear(ctx) {
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
    }
}