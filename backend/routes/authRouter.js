const express = require('express');
const Router = express.Router();
const authManager = require('../util/authManager');

const responses = require('./responseList');
const UserSchema = require('../database/models/UserSchema');
const GameSchema = require('../database/models/GameSchema');

Router.route('/register').post(async (req, res) => {
	const { username, password } = req.body;
	const hashedPassword = await authManager.hashPassword(password);

	const body = { username, password: hashedPassword };
	let schemaValidation = UserSchema.validate.validate(body);
	if (schemaValidation.error) return res.status(400).json({ message: responses.INVALID_PARAMS });

	const savedUser = await UserSchema.schema.findOne({ username });
	if (savedUser) return res.status(409).json({ message: responses.USER_EXISTS });

	const securityToken = authManager.generateSecurityToken(6);
	body.securityToken = authManager.generateJWT(securityToken);

	const createdUser = new UserSchema.schema(body);
	const createdGame = new GameSchema.schema({
		title: 'Open Game',
		moderators: ['JacksonVirgo', 'Noraa'],
		players: ['Cook', 'Rannygazoo', 'OopsieDaisy', 'Elements', 'Saudade', 'Firebringer', 'Shigaraki', 'Son of a Shephard', 'NoPowerOverMe', 'DeathNote', 'Luca Blight', 'Datisi', 'Salsabil Faria'],
		threadURL: 'https://forum.mafiascum.net/viewtopic.php?f=2&t=85772',
	});
	try {
		const savedUser = await createdUser.save();
		const savedGame = await createdGame.save();

		savedUser.games = savedGame._id;
		savedUser.save();
		return res.status(201).send(savedUser.securityToken);
	} catch (err) {
		console.log(err);
		return res.status(500).send();
	}
});
Router.route('/login').post(async (req, res) => {
	const { username, password } = req.body;
	const user = await UserSchema.schema.findOne({ username });
	if (!user) return res.status(404).send();
	try {
		const validPassword = await authManager.checkPassword(password, user.password);
		if (!validPassword) return res.status(401).send();
		let accessToken = await authManager.generateJWT({ _id: user._id, username: user.username });
		res.status(200).json({ token: accessToken });
	} catch (err) {
		console.log(err);
		return res.status(500).send();
	}
});
Router.post('/:id', async (req, res) => {});

module.exports = Router;
