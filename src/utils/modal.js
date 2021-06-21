export default {
    namespaced: true,

    state: {
        current: null,

        previous: null,

        hideable: true,
    },

    mutations: {
        previous(state, previous) {
            state.previous = previous;
        },

        current(state, current) {
            state.current = current;
        },

        hideable(state, hideable) {
            state.hideable = hideable;
        }
    },

    actions: {
        
        /**
         * This acts as a little ignore switch in the case of
         * a "swap" or "back". It means we'll ignore any "hide"
         * call in that siutation which would mess with the
         * actual "previous" and "current" states.``
         */
        hideable(ctx) {
            ctx.commit('hideable', false);

            setTimeout(() => {
                ctx.commit('hideable', true);
            }, 200);
        },

        /**
         * Show a modal. Or in the case that a modal is already
         * showing then it will do a "swap" to the new modal.
         */
        show(ctx, name) {
            ctx.dispatch('hideable');

            ctx.commit('previous', ctx.state.current);
            ctx.commit('current', name);
        },

        /**
         * Hide a modal if not doing a "swap" or "back" call.
         */
        hide(ctx) {
            if (ctx.state.hideable) {
                ctx.commit('previous', ctx.state.current);
                ctx.commit('current', null);
            }
        },

        /**
         * Go "back" ("swap") to the previous modal.
         */
        back(ctx) {
            if (
                ctx.state.hideable &&
                ctx.state.current
            ) {
                ctx.dispatch('hideable');

                ctx.commit('current', ctx.state.previous);
                ctx.commit('previous', null);
            }
        }
    },

    getters: {
        current(state) {
            return state.current;
        },

        previous(state) {
            return state.previous;
        }
    }
}