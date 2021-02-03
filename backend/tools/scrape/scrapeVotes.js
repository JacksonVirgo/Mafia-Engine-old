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
    console.log(urlLink);
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
        let webData = getDataFromPage(html, voteCountSettings, urlLink);
        for (const author in webData.voteCount) {
            let finalAuthor = votesList[author];
            let tempAuthor = webData.voteCount[author];
            if (!finalAuthor) {
                finalAuthor = {
                    author: tempAuthor.author,
                    pronoun: tempAuthor.pronoun,
                    votes: {}
                };
            }
            for (const vote in tempAuthor.votes) {
                finalAuthor.votes[vote] = tempAuthor.votes[vote];
            }

            if (Object.keys(finalAuthor.votes).length >= 1)
                votesList[author] = finalAuthor;
        }

        // Check if the last page has been parsed.
        let lastPageData = await getLastPage(currentURL);
        completed = lastPageData.isLastPage;
    }

    const finalVoteCount = {}; // Object containing child objects for each type of votes.
    for (const author in votesList) {
        let voteTypes = Object.keys(votesList[author].votes);
        for (const type of voteTypes) {
            if (!finalVoteCount[type]) finalVoteCount[type] = {};
            finalVoteCount[type][author] = votesList[author].votes;
        }
    }
    const result = parseFinalVoteCount(finalVoteCount, voteCountSettings, url.baseURL);
    return result;
}

function parseFinalVoteCount(votes, settings, baseUrl) {
    const voteCount = {};
    const unknownVotes = [];
    let slotList = settings.data.slots;
    let playerList = settings.data.players;
    let deadList = settings.data.dead;
    let deadReference = {};

    for (const voteType in votes) {
        if (!voteCount[voteType])
            voteCount[voteType] = {};

        for (const author in votes[voteType]) {
            const values = votes[voteType][author][voteType];
            if (values !== null) {
                let { vote, post, url } = values;
                const result = { author, vote, post, url };
                voteCount[voteType][author] = result;
            } else { }
        }
    }
    return { voteCount, unknownVotes, settings: settings.data };
}

/**
 * 
 * @param {*} html HTML to scan
 */
function getDataFromPage(html, settings, urlLink) {
    const $ = cheerio.load(html);
    let voteCount = {}; // Information for each USER
    $("div.post").each((i, el) => {
        let voteData = getVotesFromPost($, $(el), settings, urlLink);
        let author = voteCount[voteData.author];
        if (!author) author = {
            author: voteData.author,
            pronoun: voteData.pronoun,
            votes: {}
        };

        const voteProps = Object.keys(voteData.votes);
        for (let i = 0; i < voteProps.length; i++) {
            author.votes[voteProps[i]] = voteData.votes[voteProps[i]];
        }
        console.log(author);
        voteCount[voteData.author] = author;
    });
    return { voteCount: voteCount };
}

function getVotesFromPost($, post, settings, urlLink) {
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
                            talliedVotes[votes[i].id] = { vote: content, post: postNumber, url: postUrl };
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

    const absoluteUrl = UrlUtil.absolute(urlLink, postUrl);
    const resultObject = {
        author: authorName ? authorName : null,
        pronoun: 'N/A',
        post: { num: postNumber ? postNumber : null, url: absoluteUrl },
        votes: talliedVotes ? talliedVotes : null,
    }
    console.log(resultObject);
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
    try {
        let voteHandles = ["VOTE: ", "/vote "];
        for (const handle of voteHandles) {
            if (text.startsWith(handle))
                return text.substring(handle.length);
        }
    } catch (err) {
        console.log(err);
    }
    return text;
}

async function getVoteSettingsFromUrl(url) {
    const html = await scrapeCore.readHTML(url);
    const settings = getVoteSettings(html);
    return settings;
}
function getVoteSettings(html, url = null) {
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
    if (url !== null) {
        settings.baseUrl = url;
    }
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