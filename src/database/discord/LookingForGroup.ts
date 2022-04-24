import { Document, Schema, model } from 'mongoose';

export interface RawLFGSchema {
<<<<<<< HEAD
	messageID: string;
=======
	messageID?: string;
>>>>>>> development
	title?: string;
	categories?: {
		title: string;
		priority?: number;
		players: string[];
		limit?: number;
		locked?: boolean;
	}[];
	locked?: boolean;
<<<<<<< HEAD
	hosts: string[];
	banned: string[];
}

export interface LFGSchema extends RawLFGSchema, Document {}
=======
	hosts?: string[];
	banned?: string[];
}

export interface LFGSchema extends RawLFGSchema, Document { }
>>>>>>> development

export default model(
	'discord-lfg',
	new Schema({
		messageID: String,
		title: String,
		categories: [
			new Schema({
				title: String,
				priority: Number,
				players: [String],
				limit: Number,
				locked: Boolean,
			}),
		],
		locked: Boolean,
		hosts: [String],
		banned: [String],
	})
);
