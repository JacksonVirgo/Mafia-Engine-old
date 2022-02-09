import { ButtonInteraction, MessageEmbed, MessageOptions } from 'discord.js';
export interface LFGCategory {
    title: string;
    users: string[];
}
export interface LFG {
    title?: string;
    description?: string;
    categories?: LFGCategory[];
}
export declare const createLFG: (lfgData: LFG) => MessageOptions;
export declare const extractLFG: (lfgData: MessageEmbed) => LFG;
export declare const onLfgButton: (i: ButtonInteraction) => Promise<void>;
