import { ButtonInteraction, CommandInteraction, Interaction } from 'discord.js';
import { LFGUpdateButton } from '../structures/LFG';
import { Config } from '../..';
import { slashCommands } from '../../interfaces/Command';

const onInteractButton = async (i: ButtonInteraction) => {
	let customId: string = i.customId;
	console.log('[Handled Interaction]', customId);

	if (customId.startsWith('lfg-button') || customId.startsWith('lfg-leave-button')) {
		LFGUpdateButton(i);
	}
};

const onInteractCommand = async (i: CommandInteraction) => {
	let slash = slashCommands[i.commandName];

	if (slash && slash.runSlash) slash.runSlash(i);
	else {
		console.log(i);
		i.reply('Unknown Command');
	}
};

export default {
	tag: 'interactionCreate',
	run: async (i: Interaction) => {
		let isDevGuild = i.guildId == Config.developmentGuild;
		let isValid = Config.isDevelopment && isDevGuild;
		isValid = isValid || (!Config.isDevelopment && !isDevGuild);
		try {
			if (!isValid) return;
			if (i.isCommand()) await onInteractCommand(i);
			if (i.isButton()) await onInteractButton(i);
		} catch (err) {
			console.log('Interaction Root Error', err);
		}
	},
};
