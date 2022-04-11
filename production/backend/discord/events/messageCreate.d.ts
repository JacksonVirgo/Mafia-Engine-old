import { Message } from 'discord.js';
export declare const onRegularCommand: (message: Message) => any;
declare const _default: {
    tag: string;
    run: (message: Message) => Promise<void>;
};
export default _default;
