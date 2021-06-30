const settingsConfig = require('./settings.json');
const parseFuncs = {};
parseFuncs.players = (settings, selector, data) => {
	const { singular, group } = commaDelim(data);
	settings.players = singular;
	settings.slots = assign(settings.slots, group);
	settings.alias = assign(settings.alias, group);
	return settings;
};
parseFuncs.slots = (settings, selector, data) => {
	const { group } = commaDelim(data);
	settings.slots = assign(settings.slots, group);
	settings.alias = assign(settings.alias, group);
	return settings;
};
parseFuncs.alias = (settings, selector, data) => {
	const { group } = commaDelim(data);
	settings.alias = assign(settings.alias, group);
	return settings;
};
parseFuncs.moderators = (settings, selector, data) => {
	const { singular } = commaDelim(data);
	settings.moderators = singular;
	return settings;
};
parseFuncs.dead = (settings, selector, data) => {
	const deadList = [];
	const deadPost = {};
	let slotReference = data.split(settingsConfig.selectors.seperator);
	for (let i = 0; i < slotReference.length; i++) {
		let temp = slotReference[i].split(settingsConfig.selectors.block);
		for (let y = 0; y < temp.length; y++) {
			const player = temp[0].trim();
			const post = temp[1].trim();
			deadList.push(player);
			deadPost[player] = post;
		}
	}
	settings.dead = deadList;
	settings.deadPost = deadPost;
	return settings;
};
parseFuncs.days = (settings, selector, data) => {
	const { singular } = commaDelim(data);
	settings.days = singular;
	return settings;
};
parseFuncs.deadline = (settings, selector, data) => {
	settings.deadline = data;
	return settings;
};
parseFuncs.pageData = (settings, selector, data) => {
	settings.pageData = data;
	return settings;
};
parseFuncs.correctionWeight = (settings, selector, data) => {
	settings.correctionWeight = data;
	return settings;
};
parseFuncs.edash = (settings, selector, data) => {
	const edashInt = parseInt(data);
	settings.edash = !isNaN(edashInt) ? edashInt : -1;
	return settings;
};
parseFuncs.edashOnTop = (settings, selector, data) => {
	const edashOnTopInt = parseInt(data);
	settings.edashOnTop = !isNaN(edashOnTopInt) ? edashOnTopInt : -1;
};

/* Support Functions */
function assign(target, value) {
	return target ? Object.assign(target, value) : value;
}
function commaDelim(data) {
	const singular = [];
	const group = {};
	let slotRef = data.split(settingsConfig.selectors.seperator);
	for (let i = 0; i < slotRef.length; i++) {
		let individuals = slotRef[i].split(settingsConfig.selectors.block);
		for (let y = 0; y < individuals.length; y++) {
			const currentPlayer = individuals[0].trim();
			const playerReference = individuals[y].trim();
			singular[i] = currentPlayer;
			group[playerReference] = currentPlayer;
		}
	}
	return { singular, group };
}

/* Export Functions */
function resetNames(settings) {
	for (const handle of settings.alias) {
		if (!settings.totalnames.includes(handle)) settings.totalnames.push(handle);
	}
}
module.exports = (settings, selector, data) => {
	if (parseFuncs[selector]) return resetNames(parseFuncs[selector](settings, selector, data));
	else return settings;
};
