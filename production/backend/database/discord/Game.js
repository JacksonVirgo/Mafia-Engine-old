"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)('discord-mafia-game', new mongoose_1.Schema({
    gameHosts: [String],
    players: [
        new mongoose_1.Schema({
            _id: false,
            id: String,
            previous: [String],
            isDead: Boolean,
        }),
    ],
    dayStarts: [Number],
    gameChannel: String,
    othersChannels: [String],
    voteCounter: String,
}));
