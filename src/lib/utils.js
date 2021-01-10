export function findIndexByKey(array, val, key) {
    var i = 0,
        ii = array.length;

    key = key || 'id';

    for (; i < ii; i++) {
        if (array[i][key] === val) {
            return i;
        }
    }

    return -1;
}