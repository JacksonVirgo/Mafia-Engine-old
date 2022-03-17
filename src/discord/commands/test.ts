import { Command } from '../../interfaces/Command';
import { CommandInteraction } from 'discord.js';
import { DiscordServers } from '../..';
const colorRoot = [
	'mafioso-805310412081201152-<:role_color_mafioso:945093008024543302>',
	'arsonist-805310422894247956-<:role_color_arsonist:945094095347519488>',
	'survivor-805310103955308574-<:role_color_survivor:945096375392145468>',
	'amnesiac-650045547125932033-<:role_color_amnesiac:945092679300157440>',
	'safeguard-807805445522849814-<:role_color_safeguard:945096674433450075>',
	'serial_killer-650825346693988398-<:role_color_serial_killer:945094124992872508>',
	'witch-805310651374764033-<:role_color_witch:945092992505626664>',
	'jester-649759732009271296-<:role_color_jester:945092379721994290>',
	'juggernaut-807805468768337950-<:role_color_juggernaut:945096389707329587>',
	'werewolf-805310653333241906-<:role_color_werewolf:945094140268519444>',
	'guardian_angel-807805331081003028-<:role_color_guardian_angel:945096404571922452>',
	'executioner-649419215182495765-<:role_color_executioner:945094108551209000>',
	'vampire-666876652671991819-<:role_color_vampire:945093448841695252>',
	'pestilence-740608542020468776-<:role_color_pestilence:945093357867241493>',
];

export const menuNotif = [
	{ label: 'Game Night', value: 'role-type-notifs-game-night', emoji: '🥳' },
	{ label: 'Server Updates', value: 'role-tyoe-notifs-server-updates', emoji: '👀' },
	{ label: 'Polls', value: 'role-type-notifs-polls', emoji: '✉️' },
	{ label: 'GIM Updates', value: 'role-type-gim-updates', emoji: '💡' },
];

export default {
	tag: 'staffcommand',
	description: 'Test functionality.',
	serverPermissions: [DiscordServers.DISCORD_MAFIA, DiscordServers.DEVELOPMENT],
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
	runSlash: async (i: CommandInteraction): Promise<any> => {
		let text = '';
		for (const color in colorRoot) {
			let [role, roleID, emojiID] = color.split(':');
			text += `[${role}] ${emojiID} <@&${roleID}> `;
		}

		i.reply({ content: text });
	},
} as Command;

// export default {
// 	tag: 'test',
// 	description: 'Testing command.',
// 	serverPermissions: [DiscordServers.DISCORD_MAFIA, DiscordServers.DEVELOPMENT],

// 	slashPermissions: [
// 		{
// 			id: '943131009338204161',
// 			type: 'ROLE',
// 			permission: true,
// 		},
// 		{
// 			id: '797960436053311519',
// 			type: 'ROLE',
// 			permission: true,
// 		},
// 	],
// 	runSlash: (i: CommandInteraction) => {
// 		// const rowRoot = new MessageActionRow();

// 		// let selectColor = new MessageSelectMenu();
// 		// selectColor.setCustomId('select-role-reaction-color');
// 		// selectColor.setPlaceholder('Select Color');

// 		// let selectColorOptions: MessageSelectMenuOptions[] = [];
// 		for (const color in colorRoot) {
// 			let [role, _roleID] = color.split(':');
// 			let emoji = i.guild?.emojis.cache.find((emoji) => emoji.name == `role_color_${role}`);
// 			console.log('emoji', emoji?.identifier);
// 		}

// 		// console.log(selectColorOptions);

// 		// message.channel.send({ content: 'Select one of the following to change your role color/colour', components: [new MessageActionRow().addComponents(selectColor)] });

// 		// let selectNotif = new MessageSelectMenu();
// 		// selectNotif.setCustomId('select-role-notifications');
// 		// selectNotif.setPlaceholder('Select Notification Roles');
// 		// selectNotif.setMaxValues(menuNotif.length);
// 		// selectNotif.addOptions(menuNotif);
// 	},
// } as Command;
