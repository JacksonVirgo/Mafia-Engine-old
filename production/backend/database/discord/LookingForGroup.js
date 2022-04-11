"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)('discord-lfg', new mongoose_1.Schema({
    messageID: String,
    title: String,
    categories: [
        new mongoose_1.Schema({
            title: String,
            priority: Number,
            players: [String],
            limit: Number,
            locked: Boolean,
        }),
    ],
    locked: Boolean,
    hosts: [String],
    banned: [String],
}));
