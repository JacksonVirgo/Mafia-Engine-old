const { count } = require('console');
const express = require('express');
const upload = require('express-fileupload');
const { createReadStream } = require('fs');
const router = express.Router();

const Tools = require('../../util/toolReference');

router.use(upload());

router.route('/ping')
    .get((req, res) => {
        res.send("Pong");
    });
router.get('/replacement/:thread', async (req, res) => {
    console.log(req.params);
    let rawURL = req.params.thread;
    const processedURL = decodeURIComponent(rawURL);
    let replacement = await Tools.Replacement.getReplacementTest(processedURL);
    res.send(replacement);
});
router.get('/votecount/:thread', async (req, res) => {
    let votes = await countVotes(req, res);
    res.send(votes);
})
router.get('/votecount/format/:thread', async (req, res) => {
    let votes = await countVotes(req, res);
    let format = parseVotes(votes);
    res.send(format);
});
router.route('/rand')
    .post((req, res) => {
        let result = { status: 'ERR', data: 'POST did not contain a file.' };
        if (req.files) {
            let data = JSON.parse(req.files.data.data.toString('ascii'));
            result = { status: 'OK', data: data };
        }
        res.send(result);
    });


async function countVotes(req, res) {
    let rawURL = req.params.thread;
    const processedURL = decodeURIComponent(rawURL);
    let voteCountData = await Tools.VoteCount.getDataFromThread(processedURL);
    return voteCountData;
}

function parseVotes(voteData) {
    let result = "[area=Vote Count]";
    let votes = voteData.voteCount;
    let unknownVotes = voteData.unknownVotes;
    let voteCount = {};
    for (const author in votes) {
        let voteRef = votes[author].vote;
        if (!voteCount[voteRef]) voteCount[voteRef] = [];
        voteCount[voteRef].push(votes[author]);
    }
    for (const player in voteCount) {
        let playerName = `[b]${player} (${voteCount[player].length})[/b] - `;
        for (const vote of voteCount[player]) {
            playerName += `${vote.author} ([url=${vote.url}]${vote.post}[/url]), `;
        }
        playerName += '\n';
        result += playerName;
    }
    result += "[/area]";
    console.log(unknownVotes);
    if (unknownVotes.length > 0) {
        let tmp = '[area=Unknown Votes]'
        for (let i = 0; i < unknownVotes.length; i++) {
            tmp += `[b]${unknownVotes[i].author}[/b] voted for ${unknownVotes[i].vote}`;
        }
        tmp += 'Please make sure that you are using their full username when voting\n[/area]';
        result += tmp;
    }
    console.log(result);
    return { data: result };
}

module.exports = router;