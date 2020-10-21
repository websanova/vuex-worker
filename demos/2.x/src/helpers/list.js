import Vue from 'vue';

export function mounted(worker) {
    var $router = Vue.router,
        $route  = $router.app.$route,
        payload = worker.payload(),
        query   = payload.filter.query;

    if (payload.form.status === null) {
        worker
            .work('filter/update', {
                page: $route.query.page,
                role: $route.query.role,
                state: $route.query.state,
                query: $route.query.query,
            })
            .request();
    }
    else if (Object.keys(query).length) {
        $router.replace({
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
            if (worker.payload().filter.isChange) {
                worker.request();
            }
        });
};

export function request(worker, data) {
    worker.request(data);
};