import Vue from 'vue';

export function mounted(worker, data) {
    var payload = worker.payload(),
        query   = payload.filter.query;

    if (payload.form.status === null) {
        worker
            .work('filter/update', data)
            .request();
    }
    else if (Object.keys(query).length) {
        Vue.router.replace({
            query: query
        });
    }
};

export function destroyed(worker) {
    worker.work('clear');
};

export function filter(worker, data) {
    worker
        .work('filter/update', data)
        .then(() => {
            var payload = worker.payload();

            if (payload.filter.isChange) {
                worker.request();
            }
        });
};

export function request(worker, data) {
    worker.request(data);
};