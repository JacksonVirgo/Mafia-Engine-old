import { ButtonInteraction, Interaction, Message } from 'discord.js';
import { LFGUpdate, LFGUpdateOptions } from '../structures/LFG';
import { Config } from '../..';

const onInteractButton = async (i: ButtonInteraction) => {
	let customId: string = i.customId;
	console.log('[Handled Interaction]', customId);

	if (customId.startsWith('lfg-button') || customId.startsWith('lfg-leave-button')) {
		const isLeave: boolean = i.customId.startsWith('lfg-leave-button');
		const joined: string | null = isLeave ? null : i.customId.substring('lfg-button-'.length);

		const update: LFGUpdateOptions = {};

		if (isLeave) update.removedUsers = [i.user.id];
		else if (joined) {
			update.addedUsers = {};
			update.addedUsers[joined] = [i.user.id];
		}

		console.log(update);

		await LFGUpdate(i.message as Message, update);
		i.update({});
	}
};

export default {
	tag: 'interactionCreate',
	run: async (i: Interaction) => {
		let isDevGuild = i.guildId != '929949297892540417';
		try {
			if ((!Config.isDevelopment && isDevGuild) || (Config.isDevelopment && !isDevGuild)) return;

			if (i.isButton()) await onInteractButton(i);
		} catch (err) {
			console.log('Caught');
			console.log('Interaction Root Error', err);
		}
	},
};
