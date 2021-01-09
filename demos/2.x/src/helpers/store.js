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

const request = function(ctx, worker, data) {
    var i, ii;
    
    data = data || {};

    return new Promise(function (resolve, reject) {
        ctx
        .$store
        .dispatch(worker + '/request', data)
        .then(function (res) {
            resolve(res);

            if (data.push) {
                ctx.$router.push(data.push);
            }

            if (data.sync) {
                data.sync = data.sync.constructor !== Array ? [data.sync] : data.sync;

                for (i = 0, ii = data.sync.length; i < ii; i++) {
                    ctx.$store.dispatch(data.sync[i] + '/worker/sync', res.data.data);
                }
            }

        }, reject);
    });
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
                    data: ctx.$store.getters[worker[i] + '/worker/data'],
                    form: ctx.$store.getters[worker[i] + '/worker/form'],
                    filter: ctx.$store.getters[worker[i] + '/worker/filter']
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

const initList = function(ctx, worker, data) {
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

const fetch = function(ctx, worker, dataStage, dataRequest) {
    var item;

    dataRequest = dataRequest || {};

    if (dataRequest.find) {
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
    fetch,
    filter,
    request,
    payload,
    initList,
    stageAndRequest,
    filterAndRequest,
};