"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordServers = exports.Config = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
const Config_1 = require("./interfaces/Config");
const database_1 = require("./database");
const apiRouter_1 = __importDefault(require("./routes/apiRouter"));
(0, dotenv_1.config)();
exports.Config = (0, Config_1.fetchConfig)();
exports.DiscordServers = {
    DISCORD_MAFIA: '648663810772697089',
    DISCORD_MAFIA_PLAYER_CHAT: '753231987589906483',
    MAFIA_SCUM: '611331534389116942',
    DEVELOPMENT: '929949297892540417',
};
(async () => {
    await (0, database_1.databaseInit)();
    const app = (0, express_1.default)();
    const server = http_1.default.createServer(app);
    app.use('/api', apiRouter_1.default);
    server.listen(exports.Config.PORT, () => {
        console.log(`REST Client Connected. PORT=${exports.Config.PORT}`);
    });
})();
