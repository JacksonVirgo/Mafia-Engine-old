const express = require('express');
const path = require('path');
const router = express.Router();

//const fileControl = require('./fileController');

const fileDirectory = path.join(__dirname, '../../data/files/');

router.use((req, res, next) => next());

router.route('/:id')
    .get((req, res, next) => {
        let fileName = req.params.id;
        res.download(fileDirectory, fileName);
        next();
    });

module.exports = router;