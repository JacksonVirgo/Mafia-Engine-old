const express = require('express');
const router = express.Router();

//app.use(express.static("_frontend"));
router.use(express.json());
router.use(express.static("_frontend"));

router.use('/tool', require('./endpoints/tools'));
router.use('/api', require('./endpoints/api'));
router.use('/download', require('./endpoints/download'));
module.exports = router;