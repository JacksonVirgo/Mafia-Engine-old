const express = require('express');
const path = require('path');
const router = express.Router();

const toolDirectory = path.join(__dirname, '../../data/download');

router.use((req, res, next) => next());
router.route("/mathblade")
    .get((req, res) => res.sendFile(`${toolDirectory}/mathblade/MathBlade_VoteCounter.zip`));
    
module.exports = router;