"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Game_1 = __importDefault(require("../../database/discord/Game"));
exports.default = {
    tag: 'game',
    developmentOnly: true,
    alias: [],
    description: 'Manage a Discord Game.',
    permission: {
        regularUser: false,
        custom: (_message) => true,
    },
    runSlash: async (i) => {
        await i.deferReply({ ephemeral: true });
        const chat = i.options.getChannel('chat', true);
        let gameChatChannel = chat.id;
        const fetchedVC = await Game_1.default.findOne({ gameChatChannel });
        if (fetchedVC)
            return i.editReply({ content: 'Vote counter already exists with at least one of those channels.' });
        try {
            await i.editReply({ content: 'Check Database' });
        }
        catch (err) {
            await i.editReply({ content: 'Error' });
            console.log('Vote Count Creation Error', err);
        }
    },
    runMsg: async (_message, args) => {
        let subcmd = args.shift();
        if (subcmd && subcmd.toLowerCase() == 'addplayers') {
        }
    },
};
