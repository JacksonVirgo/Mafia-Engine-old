const express = require('express');
const path = require('path');
const router = express.Router();

const toolDirectory = path.join(__dirname, "../../../_frontend/tools");

router.use((req, res, next) => next());
router.route("/rolecard")
    .get((req, res) => res.sendFile(`${toolDirectory}/rolecard/rolecard.html`));

    router.route("/replacement")
    .get((req, res) => res.sendFile(`${toolDirectory}/replacement/replacement.html`));
router.route("/votecount")
    .get((req, res) => res.sendFile(`${toolDirectory}/votecount/votecount.html`));
router.route("/nightactions")
    .get((req, res) => res.sendFile(`${toolDirectory}/nightactions/nightactions.html`));
    
module.exports = router;