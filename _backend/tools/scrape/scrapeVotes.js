const { fetch, cheerio } = require('./scrapeCore');

const localStorage = {}

class VoteCount {
    constructor(threadURL) {
        this.threadURL = threadURL;

    }
    async parse() {
        let pages = [];
    }
}

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
    console.log("Start");
    let completed = false;
    let urls = [url];
    let currentURL = url;

    let linkBase = "https://forum.mafiascum.net";
    const attachLink = (link) => {
        return linkBase + link.substring(1);
    }

    while (!completed) {
        const response = await fetch(currentURL);
        const content = await response.text();
        const $ = cheerio.load(content);

        $(".pagination > span > a").each((i, e) => {
            let aTag = $(e).text();
            if (urls.length + 1 == aTag) {
                urls.push(attachLink($(e).attr("href")));
                console.log(aTag);
            }
        });
        currentURL = urls[urls.length - 1];
        let currentIndex = parseInt($(".pagination > span > strong").first().text());
        let lastLink = parseInt($(".pagination > span > a").last().text());
        if (!(isNaN(currentIndex) || isNaN(lastLink))) {
            completed = currentIndex > lastLink;
        }

        // let link = $("#viewtopic > fieldset.display-options > a.right-box").attr('href');
        // if (link === undefined) {
        //     completed = true;
        // } else {
        //     let generatedLink = linkBase + link.substring(1);
        //     currentURL = generatedLink;
        //     urls.push(generatedLink);

        // }
    }
    console.log(urls);
    return urls;
}

async function getVotesFromThread(urlList, socket) {
    console.time("VoteCount");
    let urls = await getPageURLs(urlList);
    let voteCount = {};
    for (const currentURL of urls) {
        let votes = await getVotesForPage(currentURL)
        console.log(votes);
        voteCount = Object.assign(voteCount, votes);
    }
    socket.emit('scrapeVotecount', {voteCount});
    console.log(voteCount);
    console.timeEnd("VoteCount");
}

module.exports = {
    getVotesForPage,
    getPageURLs,
    getVotesFromThread
}