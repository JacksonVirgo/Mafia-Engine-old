const express = require('express');
const Router = express.Router();
const path = require('path');
const fs = require('fs');
Router.get('rolecard', async (req, res) => {
	res.sendFile(path.join(__dirname, '..', '..', 'old_frontend', 'tools', 'rolecard', 'rolecard.html'));
});
Router.get('ping', (req, res) => {
	res.status(200).json({ ping: 'pong' });
});
module.exports = Router;
