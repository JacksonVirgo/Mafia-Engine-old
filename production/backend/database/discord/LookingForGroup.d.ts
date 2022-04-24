import { Document } from 'mongoose';
export interface RawLFGSchema {
    messageID: string;
    title?: string;
    categories?: {
        title: string;
        priority?: number;
        players: string[];
        limit?: number;
        locked?: boolean;
    }[];
    locked?: boolean;
    hosts: string[];
    banned: string[];
}
export interface LFGSchema extends RawLFGSchema, Document {
}
declare const _default: import("mongoose").Model<unknown, {}, {}>;
export default _default;
