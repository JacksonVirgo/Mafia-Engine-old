const fetch = require('node-fetch');
const cheerio = require("cheerio")

async function getReplacementCore(url) {
    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);
    let title = $("h2 > a").text();
    let author = $('.postprofilecontainer > dl > dt > a').eq(0).text(); 
    let currentPage = $(".pagination > input").eq(0).val();
    let lastPage = $(".pagination > span > a").last().text();

    let webData = {
        title,
        author,
        currentPage,
        lastPage,
        url
    }

    return webData;

}

async function getReplacement(url, socket) {
    let replacement = await getReplacementCore(url, socket);
    socket.emit("scrapeReplacement", replacement);
}

async function getVotesForPage(url, socket) {
    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);

    let voteCount = {};
    $(".post > .inner").each((i, el) => {
        $(el).find(".postbody > .content > .bbvote").each((index, element) => {
            let vote = $(element).text();
            let author = $(el).find(".postprofilecontainer > .postprofile > dt > a").first().text();
            voteCount[author] = vote;
        })
    });
    return voteCount;
}

async function getVotesForThread(url) {
    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);

    $(".pagination").first().find("span > a").each((i, el) => {

    });
}

module.exports = {
    getReplacement,
    getVotes: getVotesForPage
};