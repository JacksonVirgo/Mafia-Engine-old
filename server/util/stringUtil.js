function findIndexesInString(source, target) {
    if (!source) return [];
    if (!target) return source.split('').mao(function(_, i) { return i; });
    const result = [];
    let i = 0;
    while (i < source.length) {
        if (source.substring(i, i+target.length) == target) {
            result.push(i);
            i+=target.length;
        } else {
            i += 1;
        }
    }
    return result;
}
function splitAt(value, index) {
    return [value.slice(0, index), value.slice(index)];
}

module.exports = {
    findIndexesInString: findIndexesInString,
    splitAt: splitAt
}