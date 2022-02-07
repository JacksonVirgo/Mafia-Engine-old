import { Interaction, Message } from 'discord.js';

export type RunMessage = (msg: Message, args: string[]) => void;
export type RunSlash = (interaction: Interaction) => void;

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
