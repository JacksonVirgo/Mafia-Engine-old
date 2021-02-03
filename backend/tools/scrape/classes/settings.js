const scrapeCore = require('../scrapeCore');
const scrapeVotes = require('../scrapeVotes');
const cheerio = require('cheerio');

const seperator = ',';
const block = ':';


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
            dead: [],
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
        };
        this.baseUrl;
        if (settings) this.parseSettings(settings);
    }
    parseSettings(settingsData) {
        const { players, moderators, deadList, voteTags, unvoteTags, baseUrl } = settingsData;
        this.baseUrl = baseUrl;
        if (players) {
            const playerList = [];
            const slotReference = {};
            let slots = playerList.split(seperator);
            for (const slot of slots) {
                let players = slot.split(block);
                playerList.push(players[i]);
                slotReference[players[i]] = players[0];
            }
            this.data.players = playerList;
            this.data.slots = slotReference;
        }
        if (moderators) {
            this.data.moderators = moderators.split(seperator);
        }
        if (deadList) {
            this.data.dead = deadList.split(seperator);
        }
        // TODO: Figure out how to create and parse multiple and singular voting tags.
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