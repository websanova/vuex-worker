import list     from './list';
import fetch    from './fetch';
import create   from './create';
import avatar   from './avatar';
import update   from './update';
import deleat   from './delete';
import undelete from './undelete';

export default {
    namespaced: true,

    modules: {
        list,
        fetch,
        create,
        avatar,
        update,
        delete: deleat,
        undelete,
    }
}