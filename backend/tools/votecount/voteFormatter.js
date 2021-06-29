const usernameCorrection = require('../formatting/usernameCorrection');

function cleanVoteCountData(threadData, settingsVal, additionalSettings = { toPost: null }) {
    const fromPost = settingsVal.days[settingsVal.days.length - 1];
    const toPost = additionalSettings.toPost;
    const slotVotes = {};
    const livingPlayers = [];
    for (const player of settingsVal.players) {
        const isDead = settingsVal.dead.includes(player);
        if (!isDead) livingPlayers.push(player);
        if (isDead) {
            if (fromPost !== null) {
                if (settingsVal.deadPost[player] > fromPost) livingPlayers.push(player);
            }
        }
    }
    for (const page in threadData) {
        const pageData = threadData[page];
        pageData.posts = pageData.posts.filter((val) => {
            const isFromPost = fromPost ? val.information.postNumber >= fromPost : true;
            const isToPost = toPost ? val.information.postNumber <= toPost : true;
            const slot = settingsVal.slotReference[val.information.author];
            const isAlive = livingPlayers.includes(slot);
            return isFromPost && isToPost && isAlive;
        });
        for (const postData of pageData.posts) {
            const { votes, information, settings } = postData;

            let currentVote;
            let currentVoteUnvote = false;

            for (const vote of votes) {
                if (!vote) {
                    currentVote = null;
                    currentVoteUnvote = true;
                } else {
                    const correction = usernameCorrection(vote, settingsVal.totalplayers);
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

            const author = information.author;
            const hasReference = settingsVal.slotReference[author];
            slotVotes[hasReference ? hasReference : author] = { vote: currentVote, post: information.postNumber };
        }
    }
    return {
        slotVotes,
        data: {
            livingPlayers,
        },
    };
}

function formatVoteCount(threadData, settingsVal) {
    const { slotVotes: cleanedData, data } = cleanVoteCountData(threadData, settingsVal);
    const wagons = formatWagons(cleanedData, settingsVal, data);
    let voteCount = `[area=VC]${wagons}\n[/area]`;
    return voteCount;
}

function formatWagons(voteData, settings, data) {
    const wagons = {};
    const { livingPlayers } = data;
    let result = '';
    let notVoting = livingPlayers;
    const unvotes = [];

    console.log('Deadline', settings.deadline);

    const sortByPostOrder = (a, b) => a.postNumber - b.postNumber;

    for (const author in voteData) {
        const { vote, post } = voteData[author];
        const voteObject = { author, post };
        if (voteObject.author) {
            if (!wagons[vote]) wagons[vote] = [];
            wagons[vote].push(voteObject);
        } else unvotes.push(voteObject);

        notVoting = notVoting.filter((val) => val !== author);
    }

    for (const wagon in wagons) {
        wagons[wagon].sort(sortByPostOrder);
        let wagonStr = `[b]${wagon} (${wagons[wagon].length}) ->[/b] ${wagons[wagon].map((v, i) => {
            return `${i > 0 ? ' ' : ''}${v.author}`;
        })}\n`;
        result += wagonStr;
    }

    unvotes.sort(sortByPostOrder);
    notVoting = [].concat(notVoting, unvotes);

    if (notVoting.length > -5) {
        let notVotingStr = `\n[b]Not Voting (${notVoting.length}) ->[/b] ${notVoting.map((v, i) => {
            return `${i > 0 ? ' ' : ''}${typeof v === 'object' ? v.author : v}`;
        })}`;
        result += notVotingStr;
    }

    result += `\nWith ${livingPlayers.length} players alive it takes ${Math.ceil(livingPlayers.length / 2)} to eliminate.`;
    if (settings.deadline) result += `\n[b]Deadline:[/b] ${settings.deadline}`;
    return result;
}

module.exports = {
    formatVoteCount,
};
