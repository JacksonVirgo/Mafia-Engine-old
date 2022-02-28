import { ApplicationCommandOptionData, ApplicationCommandPermissionData, CommandInteraction as Interaction, Message } from 'discord.js';
import { findBestMatch as compareString } from 'string-similarity';

interface CommandHandle {
	command: string;
	allowedGuilds?: string[];
}

export const messageCommands: Record<string, Command> = {};
export const commandAlias: Record<string, string> = {};
export const commandHandles: CommandHandle[] = [];
export const allCommands: string[] = [];
export const commandDescriptions: Record<string, string> = {};

export const slashCommands: Record<string, Command> = {};

export const addCommand = (cmd: Command, onlyDevelopment?: boolean) => {
	const { tag, serverPermissions } = cmd;
	if (!(tag && serverPermissions)) return;
	let allowedGuilds = onlyDevelopment ? ['DEVELOPMENT'] : serverPermissions;
	cmd.serverPermissions = allowedGuilds;
	if (!slashCommands[tag] && cmd.runSlash) slashCommands[tag] = cmd;
};

export const getClosestCommand = (prompt: string, serverId?: string): string | null => {
	if (!serverId) return null;
	console.log(commandHandles);

	let handles: string[] = [];
	for (let i = 0; i < commandHandles.length; i++) {
		if (commandHandles[i].allowedGuilds?.includes(serverId)) handles.push(commandHandles[i].command);
	}

	if (!handles) return null;
	return compareString(prompt, handles).bestMatch.target;
};

export type RunMessage = (msg: Message, args: string[]) => void;
export type RunSlash = (interaction: Interaction) => void;

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

	// Development
	developmentOnly?: boolean;

	// Permissions
	permission?: Permission;
	slashPermissions?: ApplicationCommandPermissionData[];
	serverPermissions?: string[];

	runMsg?: RunMessage;
	runSlash?: RunSlash;
	options?: ApplicationCommandOptionData[];
}
