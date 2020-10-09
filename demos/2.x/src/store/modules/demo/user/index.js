import list    from './list';
import fetch   from './fetch';
import update  from './update';
import _delete from './delete';
import undelete from './undelete';

export default {
    namespaced: true,

    modules: {
        list,
        fetch,
        update,
        delete: _delete,
        undelete,
    }
}