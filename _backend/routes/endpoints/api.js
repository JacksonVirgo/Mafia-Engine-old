const express = require('express');
const path = require('path');
const router = express.Router();

router.use((req, res, next) => next());
router.get('/defaults', (req, res) => {
    res.status(200).send({filled: "false"})
});

module.exports = router;