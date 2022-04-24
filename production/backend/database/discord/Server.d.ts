import { Document } from 'mongoose';
export interface RawServerSchema {
    serverId: string;
    gamePlayerRoles: string[];
    staffRoles: string[];
}
export interface ServerSchema extends RawServerSchema, Document {
}
declare const _default: import("mongoose").Model<unknown, {}, {}>;
export default _default;
