import { Command } from '../../interfaces/Command';
import { Message, MessageEmbed } from 'discord.js';

interface BotState {
	created?: number;
	registered?: number;
	timeOffset?: number;
	arguments?: string;
}

export default {
	tag: 'botstate',
	description: 'Command to check if the bot is currently working correctly.',
	runMsg: (message: Message, args: string[]) => {
		let state = {} as BotState;
		state.created = message.createdTimestamp;
		state.registered = Date.now();
		state.timeOffset = state.registered - state.created;
		state.arguments = JSON.stringify(args);

		const embed = new MessageEmbed()
			.setTitle('Mafia Engine - Bot State')
			.setDescription('Full information about how the bot is performing.')
			.setColor('#00bfff')
			.setFields([
				{
					name: 'Command Register Time',
					value: `${Date.now() - message.createdTimestamp} milliseconds`,
				},
				{
					name: 'Arguments',
					value: args.toString(),
				},
			]);

		message.channel.send({ embeds: [embed] });
	},
} as Command;
