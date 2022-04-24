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
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const Command_1 = require("../../interfaces/Command");
const filesystem_1 = require("../../util/filesystem");
const __2 = require("../..");
let file = {
    tag: 'ready',
    run: async () => {
        let { isDevelopment } = __2.Config;
        if (isDevelopment)
            console.log('Running as Development Version');
        let commands = await (0, filesystem_1.loadFilesRecursive)(`${__dirname}/../commands`);
        if (commands) {
            for (let i = 0; i < commands.length; i++) {
                const command = (await Promise.resolve().then(() => __importStar(require(commands[i])))).default;
                (0, Command_1.addCommand)(command, __2.Config.isDevelopment);
            }
        }
        let slashCommandManager;
        slashCommandManager = __1.Client.guilds.cache.get(!isDevelopment ? __2.DiscordServers.DEVELOPMENT : __2.DiscordServers.DISCORD_MAFIA)?.commands;
        if (!slashCommandManager)
            __1.Client.application?.commands;
        __1.Client.application?.commands.cache.each((v) => v.delete());
        slashCommandManager?.cache.each((v) => v.delete());
        for (const slash in Command_1.slashCommands) {
            const command = Command_1.slashCommands[slash];
            const appCommand = await slashCommandManager?.create({
                name: command.tag,
                description: command.description,
                options: command.options,
                defaultPermission: false,
            });
            if (command.slashPermissions)
                appCommand?.permissions.add({
                    permissions: command.slashPermissions,
                });
            console.log(`Loaded ${appCommand?.name}`);
        }
        console.log(__1.Client?.user?.username + ' is online');
    },
};
exports.default = file;
