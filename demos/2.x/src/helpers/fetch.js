export function mounted(worker, workerList, data) {
    var keys = Object.keys(data);
    var item = workerList.getters('worker/find')(data[keys[0]]);

    return new Promise((resolve) => {
        if (item) {
            worker.work('data', item);

            resolve(item);
        }
        else {
            worker
                .work('stage/update', data)
                .request()
                .then(() => {
                    resolve(worker.payload().data);
                });
        }
    });
}

export function destroyed(worker) {
    worker.work('clear');
};