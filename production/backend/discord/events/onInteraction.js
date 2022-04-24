"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LFG_1 = require("../structures/LFG");
const __1 = require("../..");
const Command_1 = require("../../interfaces/Command");
const onInteractButton = async (i) => {
    let customId = i.customId;
    console.log('[Handled Interaction]', customId);
    if (customId.startsWith('lfg-button') || customId.startsWith('lfg-leave-button')) {
        (0, LFG_1.LFGUpdateButton)(i);
    }
};
const onInteractCommand = async (i) => {
    let slash = Command_1.slashCommands[i.commandName];
    console.log('Hello', Command_1.slashCommands);
    if (slash && slash.runSlash)
        slash.runSlash(i);
    else {
        i.reply('Unknown Command - ' + i.commandName);
    }
};
exports.default = {
    tag: 'interactionCreate',
    run: async (i) => {
        let isDevGuild = i.guildId == __1.Config.developmentGuild;
        let isValid = __1.Config.isDevelopment && isDevGuild;
        isValid = isValid || (!__1.Config.isDevelopment && !isDevGuild);
        isValid = true;
        try {
            if (!isValid)
                return;
            if (i.isCommand())
                await onInteractCommand(i);
            if (i.isButton())
                await onInteractButton(i);
        }
        catch (err) {
            console.log('Interaction Root Error', err);
        }
    },
};
