const express = require('express');
const cors = require('cors');
const path = require('path');
const router = express.Router();

const r = require('../../frontend');
router.use(cors());
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

if (process.env.running === 'production') {
    router.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'build')));
    router.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'build', 'index.html'));
    });
}

module.exports = {
    router,
    attach: (exp) => exp.use('/api', router),
};
