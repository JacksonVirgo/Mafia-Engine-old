import { Document, Schema, model } from 'mongoose';

export interface RawGameSchema {
	gameChannel: string;
	gameHosts?: string[];
	players?: {
		id: string;
		previous?: string[];
		isDead?: boolean;
	}[];
	dayStarts: number[];
	otherChannels?: string[];
	voteCounter?: string;
}

export interface GameSchema extends RawGameSchema, Document {}

export default model(
	'discord-mafia-game',
	new Schema({
		gameHosts: [String],
		players: [
			new Schema({
				_id: false,
				id: String,
				previous: [String],
				isDead: Boolean,
			}),
		],
		dayStarts: [Number],
		gameChannel: String,
		othersChannels: [String],

		voteCounter: String,
	})
);
