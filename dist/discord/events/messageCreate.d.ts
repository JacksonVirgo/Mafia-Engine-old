import { Message } from 'discord.js';
import { Command } from '../../interfaces/Command';
export declare const commands: Record<string, Command>;
export declare const commandAlias: Record<string, string>;
export declare const commandHandles: string[];
export declare const allCommands: string[];
export declare const commandDescriptions: Record<string, string>;
export declare const addCommand: (cmd: Command) => void;
export declare const getClosestCommand: (prompt: string) => string | undefined;
declare const _default: {
    tag: string;
    run: (message: Message) => Promise<void>;
};
export default _default;
