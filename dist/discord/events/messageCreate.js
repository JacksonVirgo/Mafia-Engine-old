"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClosestCommand = exports.addCommand = exports.commandDescriptions = exports.allCommands = exports.commandHandles = exports.commandAlias = exports.commands = void 0;
const __1 = require("../..");
const string_similarity_1 = require("string-similarity");
exports.commands = {};
exports.commandAlias = {};
exports.commandHandles = [];
exports.allCommands = [];
exports.commandDescriptions = {};
const addCommand = (cmd) => {
    const tag = cmd.tag;
    if (!tag)
        return;
    if (!exports.commands[tag] && cmd.runMsg) {
        exports.commands[tag] = cmd;
        exports.commandHandles.push(tag);
        if (cmd.description)
            exports.commandDescriptions[tag] = cmd.description;
        if (cmd.alias) {
            for (const alias of cmd.alias) {
                exports.commandAlias[alias] = tag;
                exports.commandHandles.push(alias);
            }
        }
    }
};
exports.addCommand = addCommand;
const getClosestCommand = (prompt) => {
    return (0, string_similarity_1.findBestMatch)(prompt, exports.commandHandles).bestMatch.target;
};
exports.getClosestCommand = getClosestCommand;
const onRegularCommand = (message) => {
    let args = message.content.toLowerCase().split(/\s+/g);
    let fullCmd = args.shift();
    if (fullCmd?.startsWith(__1.Config.discordPrefix)) {
        let cmd = fullCmd.substring(__1.Config.discordPrefix.length, fullCmd.length);
        let command;
        if (exports.commands[cmd])
            command = exports.commands[cmd];
        else if (exports.commands[exports.commandAlias[cmd]])
            command = exports.commands[exports.commandAlias[cmd]];
        if (command) {
            let run = command.runMsg;
            let permitted = true;
            if (command.permission) {
                if (!command.permission.regularUser)
                    permitted = false;
                if (command.permission.allowedUsers?.includes(message.author?.id))
                    permitted = true;
                if (message.member?.permissions.has('ADMINISTRATOR'))
                    permitted = true;
            }
            if (run && permitted)
                run(message, args);
        }
        else {
            let closestCommand = (0, exports.getClosestCommand)(cmd);
            let messageResponse = 'Unknown Command: Did you mean `' + closestCommand + '`?';
            message.channel.send({ content: messageResponse });
        }
    }
};
exports.default = {
    tag: 'messageCreate',
    run: async (message) => {
        if (message.author.bot)
            return;
        if (message.channel.type === 'DM')
            return;
        if (message.content.toLowerCase().startsWith(__1.Config.discordPrefix))
            onRegularCommand(message);
    },
};
