const { fetch, cheerio } = require('./scrapeCore');

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

module.exports = {
    getReplacement
}