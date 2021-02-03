export function attachSuffixOf(i) {
    let j = i % 10, k = i % 100;
    if (j === 1 && j !== 11) return i + "st";
    else if (j === 2 && k !== 12) return i + "nd";
    else if (j === 3 && k !== 13) return i + "rd";
    else return i + "th";
}
