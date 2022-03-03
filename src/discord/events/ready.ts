import { Client } from '../';
import { addCommand, slashCommands } from '../../interfaces/Command';
import { loadFilesRecursive } from '../../util/filesystem';
import { Config, DiscordServers } from '../..';
import { GuildApplicationCommandManager } from 'discord.js';

let file = {
	tag: 'ready',
	run: async () => {
		let { isDevelopment } = Config;
		if (isDevelopment) console.log('Running as Development Version');

		let commands = await loadFilesRecursive(`${__dirname}/../commands`);
		if (commands) {
			for (let i = 0; i < commands.length; i++) {
				const command = (await import(commands[i])).default;
				addCommand(command, Config.isDevelopment);
			}
		}

		const discordServers: Record<string, GuildApplicationCommandManager> = {};
		for (const discordServer in DiscordServers) {
			let discordId = DiscordServers[discordServer];
			let guild = Client.guilds.cache.get(discordId);
			if (guild) discordServers[discordId] = guild.commands;
		}

		for (const slash in slashCommands) {
			const command = slashCommands[slash];
			let loadedServers: string[] = [];
			let perms = command.serverPermissions || [];
			for (const server of perms) {
				if (DiscordServers[server]) {
					const commands = discordServers[DiscordServers[server]];
					const appCommand = await commands.create({
						name: command.tag,
						description: command.description,
						options: command.options,
						defaultPermission: false,
					});

					loadedServers.push(server);

					if (command.slashPermissions)
						appCommand?.permissions.add({
							permissions: command.slashPermissions,
						});
				}
			}

			console.log(`${command.tag} loaded on ${loadedServers.join(', ')}`);
		}

		console.log(Client?.user?.username + ' is online');
	},
};

export default file;
