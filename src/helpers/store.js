const clear = function(ctx, worker) {
    var i, ii;

    worker = worker.constructor !== Array ? [worker] : worker;

    for (i = 0, ii = worker.length; i < ii; i++) {
        ctx.$store.dispatch(worker[i] + '/worker/clear');
    }
};

const form = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/worker/form/update', data || {});
}

const stage = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/worker/stage/update', data || {});
};

const filter = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/worker/filter/update', data || {});
}

const reset = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/reset', data || {});
}

const unset = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/unset', data || {});
}

const request = function(ctx, worker, data) {
    return ctx
        .$store
        .dispatch(worker + '/request', data || {});
};

const stageAndRequest = function(ctx, worker, dataStage, dataRequest) {
    stage(ctx, worker, dataStage);
    
    return request(ctx, worker, dataRequest);
};

const filterAndRequest = function(ctx, worker, dataFilter, dataRequest) {
    filter(ctx, worker, dataFilter);
    
    if (ctx.$store.getters[worker + '/worker/filter'].isChange) {
        request(ctx, worker, dataRequest);
    }
};

const payload = function(ctx, worker) {
    var i, ii,
        j, jj,
        split,
        object,
        data = {};

    worker = worker.constructor !== Array ? [worker] : worker;

    for (i = 0, ii = worker.length; i < ii; i++) {
        split = worker[i].split('/').splice(1);

        object = data;

        for (j = 0, jj = split.length; j < jj; j++) {
            if (j === (jj - 1)) {
                object[split[j]] = {
                    meta: ctx.$store.getters[worker[i] + '/meta'] || ctx.$store.getters[worker[i] + '/worker/meta'],
                    data: ctx.$store.getters[worker[i] + '/data'] || ctx.$store.getters[worker[i] + '/worker/data'],
                    form: ctx.$store.getters[worker[i] + '/form'] || ctx.$store.getters[worker[i] + '/worker/form'],
                    filter: ctx.$store.getters[worker[i] + '/filter'] || ctx.$store.getters[worker[i] + '/worker/filter']
                };
            }
            else {
                object[split[j]] = object[split[j]] || {};
            }

            object = object[split[j]];
        }
    }

    return data;
};

const filterPath = function(ctx, worker, replace) {
    var i,
        queryNew = ctx.$store.getters[worker + '/worker/filter/query'],
        queryOld = Object.assign({}, ctx.$route.query),
        isChange = false;

    for (i in queryNew) {
        if (queryOld[i] != queryNew[i]) {
            queryOld[i] = queryNew[i];

            isChange = true;
        }
    }

    if (isChange) {
        ctx.$router[replace ? 'replace' : 'push']({
            query: queryNew
        });
    }
};

const onAutoPaginate = function(ctx, worker, onNext, el, offset, interval) {
    return setInterval(() => {
        var data   = ctx.$store.getters[worker + '/worker/data'];
        var form   = ctx.$store.getters[worker + '/worker/form'];
        var filter = ctx.$store.getters[worker + '/worker/filter'];

        var status       = form.status;
        var isFinished   = data.current_page * data.per_page >= data.total;
        var elOffset     = (el ? el.offsetHeight : 0) + (offset || 150);
        var isPageBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - elOffset);

        if (
            !isFinished &&
            isPageBottom &&
            status !== 'loading'
        ) {
            if (onNext) {
                onNext.call(ctx, {
                    page: parseInt(filter.fields.page) + 1
                });
            }
        }
    }, (interval || 500));
};

const fetch = function(ctx, worker, dataStage, dataRequest) {
    var item;

    dataRequest = dataRequest || {};

    if (dataRequest.find) {
        dataRequest.find.model = find.model || Object.keys(dataStage)[0];

        item = ctx.$store.getters[dataRequest.find.in + '/worker/find'](dataStage[dataRequest.find.model]);
    }

    delete dataRequest.find;

    return new Promise((resolve) => {
        if (item) {
            ctx.$store.dispatch(worker + '/worker/data', item);

            resolve();
        }
        else {
            stageAndRequest(ctx, worker, dataStage, dataRequest).then(resolve);
        }
    });
};

export {
    form,
    clear,
    stage,
    reset,
    unset,
    fetch,
    filter,
    request,
    payload,
    filterPath,
    onAutoPaginate,
    stageAndRequest,
    filterAndRequest,
};