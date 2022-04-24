"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const __1 = require("..");
const router = express_1.default.Router();
exports.default = router;
router.get('/userdata', async (req, res) => {
    const { access_token } = req.query;
    if (!access_token)
        return res.status(400).json({ error: 'Invalid token/s' });
    const discordApi = (uri) => 'https://discord.com/api' + uri;
    const userDataURI = discordApi('/users/@me');
    const userGuildsURI = discordApi('/users/@me/guilds');
    const mafiaScumURI = discordApi('/users/@me/guilds/611331534389116942/member');
    const discordMafiaURI = discordApi('/users/@me/guilds/648663810772697089/member');
    const headers = { Authorization: `Bearer ${access_token}` };
    const rawUser = await axios_1.default.get(userDataURI, { headers });
    const rawGuilds = await axios_1.default.get(userGuildsURI, { headers });
    let rawMafiaScum = null, rawDiscordMafia = null;
    let hasMS = false;
    let hasDM = false;
    rawGuilds.data.forEach((value) => {
        hasMS = hasMS || value.id == '611331534389116942';
        hasDM = hasDM || value.id == '648663810772697089';
    });
    if (hasDM)
        rawDiscordMafia = await axios_1.default.get(discordMafiaURI, { headers });
    if (hasMS)
        rawMafiaScum = await axios_1.default.get(mafiaScumURI, { headers });
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
    if (!code)
        res.status(400).json({ error: 'No code provided.' });
    const loginResult = await axios_1.default.post('https://discord.com/api/oauth2/token', {
        client_id: '843514276383031296',
        client_secret: __1.Config.discordAuthToken,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:3000',
        code: code,
    });
    if (!loginResult)
        return res.status(400).send();
    return res.status(200).json(loginResult.data);
});
