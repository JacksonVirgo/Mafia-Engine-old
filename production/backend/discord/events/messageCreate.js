"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRegularCommand = void 0;
const __1 = require("../..");
const Command_1 = require("../../interfaces/Command");
const onRegularCommand = (message) => {
    let args = message.content.toLowerCase().split(/\s+/g);
    let fullCmd = args.shift();
    if (fullCmd?.startsWith(__1.Config.discordPrefix)) {
        let cmd = fullCmd.substring(__1.Config.discordPrefix.length, fullCmd.length);
        let command;
        if (Command_1.messageCommands[cmd])
            command = Command_1.messageCommands[cmd];
        else if (Command_1.messageCommands[Command_1.commandAlias[cmd]])
            command = Command_1.messageCommands[Command_1.commandAlias[cmd]];
        let isAllowed = command?.serverPermissions?.includes(message.channelId);
        if (command && isAllowed) {
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
            let closestCommand = (0, Command_1.getClosestCommand)(cmd, message.guild?.id);
            let messageResponse = 'Unknown Command: Did you mean `' + closestCommand + '`?';
            message.channel.send({ content: messageResponse });
        }
    }
};
exports.onRegularCommand = onRegularCommand;
exports.default = {
    tag: 'messageCreate',
    run: async (message) => {
        if (message.author.bot)
            return;
        if (message.channel.type === 'DM')
            return;
    },
};
