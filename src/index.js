import Vuex from 'vuex';

Vuex.Store.prototype.hasModule = function (path) {
    return this._modulesNamespaceMap[path + '/'] ? true : false;
};

Vuex.Store.prototype.addModule = function (path, store) {
    if (!this.hasModule(path)) {
        this.registerModule(path, store);
    }

    this._modulesNamespaceCounter = this._modulesNamespaceCounter || {}
    this._modulesNamespaceCounter[path + '/'] = this._modulesNamespaceCounter[path + '/'] || 0;
    this._modulesNamespaceCounter[path + '/']++;
};

Vuex.Store.prototype.remModule = function (path) {
    this._modulesNamespaceCounter[path + '/']--;

    if (
        this.hasModule(path) &&
        !this._modulesNamespaceCounter[path + '/']
    ) {
        this.unregisterModule(path);
    }
}

export default Vuex;