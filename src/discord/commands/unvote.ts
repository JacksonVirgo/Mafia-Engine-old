import { Command } from '../../interfaces/Command';
import { CommandInteraction, Message } from 'discord.js';

export default {
	tag: 'unvote',
	developmentOnly: true,

	description: '[GAME] Remove your vote off a player.',
	permission: {
		regularUser: false,
		custom: (_message: Message) => true,
	},
	slashPermissions: [
		{
			type: 'ROLE',
			id: '801534801320083496',
			permission: true,
		},
		{
			type: 'ROLE',
			id: '650834329257377796',
			permission: true,
		},
		{
			type: 'ROLE',
			id: '897910725467570178',
			permission: true,
		},
		{
			type: 'ROLE',
			id: '943131009338204161',
			permission: true,
		},
	],
	options: [],
	runSlash: async (i: CommandInteraction): Promise<any> => {
		await i.deferReply();

		let isStandaloneVote = false;
		if (isStandaloneVote) return;

		i.editReply({
			content: `<@${i.user.id}> removed their vote`,
			allowedMentions: { parse: [], repliedUser: true },
		});
	},
} as Command;
