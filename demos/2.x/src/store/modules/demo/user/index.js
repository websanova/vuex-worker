import list    from './list';
import fetch   from './fetch';
import update  from './update';
import _delete from './delete';

export default {
    namespaced: true,

    modules: {
        list,
        fetch,
        update,
        delete: _delete
    }
}