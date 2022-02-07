import { Schema as MSchema, model, Document } from 'mongoose';

export interface SignupCategory {
	title: string;
	maximum?: number;
	locked?: boolean;
	users: string[];
	bannedUsers: string[];
}
const SignupCategoryBase = new MSchema({
	title: String,
	maximum: Number,
	locked: Boolean,
});

export interface Signup {
	title: string;
	categories: SignupCategory[];
	location: string;
	bannedUsers: string[];
	hosts: string[];
}
const SignupBase = new MSchema({
	title: String,
	categories: [SignupCategoryBase],
	location: String,
	bannedUsers: [String],
	hosts: [String],
});

export interface RootSchema extends Document {
	identifier: string;
	data?: Signup;
}
const RootSchemaBase = new MSchema({
	identifier: String,
	data: SignupBase,
});

// MongoDB Section
const dataModel = model('discord-signups', RootSchemaBase);

/**
 * Creates a new signup database entry
 * @param data new signup data
 * @returns boolean to show success result.
 */
export const createSignup = async (data: RootSchema): Promise<boolean> => {
	if (await dataModel.findOne({ identifier: data.identifier })) return false;
	try {
		await new dataModel(data).save();
		return true;
	} catch (err) {
		console.error(err);
		return false;
	}
};

/**
 * Request a specific database entry.
 * @param identifier Unique identifier of a requested db entry
 * @returns database entry
 */
export const fetchSignup = async (identifier: string): Promise<RootSchema> => {
	const fetchedDB = await dataModel.findOne({ identifier });
	if (!fetchedDB) return Promise.reject('Database entry not found');
	try {
		return fetchedDB as RootSchema;
	} catch (err) {
		return Promise.reject('Database entry conversion failed');
	}
};
