const stringSimilarity = require("string-similarity");

function findIndexesInString(source, target) {
    scanStringForTokens(source, [target]);
    return result;
}
function scanStringForTokens(source, tokenArray) {
    if (!source) return [];
    if (!tokenArray) return source.split('').map((_, i) => { return i; });
    const result = [];
    let index = 0;
    while (index < source.length) {
        let checked;
        for (const token of tokenArray) {
            if (source.substring(index, index + token.length) == token) {
                result.push({index: index, token: token});
                index += token.length;
                checked = true;
            } else {
                checked = false;
            }
        }
        index += (!checked ? 1 : 0);
    }
    return result;
}


function splitAt(value, index) {
    return [value.slice(0, index), value.slice(index)];
}
function findReplace(source, target, value) {
    return source.split(target).join(value);
}
function compareString(strA, strB) {
     let result = stringSimilarity.compareTwoStrings(strA, strB);
    return result;
}

function bestMatch(target, strings) {
    let matches = stringSimilarity.findBestMatch(target, strings);
    return matches.ratings[matches.bestMatchIndex].target;
}

module.exports = {
    findIndexesInString,
    scanStringForTokens,
    splitAt,
    findReplace,
    compareString,
    bestMatch
}