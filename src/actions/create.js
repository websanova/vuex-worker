import form  from 'LIB/store/utils/form';
import stage from 'LIB/store/utils/stage';

export default {
    namespaced: true,

    modules: {
        form: form,
        stage: stage,
    },

    actions: {
        send(ctx, data) {
            data = data || {};

            data.method = data.method || 'POST';

            return ctx.dispatch('form/send', data);
        }
    },

    getters: {
        form(state, getters) {
            return {
                status: getters['form/status'],
                loading: getters['form/loading'],
                fields: getters['form/fields'],
                errors: getters['form/errors'],
            };
        },

        stage(state, getters) {
            return getters['stage/data'];
        }
    }
}