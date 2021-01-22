const express = require('express');
const router = express.Router();

//app.use(express.static("_frontend"));
router.use(express.json());

router.use('/', express.static("_frontend"));
router.use('/files', express.static("_backend/data/files"));

router.use('/tool', require('./endpoints/tools'));
router.use('/api', require('./endpoints/api'));
router.use('/downloads', require('./endpoints/download'));

module.exports = router;