const { fetch, cheerio } = require('./scrapeCore');

const localStorage = {}

async function getVotesForPage(url) {
    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);
    let voteCount = {};
    $("div.post > div.inner").each((i, el) => {
        let vote = $(el).find('div.postbody > div.content > span.bbvote').first().text();
        let author = $(el).find("div.postprofilecontainer > dl.postprofile > dt > a").first().text();    
        if (vote && author) {
            voteCount[author] = vote;
        }
    });
    return voteCount;
}

async function getPageURLs(url, socket) {
    let completed = false;
    let urls = [url];
    let currentURL = url;

    let linkBase = "https://forum.mafiascum.net";

    while (!completed) {
        console.log("Boop");
        const response = await fetch(currentURL);
        const content = await response.text();
        const $ = cheerio.load(content);

        let link = $("#viewtopic > fieldset.display-options > a.right-box").attr('href');
        if (link === undefined) {
            completed = true;
        } else {
            let generatedLink = linkBase + link.substring(1);
            console.log(generatedLink);
            currentURL = generatedLink;
            urls.push(generatedLink);

        }
    }
    return urls;
}

async function getVotesFromAndAfterURL(url) {
    let urls = getPageURLs(url);
    let voteCount = {};
    for (let i = 0; i < (await urls).length; i++) {
        let votes = getVotesForPage(urls[i]);
        console.log(votes);
        voteCount = Object.assign(voteCount, votes);
    }
    console.log(voteCount);
}

module.exports = {
    getVotesForPage: getVotesForPage,
    getPageURLs: getPageURLs
}