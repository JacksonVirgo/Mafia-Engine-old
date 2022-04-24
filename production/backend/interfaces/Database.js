"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseEntry = void 0;
class DatabaseEntry {
    model;
    constructor(model) {
        this.model = model;
    }
    findOne(payload) {
        let fetched = this.model.findOne(payload);
        let parsed = fetched;
        return parsed;
    }
}
exports.DatabaseEntry = DatabaseEntry;
