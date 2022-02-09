"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const messageCreate_1 = require("../events/messageCreate");
const noArgs = (message, _args) => {
    let mainCommands = [];
    let alias = {};
    for (const command of messageCreate_1.commandHandles) {
        let fetchAlias = messageCreate_1.commandAlias[command];
        if (!fetchAlias)
            mainCommands.push(command);
        else {
            let aliasList = alias[fetchAlias] || [];
            aliasList.push(command);
            alias[fetchAlias] = aliasList;
        }
    }
    let embedDesc = 'Use the command `commands [command]` to check more details about a specific command.\n';
    for (const cmd of mainCommands) {
        embedDesc += `\n**${cmd}** - ${messageCreate_1.commandDescriptions[cmd]}`;
    }
    const messageEmbed = new discord_js_1.MessageEmbed().setTitle('Mafia Engine Commands').setDescription(embedDesc.trim()).setColor('#00bfff');
    message.channel.send({ embeds: [messageEmbed] });
};
const withArgs = (message, args) => {
    let command = messageCreate_1.commands[args[0]];
    if (!command)
        command = messageCreate_1.commands[messageCreate_1.commandAlias[args[0]]];
    if (!command)
        return message.channel.send(`Command does not exist. Did you mean ${'`'}${(0, messageCreate_1.getClosestCommand)(args[0])}${'`'}`);
    let perms = '';
    let permAppend = '';
    if (!command.permission || command.permission.regularUser)
        perms = 'Anyone can use';
    else if (command.permission.custom) {
        let canUse = command.permission.custom(message) || message.member?.permissions.has('ADMINISTRATOR');
        perms = 'Regular users cannot use. Custom and ADMINISTRATORS can use this command.';
        permAppend = canUse ? '\n__You can use this command__' : '\n__You cannot use this command__';
    }
    else
        perms = 'Only ADMINISTRATORS can use.';
    let aliasList = command.alias?.toString() || 'none';
    let messageEmbed = new discord_js_1.MessageEmbed()
        .setTitle(`Mafia Engine - ${command.tag}`)
        .setDescription(command.longDescription || command.description || `Information for the command ${command.tag}`)
        .setFields([
        { name: 'Permissions', value: (perms + permAppend).trim() },
        { name: 'Alias List', value: aliasList },
    ])
        .setColor('#00bfff');
    message.channel.send({ embeds: [messageEmbed] });
};
exports.default = {
    tag: 'commands',
    alias: ['getcommands', 'cmds', 'cmd', 'gc'],
    description: 'Get a list of all the commands. Use command `command [command]` for more info',
    longDescription: 'Get a list of all commands <@843514276383031296> uses. Use command `command [command]` for more detailed information for each command.',
    runMsg: (message, args) => {
        if (args.length <= 0)
            noArgs(message, args);
        else
            withArgs(message, args);
    },
};
