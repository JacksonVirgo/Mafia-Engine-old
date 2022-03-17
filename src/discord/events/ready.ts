import { Client } from '../';
import { addCommand, slashCommands } from '../../interfaces/Command';
import { loadFilesRecursive } from '../../util/filesystem';
import { Config, DiscordServers } from '../..';
import { ApplicationCommandManager, GuildApplicationCommandManager } from 'discord.js';

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

		let slashCommandManager: ApplicationCommandManager<any> | GuildApplicationCommandManager | undefined;

		slashCommandManager = Client.guilds.cache.get(!isDevelopment ? DiscordServers.DEVELOPMENT : DiscordServers.DISCORD_MAFIA)?.commands;
		if (!slashCommandManager) Client.application?.commands;

		Client.application?.commands.cache.each((v) => v.delete());
		slashCommandManager?.cache.each((v) => v.delete());

		for (const slash in slashCommands) {
			const command = slashCommands[slash];
			const appCommand = await slashCommandManager?.create({
				name: command.tag,
				description: command.description,
				options: command.options,
				defaultPermission: false,
			});

			if (command.slashPermissions)
				appCommand?.permissions.add({
					permissions: command.slashPermissions,
				});

			console.log(`Loaded ${appCommand?.name}`);
		}

		console.log(Client?.user?.username + ' is online');
	},
};

export default file;
