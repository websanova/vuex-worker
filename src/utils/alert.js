export default {
    namespaced: true,

    state: {
        list: [],

        timer: null,

        timerInterval: 1500
    },
    
    mutations: {
        message(state, data) {
            data.visible = true;

            state.list.unshift(data);
        },

        hide(state) {
            state.list[state.list.length - 1].visible = false;
        },

        pop(state) {
            state.list.pop();
        },

        timer(state, timer) {
            state.timer = timer;
        }
    },

    actions: {
        set(ctx, data) {
            var timer;

            ctx.commit('message', data);

            if ( ! ctx.state.timer) {
                timer = setInterval(() => {
                    ctx.commit('hide');

                    setTimeout(() => {
                        ctx.commit('pop');

                        if ( ! ctx.state.list.length) {
                            clearInterval(ctx.state.timer);

                            ctx.commit('timer', null);
                        }
                    }, 500);
                }, ctx.state.timerInterval);

                ctx.commit('timer', timer);
            }
        },

        success(ctx, msg) {
            ctx.dispatch('set', {
                text: msg,
                type: 'success'
            });
        },

        error(ctx, msg) {
            ctx.dispatch('set', {
                text: msg,
                type: 'danger'
            });
        },

        warning(ctx, msg) {
            ctx.dispatch('set', {
                text: msg,
                type: 'warning'
            });
        },

        info(ctx, msg) {
            ctx.dispatch('set', {
                text: msg,
                type: 'info'
            });
        }
    },

    getters: {
        list(state) {
            return state.list;
        }
    }
}