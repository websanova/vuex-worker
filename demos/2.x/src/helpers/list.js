import Vue from 'vue';

export function reset(ctx, worker) {
    ctx.$store.dispatch(worker + '/reset');
}

export function init(ctx, worker, data) {
    var form   = ctx.$store.getters[worker + '/worker/form'],
        filter = ctx.$store.getters[worker + '/worker/filter'],
        query  = filter.query;

    if (form.status === null) {
        ctx.$store.dispatch(worker + '/worker/filter/update', data || {});
        ctx.$store.dispatch(worker + '/request', {});
    }
    else if (Object.keys(query).length) {
        Vue.router.replace({
            query: query
        });
    }
};

export function clear(ctx, worker) {
    ctx.$store.dispatch(worker + '/worker/form/clear');
};

export function filter(ctx, worker, data) {
    var filter;

    ctx.$store.dispatch(worker + '/worker/filter/update', data || {});
    
    filter = ctx.$store.getters[worker + '/worker/filter'];

    if (filter.isChange) {
        ctx.$store.dispatch(worker + '/request', {});
    }
};

export function request(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/request', data || {});
};