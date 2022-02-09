import { ButtonInteraction, Interaction } from 'discord.js';
import { onLfgButton } from '../structures/LFG';
import { Config } from '../..';

const onInteractButton = (i: ButtonInteraction) => {
	let customId: string = i.customId;
	console.log('[Handled Interaction]', customId);

	if (customId.startsWith('lfg-button') || customId.startsWith('lfg-leave-button')) onLfgButton(i);
};

export default {
	tag: 'interactionCreate',
	run: async (i: Interaction) => {
		let isDevGuild = i.guildId != '929949297892540417';
		try {
			if ((!Config.isDevelopment && isDevGuild) || (Config.isDevelopment && !isDevGuild)) return;

			if (i.isButton()) onInteractButton(i);
		} catch (err) {
			console.log('Caught');
			console.log('Interaction Root Error', err);
		}
	},
};
