import { Document, Schema as MSchema, model } from 'mongoose';

export type VCType = 'COMMAND_ONLY' | 'LOCKED_VOTE_STATIC' | 'LOCKED_VOTE_DYNAMIC';

export interface VoteTransaction {
	target: string;
	voter: string;
	timestamp: string;
}
export interface VoteCount {
	post: string;
	votes: VoteTransaction[];
}
export interface Wagon {
	target: string;
	voters: string[];
}
export interface RawVoteCountSchema {
	staticPost?: string;
	votes?: [
		{
			target: string;
			voter: string;
			timestamp: string;
		}
	];
}
export interface VoteCountSchema extends RawVoteCountSchema, Document {}

const VoteCounter = new MSchema({
	staticPost: String,
	votes: [
		new MSchema({
			target: String,
			voter: String,
			timestamp: String,
			_id: false,
		}),
	],
});

export default model('discord-vote-count', VoteCounter);
