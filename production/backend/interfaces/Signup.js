"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSignup = exports.createSignup = void 0;
const mongoose_1 = require("mongoose");
const SignupCategoryBase = new mongoose_1.Schema({
    title: String,
    maximum: Number,
    locked: Boolean,
});
const SignupBase = new mongoose_1.Schema({
    title: String,
    categories: [SignupCategoryBase],
    location: String,
    bannedUsers: [String],
    hosts: [String],
});
const RootSchemaBase = new mongoose_1.Schema({
    identifier: String,
    data: SignupBase,
});
const dataModel = (0, mongoose_1.model)('discord-signups', RootSchemaBase);
const createSignup = async (data) => {
    if (await dataModel.findOne({ identifier: data.identifier }))
        return false;
    try {
        await new dataModel(data).save();
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
exports.createSignup = createSignup;
const fetchSignup = async (identifier) => {
    const fetchedDB = await dataModel.findOne({ identifier });
    if (!fetchedDB)
        return Promise.reject('Database entry not found');
    try {
        return fetchedDB;
    }
    catch (err) {
        return Promise.reject('Database entry conversion failed');
    }
};
exports.fetchSignup = fetchSignup;
