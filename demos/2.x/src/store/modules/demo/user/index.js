import list     from './list.js';
import fetch    from './fetch.js';
import create   from './create.js';
import update   from './update.js';
import deleat   from './delete.js';
import undelete from './undelete.js';

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