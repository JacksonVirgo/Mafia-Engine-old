const fetch = require('node-fetch');
const http = require('http');

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

async function checkSiteAvailability(url) {
    const html = await readHTML(url);
    let exists = !!html;
    console.log(exists);
    return exists;
}

module.exports = { readHTML, checkSiteAvailability };