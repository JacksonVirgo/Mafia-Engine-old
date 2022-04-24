"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const VoteCounter = new mongoose_1.Schema({
    staticPost: String,
    votes: [
        new mongoose_1.Schema({
            target: String,
            voter: String,
            timestamp: String,
            _id: false,
        }),
    ],
});
exports.default = (0, mongoose_1.model)('discord-vote-count', VoteCounter);
