import mongoose, { Schema as MSchema } from 'mongoose';

export interface Wagon {
	target: string;
	voters: string[];
}
const Wagon = new MSchema({ target: String, voters: [String], _id: false });

export interface VoteCount {
	post: string;
	wagons: Wagon[];
}
const VoteCount = new MSchema({ post: String, wagons: Wagon, _id: false });

export interface AutomatedGame {
	gamechannel: string;
	votechannel: string;
	votecount?: VoteCount;
}
const AutomatedGame = new MSchema({ gamechannel: String, votechannel: String, votecount: VoteCount, _id: false });

export interface RawSchema {
	title: string;
	players?: string[];
	dead?: string[];
	automation?: AutomatedGame;
}
export interface Schema extends mongoose.Document, RawSchema {}

const DiscordGame = new MSchema({
	title: String,
	players: [String],
	dead: [String],
	automation: AutomatedGame,
});

export default mongoose.model('discord-games', DiscordGame);
