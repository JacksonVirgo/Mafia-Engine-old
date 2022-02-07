import { Message } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { Config } from '../..';
import { findBestMatch as compareString } from 'string-similarity';

export const commands: Record<string, Command> = {};
export const commandAlias: Record<string, string> = {};
export const commandHandles: string[] = [];
export const allCommands: string[] = [];
export const commandDescriptions: Record<string, string> = {};
export const addCommand = (cmd: Command) => {
	const tag: string = cmd.tag;
	if (!tag) return;
	if (!commands[tag] && cmd.runMsg) {
		commands[tag] = cmd;
		commandHandles.push(tag);
		if (cmd.description) commandDescriptions[tag] = cmd.description;
		if (cmd.alias) {
			for (const alias of cmd.alias) {
				commandAlias[alias] = tag;
				commandHandles.push(alias);
			}
		}
	}
};
export const getClosestCommand = (prompt: string): string | undefined => {
	return compareString(prompt, commandHandles).bestMatch.target;
};

/**
 * Regular command handling
 * @param message Discord Message
 */
const onRegularCommand = (message: Message): any => {
	let args = message.content.toLowerCase().split(/\s+/g);
	let fullCmd = args.shift();
	if (fullCmd?.startsWith(Config.discordPrefix)) {
		let cmd = fullCmd.substring(Config.discordPrefix.length, fullCmd.length);

		let command: Command | undefined;
		if (commands[cmd]) command = commands[cmd];
		else if (commands[commandAlias[cmd]]) command = commands[commandAlias[cmd]];

		if (command) {
			let run = command.runMsg;
			let permitted: boolean = true;
			if (command.permission) {
				if (!command.permission.regularUser) permitted = false;
				if (command.permission.allowedUsers?.includes(message.author?.id)) permitted = true;
				if (message.member?.permissions.has('ADMINISTRATOR')) permitted = true;
			}
			if (run && permitted) run(message, args);
		} else {
			let closestCommand = getClosestCommand(cmd);
			let messageResponse = 'Unknown Command: Did you mean `' + closestCommand + '`?';
			message.channel.send({ content: messageResponse });
		}
	}
};

export default {
	tag: 'messageCreate',
	run: async (message: Message) => {
		if (message.author.bot) return;
		if (message.channel.type === 'DM') return;
		if (message.content.toLowerCase().startsWith(Config.discordPrefix)) onRegularCommand(message);
	},
};
