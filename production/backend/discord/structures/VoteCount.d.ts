import { MessageOptions, Guild } from 'discord.js';
export declare const ExampleVoteData: VoteCountData;
export interface VoteData {
    voter: string;
    target: string;
    timestamp: number;
}
export interface VoteCountData {
    title?: string;
    livingPlayers: string[];
    deadPlayers?: string[];
    votes?: VoteData[];
    dayStarts?: number[];
}
export declare const createVoteCount: (vcData: VoteCountData, _guild?: Guild | null | undefined) => MessageOptions;
