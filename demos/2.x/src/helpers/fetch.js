export function mounted(worker, workerList, data) {
    var keys = Object.keys(data);
    var item = workerList.getters('worker/find')(data[keys[0]]);

    if (item) {
        worker.work('data', item);
    }
    else {
        worker
            .work('stage/update', data)
            .request();
    }
}

export function destroyed(worker) {
    worker.work('clear');
};