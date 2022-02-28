import { Command } from '../../interfaces/Command';
import { CommandInteraction, Message } from 'discord.js';

import Game from '../../database/discord/Game';

export default {
	tag: 'votecount',
	developmentOnly: true,

	alias: ['vc'],
	description: 'Manage an automated vote counter.',
	permission: {
		regularUser: false,
		custom: (_message: Message) => true,
	},
	options: [{ name: 'chat', description: 'Channel where players talk', required: true, type: 'CHANNEL' }],
	runSlash: async (i: CommandInteraction): Promise<any> => {
		await i.deferReply({ ephemeral: true });
		const chat = i.options.getChannel('chat', true);
		let gameChatChannel = chat.id;
		const fetchedVC = await Game.findOne({ gameChatChannel });
		if (fetchedVC) return i.editReply({ content: 'Vote counter already exists with at least one of those channels.' });

		// const newGame: RawGameSchema = {
		// 	gameChatChannel,
		// 	voteCount: {
		// 		votes: [],
		// 	},
		// };

		try {
			// const newSchema = new Game(newGame);
			// await newSchema.save();
			await i.editReply({ content: 'Check Database' });
		} catch (err) {
			await i.editReply({ content: 'Error' });
			console.log('Vote Count Creation Error', err);
		}
	},
	runMsg: async (_message: Message, args: string[]): Promise<any> => {
		let subcmd = args.shift();
		if (subcmd && subcmd.toLowerCase() == 'addplayers') {
		}
	},
} as Command;
