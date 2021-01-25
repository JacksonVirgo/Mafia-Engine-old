const scrapeCore = require('./scrapeCore');
const cheerio = require('cheerio');
const Timer = require('../../util/Timer');
const StringUtil = require('../../util/stringUtil');
const UrlUtil = require('../../util/url');

const Vote = require('./classes/vote');
const URL = require('./classes/url');
const Settings = require('./classes/settings');

const time = {
    fetch: 0,
    scrape: 0,
    settings: 0,
    thread: 0
}

/**
 * 
 * @param {*} url 
 */
async function getDataFromThread(urlLink) {
    Timer.timeStart("dataThread");
    let url = new URL(urlLink);
    let completed = false;
    let votesList = {};
    let voteCountSettings = null;

    while (!completed) {
        // Get next URL
        let currentURL = url.getNextUrlAndIndent();

        // Fetch the page HTML
        let html = await scrapeCore.readHTML(currentURL);

        // Parse Data
        let webData = getDataFromPage(html);
        for (const handle in webData.voteCount) {
            let formerArray = webData.voteCount[handle];
            for (const vote of formerArray) {
                if (!votesList[handle]) votesList[handle] = [];
                votesList[handle].push(vote);
            }
        }
        // Check if the last page has been parsed.
        let lastPageData = await getLastPage(currentURL);
        if (lastPageData.currentPageNum === 1) {
            voteCountSettings = getVoteSettings(html);
        }
        completed = lastPageData.isLastPage;
    }

    console.log("-- FINAL VOTE COUNT --");
    let finalVoteCount = {};
    for (let user in votesList) {
        let array = votesList[user];
        finalVoteCount[user] = array[array.length - 1];
    }
    console.log(finalVoteCount);
    const result = parseFinalVoteCount(finalVoteCount, voteCountSettings, url.baseURL);
    return result;
}

function parseFinalVoteCount(votes, settings, baseUrl) {
    const voteCount = {};
    const slots = {};
    let slotList = settings.playerList.split(',');
    for (let i = 0; i < slotList.length; i++) {
        let players = slotList[i].split(':');
        for (const player of players) {
            slots[player] = players[0];
        }
    }
    
    let playerNames = Object.keys(slots);
    let unknownVotes = [];

    for (const property in votes) {
        let { author, vote, post, url } = votes[property];
        url = UrlUtil.absolute(baseUrl, url);

        vote = removeVoteTag(vote);
        let newVote = StringUtil.bestMatch(vote, playerNames);
        let diff = StringUtil.compareString(vote.toLowerCase(), newVote.toLowerCase());
        console.log(`String [${vote}] - [${newVote}] with ${diff}`);
        if (slots[vote]) {
            vote = slots[vote];
        }
        votes[property] = { author, vote, post, url };

        if (diff >= 0.5) {
            votes[property].vote = newVote;
        } else {
            unknownVotes.push(votes[property]);
            delete votes[property];
        }
    }
    const result = {
        voteCount: votes,
        unknownVotes: unknownVotes
    }
    return result;
}

/**
 * 
 * @param {*} html HTML to scan
 */
function getDataFromPage(html) {
    const $ = cheerio.load(html);

    let voteCount = {};
    $("div.post").each((i, el) => {
        let votes = getVotesFromPost($, $(el));
        for (const handle in votes) {
            for (const vote of votes[handle]) {
                if (!voteCount[handle]) voteCount[handle] = [];
                voteCount[handle].push(vote);
            }
        }
    });
    
    return { voteCount: voteCount };
}

function getVotesFromPost($, post) {
    let votes = {};
    let author = post.find("div.inner > div.postprofilecontainer > dl.postprofile > dt > a").first().text();
    let postNumber = post.find("div.inner > div.postbody > p.author > a > strong").first().parent();

    let postURL = postNumber.attr('href');
    let postNum = postNumber.find('strong').first().text();

    post.find("div.inner > div.postbody > div.content").first().each((index, element) => { 
        $(element).find("blockquote").each((i, e) => {
            $(e).remove();
        });
        $(element).find("span.bbvote, span.noboldsig").each((i, el) => {
            let possibleVote = $(el).text();
            if (possibleVote != undefined && isVote(possibleVote)) {
                if (!votes[author]) votes[author] = [];
                votes[author].push({
                    author: author,
                    vote: possibleVote,
                    post: parseInt(postNum.replace(/\D/g,'')),
                    url: postURL
                });
            }
        }); 
    });
    return votes;
}

function isVote(vote) {
    let isVote = false;
    let voteHandles = [ "VOTE: ", "UNVOTE: ", "/vote ", "/unvote " ];
    for (const handle of voteHandles) {
        if (vote.startsWith(handle)) 
            isVote = true;
    }
    return isVote;
}

function removeVoteTag(text) {
    let voteHandles = [ "VOTE: ", "/vote " ];
    for (const handle of voteHandles) {
        if (text.startsWith(handle))
            return text.substring(handle.length);
    }
    return text;
}

function getVoteSettings(html) {
    Timer.timeStart("getSettings");

    const $ = cheerio.load(html);
    let voteCountSelector = "Spoiler: VoteCount Settings";
    const settings = {}
    $("div.post").first().find("div.inner > div.postbody > div.content > div").each((index, element) => {
        $(element).find("div.quotetitle").each((index, element) => {
            let parent = $(element).parent();
            let handle = $(element).find("b").first().text();
            let content = parent.find("div.quotecontent").first().find("div").first();
            if (handle === voteCountSelector) {
                content.find("span").each((index, element) => {
                    let totalString = $(element).text();
                    let command = totalString.split("=");
                    settings[command[0]] = command[1];
                });              
            }
        });
    });
    return settings;
}

function parseURL(url) {
    return url + "&ppp=200";
}

async function getLastPage(url) {
    let html = await scrapeCore.readHTML(url);
    let $ = cheerio.load(html);

    let pagination = $(".pagination").first();
    let currentPage = pagination.find("strong").first();

    let currentPageNum = convertInt(currentPage.text());
    let lastPage = currentPageNum;

    if (pagination.find("span").length >= 1) {
        let lastLink = pagination.find("span > a").last();
        let lastLinkNumber = convertInt(lastLink.text());
        lastPage = (lastPage > lastLinkNumber) ? lastPage : lastLinkNumber;
    }

    let isLastPage = lastPage === currentPageNum;

    let result = { currentPageNum, lastPage, isLastPage };
    console.log(result);
    return result;
}

function convertInt(str) {
    let result = parseInt(str);
    result = isNaN(result) ? null : result;
    return result;
}

module.exports = {
    getDataFromThread,
    getDataFromPage,
    getLastPage
}