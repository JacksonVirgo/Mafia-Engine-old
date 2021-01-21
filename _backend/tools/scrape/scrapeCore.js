const fetch = require('node-fetch');
const cheerio = require("cheerio")

async function getHTML(url) {
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

module.exports = { getHTML, getQuery, getQueryFromURL, cheerio, fetch };