export function request(worker, data) {
    worker
        .work('stage/update', data)
        .request();
};