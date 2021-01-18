const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');

class PageInfo {
    constructor(site, link) {
        this.site = site;
        this.link = link;
        this.html = null;
    }
    setHTML(html) {
        this.html = html;
    }
}

class ScreenSraper {
    constructor() {}
    retrievePage(link) {
        request(link, (err, res, html) => {
            if (!err && res.statusCode == 200) {
                return html;
            } else {
                return null;
            }
        });
    }
}

module.exports = new ScreenSraper();