import { Command } from '../../interfaces/Command';
import { Message } from 'discord.js';
import { createLFG } from '../structures/LFG';

export default {
	tag: 'opensignups',
	developmentOnly: true,

	alias: ['opensignup', 'open', 'os'],
	description: 'Open a signup in the current channel.',
	permission: {
		regularUser: false,
		custom: (_message: Message) => true,
	},
	runMsg: (_message: Message, _args: string[]) => {
		let lfg = createLFG({});

		// let embed = new MessageEmbed()
		// 	.setTitle('Game Signups')
		// 	.setDescription('Click the appropriate button to join the signup')
		// 	.setFields(
		// 		{
		// 			name: 'Players',
		// 			value: '\u200b',
		// 			inline: true,
		// 		},
		// 		{
		// 			name: 'Backups',
		// 			value: '\u200b',
		// 			inline: true,
		// 		}
		// 	)
		// 	.setColor(Constants.Colors.BLURPLE);
		console.log(lfg);
	},
} as Command;
