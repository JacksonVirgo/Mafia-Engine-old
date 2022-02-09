import { Interaction, Message } from 'discord.js';
export declare type RunMessage = (msg: Message, args: string[]) => void;
export declare type RunSlash = (interaction: Interaction) => void;
export interface Permission {
    regularUser?: boolean;
    allowedUsers?: string[];
    custom?: (message: Message) => boolean;
}
export interface Command {
    tag: string;
    alias: string[];
    permission?: Permission;
    description?: string;
    longDescription?: string;
    runMsg?: RunMessage;
    runSlash?: RunSlash;
}
