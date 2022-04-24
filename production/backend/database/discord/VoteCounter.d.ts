import { Document } from 'mongoose';
export declare type VCType = 'COMMAND_ONLY' | 'LOCKED_VOTE_STATIC' | 'LOCKED_VOTE_DYNAMIC';
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
export interface VoteCountSchema extends RawVoteCountSchema, Document {
}
declare const _default: import("mongoose").Model<Document<any, any, any>, any, any>;
export default _default;
