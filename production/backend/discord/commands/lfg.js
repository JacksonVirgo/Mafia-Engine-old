"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LFG_1 = require("../structures/LFG");
const __1 = require("../..");
exports.default = {
    tag: 'lookingforgroup',
    alias: ['lfg', 'signups'],
    description: 'Manage a LFG embed.',
    serverPermissions: [__1.DiscordServers.DISCORD_MAFIA, __1.DiscordServers.DEVELOPMENT],
    permission: {
        regularUser: false,
        custom: (_message) => true,
    },
    slashPermissions: [
        {
            id: '943131009338204161',
            type: 'ROLE',
            permission: true,
        },
        {
            id: '797960436053311519',
            type: 'ROLE',
            permission: true,
        },
    ],
    options: [
        {
            name: 'categories',
            description: 'List of categories seperated by a space.',
            type: 'STRING',
            required: false,
        },
        {
            name: 'title',
            description: 'Title for the LFG embed.',
            type: 'STRING',
            required: false,
        },
    ],
    runSlash: async (i) => {
        i.deferReply();
        const rawCategories = (i.options.getString('categories') || 'players backups').split(/\s+/g);
        const title = (i.options.getString('title') || 'Looking For Group').trim();
        const categories = [];
        let buttons = new discord_js_1.MessageActionRow();
        for (const category of rawCategories) {
            categories.push({ title: category, users: [] });
            buttons.addComponents(new discord_js_1.MessageButton().setCustomId(`lfg-button-${category.toLowerCase()}`).setLabel(category).setStyle('SECONDARY'));
        }
        let lfg = (0, LFG_1.createLFG)({ title, categories });
        i.channel?.send(lfg);
        i.deleteReply();
    },
};
