const scrapeCore = require('./scrapeCore');
const cheerio = require('cheerio');
const Timer = require('../../util/Timer');

const Vote = require('./classes/vote');
const URL = require('./classes/url');

const time = {
    fetch: 0,
    scrape: 0,
    thread: 0
}

/**
 * 
 * @param {*} url 
 */
async function getDataFromThread(urlLink) {
    Timer.timeStart("dataThread");
    let url = new URL(urlLink);
    let indent = 0;
    let completed = false;

    let urlArray = [];

    let voteArray = [];

    while (!completed) {
        let currentURL = url.urlFromPost(indent);
        console.log(currentURL);
        urlArray.push(currentURL);
        Timer.timeStart("fetch");
        let html = await scrapeCore.readHTML(currentURL);
        time.fetch += Timer.timeEndSeconds("fetch");
        let webData = getDataFromPage(html);
        
        voteArray.push(webData.data);

        if (Math.floor(indent / url.ppp) + 1 === webData.last) {
            completed = true;
        } else {
            indent += url.ppp;
        }
    }

    let voteCount = {};
    for (let i = 0; i < voteArray.length; i++) {
        for (let j = 0; j < voteArray[i].length; j++) {
            let array = voteArray[i][j];
            voteCount[array.author] = array.vote;
        }
    }
    console.log(voteCount);
    time.thread += Timer.timeEndSeconds("dataThread");
    console.log(time);

    return voteCount;
}

/**
 * 
 * @param {*} html 
 */
function getDataFromPage(html) {
    Timer.timeStart("getData");
    const $ = cheerio.load(html);
    
    let voteCount = [];

    let current = parseInt($(".pagination > span > strong").first().text());
    let lastA = parseInt($(".pagination > span > a").last().text());
    let lastLink = (!isNaN(current) && !isNaN(lastA)) ? ((current > lastA) ? current : lastA) : null;

    $("div.post > div.inner").each((i, el) => {
        let vote = $(el).find('div.postbody > div.content > span.bbvote').first().text();
        let author = $(el).find("div.postprofilecontainer > dl.postprofile > dt > a").first().text();    
        let pronoun = null;
        if (vote && author) {
            voteCount.push(new Vote(author, pronoun, vote).asJSON());
        }
    });

    time.scrape += Timer.timeEndSeconds("getData");
    return { data: voteCount, last: lastLink };
}

function parseURL(url) {
    return url + "&ppp=200";
}

module.exports = {
    getDataFromThread,
    getDataFromPage
}