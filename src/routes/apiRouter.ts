import express from 'express';
import axios from 'axios';
import { Config } from '..';
const router = express.Router();
export default router;

router.get('/userdata', async (req, res): Promise<any> => {
	const { access_token } = req.query;
	if (!access_token) return res.status(400).json({ error: 'Invalid token/s' });

	const discordApi = (uri: string) => 'https://discord.com/api' + uri;
	const userDataURI = discordApi('/users/@me');
	const userGuildsURI = discordApi('/users/@me/guilds');
	const mafiaScumURI = discordApi('/users/@me/guilds/611331534389116942/member');
	const discordMafiaURI = discordApi('/users/@me/guilds/648663810772697089/member');

	const headers = { Authorization: `Bearer ${access_token}` };
	const rawUser = await axios.get(userDataURI, { headers });
	const rawGuilds = await axios.get(userGuildsURI, { headers });
	let rawMafiaScum = null,
		rawDiscordMafia = null;
	// const rawMafiaScum = await axios.get(mafiaScumURI, { headers });

	let hasMS: boolean = false;
	let hasDM: boolean = false;
	interface GuildData {
		id: string;
	}

	rawGuilds.data.forEach((value: GuildData) => {
		hasMS = hasMS || value.id == '611331534389116942';
		hasDM = hasDM || value.id == '648663810772697089';
	});

	if (hasDM) rawDiscordMafia = await axios.get(discordMafiaURI, { headers });
	if (hasMS) rawMafiaScum = await axios.get(mafiaScumURI, { headers });
	return res.status(200).json({
		data: {
			user: rawUser.data,
			guilds: rawGuilds.data,
			mafiascum: rawMafiaScum ? rawMafiaScum.data : null,
			discordmafia: rawDiscordMafia ? rawDiscordMafia.data : null,
		},
	});
});
router.get('/login', async (req, res) => {
	const { code } = req.query;
	if (!code) res.status(400).json({ error: 'No code provided.' });

	const loginResult = await axios.post('https://discord.com/api/oauth2/token', {
		client_id: '843514276383031296',
		client_secret: Config.discordAuthToken,
		grant_type: 'authorization_code',
		redirect_uri: 'http://localhost:3000',
		code: code,
	});

	if (!loginResult) return res.status(400).send();
	return res.status(200).json(loginResult.data);
});
