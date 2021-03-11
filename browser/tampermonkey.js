// ==UserScript==
// @name        Mafia Engine
// @namespace   http://forum.mafiascum.net
// @author      JacksonVirgo
// @description Add integration from the Mafia Engine API into MafiaScum's website.
// @include     http://forum.mafiascum.net/*
// @grantnone
// @version     1.0.0
// ==/UserScript==
// --------------------
// Configurable parameters, you may change values here

const useAllForums = true,
    desiredForums = ["The Road to Rome", "New York", "Coney Island", "Theme Park", "Central Park", "Mayfair Club"];

function root() {
    let willRun = false;
    let threadUrl = $("h2").first().children("a").first().attr("href");
    let threadNumber = "";
    let i = threadUrl.search("&t=") + 3;
    var pageNumber = $(".pagination").find("strong").first().html();

    $(".icon-home > a").each((index, value) => {
        let label = $(this).html();
        for (let i = 0; !willRun && i < desiredForums.length; i++) {
            if (label == desiredForums[i]) {
                willrun = true;
            }
        }
    });
    if (!allForums && !willRun) return;
    while (!isNaN(threadUrl[i])) threadNumber += threadUrl[i++];
    $(".post").each((index, value) => {
        let childrenLng = $(this).children(".inner").first().children(".postprofile").length;
        let postId = $(this).attr("id").substring(1);

        if (childrenLng === 0) return;
    });
}

function actualThing() {
    //#region F
    var willRun = false;
    $(".icon-home > a").each(function (index, value) {
        var label = $(this).html();
        var i;
        for (i = 0; !willRun && i < desiredForums.length; i++) {
            if (label == desiredForums[i]) {
                willRun = true;
            }
        }
    });

    if (!allForums && !willRun) {
        return;
    }

    var threadURL = $("h2").first().children("a").first().attr("href");
    var threadNumber = "";
    var i = threadURL.search("&t=") + 3;
    while (!isNaN(threadURL[i])) {
        threadNumber += threadURL[i++];
    }
    //#endregion F
    var pageNumber = $(".pagination").find("strong").first().html();

    $(".post").each(function (index, value) {
        if ($(this).children(".inner").first().children(".postprofile").length === 0) {
            return;
        }

        var postID = $(this).attr("id").substring(1);
        var postNumber = (pageNumber - 1) * 25 + index;
        var authorLine = $(this).find(".author");
        var authorName = authorLine.find("strong").first().children("a").html();
        var authorString = authorLine.html();

        var insertIndex = authorString.search("</a>by") + 4;
        authorString = 'Post <a href="./viewtopic.php?p=' + postID + "#p" + postID + '"><strong>#' + postNumber + "</strong></a> " + authorString.substring(insertIndex, authorString.length);
        insertIndex = authorString.search("» ");
        authorString = authorString.substring(0, insertIndex) + ' (<a href="./search.php?t=' + threadNumber + "&author=" + authorName + '">ISO</a>)' + authorString.substring(insertIndex, authorString.length);
        authorLine.html(authorString);
    });
}

function loadScript(src, callback) {
    var s, r, t;
    r = false;
    s = document.createElement("script");
    s.type = "text/javascript";
    s.src = src;
    s.onload = s.onreadystatechange = function () {
        if (!r && (!this.readyState || this.readyState == "complete")) {
            r = true;
            callback();
        }
    };
    t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(s, t);
}

loadScript("//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js", actualThing);
