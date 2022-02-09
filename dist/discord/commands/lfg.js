"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const LFG_1 = require("../structures/LFG");
exports.default = {
    tag: 'lookingforgroup',
    alias: ['lfg', 'signups'],
    description: 'Manage a LFG embed.',
    permission: {
        regularUser: false,
        custom: (_message) => true,
    },
    runMsg: async (message, args) => {
        let secondaryCommand = args.shift();
        switch (secondaryCommand) {
            case 'create':
                let categories = [];
                let buttons = new discord_js_1.MessageActionRow();
                for (const arg of args) {
                    categories.push({ title: arg, users: [] });
                    buttons.addComponents(new discord_js_1.MessageButton().setCustomId(`lfg-button-${arg.toLowerCase()}`).setLabel(arg).setStyle('SECONDARY'));
                }
                let lfg = (0, LFG_1.createLFG)({ categories });
                message.channel.send(lfg);
                break;
            case 'get':
                let requestedMessageId = args.shift();
                if (!requestedMessageId)
                    break;
                let fetchedMessage = await message.channel.messages.fetch(requestedMessageId);
                const embed = fetchedMessage.embeds[0];
                if (!embed)
                    return message.channel.send(`Message ${requestedMessageId} does not contain a valid LFG`);
                if (embed.footer?.text != 'Mafia Engine LFG')
                    return message.channel.send(`Message ${requestedMessageId} does not contain a valid LFG`);
                const lfgData = (0, LFG_1.extractLFG)(embed);
                message.channel.send(JSON.stringify(lfgData));
                break;
        }
    },
};
