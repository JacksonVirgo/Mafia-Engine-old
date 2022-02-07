import { Command } from '../../interfaces/Command';
import { Message, MessageActionRow, MessageButton } from 'discord.js';
import { createLFG, extractLFG } from '../structures/LFG';

export default {
	tag: 'lookingforgroup',
	alias: ['lfg', 'signups'],
	description: 'Manage a LFG embed.',
	permission: {
		regularUser: false,
		custom: (_message: Message) => true,
	},
	runMsg: async (message: Message, args: string[]): Promise<any> => {
		let secondaryCommand = args.shift();
		switch (secondaryCommand) {
			case 'create':
				let categories = [];
				let buttons = new MessageActionRow();
				for (const arg of args) {
					categories.push({ title: arg, users: [] });
					buttons.addComponents(new MessageButton().setCustomId(`lfg-button-${arg.toLowerCase()}`).setLabel(arg).setStyle('SECONDARY'));
				}

				let lfg = createLFG({ categories });
				message.channel.send(lfg);

				break;
			case 'get':
				let requestedMessageId = args.shift();
				if (!requestedMessageId) break;

				let fetchedMessage = await message.channel.messages.fetch(requestedMessageId);
				const embed = fetchedMessage.embeds[0];

				if (!embed) return message.channel.send(`Message ${requestedMessageId} does not contain a valid LFG`);
				if (embed.footer?.text != 'Mafia Engine LFG') return message.channel.send(`Message ${requestedMessageId} does not contain a valid LFG`);

				const lfgData = extractLFG(embed);

				message.channel.send(JSON.stringify(lfgData));
				break;
		}
	},
} as Command;
