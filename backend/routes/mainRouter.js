const express = require('express');
const Router = express.Router();

Router.use('/auth', require('./authRouter'));
Router.use('/game', require('./gameRouter'));
module.exports = Router;
