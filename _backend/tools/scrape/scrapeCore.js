const fetch = require('node-fetch');

async function readHTML(url) {
    const response = await fetch(url);
    const content = await response.text();
    return content;
}

function getQuery(html) {
    return cheerio.load(html);
}

async function getQueryFromURL(url) {
    return getQuery(getHTML(url));
}

module.exports = { readHTML };