const request = require('request-promise');
const cheerio = require("cheerio")
const axios = require("axios");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

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
    scrapeReplacement(url, socket) {
        try {
            axios.get(url).then((res) => {
                const html = res.data;
                const $ = cheerio.load(html);
                let title = $("h2 > a").text();
                let author = $('.postprofilecontainer > dl > dt > a').eq(0).text(); 
                let currentPage = $(".pagination > input").eq(0).val();
                let lastPage = $(".pagination > span > a").last().text();

                const webData = {title, author, currentPage, lastPage, url};
                console.log(webData);

                socket.emit("scrapeReplacement", webData);
            });        
        } catch (err) {
            console.error(err);
        }
    }

    test() {
        (async () => {
            let siteData = [];
            const res = await request({
                uri: link,
                headers: {
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "en-US,en;q=0.9"
                },
                gzip: true
            }).catch(console.error);
            let $ = cheerio.load(res);
            let title = $("h2 > a").text();
            let author = $('.postprofilecontainer > dl > dt > a').eq(0).text(); 
            let currentPage = $(".pagination > input").eq(0).val();
            let lastPage = $(".pagination > span > a").last().text();
            siteData.push({ title, author, currentPage, lastPage });

            console.log(siteData);

            socket.emit("scrapeReplacement", {title, author, currentPage, lastPage});
        })()
    }
}

module.exports = new ScreenSraper();