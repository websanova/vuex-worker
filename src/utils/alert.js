export default {
    namespaced: true,

    state() {
        return {
            data: {},

            queue: [],

            timer: null,

            timeout: 1750
        };
    },
    
    mutations: {
        add(state, data) {
            state.data[data.id] = data;

            state.queue.unshift(data.id);
        },

        remove(state, id) {
            var i, ii;

            for (i = 0, ii = state.queue.length; i < ii; i++) {
                if (id === state.queue[i]) {
                    state.queue.splice(i, 1);
                }
            }

            delete state.data[id];
        },

        timer(state, timer) {
            state.timer = timer;
        },

        timeout(state, timeout) {
            state.timeout = timeout;
        },

        clear(state) {
            state.data = {};
        }
    },

    actions: {
        reset(ctx, data) {
            data = data || {};

            if (data.timeout) {
                ctx.commit('timeout', data.timeout);
            }
        },

        add(ctx, data) {
            data = data || {};

            data.id       = data.id       || Math.random().toString(32).substring(2);
            data.type     = data.type     || 'info';
            data.timeout = data.timeout || ctx.state.timeout;

            ctx.commit('add', data);

            if (!ctx.state.timer) {
                ctx.dispatch('start');
            }
        },

        /**
         * On a direct remove calls we want to reset the timer
         * and just continue along the next item in the queue.
         */
        remove(ctx, id) {
            if (ctx.state.data[id]) {
                ctx.commit('remove', id);

                ctx.dispatch('start');
            }
        },

        /**
         * Starting the queue will reset any previous timer. On each
         * cycle it will remove the next item and check if queue is empty.
         */
        start(ctx) {
            var id,
                timer,
                timeout;

            id = ctx.state.queue[ctx.state.queue.length - 1];

            if (!id) {
                return;
            }
            
            timeout = ctx.state.data[id].timeout || ctx.state.timeout;

            clearTimeout(ctx.state.timer);

            timer = setTimeout(() => {
                ctx.dispatch('remove', id);
                ctx.dispatch('end');
            }, timeout);

            ctx.commit('timer', timer);
        },

        /**
         * Clear the timeout and timer if there are no more
         * items left in the queue. We can also do a clear on
         * the data to do a little failsafe garbage collect.
         */
        end(ctx) {
            if (!ctx.state.queue.length) {
                clearTimeout(ctx.state.timer);
                ctx.commit('timer', null);
                ctx.commit('clear');
            }
            else {
                ctx.dispatch('start');
            }
        },

        success(ctx, msg) {
            return ctx.dispatch('add', {
                msg: msg,
                type: 'success'
            });
        },

        error(ctx, msg) {
            return ctx.dispatch('add', {
                msg: msg,
                type: 'danger'
            });
        },

        warning(ctx, msg) {
            return ctx.dispatch('add', {
                msg: msg,
                type: 'warning'
            });
        },

        info(ctx, msg) {
            return ctx.dispatch('add', {
                msg: msg,
                type: 'info'
            });
        }
    },

    getters: {

        /**
         * Combine this in real time for some fail over in case
         * an item is removed manually but still in queue. This
         * will help to remove any strange oddities that may occur.
         */
        data(state) {
            var i, ii,
                data = [];

            for (i = 0, ii = state.queue.length; i < ii; i++) {
                if (state.data[state.queue[i]]) {
                    data.push(state.data[state.queue[i]]);
                }
            }

            return data;
        }
    }
}