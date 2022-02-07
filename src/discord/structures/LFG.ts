import { ButtonInteraction, Constants, MessageActionRow, MessageButton, MessageEmbed, MessageEmbedOptions, MessageOptions } from 'discord.js';
export interface LFGCategory {
	title: string;
	users: string[];
}
export interface LFG {
	title?: string;
	description?: string;
	categories?: LFGCategory[];
}

export const createLFG = (lfgData: LFG): MessageOptions => {
	let result: MessageOptions = {};
	let embedData: MessageEmbedOptions = {
		title: lfgData.title || 'Looking For Group',
		description: 'Interact with a button below to join a group, if there are no buttons notify staff.',
		fields: [],
		color: Constants.Colors.BLURPLE,
		footer: {
			text: 'Mafia Engine LFG',
		},
		timestamp: new Date(),
	};
	const completedCategories: string[] = [];
	const actionRow = new MessageActionRow();
	if (lfgData.categories)
		for (const category of lfgData.categories) {
			if (completedCategories.includes(category.title.toLowerCase())) continue;
			completedCategories.push(category.title.toLowerCase());

			let categoryValue: string = '';
			category.users.forEach((val) => (categoryValue += `<@${val}>\n`));
			if (categoryValue === '') categoryValue = 'N/A';

			let formattedLabel = category.title
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

			embedData.fields?.push({
				name: formattedLabel,
				value: categoryValue,
				inline: true,
			});

			let button = new MessageButton()
				.setCustomId(`lfg-button-${category.title}`)
				.setLabel(formattedLabel)
				.setStyle(actionRow.components.length === 0 ? 'PRIMARY' : 'SECONDARY');

			actionRow.addComponents(button);
		}

	let leaveButton = new MessageButton().setCustomId('lfg-leave-button').setLabel('Leave').setStyle('DANGER');
	actionRow.addComponents(leaveButton);

	const embed = new MessageEmbed(embedData);

	result.embeds = [embed];
	result.components = [actionRow];
	return result;
};

export const extractLFG = (lfgData: MessageEmbed): LFG => {
	let lfg: LFG = {
		title: lfgData.title || undefined,
		description: lfgData.description || undefined,
		categories: [],
	};

	for (const field of lfgData.fields) {
		const { name, value } = field;
		let lfgCat: LFGCategory = {
			title: name,
			users: [],
		};

		let users = value.trim().split('\n');
		for (const user of users) {
			if (!user) continue;
			if (user.startsWith('<@') && user.endsWith('>')) {
				let newUser = user.slice(2, -1);
				if (newUser.startsWith('!')) newUser = newUser.slice(1);
				lfgCat.users.push(user.slice(2, -1));
			}
		}

		lfg.categories?.push(lfgCat);
	}

	return lfg;
};

export const onLfgButton = async (i: ButtonInteraction) => {
	const isLeave: boolean = i.customId.startsWith('lfg-leave-button');
	const joined: string | null = isLeave ? null : i.customId.substring('lfg-button-'.length);
	const embed: MessageEmbed = i.message.embeds[0] as MessageEmbed;

	let lfgData = extractLFG(embed);

	if (!lfgData.categories) return;

	console.log(lfgData.categories);

	lfgData.categories.forEach((v) => {
		v.users = v.users.filter((v) => {
			console.log(`[${i.user.id}]`, `[${v}]`, v == i.user.id);
			return v != i.user.id;
		});
		console.log(v.title, v.users);
		if (v.title.toLowerCase() === joined) v.users.push(i.user.id);
	});

	let createdLFG = createLFG(lfgData);
	await i.update({ embeds: createdLFG.embeds });
	// i.reply({ ephemeral: true, content: 'Sup' });
};
