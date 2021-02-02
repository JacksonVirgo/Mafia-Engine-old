const scrapeCore = require('./scrapeCore');
const cheerio = require('cheerio');

async function getReplacementCore(url) {
    const html = await scrapeCore.readHTML(url);
    const $ = cheerio.load(html);

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

async function getReplacementFromUrl(url) {
    let replacement = await getReplacementCore(url);
    return replacement;
}

async function getReplacement(url, socket) {
    let replacement = await getReplacementCore(url);
    socket.emit("scrapeReplacement", replacement);
}

async function getReplacementTest(url) {
    let replacement = await getReplacementCore(url);
    return replacement;
}

module.exports = {
    getReplacement,
    getReplacementFromUrl,
    getReplacementTest
}