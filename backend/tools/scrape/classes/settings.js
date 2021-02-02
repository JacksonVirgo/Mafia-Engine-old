const scrapeCore = require('../scrapeCore');
const scrapeVotes = require('../scrapeVotes');
const cheerio = require('cheerio');

const seperator = ',';
const block = ':';

function parsePlayers(playerList) {
    const totalPlayers = [];
    const slotList = {};
    let slots = playerList.split(seperator);
    for (const slot of slots) {
        let players = slot.split(block);
        for (let i = 0; i < players.length; i++) {
            totalPlayers.push(players[i]);
            slotList[players[i]] = players[0];
        }
    }
    return { totalPlayers, slotList };
}
function parseModerators(moderatorList) {
    const totalModerators = moderatorList.split(seperator);
    return totalModerators;
}
function parseVotes(voteTags, unvoteTags) {
    let finalVoteTags = [];
    let finalUnvoteTags = [];

    console.log(voteTags);

    let votes = voteTags.split(seperator);
    let unvotes = unvoteTags.split(seperator);
    let size = (votes.length > unvotes.length ? votes.length : unvotes.length);
    for (let i = 0; i < size; i++) {
        let voteTag = votes[i] ? votes[i] : null;
        let unvoteTag = unvotes[i] ? unvotes[i] : null;
        finalVoteTags.push(voteTag);
        finalUnvoteTags.push(unvoteTag);
    }
    return { voteTags: finalVoteTags, unvoteTags: finalUnvoteTags };
}

module.exports = class {
    constructor(settings = null) {
        this.data = {
            players: [],
            moderators: [],
            slots: {},
            votes: {
                reg: {
                    id: '0',
                    vote: 'VOTE: ',
                    unvote: 'UNVOTE: '
                },
                hurt: {
                    id: '1',
                    vote: 'HURT: ',
                    unvote: 'HEAL: '
                }
            }
        }
        if (settings) this.parseSettings(settings);
    }
    parseSettings(settingsData) {
        const { players, moderators, deadList, voteTags, unvoteTags } = settingsData;
        //console.log(settingsData);
        let playerResult = players ? parsePlayers(players) : null;
        if (playerResult !== null) {
            this.data.players = playerResult.totalPlayers;
            this.data.slots = playerResult.slotList;
        }
        this.data.moderators = moderators ? parseModerators(moderators) : null;
        let votes = parseVotes(voteTags, unvoteTags);
        // if (votes.voteTags) this.data.voteTags = votes.voteTags;
        // if (votes.unvoteTags) this.data.unvoteTags = votes.unvoteTags;
    }
    addSetting(handle, setting) {
        switch (handle) {
            case "playerList":
                this.addPlayers(setting);
                break;
            default:
                break;
        }
    }
    addPlayers(players) {
        let slots = players.split(",");
        for (let i = 0; i < slots.length; i++) {
            let slot = slots[i];
            let players = slot.split(":");
            for (let f = 0; f < players.length; f++) {
                this.slotList[players[f]] = players[0];
            }
        }
        console.log(this.slotList);
    }
}