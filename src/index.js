import Vuex from 'vuex';

Vuex.Store.prototype.hasModule = function (path) {
    return this._modulesNamespaceMap[path + '/'] ? true : false;
};

Vuex.Store.prototype.hasAction = function (path) {
    return this._actions[path] ? true : false;
};

Vuex.Store.prototype.addModule = function (path, store) {
    var mod = this._modulesNamespaceMap[path + '/'];

    if (!mod) {
        this.callHooks('beforeCreate', store);

        this.registerModule(path, store);    

        this.callHooks('created', store, path);
    }

    this._modulesNamespaceCounter = this._modulesNamespaceCounter || {}
    this._modulesNamespaceCounter[path + '/'] = this._modulesNamespaceCounter[path + '/'] || 0;
    this._modulesNamespaceCounter[path + '/']++;
};

Vuex.Store.prototype.remModule = function (path) {
    var mod = this._modulesNamespaceMap[path + '/'],
        raw;

    this._modulesNamespaceCounter[path + '/']--;

    if (
        mod &&
        !this._modulesNamespaceCounter[path + '/']
    ) {
        raw = mod._rawModule;

        this.callHooks('beforeDestroy', raw, path);

        this.unregisterModule(path);

        this.callHooks('destroyed', raw);
    }
}

Vuex.Store.prototype.callHooks = function (name, store, path) {
    var i,
        mod,
        ctx,
        _this = this;

    mod = this._modulesNamespaceMap[path + '/'];

    // Context

    if (mod) {
        ctx = mod.context;
    }

    // Call hooks

    if (
        store.hooks &&
        store.hooks[name]
    ) {
        store.hooks[name].call(this, ctx);
    }

    if (store.modules) {
        for (i in store.modules) {
            (function (i) {
                _this.callHooks(name, store.modules[i], path + '/' + i);
            })(i);
        }
    }
};

Vuex.Store.prototype.worker = function (path) {
    var mod,
        ctx,
        raw,
        chain = {},
        _this = this;

    mod = this._modulesNamespaceMap[path + '/'];

    if (!mod) {
        return undefined;
    }

    ctx = mod.context;
    raw = mod._rawModule;

    var promise = new Promise((resolve) => {
        resolve();
    });

    chain.then = function(suc, err) {
        promise = promise.then(suc, err);

        return {
            data: chain.data,
            work: chain.work,
            then: chain.then,
            request: chain.request,
            dispatch: chain.dispatch,
            catch: promise.catch,
            finally: promise.finally,
            getters: chain.get,
        };
    };

    chain.dispatch = function(name, data) {
        promise = promise
            .then(() => {
                return ctx.dispatch(name, data);
            }, () => {
                return ctx.dispatch(name, data);
            });

        return {
            data: chain.data,
            work: chain.work,
            then: chain.then,
            request: chain.request,
            dispatch: chain.dispatch,
            catch: promise.catch,
            finally: promise.finally,
            getters: chain.get,
        };
    };

    chain.work = function(name, data) {
        return chain.dispatch('worker/' + name, data);
    };

    chain.request = function(data) {
        var i;
        var stage   = ctx.getters['worker/stage'];
        var request = raw.request || {};

        data = Object.assign({}, data || {}, request);

        for (i in data) {
            (function (i) {
                if (data[i] instanceof Function) {
                    data[i] = data[i].call(_this, ctx, ctx.getters['worker/stage']);
                }
            })(i);
        }

        return chain
            .dispatch('worker/send', data)
            .then((res) => {
                if (data.success) {
                    data.success.call(_this, ctx, res, ctx.getters['worker/stage']);
                }
            }, (res) => {
                if (data.error) {
                    data.error.call(_this, ctx, res, ctx.getters['worker/stage']);
                }
            });
    };

    chain.getters = function(key) {
        return key ? ctx.getters[key] : ctx.getters;
    };

    chain.payload = function(key) {
        return (
            key
            ? ctx.getters['worker/' + key]
            : {
                data:   ctx.getters['worker/data'],
                form:   ctx.getters['worker/form'],
                stage:  ctx.getters['worker/stage'],
                filter: ctx.getters['worker/filter'],
            }
        );
    };

    return chain;
};

export default Vuex;