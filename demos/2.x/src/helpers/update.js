export function reset(worker, data) {
    return worker
        .work('stage/update', data)
        .dispatch('reset', data);
}

export function request(worker, data) {
    return worker
        .work('stage/update', data)
        .request();
};

export function destroyed(worker) {
    return worker.work('clear');
};