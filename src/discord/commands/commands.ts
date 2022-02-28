import { Command, commandHandles, commandDescriptions, commandAlias, messageCommands as commands, getClosestCommand } from '../../interfaces/Command';
import { Message, MessageEmbed } from 'discord.js';

const noArgs = (message: Message, _args: string[]) => {
	let mainCommands: string[] = [];
	let alias: Record<string, string[]> = {};
	for (const commandHandle of commandHandles) {
		let { command } = commandHandle;
		let fetchAlias = commandAlias[command];
		if (!fetchAlias) mainCommands.push(command);
		else {
			let aliasList = alias[fetchAlias] || [];
			aliasList.push(command);
			alias[fetchAlias] = aliasList;
		}
	}

	let embedDesc = 'Use the command `commands [command]` to check more details about a specific command.\n';
	for (const cmd of mainCommands) {
		embedDesc += `\n**${cmd}** - ${commandDescriptions[cmd]}`;
	}

	const messageEmbed = new MessageEmbed().setTitle('Mafia Engine Commands').setDescription(embedDesc.trim()).setColor('#00bfff');

	message.channel.send({ embeds: [messageEmbed] });
};

const withArgs = (message: Message, args: string[]): any => {
	let command: Command | undefined = commands[args[0]];
	if (!command) command = commands[commandAlias[args[0]]];
	if (!command) return message.channel.send(`Command does not exist. Did you mean ${'`'}${getClosestCommand(args[0])}${'`'}`);

	let perms = '';
	let permAppend = '';
	if (!command.permission || command.permission.regularUser) perms = 'Anyone can use';
	else if (command.permission.custom) {
		let canUse = command.permission.custom(message) || message.member?.permissions.has('ADMINISTRATOR');
		perms = 'Regular users cannot use. Custom and ADMINISTRATORS can use this command.';
		permAppend = canUse ? '\n__You can use this command__' : '\n__You cannot use this command__';
	} else perms = 'Only ADMINISTRATORS can use.';

	let aliasList = command.alias?.toString() || 'none';
	let messageEmbed = new MessageEmbed()
		.setTitle(`Mafia Engine - ${command.tag}`)
		.setDescription(command.longDescription || command.description || `Information for the command ${command.tag}`)
		.setFields([
			{ name: 'Permissions', value: (perms + permAppend).trim() },
			{ name: 'Alias List', value: aliasList },
		])
		.setColor('#00bfff');

	message.channel.send({ embeds: [messageEmbed] });
};

export default {
	tag: 'commands',
	alias: ['getcommands', 'cmds', 'cmd', 'gc'],
	description: 'Get a list of all the commands. Use command `command [command]` for more info',
	longDescription: 'Get a list of all commands <@843514276383031296> uses. Use command `command [command]` for more detailed information for each command.',
	runMsg: (message: Message, args: string[]) => {
		if (args.length <= 0) noArgs(message, args);
		else withArgs(message, args);
	},
} as Command;
