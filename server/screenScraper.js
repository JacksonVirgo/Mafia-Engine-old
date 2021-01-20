const fetch = require('node-fetch');
const cheerio = require("cheerio")

async function getReplacement(url, socket) {
    console.log(url);
    console.log("https://forum.mafiascum.net/viewtopic.php?f=2&t=85512");
    const response = await fetch(url);
    const content = await response.text();
    const $ = cheerio.load(content);

    console.log(content);

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

    socket.emit("scrapeReplacement", webData);
}

module.exports = {
    getReplacement
};