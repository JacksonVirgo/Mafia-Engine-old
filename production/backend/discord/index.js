"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.commandList = exports.Client = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
const __1 = require("../");
const filesystem_1 = require("../util/filesystem");
const { Intents } = discord_js_1.default;
exports.Client = new discord_js_1.default.Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});
exports.commandList = {};
const init = async () => {
    if (!__1.Config.discordToken)
        return console.log('Invalid or Missing Discord Token');
    let files = await (0, filesystem_1.loadFiles)(`${__dirname}/events`);
    if (files) {
        for (let i = 0; i < files.length; i++) {
            let eventData = (await Promise.resolve().then(() => __importStar(require(files[i])))).default;
            const loadEvent = (event) => {
                const { tag, run } = event;
                if (tag && run)
                    exports.Client.on(tag, run);
            };
            if (!eventData.events)
                loadEvent(eventData);
            else {
                for (const event of eventData) {
                    loadEvent(event);
                }
            }
        }
    }
    let connected = (await exports.Client.login(__1.Config.discordToken)) === __1.Config.discordToken;
    if (connected)
        console.log('Discord v0.1 Connected');
    else
        console.log('Discord failed to connect.');
};
exports.init = init;
