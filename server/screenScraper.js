// const request = require("request");
// const cheerio = require("cheerio");

class PageInfo {
    constructor(site, link) {
        this.site = site;
        this.link = link;

        this.siteInformation = {};
    }
}

module.exports = PageInfo;