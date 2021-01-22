const { fetch, cheerio } = require('./scrapeCore');
const Timer = require('../../util/Timer');

let hrstart = process.hrtime();
const localStorage = {}

class Vote {
    constructor(author, pronoun=null, vote=null) {
        this.author = author;
        this.pronoun = pronoun;
        this.vote = vote;
        Vote.list.push(this);
    }
    setVote(vote) {
        this.vote = vote;
    }
    asJSON() {
        return {
            author: this.author,
            pronoun: this.pronoun,
            vote: this.vote
        }
    }
}
Vote.list = [];
Vote.getList = () => {
    let result = [];
    for (const val of Vote.list) {
        result.push(val.asJSON());
    }
    return result;
}

const time = {
    pull: 0,
    scrape: 0
}

async function getVotesForPage(url) {
    Timer.timeStart("getVotes");
    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);
    time.pull += Timer.timeEndSeconds("getVotes");

    Timer.timeStart("getParse");
    let voteCount = {};
    $("div.post > div.inner").each((i, el) => {
        let vote = $(el).find('div.postbody > div.content > span.bbvote').first().text();
        let author = $(el).find("div.postprofilecontainer > dl.postprofile > dt > a").first().text();    
        let pronoun = "";
        if (vote && author) {
            new Vote(author, pronoun, vote);
        }
    });
    time.scrape += Timer.timeEndSeconds("getParse");
    return voteCount;
}

async function getPageURLs(url, socket) {
    Timer.timeStart("getURLs");
    let completed = false;
    let urls = [parseURL(url)];
    let currentURL = urls[0];
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
                let url = parseURL(attachLink($(e).attr("href")));
                urls.push(url);
                console.log(aTag);
            }
        });
        currentURL = urls[urls.length - 1];
        let currentIndex = parseInt($(".pagination > span > strong").first().text());
        let lastLink = parseInt($(".pagination > span > a").last().text());
        if (!(isNaN(currentIndex) || isNaN(lastLink))) {
            completed = currentIndex > lastLink;
        }
    }
    time.grabURLS = Timer.timeEndSeconds('getURLs');
    return urls;
}

async function getVotesFromThread(urlList, socket) {
    Timer.timeStart("Votecount");
    let urls = await getPageURLs(urlList);
    //let voteCount = {};
    for (const currentURL of urls) {
        let votes = await getVotesForPage(currentURL)
        console.log(votes);
        //voteCount = Object.assign(voteCount, votes);
    }
    socket.emit('scrapeVotecount', { voteCount: Vote.getList() });
    time.total = Timer.timeEndSeconds("Votecount");
//    console.log(voteCount);

    console.log(Vote.getList());
    console.log(time);
}

function parseURL(url) {
    return url + "&ppp=200";
}

module.exports = {
    getVotesForPage,
    getPageURLs,
    getVotesFromThread
}