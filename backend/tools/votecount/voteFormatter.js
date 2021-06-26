const usernameCorrection = require('../formatting/usernameCorrection');

const defaultScrapeSettings = {
    fromPost: 2307,
    toPost: null,
};

function formatVoteCount(threadData, settingsVal, scrapeSettings = defaultScrapeSettings) {
    const { fromPost, toPost } = scrapeSettings;

    const slotVotes = {};

    for (const page in threadData) {
        const pageData = threadData[page];
        if (fromPost) pageData.posts = pageData.posts.filter((val) => val.information.postNumber >= fromPost);
        if (toPost) pageData.posts = pageData.posts.filter((val) => val.information.postNumber <= toPost);

        for (const postData of pageData.posts) {
            const { votes, information, settings } = postData;

            let currentVote;
            let currentVoteUnvote = false;

            for (const vote of votes) {
                if (!vote) {
                    currentVote = null;
                    currentVoteUnvote = true;
                } else {
                    const correction = usernameCorrection(vote, settingsVal.players);
                    for (const correctionType in correction) {
                        const mostAccurate = correction[correctionType][0];
                        if (mostAccurate.distance >= 0.8) {
                            currentVote = mostAccurate.result;
                            break;
                        }
                    }
                }

                if (currentVote || currentVoteUnvote) break;
            }

            const replacement = settingsVal.replacements[information.author];
            slotVotes[replacement ? replacement : information.author] = currentVote;
        }
    }

    console.log(slotVotes);
}

module.exports = {
    formatVoteCount,
};
