import { Document, Schema, model } from 'mongoose';

export interface RawServerSchema {
	serverId: string;
	gamePlayerRoles: string[];
	staffRoles: string[];
}
export interface ServerSchema extends RawServerSchema, Document {}

export default model(
	'discord-servers',
	new Schema({
		serverId: String,
		gamePlayerRoles: [String],
		staffRoles: [String],
	})
);
