const scrapeCore = require('../scrapeCore');
const scrapeVotes = require('../scrapeVotes');
const cheerio = require('cheerio');

const seperator = ',';
const block = ':';


function parseVotes(voteTags, unvoteTags) {
    let finalVoteTags = [];
    let finalUnvoteTags = [];
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
            },
            pageData: null
        };
        this.baseUrl;
        if (settings) this.parseSettings(settings);
    }
    parseSettings(settingsData) {
        const { playerList, moderatorList, deadList, voteTags, unvoteTags, baseUrl, pageData } = settingsData;
        this.baseUrl = baseUrl;
        if (playerList) {
            const playerArray = [];
            const slotReference = {};
            let slots = playerList.split(seperator);
            for (let i = 0; i < slots.length; i++) {
                let players = slots[i].split(block);
                for (let f = 0; f < players.length; f++) {
                    playerArray.push(players[f]);
                    slotReference[players[f]] = players[0];
                }
            }
            this.data.players = playerArray;
            this.data.slots = slotReference;
        }
        if (moderatorList) {
            this.data.moderators = moderatorList.split(seperator);
        }
        if (deadList) {
            this.data.dead = deadList.split(seperator);
        }
        this.data.pageData = pageData;
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