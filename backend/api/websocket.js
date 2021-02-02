const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    console.log("Middleware");
    req.testing = 'testing';
    return next();
});
router.get('/', (req, res, next) => {
    console.log('Get Route', req.testing);
    res.end();
});

// router.ws('/', (ws, req) => {
//     ws.on('message', (msg) => {
//         console.log(msg);
//         return false;
//     });
//     console.log('socket', req.testing);
//     return false;
// });

module.exports = router;