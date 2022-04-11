import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction as Interaction, Message } from 'discord.js';
interface CommandHandle {
    command: string;
    allowedGuilds?: string[];
}
export declare const messageCommands: Record<string, Command>;
export declare const commandAlias: Record<string, string>;
export declare const commandHandles: CommandHandle[];
export declare const allCommands: string[];
export declare const commandDescriptions: Record<string, string>;
export declare const slashCommands: Record<string, Command>;
export declare const addCommand: (cmd: Command, onlyDevelopment?: boolean | undefined) => void;
export declare const getClosestCommand: (prompt: string, serverId?: string | undefined) => string | null;
export declare type RunMessage = (msg: Message, args: string[]) => void;
export declare type RunSlash = (interaction: Interaction) => void;
export interface Permission {
    regularUser?: boolean;
    allowedUsers?: string[];
    custom?: (message: Message) => boolean;
}
export interface Command {
    tag: string;
    alias?: string[];
    description: string;
    longDescription?: string;
    developmentOnly?: boolean;
    permission?: Permission;
    slashPermissions?: ApplicationCommandPermissionData[];
    serverPermissions?: string[];
    runMsg?: RunMessage;
    runSlash?: RunSlash;
    options?: ApplicationCommandOptionData[];
}
export {};
