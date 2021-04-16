const seperator = ',';
const block = ':';
const selectors = {
	players: ['playerList', 'players'],
	slots: ['slotList', 'slots', 'replacementlist', 'replacements'],
	alias: ['nicknameList', 'nicknames', 'alias', 'aliasList'],
	moderators: ['moderatorList', 'moderators', 'moderatorNames'],
	dead: ['deadList', 'dead', 'eliminated'],
	days: ['dayStartNumbers', 'dayStart', 'days'],
	deadline: ['deadline', 'timer'],
	prods: ['prodTimer', 'prod'],
	countdown: ['prods', 'timer', 'prodTimer', 'countdown'],
	pageData: ['pageData'],
	correctionWeight: ['correctionWeight, correction'],
	edash: ['edash', 'edashweight'],
	edashOnTop: ['edashOnTop'],
};
function containsSelector(sel, selRef) {
	return selRef.includes(sel);
}
function findSelector(sel) {
	for (const selector in selectors) {
		if (containsSelector(sel, selectors[selector])) {
			return { handle: selector, request: sel, selectors: selectors[selector] };
		}
	}
	return null;
}

const defaultFunc = (settings) => {
	let s = new SettingsFormat(settings);
	return s.data;
};
export default defaultFunc;

class SettingsFormat {
	constructor(settings = null) {
		this.data = {
			players: [],
			slots: {},
			alias: {},
			totalnames: [],
			moderators: [],
			dead: [],
			days: ['0'],
			votes: {
				reg: {
					id: '0',
					vote: 'VOTE: ',
					unvote: 'UNVOTE: ',
				},
				hurt: {
					id: '1',
					vote: 'HURT: ',
					unvote: 'HEAL: ',
				},
			},
			pageData: null,
			voteWeight: {
				reg: 1,
			},
			edash: 2,
			edashOnTop: 1,
			correctionWeight: 0.5,
		};
		this.baseUrl = '';
		if (settings) this.parseSettings(settings);
	}
	parseSettings(settingsData) {
		for (const sel in settingsData) {
			let selector = findSelector(sel);
			let data = settingsData[sel];
			if (selector) {
				switch (selector.handle) {
					case 'players':
						const playerRef = this.convertCommaDelimiter(data);
						this.data.players = playerRef.list;
						this.data.slots = playerRef.obj;
						this.addNamesArray(playerRef.list);
						this.addAlias(playerRef.obj);
						this.convertPlayerNicknames(playerRef.list);
						break;
					case 'slots':
						const slotRef = this.convertCommaDelimiter(data);
						this.data.slots = slotRef.obj;
						this.addNamesArray(slotRef.list);
						this.addAlias(slotRef.obj);
						break;
					case 'alias':
						const aliasRef = this.convertCommaDelimiter(data);
						this.addAlias(aliasRef.obj);
						this.addNamesArray(aliasRef.list);
						break;
					case 'moderators':
						const moderatorRef = this.convertCommaDelimiter(data);
						this.data.moderators = moderatorRef.list;
						break;
					case 'dead':
						const deadRef = this.convertCommaDelimiter(data);
						this.data.dead = deadRef.list;
						break;
					case 'days':
						const dayRef = this.convertCommaDelimiter(data);
						this.data.days = dayRef.list;
						break;
					case 'deadline':
						this.data.deadline = data;
						break;
					case 'countdown':
						const prodRef = this.convertCommaDelimiter(data);
						let prodList = prodRef.list;
						this.data.prods = [];
						for (let i = 0; i < 4; i++) {
							if (!isNaN(parseInt(prodList[i]))) this.data.prods[i] = prodList[i];
							else this.data.prods[i] = 0;
						}
						break;
					case 'pageData':
						this.data.pageData = data;
						break;
					case 'correctionWeight':
						this.data.correctionWeight = data;
						break;
					case 'prods':
						const prodTimerRef = this.convertProds(data);
						break;
					case 'edash':
						const edashInt = parseInt(data);
						if (!isNaN(edashInt)) this.data.edash = edashInt;
						else this.data.edash = -1;
						break;
					case 'edashOnTop':
						const edashOnTopInt = parseInt(data);
						if (!isNaN(edashOnTopInt)) this.data.edashOnTop = edashOnTopInt;
						else this.data.edashOnTop = -1;
						break;
					default:
						console.log('Unknown Setting');
						break;
				}
			} else {
				console.log(`Settings found [${sel}] as an unknown selector.`);
			}
		}
	}
	addNamesArray(nameArray) {
		for (let name of nameArray) {
			if (!this.data.totalnames.includes(name)) this.data.totalnames.push(name);
		}
	}
	addAlias(obj) {
		this.data.alias = Object.assign(this.data.alias, obj);
	}
	addSetting(handle, setting) {
		switch (handle) {
			case 'playerList':
				this.addPlayers(setting);
				break;
			default:
				break;
		}
	}
	addPlayers(players) {
		let slots = players.split(',');
		for (let i = 0; i < slots.length; i++) {
			let slot = slots[i];
			let players = slot.split(':');
			for (let f = 1; f < players.length; f++) {
				let cur = players[f],
					root = players[0];
				this.slotList[cur] = root;
			}
		}
	}
	convertPlayerNicknames(data) {
		const nicknames = {};
		for (let i = 0; i < data.length; i++) {
			const root = data[i];
			const splitData = root.split('{');
			if (splitData.length > 1) {
				let nicks = splitData[1].split('}')[0].split('+');
				for (let j = 0; j < nicks.length; j++) {
					nicknames[nicks[j]] = splitData[0];
				}
			}
		}
		console.log(nicknames);
		return nicknames;
	}
	convertCommaDelimiter(data) {
		const author = [],
			group = {};
		let slotRef = data.split(seperator);
		for (let i = 0; i < slotRef.length; i++) {
			let indivPlayers = slotRef[i].split(block);
			for (let j = 0; j < indivPlayers.length; j++) {
				const currentPlayer = indivPlayers[0].trim();
				const playerReference = indivPlayers[j].trim();
				author.push(playerReference);
				group[playerReference] = currentPlayer;
			}
		}
		return { list: author, obj: group };
	}
	convertProds(data) {
		const prods = [0, 0, 0, 0];
		const split = data.split(',');
		const val = split.length > prods.length ? prods.length : split.length;
		for (let i = 0; i < val; i++) {
			let prod = split[i].trim();
			let int = parseInt(prod);
			if (!isNaN(int)) {
				prods[i] = int;
			}
		}
	}
}
