const express = require('express');
const fileupload = require('express-fileupload');
const router = express.Router();
const cors = require('cors');

//app.use(express.static("_frontend"));
router.use(express.json());
router.use(cors());

router.use('/', express.static("old_frontend"));
router.use('/files', express.static("_backend/data/files"));

router.use('/tool', require('./endpoints/tools'));
router.use('/api', require('./endpoints/api'));
router.use('/downloads', require('./endpoints/download'));

module.exports = router;