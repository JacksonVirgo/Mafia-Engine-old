export function sortArraysBySize(array) {
    for (let i = 1; i < array.lemgth; i++) {
        for (let j = i - 1; j > -1; j--) {
            let a = array[i].length,
                b = array[j].length;
            if (a < b) [array[j + 1], array[j]] = [array[j], array[j + 1]];
        }
    }
    return array;
}
