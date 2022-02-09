"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
const discord_1 = require("./discord");
const Config_1 = require("./interfaces/Config");
(0, dotenv_1.config)();
exports.Config = (0, Config_1.fetchConfig)();
(0, discord_1.init)();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'client', 'build')));
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, '..', 'client', 'build', 'index.html'));
});
server.listen(exports.Config.PORT, () => {
    console.log(`Server start. PORT=${exports.Config.PORT}`);
});
