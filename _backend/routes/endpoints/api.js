const express = require('express');
const path = require('path');
const Tools = require('../../util/toolReference');

const { REPL_MODE_SLOPPY } = require('repl');
const router = express.Router();
const generateAvi = require('../../api/generateAvatar/generateAvatar');

router.use((req, res, next) => next());
router.get('/defaults', (req, res) => {
    res.status(200).send({filled: "false"})
});

router.get('/replacement/:thread', async (req, res) => {
    let rawURL = req.params.thread;
    const processedURL = decodeURIComponent(rawURL);
    let replacement = await Tools.Replacement.getReplacementTest(processedURL);
    res.send(replacement);
});

module.exports = router;