const express = require('express');
const cors = require('cors');
const router = express.Router();
const scrapeReplacement = require('../tools/scrape/scrapeReplacement');
router.use(cors());
router.get('ping', (req, res) => res.send("pong"));
router.get('/replacement/:thread', async (req, res) => {
    console.log(req.params);
    let rawURL = req.params.thread;
    const processedURL = decodeURIComponent(rawURL);
    let replacement = await scrapeReplacement.getReplacementTest(processedURL);
    res.send(replacement);
});

router.use('/ws', require('./websocket'));

module.exports = router;