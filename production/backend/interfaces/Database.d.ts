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
export declare class DatabaseEntry<T extends Document> {
    private model;
    constructor(model: Model<any>);
    findOne(payload: FilterQuery<any>): T;
}
export {};
