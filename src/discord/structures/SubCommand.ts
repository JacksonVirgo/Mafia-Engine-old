import { Message } from 'discord.js';

export interface SubCommand {
	(msg: Message, args: string[]): void;
}

export interface SubCommandManager {
	commands: Record<string, SubCommand>;
	run: (msg: Message, args: string[]) => any;
}

export const useSubCmd = (commands: Record<string, SubCommand>) => {
	let manager: SubCommandManager = {
		commands,
		run: (msg: Message, args: string[]) => {
			let secondaryCommand = args.shift();
			if (secondaryCommand && commands[secondaryCommand]) {
				commands[secondaryCommand](msg, args);
			}
		},
	};
	return manager;
};
