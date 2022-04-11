import { ButtonInteraction, Message, MessageEmbed, MessageOptions } from 'discord.js';
import LFG, { LFGSchema } from '../../database/discord/LookingForGroup';
export interface LFGCategory {
    title: string;
    users: string[];
    maximum?: number;
}
export interface LFG {
    title?: string;
    description?: string;
    categories?: LFGCategory[];
    development?: boolean;
}
export declare const IlllegalCharacters: string;
interface CategoryTitleParseResponse {
    title: string;
    maximum?: number;
}
export declare const parseRequestedCategoryTitle: (req: string) => CategoryTitleParseResponse;
export declare const createLFG: (lfgData: LFGSchema) => MessageOptions;
export declare const extractLFG: (lfgData: MessageEmbed) => LFG;
export interface LFGUpdateOptions {
    removedUsers?: string[];
    addedUsers?: Record<string, string[]>;
    changeCategoryMax?: Record<string, number>;
    changedTitle?: string;
    changedDescription?: string;
}
interface PostLFGSave {
    (data: any): void;
}
export declare const LFGUpdateButton: (i: ButtonInteraction) => Promise<void>;
export declare const LFGUpdate: (message: Message, update: LFGUpdateOptions, saveFunc?: PostLFGSave | null) => Promise<void>;
export {};
