import Vue from 'vue';

export default {
    namespaced: true,

    state() {
        return {
            msg: false,

            clear: false,

            delay: false,

            status: null,

            silent: null,
            
            loading: null,

            errors: {},
            
            fields: {}
        };
    },
    
    mutations: {
        start(state, data) {
            data = data || {};
            
            state.msg = data.msg === true ? true : false;
            state.clear = data.clear === true ? true : false;
            state.silent = data.silent === true ? true : false;

            state.status = data.silent ? 'loading-silent' : 'loading';
            state.loading = true;
            state.delay = true;
        },

        delay(state, toggle) {
            state.delay = toggle;
        },

        success(state) {
            state.status = 'success';
            state.silent = false;
            state.loading = false;
        },

        error(state) {
            state.status = 'error';
            state.silent = false;
            state.loading = false;
        },

        clearFields(state) {
            Vue.set(state, 'fields', {});
        },

        clearErrors(state) {
            Vue.set(state, 'errors', {});
        },

        updateFields(state, fields) {
            var i;

            for (i in fields) {
                Vue.set(state.fields, i, fields[i]);
            }
        },

        updateErrors(state, errors) {
            var i, ii;

            errors = errors || {};

            for (i = 0, ii = errors.length; i < ii; i++) {
                if ( ! state[errors[i].field]) {
                    Vue.set(state.errors, errors[i].field, (errors[i].msg || errors[i].message));
                }
            }
        }
    },

    actions: {
        clear(ctx,) {
            ctx.commit('clearFields');
            ctx.commit('clearErrors');
        },

        update(ctx, data) {
            ctx.commit('updateFields', data);
        },

        start(ctx, data) {
            ctx.commit('start', data);
        },

        success(ctx, res) {
            ctx.commit('success');
        
            ctx.commit('clearErrors');
            
            if (ctx.state.clear) {
                ctx.commit('clearFields');
            }

            if (ctx.state.msg && res.data.msg) {
                this.dispatch('alert/success', res.data.msg);
            }
        },

        error(ctx, res) {
            ctx.commit('clearErrors');

            ctx.commit('updateErrors', res.data.errors || [
                {field: 'general', msg: (res.data.msg || res.data.message)},
                {field: res.data.code, msg: (res.data.msg || res.data.message)}
            ]);

            ctx.commit('error');

            if (ctx.state.msg && res.data.msg) {
                this.dispatch('alert/error', res.data.msg);
            }
        },

        fire(ctx, data) {
            data = data || {};

            return new Promise((resolve, reject) => {
                Vue.http({
                        method: data.method || 'get',
                        url: data.url,
                        params: data.body || data.params,
                        body: Object.assign({}, data.body, ctx.state.fields)
                    })
                    .then((res) => {
                        resolve(res);
                    }, (res) => {
                        reject(res);
                    });
            });
        },

        send(ctx, data) {
            data = data || {};

            // NOTE: Break the promise chain if too many dupicate requests
            //       fire off within 200ms (assumed it's uplicate).
            if (
                ctx.state.delay &&
                data.ignoreDelay !== true
            ) {
                return Promise.reject('Form Store Duplicate Request: ' + data.url);
            }

            ctx.dispatch('start', {
                msg: data.msg,
                clear: data.clear,
                silent: data.silent
            });

            setTimeout(() => {
                ctx.commit('delay', false);
            }, 200);

            return new Promise((resolve, reject) => {
                Vue.http({
                        method: data.method || 'get',
                        url: data.url,
                        params: data.body || data.params,
                        body: Object.assign({}, data.body, ctx.state.fields)
                    })
                    .then((res) => {
                        if (data.success) {
                            data.success(res);
                        }

                        ctx.dispatch('success', res);

                        resolve(res);
                    }, (res) => {
                        if (data.error) {
                            data.error(res);
                        }

                        ctx.dispatch('error', res);

                        reject(res);
                    });
            });
        }
    },

    getters: {
        status(state) {
            return state.status;
        },

        loading(state) {
            return state.loading;
        },

        silent(state) {
            return state.silent;
        },

        fields(state) {
            return state.fields;
        },

        errors(state) {
            return state.errors;
        }
    }
}