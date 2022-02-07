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
