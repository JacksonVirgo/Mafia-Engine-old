const scrapeCore = require('../scrapeCore');
const scrapeVotes = require('../scrapeVotes');
const cheerio = require('cheerio');

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
	countdown: ['prods', 'timer', 'prodTimer', 'countdown'],
	pageData: ['pageData'],
	correctionWeight: ['correctionWeight, correction'],
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

module.exports = class {
	constructor(settings = null) {
		this.data = {
			players: [],
			slots: {},
			alias: {},
			totalnames: [],
			moderators: [],
			dead: [],
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
			correctionWeight: 0.5,
		};
		this.baseUrl;
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
				console.log(f, players[f]);
				this.slotList[players[f]] = players[0];
			}
		}
	}
	convertCommaDelimiter(data) {
		const author = [],
			group = {};
		let slotRef = data.split(seperator);
		for (let i = 0; i < slotRef.length; i++) {
			let indivPlayers = slotRef[i].split(block);
			for (let j = 0; j < indivPlayers.length; j++) {
				author.push(indivPlayers[j]);
				group[indivPlayers[j]] = indivPlayers[0];
			}
		}
		return { list: author, obj: group };
	}
};
