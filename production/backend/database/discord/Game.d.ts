import { Document } from 'mongoose';
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
export interface GameSchema extends RawGameSchema, Document {
}
declare const _default: import("mongoose").Model<unknown, {}, {}>;
export default _default;
