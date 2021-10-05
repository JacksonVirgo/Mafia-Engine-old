export function chunkArray(array, n) {
	let chunkLength = Math.max(array.length / n, 1);
	let chunks = [];

	for (let i = 0; i < n; i++) {
		if (chunkLength * (i + 1) <= array.length) {
			chunks.push(array.slice(chunkLength * i, chunkLength * (i + 1)));
		}
	}
	return chunks;
}
