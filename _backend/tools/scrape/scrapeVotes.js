const scrapeCore = require('./scrapeCore');
const cheerio = require('cheerio');
const Timer = require('../../util/Timer');
const StringUtil = require('../../util/stringUtil');

const Vote = require('./classes/vote');
const URL = require('./classes/url');
const Settings = require('./classes/settings');

const time = {
    fetch: 0,
    scrape: 0,
    settings: 0,
    thread: 0
}

/**
 * 
 * @param {*} url 
 */
async function getDataFromThread(urlLink) {
    Timer.timeStart("dataThread");
    let url = new URL(urlLink);
    let indent = 0;
    let completed = false;
    let urlArray = [];
    let voteArray = [];

    let finalVoteCount = {};

    let voteCountSettings = null;

    while (!completed) {
        let currentURL = url.urlFromPost(indent);
        console.log(currentURL);
        urlArray.push(currentURL);
        Timer.timeStart("fetch");
        let html = await scrapeCore.readHTML(currentURL);
        time.fetch += Timer.timeEndSeconds("fetch");

        if (indent === 0) {
            voteCountSettings = getVoteSettings(html);
        }

        let webData = getDataFromPage(html);
        voteArray.push(webData.data);
        finalVoteCount = Object.assign(finalVoteCount, webData.data);

        let isCompleted = Math.floor(indent / url.ppp) + 1 === webData.last;
        if (isCompleted) completed = true;
        else indent += url.ppp;

        if (Math.floor(indent / url.ppp) + 1 === webData.last) {
            completed = true;
        } else {
            indent += url.ppp;
        }
    }

    console.log("-- FINAL VOTE COUNT --");
    console.log(finalVoteCount);

    let voteCount = {};
    for (let i = 0; i < voteArray.length; i++) {
        for (let j = 0; j < voteArray[i].length; j++) {
            let array = voteArray[i][j];
            voteCount[array.author] = array.vote;
        }
    }
    console.log(voteCount);
    time.thread += Timer.timeEndSeconds("dataThread");
    console.log(time);

    return voteCount;
}

/**
 * 
 * @param {*} html 
 */
function getDataFromPage(html) {
    Timer.timeStart("getData");
    const $ = cheerio.load(html);
    
    let current = parseInt($(".pagination > span > strong").first().text());
    let lastA = parseInt($(".pagination > span > a").last().text());
    let lastLink = (!isNaN(current) && !isNaN(lastA)) ? ((current > lastA) ? current : lastA) : null;

    let voteCount = {};
    $("div.post").each((i, el) => {
        let votes = getVotesFromPost($, $(el));
        voteCount = Object.assign(voteCount, votes);
    });
    time.scrape += Timer.timeEndSeconds("getData");
    return { data: voteCount, last: lastLink };
}

function getVotesFromPost($, post) {
    let voteList = {};
    let author = post.find("div.inner > div.postprofilecontainer > dl.postprofile > dt > a").first().text();
    post.find("div.inner > div.postbody > div.content").first().each((index, element) => { 
        $(element).find("span.bbvote, span.noboldsig").each((i, el) => {
            let possibleVote = $(el).text();
            if (possibleVote != undefined && isVote(possibleVote)) {
                voteList[author] = new Vote(author, null, removeVoteTag(possibleVote)).asJSON();
            }
        }); 
    });
    return voteList;
}

function isVote(vote) {
    let isVote = false;
    let voteHandles = [ "VOTE: ", "UNVOTE: ", "/vote ", "/unvote " ];
    for (const handle of voteHandles) {
        if (vote.startsWith(handle)) 
            isVote = true;
    }
    return isVote;
}

function removeVoteTag(text) {
    let voteHandles = [ "VOTE: ", "/vote " ];
    for (const handle of voteHandles) {
        if (text.startsWith(handle))
            return text.substring(handle.length);
    }
    return text;
}

function getVoteSettings(html) {
    Timer.timeStart("getSettings");

    const $ = cheerio.load(html);
    let settingsGroup = null;
    let voteCountSelector = "Spoiler: VoteCount Settings";

    let noSettings = true;

    console.log("Potato");

    let settings = new Settings();
    $("div.post").first().find("div.inner > div.postbody > div.content > div").each((index, element) => {
        $(element).find("div.quotetitle").each((index, element) => {
            let parent = $(element).parent();
            let handle = $(element).find("b").first().text();
            let content = parent.find("div.quotecontent").first().find("div").first();
            if (handle === voteCountSelector) {
                content.find("span").each((index, element) => {
                    let totalString = $(element).text();
                    let command = totalString.split("=");
                    settings.addSetting(command[0], command[1]);
                });              
            }
        });
        // let parent = $(element).parent();
        // let handle = $(element).find("b:first-child").text();
        // let content = parent.find("div.quotecontent:first-child > div:first-child");
        // content.each((index, element) => {
        //     $(element).find("div > span").each((index, element) => {
        //         let totalCommand = $(element).text();
        //         console.log(totalCommand);
        //     });
        // });
    });

    time.settings += Timer.timeEndSeconds("getSettings");
}

function parseURL(url) {
    return url + "&ppp=200";
}

module.exports = {
    getDataFromThread,
    getDataFromPage
}