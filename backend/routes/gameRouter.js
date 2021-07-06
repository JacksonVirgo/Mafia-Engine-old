const express = require('express');
const Router = express.Router();
const { authenticateToken } = require('../util/authManager');
const UserSchema = require('../database/models/UserSchema');
const GameSchema = require('../database/models/GameSchema');

function getGameValues({ _id, moderators, players, threadURL, title }) {
	return { _id, moderators, players, threadURL, title };
}

Router.route('/create', authenticateToken, async (req, res) => {
	const { _id, username } = req.user;
	const { title, moderators, players, threadURL } = req.body;
	const body = { title, moderators, players, threadURL };

	res.status(201).send();
});

Router.route('/').get(authenticateToken, async (req, res) => {
	const { _id, username } = req.user;
	const user = await UserSchema.schema.findOne({ _id, username });
	if (!user) return res.status(409).send();

	const game = await GameSchema.schema.findOne({ _id: user.games });
	if (!game) return res.status(404).send();

	const requestedData = getGameValues(game);
	res.status(200).json(requestedData);
});
Router.route('/:id').put(authenticateToken, async (req, res) => {
	const { _id, username } = req.user;
	const { title, thread, players } = req.body;

	const user = await UserSchema.schema.findOne({ _id, username });
	if (!user) return res.status(409).send();

	let game = await GameSchema.schema.findOne({ _id: user.games });
	if (!game) return res.status(404).send();

	if (thread) game.threadURL = thread;
	if (players) game.players = players;
	if (title) game.title = title;

	try {
		const savedGame = await game.save();
		const requestedData = getGameValues(savedGame);
		return res.status(200).json(requestedData);
	} catch (err) {
		console.log(err);
		return res.status(500).send();
	}
});

module.exports = Router;
