import { Document, Schema as MSchema, model } from 'mongoose';

export interface VoteCountSettings {
    thread: string;
    hosts: string[];
    players: string[];
    dead?: {
        player: string;
        post?: number;
    }[];
    replacements?: {
        before: string;
        after: string;
        post: number;
    }[];
    dayStarts?: {
        label?: string;
        post: number;
        count: number;
        endPost?: number;
    }[];
    alternativeNames?: {
        truename: string;
        alternatives: string[];
    }[]
}

export interface VoteCountSettingsSchema extends Document, VoteCountSettings { }

const VoteCountSettingsSchemaRaw = new MSchema({
    thread: { type: String, required: true },
    hosts: { type: [String], required: true },
    players: { type: [String], required: true },
    dead: { type: [String], required: false },
    replacements: {
        type: [new MSchema({
            _id: false,
            before: { type: String, required: true },
            after: { type: String, required: true },
            post: { type: Number, required: true },
        })], required: false
    },
    dayStarts: {
        type: [new MSchema({
            _id: false,
            label: { type: String, required: false },
            post: { type: Number, required: true },
            count: { type: Number, required: true },
            endPost: { type: Number, required: false }
        })],
        required: false
    },
    alternativeNames: {
        type: [new MSchema({
            _id: false,
            truename: { type: String, required: true },
            alternative: { type: [String], required: true }
        })]
    }
})


export default model('mafiascum-vote-count-settings', VoteCountSettingsSchemaRaw);
