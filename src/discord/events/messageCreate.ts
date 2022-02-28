import { Message } from 'discord.js';
import { Command } from '../../interfaces/Command';
import { Config } from '../..';
import { messageCommands, commandAlias, getClosestCommand } from '../../interfaces/Command';

/**
 * Regular command handling
 * @param message Discord Message
 */
export const onRegularCommand = (message: Message): any => {
	let args = message.content.toLowerCase().split(/\s+/g);
	let fullCmd = args.shift();
	if (fullCmd?.startsWith(Config.discordPrefix)) {
		let cmd = fullCmd.substring(Config.discordPrefix.length, fullCmd.length);

		let command: Command | undefined;
		if (messageCommands[cmd]) command = messageCommands[cmd];
		else if (messageCommands[commandAlias[cmd]]) command = messageCommands[commandAlias[cmd]];

		let isAllowed = command?.serverPermissions?.includes(message.channelId);

		if (command && isAllowed) {
			let run = command.runMsg;
			let permitted: boolean = true;
			if (command.permission) {
				if (!command.permission.regularUser) permitted = false;
				if (command.permission.allowedUsers?.includes(message.author?.id)) permitted = true;
				if (message.member?.permissions.has('ADMINISTRATOR')) permitted = true;
			}
			if (run && permitted) run(message, args);
		} else {
			let closestCommand = getClosestCommand(cmd, message.guild?.id);
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
	},
};
