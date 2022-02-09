"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    tag: 'botstate',
    description: 'Command to check if the bot is currently working correctly.',
    runMsg: (message, args) => {
        let state = {};
        state.created = message.createdTimestamp;
        state.registered = Date.now();
        state.timeOffset = state.registered - state.created;
        state.arguments = JSON.stringify(args);
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Mafia Engine - Bot State')
            .setDescription('Full information about how the bot is performing.')
            .setColor('#00bfff')
            .setFields([
            {
                name: 'Command Register Time',
                value: `${Date.now() - message.createdTimestamp} milliseconds`,
            },
            {
                name: 'Arguments',
                value: args.toString(),
            },
        ]);
        message.channel.send({ embeds: [embed] });
    },
};
