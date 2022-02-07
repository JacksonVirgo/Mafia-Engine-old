import { Client } from '../';
import { loadFilesRecursive } from '../../util/filesystem';
import { addCommand as addMessageCommand } from './messageCreate';

let file = {
	tag: 'ready',
	run: async () => {
		let commands = await loadFilesRecursive(`${__dirname}/../commands`);
		if (commands) {
			for (let i = 0; i < commands.length; i++) {
				const command = (await import(commands[i])).default;
				addMessageCommand(command);
			}
		}

		console.log(Client?.user?.username + ' is online');
	},
};

export default file;
