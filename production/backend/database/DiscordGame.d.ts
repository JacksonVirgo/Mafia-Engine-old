import mongoose from 'mongoose';
export interface Wagon {
    target: string;
    voters: string[];
}
export interface VoteCount {
    post: string;
    wagons: Wagon[];
}
export interface AutomatedGame {
    gamechannel: string;
    votechannel: string;
    votecount?: VoteCount;
}
export interface RawSchema {
    title: string;
    players?: string[];
    dead?: string[];
    automation?: AutomatedGame;
}
export interface Schema extends mongoose.Document, RawSchema {
}
declare const _default: mongoose.Model<mongoose.Document<any, any, any>, any, any>;
export default _default;
