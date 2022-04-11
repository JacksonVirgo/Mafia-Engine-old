import { Document, Schema as MSchema, model } from 'mongoose';

export interface Vote {
    target: string;
    author: string;
    timestamp: number;
}

export interface OngoingGame {
    thread: string;
    hosts: string[];
    players?: string[];
    dead?: string[];
    votes?: Vote[];
    days?: number[];
}

export interface FullOngoingGame extends Document, OngoingGame { }

const VoteCounter = new MSchema({
    thread: String,
    hosts: [String],
    players: [String],
    dead: [String],
    votes: [new MSchema({
        _id: false,
        target: String,
        author: String,
        timestamp: Number
    })],
    days: [String]
});

export default model('mafiascum-game', VoteCounter);
