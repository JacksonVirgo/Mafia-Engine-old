const express = require('express');
const upload = require('express-fileupload');
const { createReadStream } = require('fs');
const router = express.Router();

const Tools = require('../../util/toolReference');

router.use(upload());

router.route('/ping/:response')
    .get((req, res) => {
        res.send(req.params);
    })
router.get('/replacement/:thread', async (req, res) => {
    console.log(req.params);
    let rawURL = req.params.thread;
    const processedURL = decodeURIComponent(rawURL);
    let replacement = await Tools.Replacement.getReplacementTest(processedURL);
    res.send(replacement);
});
router.get('/votecount/:thread', async (req, res) => {
    let rawURL = req.params.thread;
    const processedURL = decodeURIComponent(rawURL);
    let voteCountData = await Tools.VoteCount.getDataFromThread(processedURL);
    res.send(voteCountData);
})
router.route('/rand')
    .post((req, res) => {
        let result = { status: 'ERR', data: 'POST did not contain a file.' };
        if (req.files) {
            let data = JSON.parse(req.files.data.data.toString('ascii'));
            result = { status: 'OK', data: data };
        }
        res.send(result);
    });
module.exports = router;