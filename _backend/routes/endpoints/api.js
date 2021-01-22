const express = require('express');
const path = require('path');
const router = express.Router();
const generateAvi = require('../../api/generateAvatar/generateAvatar');

router.use((req, res, next) => next());
router.get('/defaults', (req, res) => {
    res.status(200).send({filled: "false"})
});
module.exports = router;