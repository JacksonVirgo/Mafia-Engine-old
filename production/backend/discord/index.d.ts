import Discord from 'discord.js';
import { Command } from '../interfaces/Command';
export declare const Client: Discord.Client<boolean>;
export declare const commandList: Record<string, Command>;
export declare const init: () => Promise<void>;
