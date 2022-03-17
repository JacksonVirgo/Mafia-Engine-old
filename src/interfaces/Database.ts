import { Document, FilterQuery, Model } from 'mongoose';

interface RunFunction {
	(args: any): any;
}

export interface Event {
	tag?: string;
	tags?: string[];
	run: RunFunction;
}

export interface EventList {
	events: Event[];
}

export class DatabaseEntry<T extends Document> {
	private model: Model<any>;
	constructor(model: Model<any>) {
		this.model = model;
	}

	public findOne(payload: FilterQuery<any>): T {
		let fetched = this.model.findOne(payload);
		let parsed: T = fetched as unknown as T;
		return parsed;
	}
}
