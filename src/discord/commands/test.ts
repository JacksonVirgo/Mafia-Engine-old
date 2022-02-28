import { Command } from '../../interfaces/Command';
import { Message, MessageActionRow, MessageSelectMenu } from 'discord.js';

const menuRoot = [
	{
		label: 'Color',
		value: 'role-type-color',
		emoji: '🌈',
	},
	{
		label: 'Pronouns',
		value: 'role-type-pronouns',
		emoji: '⚧',
	},
	{
		label: 'Unlock Categories',
		value: 'role-type-category-unlocks',
		emoji: '🔒',
	},
	{
		label: 'Notifications',
		value: 'role-type-notifications',
		emoji: '🔔',
	},
	{
		label: 'Locale',
		value: 'role-type-locale',
		emoji: '🌏',
	},
];

const colorRoot = [
	{
		label: 'Mafioso',
		value: 'role-type-color-805310412081201152',
		emoji: '<:role_color_mafioso:945093008024543302>',
	},
	{
		label: 'Arsonist',
		value: 'role-type-color-805310422894247956',
		emoji: '<:role_color_arsonist:945094095347519488>',
	},
	{
		label: 'Survivor',
		value: 'role-type-color-805310103955308574',
		emoji: '<:role_color_survivor:945096375392145468>',
	},
	{
		label: 'Amnesiac',
		value: 'role-type-color-650045547125932033',
		emoji: '<:role_color_amnesiac:945092679300157440>',
	},
	{
		label: 'Safeguard',
		value: 'role-type-color-807805445522849814',
		emoji: '<:role_color_safeguard:945096674433450075>',
	},
	{
		label: 'Serial Killer',
		value: 'role-type-color-650825346693988398',
		emoji: '<:role_color_serial_killer:945094124992872508>',
	},
	{
		label: 'Witch',
		value: 'role-type-color-805310651374764033',
		emoji: '<:role_color_witch:945092992505626664>',
	},
	{
		label: 'Jester',
		value: 'role-type-color-649759732009271296',
		emoji: '<:role_color_jester:945092379721994290>',
	},
	{
		label: 'Juggernaut',
		value: 'role-type-color-807805468768337950',
		emoji: '<:role_color_juggernaut:945096389707329587>',
	},
	{
		label: 'Werewolf',
		value: 'role-type-color-805310653333241906',
		emoji: '<:role_color_werewolf:945094140268519444>',
	},
	{
		label: 'Guardian Angel',
		value: 'role-type-color-807805331081003028',
		emoji: '<:role_color_guardian_angel:945096404571922452>',
	},
	{
		label: 'Executioner',
		value: 'role-type-color-649419215182495765',
		emoji: '<:role_color_executioner:945094108551209000>',
	},
	{
		label: 'Vampire',
		value: 'role-type-color-666876652671991819',
		emoji: '<:role_color_vampire:945093448841695252>',
	},
	{
		label: 'Pestilence',
		value: 'role-type-color-740608542020468776',
		emoji: '<:role_color_pestilence:945093357867241493>',
	},
];

const menuNotif = [
	{ label: 'Game Night', value: 'role-type-notifs-game-night', emoji: '🥳' },
	{ label: 'Server Updates', value: 'role-tyoe-notifs-server-updates', emoji: '👀' },
	{ label: 'Polls', value: 'role-type-notifs-polls', emoji: '✉️' },
	{ label: 'GIM Updates', value: 'role-type-gim-updates', emoji: '💡' },
];

export default {
	tag: 'test',
	developmentOnly: true,

	description: 'Testing command.',
	runMsg: (message: Message, _args: string[]) => {
		const rowRoot = new MessageActionRow();

		let select = new MessageSelectMenu();
		select.setCustomId('select-role-reaction');
		select.setPlaceholder('Select Role Type');
		select.addOptions(menuRoot);
		rowRoot.addComponents(select);

		if (false) message.channel.send({ content: 'This is the main select menu', components: [rowRoot] });

		let selectColor = new MessageSelectMenu();
		selectColor.setCustomId('select-role-reaction-color');
		selectColor.setPlaceholder('Select Color');
		selectColor.addOptions(colorRoot);
		message.channel.send({ content: 'Select one of the following to change your role color/colour', components: [new MessageActionRow().addComponents(selectColor)] });

		let selectNotif = new MessageSelectMenu();
		selectNotif.setCustomId('select-role-notifications');
		selectNotif.setPlaceholder('Select Notification Roles');
		selectNotif.setMaxValues(menuNotif.length);
		selectNotif.addOptions(menuNotif);

		if (false) message.channel.send({ content: 'This is a select menu which you can select multiple at a time.', components: [new MessageActionRow().addComponents(selectNotif)] });
	},
} as Command;
