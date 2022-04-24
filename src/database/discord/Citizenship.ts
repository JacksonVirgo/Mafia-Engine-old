import { Document, Schema, model } from 'mongoose';

export interface RawCitizen {
    discordId: string;
    roles?: string[];
    gamesPlayed?: number;
    alts?: string[];
}
export interface Citizen extends RawCitizen, Document { };

export default model(
    'discord-mafia-game',
    new Schema({
        discordId: String,
        roles: [String],
        gamesPlayed: [String],
        alts: [String]
    })
);
