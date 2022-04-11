import express, { NextFunction } from 'express'
import axios, { AxiosError } from 'axios';
import { Config } from '..';
import fetch, { BodyInit } from 'node-fetch'

interface DiscordAuth {
    accessToken?: string;
    refreshToken?: string;
    userData?: any;
    mafiascumUserData?: any;
}

interface DiscordAuthRequest extends express.Request {
    discordAuth?: DiscordAuth;

}

const DISCORD_API = 'https://discord.com/api';

export async function authMiddleware(request: express.Request, response: express.Response, next: NextFunction): Promise<any> {
    console.log('here1')

    const { accessToken, refreshToken } = request.cookies;
    if (!accessToken && !refreshToken) return response.status(401).json({ cookies: request.cookies });

    const validationURI = 'https://discord.com/api/users/@me';
    const headers = { Authorization: `Bearer ${request.cookies.accessToken}` };
    const rawData = await axios.get(validationURI, { headers });

    const newReq: DiscordAuthRequest = request;
    if (rawData.data.id) newReq.discordAuth = {
        accessToken,
        refreshToken,
        userData: rawData.data
    }

    request = newReq;
    next();
}

export async function mafiascumAuthMiddleware(request: DiscordAuthRequest, response: express.Response, next: NextFunction): Promise<any> {
    console.log('here2')

    const mafiaScumURI = DISCORD_API + '/users/@me/guilds/611331534389116942/member';

    try {
        const msReq = await axios.get(mafiaScumURI, { headers: { Authorization: `Bearer ${request.discordAuth?.accessToken}` } })
        const msRes = msReq.data;

        const MS_VERIFY_ID = '735134934947332206';

        if (!msRes.roles) return response.status(401).send();
        const isVerified = msRes.roles.includes(MS_VERIFY_ID);

        if (isVerified && request.discordAuth) request.discordAuth.mafiascumUserData = msRes;
        else return response.status(401).send();

        next();
    } catch (error) {
        const err = error as AxiosError;
        if (err.response) {
            if (err.response.status == 404) {
                console.log('Is not in server');
                return response.status(404).send();
            }
        }

        console.log(err);
        return response.status(500).send();
    }
}

const router = express.Router();

router.get('/userdata', authMiddleware, async (req, res): Promise<any> => {
    const { accessToken } = req.cookies;
    if (!accessToken) return res.redirect('https://discord.com/api/oauth2/authorize?client_id=843514276383031296&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds');

    const discordApi = (uri: string) => 'https://discord.com/api' + uri;
    const userDataURI = discordApi('/users/@me');
    const userGuildsURI = discordApi('/users/@me/guilds');
    const mafiaScumURI = discordApi('/users/@me/guilds/611331534389116942/member');
    const discordMafiaURI = discordApi('/users/@me/guilds/648663810772697089/member');

    const headers = { Authorization: `Bearer ${accessToken}` };
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



router.get('/test', authMiddleware, mafiascumAuthMiddleware, async (req: DiscordAuthRequest, res) => {
    res.status(200).json({ user: req.discordAuth });
})

router.get('/login', async (req, res): Promise<any> => {
    const { code } = req.query;
    if (!code) res.status(401).json({ error: 'No code provided.' });

    if (!Config.discordAuthToken) return res.status(500).send();

    const params = new URLSearchParams();
    params.append('client_id', '843514276383031296');
    params.append('client_secret', Config.discordAuthToken);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', 'http://localhost:3000/login');
    params.append('code', code as string);

    const request = await fetch('https://discord.com/api/oauth2/token', {
        method: 'post',
        body: params as BodyInit,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const response = await request.json();

    if (!response || response.error) return res.status(500).json({ error: 'Error occurred' })

    return res.status(200)
        .cookie('accessToken', response.access_token, {
            sameSite: 'strict',
            path: '/',
            httpOnly: true,
            secure: true
        })
        .cookie('refreshToken', response.refresh_token, {
            sameSite: 'strict',
            path: '/',
            secure: true
        }).json({ success: true });

});


export default router;