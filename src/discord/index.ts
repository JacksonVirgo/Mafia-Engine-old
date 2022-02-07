import Discord from 'discord.js';
import { Config } from '../';
import { Command } from '../interfaces/Command';
import { Event } from '../interfaces/Event';

import { loadFiles } from '../util/filesystem';

const { Intents } = Discord;
export const Client = new Discord.Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

/** Record of all discord commands */
export const commandList: Record<string, Command> = {};

/**
 * Initializes the discord bot.
 */
export const init = async () => {
	if (!Config.discordToken) return console.log('Invalid or Missing Discord Token');
	let files = await loadFiles(`${__dirname}/events`);
	if (files) {
		for (let i = 0; i < files.length; i++) {
			let eventData = (await import(files[i])).default;
			const loadEvent = (event: Event) => {
				const { tag, run } = event;
				if (tag && run) Client.on(tag, run);
			};
			if (!eventData.events) loadEvent(eventData);
			else {
				for (const event of eventData) {
					loadEvent(event);
				}
			}
		}
	}

	Client.login(Config.discordToken);
};
