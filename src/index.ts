import express from 'express';
import protocol from 'http';
import path from 'path';
import { config as loadEnvironment } from 'dotenv';
import { init as discordInit } from './discord';
import { fetchConfig } from './interfaces/Config';

loadEnvironment();
export const Config = fetchConfig();

discordInit();

const app = express();
const server = protocol.createServer(app);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));
app.get('*', (_req, res) => {
	res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});
server.listen(Config.PORT, () => {
	console.log(`Server start. PORT=${Config.PORT}`);
});
