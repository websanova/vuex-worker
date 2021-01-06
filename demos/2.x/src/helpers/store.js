const clear = function(ctx, worker) {
    ctx.$store.dispatch(worker + '/worker/clear');
};

const reset = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/reset', data || {});
}

const stage = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/worker/stage/update', data || {});
};

const filter = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/worker/filter/update', data || {});
}

const request = function(ctx, worker, data) {
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
                ctx.$store.dispatch(data.sync + '/worker/sync', res.data.data);
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
    return {
        data: ctx.$store.getters[worker + '/worker/data'],
        form: ctx.$store.getters[worker + '/worker/form'],
        filter: ctx.$store.getters[worker + '/worker/filter']
    };
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

const fetch = function(ctx, worker, dataStage, dataRequest, options) {
    var keys,
        item;

    options = options || {};

    if (options.find && options.in) {
        item = ctx.$store.getters[options.in + '/worker/find'](dataStage[options.find]);
    }

    return new Promise((resolve) => {
        if (item) {
            ctx.$store.dispatch(worker + '/worker/data', item);

            resolve();
        }
        else {
            stageAndRequest(ctx, worker, dataStage).then(resolve);
        }
    });
}

export {
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