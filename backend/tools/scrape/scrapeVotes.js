const scrapeCore = require('./scrapeCore');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const Settings = require('./classes/settings');

class URL {
    constructor(url, ppp) {
        this.baseURL = url;
        this.ppp = ppp;
        this.indent = 0;
        this.pppURL = url + "&ppp=" + this.ppp;
    }
    urlFromPost(postNum) {
        return `${this.pppURL}&start=${postNum}`;
    }
    getNextUrlAndIndent() {
        let result = `${this.pppURL}&start=${this.indent}`;
        this.applyIndent();
        return result;
    }
    getCurrentIndented() {
        let result = `${this.pppURL}&start=${this.indent}`;
        return result;
    }
    pageNumberFromPost(postNum) {
        let pages = Math.floor(postNum / this.ppp) + 1;
        return pages;
    }
    applyIndent() {
        this.indent += this.ppp;
    }
}

class Thread {
    constructor(url, progress = (e) => { console.log(e) }) {
        this.url = new URL(url, 200);
        this.completed = false;
        this.settings = null;
        this.voteTags = {
            filled: false,
            votePairs: { reg: { id: 0, vote: 'VOTE: ', unvote: 'UNVOTE: ' } },
            votes: [],
            unvotes: [],
            total: []
        };
    }
    async init(progressUpdate = (e) => console.log(e)) {
        console.time('Scrape');
        const voteCount = {};
        while (!this.completed) {
            let currentUrl = this.url.getNextUrlAndIndent();
            let html = await getHTML(currentUrl);
            let webData = this.scrapePage(html);
            if (webData) {
                for (const category in webData) {
                    for (const vote in webData[category]) {
                        let { author, pronoun, post, votes } = webData[category][vote];
                        if (!voteCount[category]) {
                            voteCount[category] = {};
                        } else {
                            if (voteCount[category][author]) {
                                votes = Object.assign(voteCount[category][author].votes, votes);
                            }
                        }
                        voteCount[category][author] = { author, pronoun, post, votes };
                    }
                }
            }
            this.completed = this.settings.pageData.currentPage === this.settings.pageData.lastPage;
            progressUpdate(this.settings.pageData);
        }
        console.timeEnd('Scrape');
        return { voteCount, settings: this.settings };
    }
    scrapeSettings($) {
        let voteCountSelector = "Spoiler: VoteCount Settings";
        const settings = {}
        settings.pageData = this.getPageData($);
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
        this.settings = finalSettings.data;
        console.log(this.settings);

    }
    getPageData($) {
        let pagination = $(".pagination").first();
        let currentPage = pagination.find("strong").first();
        let currentPageNum = convertInt(currentPage.text());
        let lastPage = currentPageNum;
        if (pagination.find("span").length >= 1) {
            let lastLink = pagination.find("span > a").last();
            let lastLinkNumber = convertInt(lastLink.text());
            lastPage = (lastPage > lastLinkNumber) ? lastPage : lastLinkNumber;
        }

        const result = { lastPage, currentPage: currentPageNum };
        return result;
    }
    scrapePage(html) {
        const $ = cheerio.load(html);
        if (!this.settings) this.scrapeSettings($);
        else this.settings.pageData = this.getPageData($);

        let voteCount = {};

        $('div.post').each((i, e) => {
            let voteData = this.scrapePost($, $(e));
            if (voteData) {
                let { author, pronoun, post, votes } = voteData;
                for (const voteCategory in votes) {
                    if (!voteCount[voteCategory]) {
                        voteCount[voteCategory] = {};
                    } else {
                        if (voteCount[voteCategory][author]) {
                            votes = Object.assign(voteCount[voteCategory][author].votes, votes);
                        }
                    }
                    voteCount[voteCategory][author] = { author, pronoun, post, votes };
                }
            }
        });
        return voteCount;
    }
    scrapePost($, post) {
        const voteData = {
            author: post.find('.inner > .postprofilecontainer > .postprofile > dt > a').text(),
            post: {
                url: post.find('div.inner > div.postbody > p.author > a > strong').parent().attr('href'),
                number: post.find('div.inner > div.postbody > p.author > a > strong:first').text().replace(/\D/g, '')
            },
            pronoun: 'N/A',
            votes: {}
        };
        if (!this.voteTags.filled) {
            for (const category in this.voteTags.votePairs) {
                if (this.voteTags.votePairs[category].vote) this.voteTags.votes.push(this.voteTags.votePairs[category].vote);
                if (this.voteTags.votePairs[category].unvote) this.voteTags.unvotes.push(this.voteTags.votePairs[category].unvote);
                this.voteTags.total = [].concat(this.voteTags.votes, this.voteTags.unvotes);
            }
            this.voteTags.filled = true;
        }
        post.find('div.inner > div.postbody > div.content:first').each((i, e) => {
            $(e).find('blockquote').each((i, e) => $(e).remove());
            $(e).find('span.bbvote, span.noboldsig').each((i, e) => {
                let vote = $(e).text();
                if (vote) {
                    let detachedVote = detachVoteTag(vote, this.voteTags.total);
                    if (detachedVote) {
                        let { tag, content } = detachedVote;
                        for (const voteCategory in this.voteTags.votePairs) {
                            if (tag === this.voteTags.votePairs[voteCategory].vote) {
                                voteData.votes[voteCategory] = { vote: content };
                            } else if (tag === this.voteTags.votePairs[voteCategory].unvote) {
                                voteData.votes[voteCategory] = null;
                            }
                        }
                    }
                }
            });
        });
        let result = !!Object.keys(voteData.votes).length ? voteData : null;
        return result;
    }
}

async function getHTML(url) {
    const res = await fetch(url);
    const content = await res.text();
    return content;
}


/**
 * 
 * @param {*} url 
 */
async function getDataFromThread(urlLink, progress = (e) => { console.log(e) }) {
    let url = new URL(urlLink);
    let completed = false;
    let votesList = {};
    const response = await scrapeCore.readHTML(urlLink);
    let voteCountSettings = getVoteSettings(response);

    console.log('Thread Scraping Started');

    while (!completed) {
        let currentURL = url.getNextUrlAndIndent();
        let html = await scrapeCore.readHTML(currentURL);
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
        progress(lastPageData);
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

    for (const voteType in votes) {
        if (!voteCount[voteType])
            voteCount[voteType] = {};

        for (const author in votes[voteType]) {
            const values = votes[voteType][author][voteType];
            if (values !== null) {
                let { vote, post, url } = values;
                const result = { author, vote, post, url };
                voteCount[voteType][author] = result;
            }
        }
    }
    return { voteCount: voteCount, unknownVotes, settings: settings.data };
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
        voteCount[voteData.author] = author;
    });
    return { voteCount: voteCount };
}

function getPostContent($, post) {
    return post.find('div.inner > div.postbody > div.content')
}

/**
 * 
 * @param {*} $ Cheerio object
 * @param {*} post HTML element containing post
 * @param {*} settings VC Settings
 * @param {*} urlLink URL to the page.
 */
function getVotesFromPost($, post, settings, urlLink) {
    const authorName = post.find('.inner > .postprofilecontainer > .postprofile > dt > a');
    const postNumber = post.find('div.inner > div.postbody > p.author > a > strong:parent').attr('href');
    const postUrl = post.find('div.inner > div.postbody > p.author > a > strong:first').text().replace(/\D/g, '');

    console.log({ authorName, postNumber, postUrl });

    let talliedVotes = {},
        votePairs = { reg: { id: 0, vote: 'VOTE: ', unvote: 'UNVOTE: ' } },//settings.data.votes;
        voteTags = [],
        unvoteTags = [];
    for (const property in votePairs) {
        if (votePairs[property].vote)
            voteTags.push(votePairs[property].vote);
        if (votePairs[property].unvote)
            unvoteTags.push(votePairs[property].unvote);
    }


    // post.find("div.inner > div.postbody > div.content").first().each((index, element) => {
    //     $(element).find("blockquote").each((i, e) => $(e).remove());
    //     $(element).find("span.bbvote, span.noboldsig").each((i, el) => {
    //         let vote = $(el).text();
    //         if (vote) {
    //             let detachedVote = detachVoteTag(vote, totalVotes);
    //             if (detachedVote) {
    //                 let { tag, content } = detachedVote;

    //                 for (let i = 0; i < votes.length; i++) {
    //                     if (tag === votes[i].vote) {
    //                         talliedVotes[votes[i].id] = { vote: content, post: postNumber, url: postUrl };
    //                         break;
    //                     }
    //                 }
    //                 for (let i = 0; i < unvotes.length; i++) {
    //                     if (tag === unvotes[i].vote) {
    //                         talliedVotes[unvotes[i].id] = null;
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // });

    // const resultObject = {
    //     author: authorName ? authorName : null,
    //     pronoun: 'N/A',
    //     post: { num: postNumber ? postNumber : null, url: postUrl },
    //     votes: talliedVotes ? talliedVotes : null,
    // }
    return null;// resultObject;
}

function detachVoteTag(vote, allVotes) {
    for (const voteTag of allVotes) {
        if (vote.startsWith(voteTag)) {
            const result = { tag: voteTag, content: vote.substring(voteTag.length) };
            return result;
        }
    }
    return null;
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
    getVoteSettingsFromUrl,

    scrapeThread: (url, progress = (e) => console.log(e)) => {
        return new Thread(url).init(progress);
    }
}