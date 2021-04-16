import Vote from '../Vote';
import { sortArraysBySize } from '../sorting.js';
import { findBestMatch } from 'string-similarity';

export default function formatVoteCount(voteCount, settings) {
	const vc = new VoteCount(voteCount, settings);
	const result = vc.run();
}
const clean = (voteCount, settings) => {
	const isValid = settings.players.length >= 1;
	const voteData = {
		votes: {},
		wagons: {},
		orderedWagons: [],
		notVoting: [],
		majority: null,
	};
	if (isValid) {
		for (const category in voteCount) {
			if (!voteData.votes[category]) voteData.votes[category] = {};
			if (!voteData.wagons[category]) voteData.wagons[category] = {};
			let hammerOccured = false;
			voteData.notVoting = getLivingPlayers(settings);
		}
	} else {
	}
};
const getLivingPlayers = ({ players, dead, totalnames, alias }) => {
	let livingList = [];
	for (let i = 0; i < players.length; i++) {
		let root = getNewestPlayerFromSlot(players, totalnames, alias);
		if (!containsObject(root, livingList) && !containsObject(root, dead)) {
			livingList.push(root);
		}
	}
	return livingList;
};
const getNewestPlayerFromSlot = (user, totalnames, alias) => {
	const bestMatch = findBestMatch(user, totalnames).bestMatch;
	const root = alias[bestMatch.target];
	return root || bestMatch.target;
};

class VoteCount {
	constructor(voteCount, settings) {
		this.voteCount = voteCount;
		this.settings = settings;
	}
	run() {}
	clean() {}
	format() {}
}

function cleanInput(voteCount, settings) {
	const voteData = { wagons: {}, votes: {}, notVoting: [] };
	for (const cat in voteCount) {
		if (!voteData.votes[cat]) voteData.votes[cat] = {};
		if (!voteData.wagons[cat]) voteData.wagons[cat] = {};
		let living = getAlivePlayers(settings);
		voteData.notVoting = getAlivePlayers(settings);
		voteData.majority = Math.ceil(voteData.notVoting.length / 2);
		console.log(voteData.majority, voteData.notVoting);
		let hammerOccured = false;

		for (const author in voteCount[cat]) {
			let voteArray = voteCount[cat][author];
			let lastVote = null,
				validVote = null;
			for (let i = 0; i < voteArray.length; i++) {
				let vote = new Vote(voteArray[i], cat);
				vote.clean(settings);
				if (vote.vote.valid !== undefined) validVote = vote.vote.valid ? vote.getNewest(validVote) : null;
				lastVote = vote.getNewest(lastVote);
			}
			if (validVote?.isValid(settings)) {
				let authorIndex = voteData.notVoting.indexOf(validVote.author);
				voteData.notVoting.splice(authorIndex, 1);
				voteData.votes[cat][author] = { last: lastVote, valid: validVote };
				if (!voteData.wagons[cat][validVote.vote.valid]) voteData.wagons[cat][validVote.vote.valid] = [];
				let wagons = voteData.wagons[cat][validVote.vote.valid];
				wagons.push(validVote);
				wagons = sortArraysBySize(wagons);
				voteData.wagons[cat][validVote.vote.valid] = wagons;
				hammerOccured = wagons.length >= voteData.majority;
			}
			if (hammerOccured) {
				console.log('Hammered');
				break;
			}
		}
	}
	console.log(voteData);
	return voteData;
}
function formatInput(voteData, settings) {
	const { wagons, notVoting } = voteData;
	let totalVC = '';
	for (const category in wagons) {
		let categoryVotes = '[area=VC]';
		for (const wagonHead in wagons[category]) {
			let voteArray = wagons[category][wagonHead];
			let vote = `[b]${wagonHead}[/b] (${voteArray.length}) -> `;
			for (let i = 0; i < voteArray.length; i++) {
				if (i > 0) vote += ', ';
				vote += `${voteArray[i].author}`;
			}
			categoryVotes += vote + '\n';
		}
		if (notVoting.length > 0) {
			categoryVotes += `\n[b]Not Voting[/b] (${notVoting.length}) -> `;
			for (let i = 0; i < notVoting.length; i++) {
				if (i > 0) categoryVotes += ', ';
				categoryVotes += `${notVoting[i]}`;
			}
		}
		categoryVotes += '[/area]';
		totalVC += categoryVotes;
	}
	return totalVC;
}

function getAlivePlayers(settings) {
	const { players, dead } = settings;
	let aliveList = [];
	for (let i = 0; i < players.length; i++) {
		let root = getRootAuthor(players[i], settings);
		if (!containsObject(root, aliveList) && !containsObject(root, dead)) {
			aliveList.push(root);
		}
	}
	console.log('Alive', aliveList);
	return aliveList;
}
function getRootAuthor(author, settings) {
	let bestMatch = findBestMatch(author, settings.totalnames).bestMatch;
	let root = settings.alias[bestMatch.target];
	return root || bestMatch.target;
}
function containsObject(obj, list) {
	for (let i = 0; i < list.length; i++) {
		if (list[i] === obj) return true;
	}
	return false;
}
