const scrapeCore = require('./scrapeCore');
const cheerio = require('cheerio');
const Timer = require('../../util/Timer');
const StringUtil = require('../../util/stringUtil');
const UrlUtil = require('../../util/url');

const URL = require('./classes/url');
const Settings = require('./classes/settings');
const { Author } = require('./classes/voteAuthor');

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


    const response = await scrapeCore.readHTML(urlLink);
    let voteCountSettings = getVoteSettings(response);

    while (!completed) {
        // Get next URL
        let currentURL = url.getNextUrlAndIndent();

        // Fetch the page HTML
        let html = await scrapeCore.readHTML(currentURL);

        // Parse Data
        let webData = getDataFromPage(html, voteCountSettings);
        for (const author in webData.voteCount) {

        }

        for (const handle in webData.voteCount) {
            let formerArray = webData.voteCount[handle];
            for (const vote in formerArray) {
                if (!votesList[handle]) votesList[handle] = [];
                votesList[handle].push(vote);
            }
        }
        // Check if the last page has been parsed.
        let lastPageData = await getLastPage(currentURL);
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
    const unknownVotes = [];
    const slotReference = {};
    const playerNameList = [];
    const deadPlayerList = {};
    let slotList = settings.playerList.split(',');
    for (let i = 0; i < slotList.length; i++) {
        let playerList = slotList[i].split(':');
        for (let f = 0; f < playerList.length; f++) {
            playerNameList.push(playerList[f]);
            slotReference[playerList[f]] = playerList[0];
            deadPlayerList[playerList[f]] = false;
            console.log(`${playerList[f]} refers to ${playerList[0]}`);
        }
    }
    let deadList = settings.deadList.split(',');
    for (let i = 0; i < deadList.length; i++) {
        deadPlayerList[deadList[i]] = true;
    }
    for (const player in votes) {
        let { author, vote, post, url } = votes[player];
        url = UrlUtil.absolute(baseUrl, url);
        let votedPlayer = removeVoteTag(vote);
        let votedPlayerCorrected = StringUtil.bestMatch(votedPlayer, playerNameList);
        let correctionVal = StringUtil.compareString(votedPlayer.toLowerCase(), votedPlayerCorrected.toLowerCase());
        author = slotReference[author];
        if (correctionVal > 0.5) {
            vote = slotReference[votedPlayerCorrected];
            if (!deadPlayerList[vote] && !deadPlayerList[author] && author != undefined && vote != undefined)
                voteCount[author] = { author, vote, post, url };
        } else {
            if (author != undefined && vote != undefined)
                unknownVotes.push({ author, vote, post, url });
        }
    }
    return { voteCount, unknownVotes };
}

/**
 * 
 * @param {*} html HTML to scan
 */
function getDataFromPage(html, settings) {
    const $ = cheerio.load(html);
    let voteCount = {}; // Information for each USER
    $("div.post").each((i, el) => {
        let voteData = getVotesFromPost($, $(el), settings);
        if (!voteCount[voteData.author])
            voteCount[voteData.author] = {};

        let authorRef = voteCount[voteData.author];
        authorRef.pronoun = voteData.pronoun;
        authorRef.author = voteData.author;


        const voteProps = Object.keys(voteData.votes);
        for (let i = 0; i < voteProps.length; i++) {
            if (voteProps[i] === null) {
                authorRef.votes[i] = { vote: null, post: voteData.post };
            } else if (authorRef.votes === undefined) {
                authorRef.votes = [];
                authorRef.votes[i] = { vote: voteData.votes[voteProps[i]], post: voteData.post };
            } else if (voteData.votes[voteProps[i]] !== authorRef.votes[i]) {
                authorRef.votes[i] = { vote: voteData.votes[voteProps[i]], post: voteData.post };
            }
        }
        console.log(authorRef);
        voteCount[voteData.author] = authorRef;
    });
    return { voteCount: voteCount };
}

function getVotesFromPost($, post, settings) {
    const authorName = post.find("div.inner > div.postprofilecontainer > dl.postprofile > dt > a").first().text();
    const postNumberRef = post.find("div.inner > div.postbody > p.author > a > strong").first().parent();
    const postUrl = postNumberRef.attr('href');
    const postNumber = postNumberRef.find('strong').first().text().replace(/\D/g, '');

    let talliedVotes = {};
    let votePairs = settings.data.votes;
    let totalVotes = [];
    let votes = [];
    let unvotes = [];
    for (const property in votePairs) {
        if (votePairs[property].vote) {
            totalVotes.push(votePairs[property].vote);
            votes.push({ id: votePairs[property].id, vote: votePairs[property].vote });
        }
        if (votePairs[property].unvote) {
            totalVotes.push(votePairs[property].unvote);
            unvotes.push({ id: votePairs[property].id, vote: votePairs[property].unvote });

        }
    }

    post.find("div.inner > div.postbody > div.content").first().each((index, element) => {
        $(element).find("blockquote").each((i, e) => $(e).remove());
        $(element).find("span.bbvote, span.noboldsig").each((i, el) => {
            let vote = $(el).text();
            if (vote) {
                let detachedVote = detachVoteTag(vote, totalVotes);
                if (detachedVote) {
                    let { tag, content } = detachedVote;
                    for (let i = 0; i < votes.length; i++) {
                        if (tag === votes[i].vote) {
                            talliedVotes[votes[i].id] = content;
                            break;
                        }
                    }
                    for (let i = 0; i < unvotes.length; i++) {
                        if (tag === unvotes[i].vote) {
                            talliedVotes[unvotes[i].id] = null;
                            break;
                        }
                    }
                }
            }
        });
    });

    const resultObject = {
        author: authorName ? authorName : null,
        pronoun: 'N/A',
        post: { num: postNumber ? postNumber : null, url: postUrl ? postUrl : null },
        votes: talliedVotes ? talliedVotes : null
    }
    return resultObject;
}

function detachVoteTag(vote, allVotes) {
    for (const voteTag of allVotes) {
        if (vote.startsWith(voteTag)) {
            const result = { tag: voteTag, content: vote.substring(voteTag.length) };
            //console.log(result);
            return result;
        }
    }
    return null;
}

function isVote(vote, settings) {
    let isVote = false;
    let voteHandles = [];
    let unvoteHandles = [];
    for (const voteData of settings.data.voteTags) {
        voteHandles.concat(voteData.vote);
        unvoteHandles.concat(voteData.unvote);
    }
    for (const handle of voteHandles) {
        if (vote.startsWith(handle))
            isVote = true;
    }
    for (const handle of unvoteHandles) {
        if (vote.startsWith(handle)) {
            isVote = true;
        }
    }
    return isVote;
}

function removeVoteTag(text, settings) {
    let voteHandles = ["VOTE: ", "/vote "];
    for (const handle of voteHandles) {
        if (text.startsWith(handle))
            return text.substring(handle.length);
    }
    return text;
}

async function getVoteSettingsFromUrl(url) {
    const html = await scrapeCore.readHTML(url);
    const settings = getVoteSettings(html);
    return settings;
}
function getVoteSettings(html) {
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
    const finalSettings = new Settings(settings);
    return finalSettings;
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
    getLastPage,
    getVoteSettingsFromUrl
}