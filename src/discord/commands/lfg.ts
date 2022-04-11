import { Command } from '../../interfaces/Command';
import { Message, MessageActionRow, MessageButton, CommandInteraction } from 'discord.js';
import { createLFG } from '../structures/LFG';
import { DiscordServers } from '../..';

export default {
	tag: 'lookingforgroup',
	alias: ['lfg', 'signups'],
	description: 'Manage a LFG embed.',
	serverPermissions: [DiscordServers.DISCORD_MAFIA, DiscordServers.DEVELOPMENT],
	permission: {
		regularUser: false,
		custom: (_message: Message) => true,
	},
	slashPermissions: [
		{
			id: '943131009338204161',
			type: 'ROLE',
			permission: true,
		},
		{
			id: '797960436053311519',
			type: 'ROLE',
			permission: true,
		},
	],
	options: [
		{
			name: 'categories',
			description: 'List of categories seperated by a space.',
			type: 'STRING',
			required: false,
		},
		{
			name: 'title',
			description: 'Title for the LFG embed.',
			type: 'STRING',
			required: false,
		},
	],
	runSlash: async (i: CommandInteraction): Promise<any> => {
		i.deferReply();
		const rawCategories = (i.options.getString('categories') || 'players backups').split(/\s+/g);
		const title = (i.options.getString('title') || 'Looking For Group').trim();

		const categories = [];

		let buttons = new MessageActionRow();
		for (const category of rawCategories) {
			categories.push({ title: category, players: [] });
			buttons.addComponents(new MessageButton().setCustomId(`lfg-button-${category.toLowerCase()}`).setLabel(category).setStyle('SECONDARY'));
		}
		let lfg = createLFG({ title, categories });
		i.channel?.send(lfg);
		i.deleteReply();
	},
} as Command;
