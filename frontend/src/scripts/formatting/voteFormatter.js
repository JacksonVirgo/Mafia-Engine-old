import Vote from "../Vote";
import {sortArraysBySize} from '../sorting.js';
import {findBestMatch} from 'string-similarity';

export function cleanInput(voteCount, settings) {
    const voteData = {
        wagons: {},
        votes: {},
        notVoting: []
    }
    for (const cat in voteCount) {
        if (!voteData.votes[cat]) voteData.votes[cat] = {};
        if (!voteData.wagons[cat]) voteData.wagons[cat] = {};
        voteData.notVoting = getAlivePlayers(settings);
        voteData.majority = Math.ceil(voteData.notVoting.length / 2);
        let hammerOccured = false;

        for (const author in voteCount[cat]) {
            let voteArray = voteCount[cat][author];
            let lastVote = null, validVote = null;
            for (let i = 0; i < voteArray.length; i++) {
                let vote = new Vote(voteArray[i], cat);
                vote.clean(settings);
                if (vote.vote.valid !== undefined)
                    validVote = vote.vote.valid ? vote.getNewest(validVote) : null;
                lastVote = vote.getNewest(lastVote);
            }
            if (validVote?.isValid(settings)) {
                let authorIndex = voteData.notVoting.indexOf(validVote.author);
                voteData.notVoting.splice(authorIndex, 1);
                voteData.votes[cat][author] = { last: lastVote, valid: validVote };
                if (!voteData.wagons[cat][validVote.vote.valid])
                    voteData.wagons[cat][validVote.vote.valid] = [];
                let wagons = voteData.wagons[cat][validVote.vote.valid];
                wagons.push(validVote);
                wagons = sortArraysBySize(wagons);
                voteData.wagons[cat][validVote.vote.valid] = wagons;
                hammerOccured = wagons.length >= voteData.majority;
            }
            if (hammerOccured) {
                console.log("Hammered");
                break;
            }
        }
    }
    return voteData;
}
export function formatInput(voteData, settings) {
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
