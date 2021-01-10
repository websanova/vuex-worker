import Vue   from 'vue';
import stage from '../utils/stage.js';

export default {
    namespaced: true,

    modules: {
        stage: stage
    },

    state() {
        return {
            key: null,

            onEnd: null,

            onError: null,

            onSuccess: null
        };
    },

    mutations: {
        key(state, key) {
            state.key = key;
        },

        onEnd(state, onEnd) {
            state.onEnd = onEnd;
        },

        onError(state, onError) {
            state.onError = onError;
        },

        onSuccess(state, onSuccess) {
            state.onSuccess = onSuccess;
        }
    },

    actions: {
        on(ctx, data) {
            var success;
            
            ctx.commit('key', data.key || Math.random().toString());
            
            data = data || {};

            success = data.onSuccess;

            data.onSuccess = (file, res) => {
                file.clear();

                if (success) {
                    success.call(this, file, res);
                }
            };


            Vue.upload.on(ctx.state.key, data);

            ctx.commit('onEnd', Vue.upload.instances[ctx.state.key].options.onEnd);
            ctx.commit('onError', Vue.upload.instances[ctx.state.key].options.onError);
            ctx.commit('onSuccess', Vue.upload.instances[ctx.state.key].options.onSuccess);
        },

        off(ctx) {
            Vue.upload.off(ctx.state.key);

            ctx.commit('onEnd', null);
            ctx.commit('onError', null);
            ctx.commit('onSuccess', null);
        },

        send(ctx, data) {
            var multiple;

            if (data) {
                Vue.upload.option(ctx.state.key, 'url', data.url);

                Vue.upload.option(ctx.state.key, 'body', data.body);
            }

            Vue.upload.select(ctx.state.key);

            // NOTE: For multi file downloads, success/error promise resolove
            //       is not useful since it will only resolve the first file
            //       In this case it will just resolve once onEnd which "should"
            //       always fire.

            multiple = Vue.upload.instances[ctx.state.key].options.multiple;

            if (multiple) {
                return new Promise((resolve) => {
                    Vue.upload.option(ctx.state.key, 'onEnd', () => {
                        if (ctx.state.onEnd) {
                            ctx.state.onEnd.call(Vue.upload.instances[ctx.state.key]);
                        }

                        resolve();
                    });
                });
            }

            // NOTE: In the case of single file downloads, we can send back a
            //       promise with a normal success/error resolve which can
            //       then be used for further processing (and sync).

            return new Promise((resolve, reject) => {
                Vue.upload.option(ctx.state.key, 'onSuccess', (file, res) => {
                    if (ctx.state.onSuccess) {
                        ctx.state.onSuccess.call(Vue.upload.instances[ctx.state.key], file, res);
                    }

                    resolve(res);
                });

                Vue.upload.option(ctx.state.key, 'onError', (file, res) => {
                    if (ctx.state.onError) {
                        ctx.state.onError.call(Vue.upload.instances[ctx.state.key], file, res);
                    }

                    reject(res);
                });
            });
        }
    },

    getters: {
        form(state) {
            return {
                errors: Vue.upload.file(state.key).error.msg ? {file: Vue.upload.file(state.key).error.msg} : {},
                status: Vue.upload.file(state.key).sending ? 'loading' : Vue.upload.file(state.key).state,
                loading: Vue.upload.file(state.key).sending
            };
        },

        stage(state, getters) {
            return {
                data: getters['stage/data'],
            }
        },
    }
}