import list     from './list';
import fetch    from './fetch';
import update   from './update';
import deleat   from './delete';
import create   from './create';
import undelete from './undelete';

export default {
    namespaced: true,

    modules: {
        list,
        fetch,
        create,
        update,
        delete: deleat,
        undelete,
    }
}