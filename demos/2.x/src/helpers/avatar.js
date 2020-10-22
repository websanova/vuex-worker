export function request(worker, data) {
    return worker
        .work('stage/update', data)
        .dispatch('send');
};