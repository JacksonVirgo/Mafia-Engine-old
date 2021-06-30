const scrapeCore = require('../../screenscraping/scrapeCore');
const cheerio = require('cheerio');
const urlManager = require('../../util/url');
const DEFAULTS = {
    voteTags: ['VOTE: '],
    unvoteTags: ['UNVOTE: '],
    settingSelectors: ['Spoiler: VoteCount Settings'],
};

/**
 * Gets all relevant data from a single thread.
 * Loops over each page until there is no more after that page.
 * @param {*} $ Cheerio object
 */
async function getThreadDataFromURL(baseURL) {
    let url = new URL(baseURL.split('#')[0]);
    let urlParams = url.searchParams;

    let isThread = urlParams.has('t');
    let isPost = urlParams.has('p');
    urlParams.set('ppp', 200);
    urlParams.set('start', 0);

    let currentIndent = 0;
    const scrapedPages = {};

    let completedLastPage = false;

    let threadSettings = [];

    while (!completedLastPage) {
        const convertedURL = url.toString();
        const html = await scrapeCore.getHTML(convertedURL);
        const $ = cheerio.load(html);

        if (isPost) {
            console.log('URL Linked to Post');
            const threadURL = $('#page-body > h2 > a').first().attr('href');
            console.log(threadURL);
            if (threadURL) {
                const newParams = new URLSearchParams(threadURL.split('?')[1].split('#')[0]);
                urlParams.set('t', newParams.get('t'));
                urlParams.delete('p');

                isPost = false;
                isThread = true;
                completedLastPage = false;
            } else {
                completedLastPage = true;
            }
        } else if (isThread) {
            const pageData = getPageData($);
            const { pageIndex, posts, settings } = pageData;
            const { lastPage, currentPage, currentURL } = pageIndex;
            scrapedPages[currentPage] = pageData;

            if (settings.length >= 1) {
                threadSettings = [].concat(threadSettings, settings);
            }

            currentIndent += 200;
            urlParams.set('start', currentIndent);

            completedLastPage = lastPage <= currentPage;
        }
    }

    threadSettings = threadSettings.filter((val) => val.information.postNumber === '0');
    return { scrapedPages, settings: threadSettings };
}

/**
 * Get all relevant data from a single page.
 * @param {*} $ Cheerio object
 */
function getPageData($) {
    const pageIndex = getPageIndex($);
    const posts = [];
    const settingsArray = [];

    $('div.post').each((i, e) => {
        const { postData, settings } = getPostData($, $(e));
        const containsVote = postData.votes.length > 0;
        if (containsVote) posts.push(postData);
        if (settings) settingsArray.push({ information: postData.information, settings });
    });

    return { pageIndex, posts, settings: settingsArray };
}

/**
 * Get all possible information from a single post.
 * @param {*} $ Cheerio object of the web page
 * @param {*} post Cheerio object of the exact post
 * @returns
 */
function getPostData($, post) {
    const postData = {
        votes: [],
        information: {},
        settings: {},
    };
    let settings = null;
    postData.information.author = post.find('.inner > .postprofilecontainer > .postprofile > dt > a').text();
    postData.information.postNumber = post.find('div.inner > div.postbody > p.author > a > strong:first').text().replace(/\D/g, '');
    postData.information.url = post.find('div.inner > div.postbody > p.author > a > strong').parent().attr('href');

    post.find('div.inner > div.postbody > div.content:first').each((i, e) => {
        $(e)
            .find('blockquote, quotecontent')
            .each((i, e) => $(e).remove());

        $(e)
            .find('div.quotetitle')
            .each((i, e) => {
                let parent = $(e).parent();
                let handle = $(e).find('b').first().text();
                let content = parent.find('div.quotecontent').first().find('div').first();
                if (DEFAULTS.settingSelectors.includes(handle)) {
                    if (settings == null) settings = {};
                    content.find('span').each((i, e) => {
                        let totalString = $(e).text();
                        let command = totalString.split('=');
                        settings[command[0]] = command[1];
                    });
                }
            });

        $(e)
            .find('span.bbvote, span.noboldsig')
            .each((i, e) => {
                const { voteTags, unvoteTags } = DEFAULTS;
                let vote = parseVoteTag($(e).text(), [].concat(voteTags, unvoteTags));
                if (!vote) return;
                const { tag, content } = vote;
                let isUnvote = unvoteTags.includes(tag);
                if (isUnvote || voteTags.includes(tag)) postData.votes.push(isUnvote ? null : content);
            });
    });

    return { postData, settings };
}

function parseVoteTag(vote, voteTags) {
    if (!vote) return null;
    for (const voteTag of voteTags) {
        if (vote.startsWith(voteTag)) return { tag: voteTag, content: vote.substring(voteTag.length) };
    }
    return null;
}

function getPageIndex($) {
    const pagination = $('.pagination').first();
    const currentPage = pagination.find('strong').first();
    const currentPageNumber = parseInt(currentPage.text());
    const currentPageURL = $('h2 a').attr('href');
    let lastPage = currentPageNumber;
    if (pagination.find('span').length >= 1) {
        const lastLink = pagination.find('span > a').last();
        const lastLinkNumber = parseInt(lastLink.text());
        lastPage = lastPage > lastLinkNumber ? lastPage : lastLinkNumber;
    }

    return { lastPage, currentPage: currentPageNumber, currentURL: currentPageURL };
}

module.exports = {
    getThreadDataFromURL,
};
