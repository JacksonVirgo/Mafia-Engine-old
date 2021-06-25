function levenshtein(target, base) {
	if (target.length == 0) return target.length;
	if (base.length == 0) return base.length;
	let matrix = [];
	let i, j;

	for (i = 0; i <= base.length; i++) {
		matrix[i] = [i];
	}
	for (j = 0; j < target.length; j++) {
		matrix[0][j] = j;
	}

	for (i = 1; i <= base.length; i++) {
		for (j = 1; j <= target.length; j++) {
			if (base.charAt(i - 1) == target.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
			}
		}
	}

	return matrix[base.length][target.length];
}

function jarowinkler(s1, s2) {
	var m = 0;
	if (s1.length === 0 || s2.length === 0) {
		return 0;
	}
	if (s1 === s2) {
		return 1;
	}
	var range = Math.floor(Math.max(s1.length, s2.length) / 2) - 1,
		s1Matches = new Array(s1.length),
		s2Matches = new Array(s2.length);

	for (i = 0; i < s1.length; i++) {
		var low = i >= range ? i - range : 0,
			high = i + range <= s2.length ? i + range : s2.length - 1;

		for (j = low; j <= high; j++) {
			if (s1Matches[i] !== true && s2Matches[j] !== true && s1[i] === s2[j]) {
				++m;
				s1Matches[i] = s2Matches[j] = true;
				break;
			}
		}
	}
	if (m === 0) {
		return 0;
	}
	var k = (n_trans = 0);

	for (i = 0; i < s1.length; i++) {
		if (s1Matches[i] === true) {
			for (j = k; j < s2.length; j++) {
				if (s2Matches[j] === true) {
					k = j + 1;
					break;
				}
			}

			if (s1[i] !== s2[j]) {
				++n_trans;
			}
		}
	}

	var weight = (m / s1.length + m / s2.length + (m - n_trans / 2) / m) / 3,
		l = 0,
		p = 0.1;

	if (weight > 0.7) {
		while (s1[l] === s2[l] && l < 4) {
			++l;
		}

		weight = weight + l * p * (1 - weight);
	}

	return weight;
}
const abbreviateWord = (word) => {
	const splitBase = word.split(/(?=[A-Z])/);
	let abb = '';
	for (const letter of splitBase) {
		abb += letter[0];
	}
	return abb;
};

const charDifference = (base, playerList, allLowerCase = true) => {
	const result = [];
	for (const player of playerList) {
		let distance = jarowinkler(allLowerCase ? base.toLowerCase() : base, allLowerCase ? player.toLowerCase() : player);
		result.push({ distance, result: player });
	}
	result.sort((a, b) => {
		return b.distance - a.distance;
	});

	return result;
};
const charAbbreviationDifference = (base, playerList, allLowerCase = true) => {
	const result = [];
	for (const player of playerList) {
		let baseName = allLowerCase ? base.toLowerCase() : base;
		let playerName = allLowerCase ? abbreviateWord(player).toLowerCase() : abbreviateWord(player);
		let distance = jarowinkler(baseName, playerName);
		result.push({ distance, result: player, data: [baseName, playerName] });
	}
	result.sort((a, b) => {
		return b.distance - a.distance;
	});
	return result;
};

module.exports = (rawUsername, playerList) => {
	const result = {
		direct: charDifference(rawUsername, playerList),
		abbreviate: charAbbreviationDifference(rawUsername, playerList),
	};
	return result;
};
