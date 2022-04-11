"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClosestCommand = exports.addCommand = exports.slashCommands = exports.commandDescriptions = exports.allCommands = exports.commandHandles = exports.commandAlias = exports.messageCommands = void 0;
const string_similarity_1 = require("string-similarity");
exports.messageCommands = {};
exports.commandAlias = {};
exports.commandHandles = [];
exports.allCommands = [];
exports.commandDescriptions = {};
exports.slashCommands = {};
const addCommand = (cmd, onlyDevelopment) => {
    const { tag, serverPermissions } = cmd;
    if (!(tag && serverPermissions))
        return;
    let allowedGuilds = onlyDevelopment ? ['DEVELOPMENT'] : serverPermissions;
    cmd.serverPermissions = allowedGuilds;
    if (!exports.slashCommands[tag] && cmd.runSlash)
        exports.slashCommands[tag] = cmd;
};
exports.addCommand = addCommand;
const getClosestCommand = (prompt, serverId) => {
    if (!serverId)
        return null;
    console.log(exports.commandHandles);
    let handles = [];
    for (let i = 0; i < exports.commandHandles.length; i++) {
        if (exports.commandHandles[i].allowedGuilds?.includes(serverId))
            handles.push(exports.commandHandles[i].command);
    }
    if (!handles)
        return null;
    return (0, string_similarity_1.findBestMatch)(prompt, handles).bestMatch.target;
};
exports.getClosestCommand = getClosestCommand;
