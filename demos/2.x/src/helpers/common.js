const clear = function(ctx, worker) {
    ctx.$store.dispatch(worker + '/worker/clear');
};

const stage = function(ctx, worker, data) {
    ctx.$store.dispatch(worker + '/worker/stage/update', data || {});
};

const reset = function(ctx, worker) {
    ctx.$store.dispatch(worker + '/reset');
}

const request = function(ctx, worker, data) {
    data = data || {};

    return new Promise(function (resolve, reject) {
        ctx
        .$store
        .dispatch(worker + '/request', data || {})
        .then(function (res) {
            resolve(res);

            if (data.push) {
                ctx.$router.push(data.push);
            }

        }, reject);
    });
};

const stageAndRequest = function(ctx, worker, dataStage, dataRequest) {
    stage(ctx, worker, dataStage);
    
    return request(ctx, worker, dataRequest);
};

export {
    clear,
    stage,
    reset,
    request,
    stageAndRequest,
};