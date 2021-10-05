const Command = require('../Command');
const urlUtil = require('../../../util/url');
const scrapeCore = require('../../../tools/scrape/scrapeCore');
const voteCounter = require('../../../tools/votecount/voteCounter');
const voteFormatter = require('../../../tools/votecount/voteFormatter');

const screenScraper = require('../../../util/screenScraper');

const settings = require('../../../tools/formatting/settingsFormat');
const RES = {
    INVALID_URL: { error: true, message: 'Invalid URL' },
};

const scrapeSelectors = {
    root: [
        { selector: 'h2 > a', type: 'text', label: 'title' },
        { selector: 'div.pagination', type: 'full', label: 'pagination', options: { first: true } },
        { selector: '#page-body', type: 'full', label: 'pageBody' },
    ],
    pagination: [
        { selector: 'a', type: 'text', label: 'lastAnchor', options: { last: true } },
        { selector: 'span', type: 'text', label: 'lastSpan', options: { last: true } },
    ],
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

    if (!url) return;

    const { title, pagination, pageBody } = await screenScraper.getElementsFromUri(url, scrapeSelectors.root);

    const { lastAnchor, lastSpan } = await screenScraper.getElements(pagination, scrapeSelectors.pagination);

    console.log(title, lastAnchor);

    // const response = {};

    // // Validate URL
    // const urlValidate = urlUtil.validate(url);
    // if (!urlValidate) return socket.emit(tag, RES.INVALID_URL);

    // // Request Data
    // const voteData = await voteCounter.getThreadDataFromURL(url);
    // response.rawData = voteData;
    // if (raw) return socket.emit(tag, response);

    // // Validate Settings
    // let settingsValue = voteData.settings[0];
    // if (settingsValue) {
    //     console.log(settingsValue.information.postNumber);
    //     if (settingsValue.information.postNumber != '0') settingsValue = null;
    //     else {
    //         const newSettings = settings(settingsValue);
    //         console.log(newSettings);
    //         settingsValue = newSettings;
    //     }
    //     response.settings = settingsValue;
    // }

    // if (!settingsValue) response.lastVotes = getLastVotes(voteData.scrapedPages);
    // else response.lastValidVotes = formatVoteCount(voteData.scrapedPages, settingsValue);

    // socket.emit(tag, response);
});
