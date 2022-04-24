import express from 'express';
import protocol from 'http';
// import path from 'path';
import { config as loadEnvironment } from 'dotenv';
// import { init as discordInit } from './discord';
import { fetchConfig } from './interfaces/Config';
import cors from 'cors';

import apiRouter from './routes/apiRouter';

loadEnvironment();
export const Config = fetchConfig();

export const DiscordServers: Record<string, string> = {
	DISCORD_MAFIA: '648663810772697089',
	DISCORD_MAFIA_PLAYER_CHAT: '753231987589906483',
	MAFIA_SCUM: '611331534389116942',
	DEVELOPMENT: '929949297892540417',
};

(async () => {
	// await discordInit();

	const app = express();
	const server = protocol.createServer(app);

	// app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
	// app.get('*', (_req, res) => {
	// 	res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
	// });

	app.use(cors({}))
	app.use('/api', apiRouter);

	server.listen(Config.PORT, () => {
		console.log(`REST Client Connected. PORT=${Config.PORT}`);
	});
})();
