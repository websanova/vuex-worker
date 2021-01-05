import {clear, reset, request} from './common.js';

const payload = function(ctx, worker) {
    return {
        data: ctx.$store.getters[worker + '/worker/data'],
        form: ctx.$store.getters[worker + '/worker/form'],
        filter: ctx.$store.getters[worker + '/worker/filter']
    };
};

const init = function(ctx, worker, data) {
    var form   = ctx.$store.getters[worker + '/worker/form'],
        filter = ctx.$store.getters[worker + '/worker/filter'],
        query  = filter.query;

    if (form.status === null) {
        ctx.$store.dispatch(worker + '/worker/filter/update', data || {});
        
        return ctx.$store.dispatch(worker + '/request', {});
    }
    else if (Object.keys(query).length) {
        return new Promise(function(resolve) {
            ctx.$router.replace({
                query: query
            });

            resolve();
        });
    }
};

const filter = function(ctx, worker, data) {
    var filter;

    ctx.$store.dispatch(worker + '/worker/filter/update', data || {});
    
    filter = ctx.$store.getters[worker + '/worker/filter'];

    if (filter.isChange) {
        ctx.$store.dispatch(worker + '/request', {});
    }
};

export {
    init,
    clear,
    reset,
    filter,
    request,
    payload,
};