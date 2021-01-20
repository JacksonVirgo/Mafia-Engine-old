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
    socket.emit("scrapeReplacementPing", {});
    let replacement = await getReplacementCore(url, socket);
    socket.emit("scrapeReplacement", replacement);
}

async function getVotesForPage(url, socket) {
    console.log(url);

    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);

    let array = await getAllPageLinks(url);
    console.log(array);

    let voteCount = {};
    $(".post > .inner").each((i, el) => {
        $(el).find(".postbody > .content > .bbvote").each((index, element) => {
            let vote = $(element).text();
            let author = $(el).find(".postprofilecontainer > .postprofile > dt > a").first().text();
            voteCount[author] = vote;
        });
    });
    return voteCount;
}

async function getAllPageLinks(url) {
    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);

    let nextLink = "";//$(".pagination").first().find("span > strong").first().nextAll().find("a").first().attr("href");
    return nextLink;
}

module.exports = {
    getReplacement,
    getVotes: getVotesForPage
};