import Vue from 'vue';

export function init(ctx, worker) {
    ctx.$store.dispatch(worker + '/init');
}

export function mounted(ctx, worker, data) {
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

export function destroyed(ctx, worker) {
    // return worker.work('clear');
};

export function filter(ctx, worker, data) {
    // return worker
    //     .work('filter/update', data)
    //     .then(() => {
    //         var payload = worker.payload();

    //         if (payload.filter.isChange) {
    //             worker.request();
    //         }
    //     });
};

export function request(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/request', data || {});
};