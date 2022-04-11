import { Message } from 'discord.js';
export interface SubCommand {
    (msg: Message, args: string[]): void;
}
export interface SubCommandManager {
    commands: Record<string, SubCommand>;
    run: (msg: Message, args: string[]) => any;
}
export declare const useSubCmd: (commands: Record<string, SubCommand>) => SubCommandManager;
