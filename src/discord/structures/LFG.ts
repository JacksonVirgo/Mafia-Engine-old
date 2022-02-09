import { ButtonInteraction, Constants, Message, MessageActionRow, MessageButton, MessageEmbed, MessageEmbedOptions, MessageOptions } from 'discord.js';
export interface LFGCategory {
	title: string;
	users: string[];
	maximum?: number;
}
export interface LFG {
	title?: string;
	description?: string;
	categories?: LFGCategory[];
	development?: boolean;
}

export const IlllegalCharacters: string = '[]:/';
interface CategoryTitleParseResponse {
	title: string;
	maximum?: number;
}
export const parseRequestedCategoryTitle = (req: string): CategoryTitleParseResponse => {
	let title: string | undefined;
	let maximum: number | undefined;

	let split = req.split('[');
	title = split.shift()?.trim();

	let data: string | undefined = split.shift()?.split(']')[0];
	if (data) {
		if (data.includes('/')) {
			let strMax: string = data.split('/')[1];
			let tmpMax = parseInt(strMax.trim());
			if (!isNaN(tmpMax)) maximum = tmpMax;
		}
	}

	if (!title) title = req;
	return { title, maximum } as CategoryTitleParseResponse;
};

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
			let parsedCategory: string = category.title.toLowerCase();
			let amount: number | undefined = category.users.length;
			let maximum: number | undefined = category.maximum;

			if (completedCategories.includes(parsedCategory)) continue;
			completedCategories.push(parsedCategory);

			let categoryValue: string = '';
			category.users.forEach((val) => (categoryValue += `<@${val}>\n`));
			if (categoryValue === '') categoryValue = 'N/A';

			let formattedLabel = category.title
				.toLowerCase()
				.split(' ')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');

			if (amount) formattedLabel += ` [${amount}${maximum ? `/${maximum}` : ''}]`;

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
		let parsed = parseRequestedCategoryTitle(name);
		let lfgCat: LFGCategory = {
			title: parsed.title,
			users: [],
			maximum: parsed.maximum,
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

export interface LFGUpdateOptions {
	removedUsers?: string[];
	addedUsers?: Record<string, string[]>;
	changeCategoryMax?: Record<string, number>;
}
interface PostLFGSave {
	(data: any): void;
}
export const LFGUpdateButton = async (i: ButtonInteraction) => {
	const isLeave: boolean = i.customId.startsWith('lfg-leave-button');
	const joined: string | null = isLeave ? null : i.customId.substring('lfg-button-'.length);

	const update: LFGUpdateOptions = {};

	if (isLeave) update.removedUsers = [i.user.id];
	else if (joined) {
		update.addedUsers = {};
		update.addedUsers[joined] = [i.user.id];
	}

	await LFGUpdate(i.message as Message, update, (data) => {
		i.update(data);
	});
};

export const LFGUpdate = async (message: Message, update: LFGUpdateOptions, saveFunc: PostLFGSave | null = null) => {
	const embed: MessageEmbed = message.embeds[0] as MessageEmbed;

	let lfgData = extractLFG(embed);
	if (!lfgData.categories) return;

	let allUpdatedUsers: string[] = update.removedUsers || [];
	if (update.addedUsers) {
		for (const key in update.addedUsers) {
			allUpdatedUsers = allUpdatedUsers.concat(update.addedUsers[key]);
		}
	}

	// TODO: Ensure added users are unique
	lfgData.categories.forEach((v, _i) => {
		v.users = v.users.filter((v2) => !allUpdatedUsers.includes(v2));
		if (update.addedUsers) {
			for (const joinedCategories in update.addedUsers) {
				if (v.title.toLowerCase() == joinedCategories.toLowerCase()) {
					update.addedUsers[joinedCategories].forEach((user) => {
						v.users.push(user);
					});
				}
			}
		}
	});

	let createdLFG = createLFG(lfgData);
	if (saveFunc) saveFunc({ embeds: createdLFG.embeds });
};
