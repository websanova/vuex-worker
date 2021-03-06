export default {
    namespaced: true,

    state() {
        return {
            clear: false,

            status: null,

            percentComplete: 0,

            silent: null,
            
            loading: null,

            request: null,

            timer: null,

            errors: {},
            
            fields: {},
        };
    },
    
    mutations: {
        start(state, data) {
            data = data || {};

            state.clear = data.clear === true ? true : false;
            state.silent = data.silent === true ? true : false;

            state.status = data.silent ? 'loading-silent' : 'loading';
            state.loading = true;
        },

        success(state) {
            state.status = 'success';
            state.silent = false;
            state.loading = false;
            state.request = null;
        },

        error(state) {
            state.status = 'error';
            state.silent = false;
            state.loading = false;
            state.request = null;
        },

        progress(state, percent) {
            state.percentComplete = percent;
        },

        clearStatus(state) {
            state.status = null;
        },

        clearFields(state) {
            this._vm.$set(state, 'fields', {});
        },

        clearErrors(state) {
            this._vm.$set(state, 'errors', {});
        },

        clearProgress(state) {
            state.percentComplete = 0;
        },

        updateFields(state, fields) {
            var i;

            for (i in fields) {
                this._vm.$set(state.fields, i, fields[i]);
            }
        },

        updateErrors(state, errors) {
            var i, ii;

            errors = errors || {};

            for (i = 0, ii = errors.length; i < ii; i++) {
                if ( ! state[errors[i].field]) {
                    this._vm.$set(state.errors, errors[i].field, (errors[i].msg || errors[i].message));
                }
            }
        },

        request(state, request) {
            state.request = request;
        },

        timer(state, timer) {
            state.timer = timer;
        }
    },

    actions: {
        clear(ctx,) {
            ctx.commit('clearFields');
            ctx.commit('clearErrors');
            ctx.commit('clearStatus');
            ctx.commit('clearProgress');
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
                ctx.commit('clearProgress');
            }
        },

        error(ctx, res) {
            ctx.commit('clearErrors');

            ctx.commit('updateErrors', res.data.errors || [
                {field: 'general', msg: (res.data.msg || res.data.message)},
                {field: res.data.code, msg: (res.data.msg || res.data.message)}
            ]);

            ctx.commit('error');
        },

        send(ctx, data) {
            var body,
                timer,
                token;

            var progress = function (e) {
                var percent = e.lengthComputable ? Math.ceil(e.loaded / e.total * 100) : 0;
                
                ctx.commit('progress', percent);
            };

            data = data || {};

            if (
                data.abort === false &&
                ctx.state.loading
            ) {
                console.warn('Form store duplicate request: "' + data.url + '"');

                return Promise.resolve();
            }

            if (ctx.state.request) {
                ctx.state.request.abort();
            }

            return new Promise((resolve, reject) => {
                if (ctx.state.timer) {
                    clearTimeout(ctx.state.timer);
                    
                    ctx.commit('timer', null);

                    resolve();
                }

                timer = setTimeout(() => {
                    var $http  = this._vm.http  || this._vm.$http;
                    var $axios = this._vm.axios || this._vm.$axios;

                    ctx.dispatch('start', {
                        clear: data.clear,
                        silent: data.silent
                    });

                    if (data.before) {
                        data.before();
                    }

                    body = Object.assign({}, data.body, ctx.state.fields);

                    if ($axios && $axios.CancelToken) {
                        token = $axios.CancelToken.source().token;

                        ctx.commit('request', {
                            abort: function () {
                                token.cancel();
                            }
                        });
                    }

                    ($http || $axios)({
                            method: data.method || 'get',
                            url: data.url,
                            params: data.body || data.params,
                            body: body,
                            data: body,
                            cancelToken: token,
                            before: function(req) {
                                ctx.commit('request', req);
                            },
                            onUploadProgress: progress,
                            progress: progress
                        })
                        .then((res) => {
                            if (data.success) {
                                data.success(res);
                            }

                            ctx.dispatch('success', res);

                            resolve(res);
                        }, (res) => {
                            res = res.response || res;

                            if (data.error) {
                                data.error(res);
                            }

                            ctx.dispatch('error', res);

                            reject(res);
                        })
                        .finally(function () {
                            ctx.commit('timer', null);
                        });
                }, 50);

                ctx.commit('timer', timer);
            });
        }
    },

    getters: {
        status(state) {
            return state.status;
        },

        percentComplete(state) {
            return state.percentComplete;
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