const request = require("request");
const cheerio = require("cheerio");

const testURL = "https://forum.mafiascum.net/viewtopic.php?f=50&t=84085";

class PageInfo {
    constructor(num, header, linkToNext) {
        this.num = num;
        this.header = header;
        this.linkToNext = linkToNext;
    }
}



function maxPages(site) {
    allPages = [];
}

// var finalPage = false;

// var array = [];
// while (!finalPage) {
//     var i = scrapeLink(testURL);
//     array[i.pageNum] = i;
// }
