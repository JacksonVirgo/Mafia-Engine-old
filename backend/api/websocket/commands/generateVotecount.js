const Command = require('../Command');
const urlUtil = require('../../../util/url');
const scrapeCore = require('../../../tools/scrape/scrapeCore');
const voteCounter = require('../../../tools/votecount/voteCounter');
const voteFormatter = require('../../../tools/votecount/voteFormatter');

const settings = require('../../../tools/formatting/settingsFormat');
const RES = {
    INVALID_URL: { error: true, message: 'Invalid URL' },
};

const getLastVotes = (voteData) => {
    const votes = {};
    for (const page in voteData) {
        const { posts } = voteData[page];
        for (const post of posts) {
            if (post.votes.length >= 1) {
                const author = post.information.author;
                const lastVote = post.votes[post.votes.length - 1];
                votes[author] = lastVote;
            }
        }
    }
    return votes;
};

const validateVote = (vote, settings) => {};

const formatVoteCount = (voteData, settings) => {
    const voteList = {};

    // Iterate Through Each Page
    for (const page in voteData) {
        // Iterate through each post
        const { posts } = voteData[page];
        for (const post of posts) {
            if (post.votes.length >= 1) {
                const author = post.information.author;
                // Iterate through each vote
                for (const vote of post.votes) {
                    voteList[author] = vote;
                }
            }
        }
    }
    return voteList;
};

module.exports = Command('genVoteCount', async (socket, data, tag) => {
    const { url, raw } = data;
    console.log(data);
    const response = {};

    // Validate URL
    const urlValidate = urlUtil.validate(url);
    if (!urlValidate) return socket.emit(tag, RES.INVALID_URL);

    // Request Data
    const voteData = await voteCounter.getThreadDataFromURL(url);
    response.rawData = voteData;
    if (raw) return socket.emit(tag, response);

    // Validate Settings
    let settingsValue = voteData.settings[0];
    if (settingsValue) {
        console.log(settingsValue.information.postNumber);
        if (settingsValue.information.postNumber != '0') settingsValue = null;
        else {
            const newSettings = settings(settingsValue);
            console.log(newSettings);
            settingsValue = newSettings;
        }
        response.settings = settingsValue;
    }

    if (!settingsValue) response.lastVotes = getLastVotes(voteData.scrapedPages);
    else response.lastValidVotes = formatVoteCount(voteData.scrapedPages, settingsValue);

    socket.emit(tag, response);
});
