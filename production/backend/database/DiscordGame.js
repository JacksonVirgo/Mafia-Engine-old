"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const Wagon = new mongoose_1.Schema({ target: String, voters: [String], _id: false });
const VoteCount = new mongoose_1.Schema({ post: String, wagons: Wagon, _id: false });
const AutomatedGame = new mongoose_1.Schema({ gamechannel: String, votechannel: String, votecount: VoteCount, _id: false });
const DiscordGame = new mongoose_1.Schema({
    title: String,
    players: [String],
    dead: [String],
    automation: AutomatedGame,
});
exports.default = mongoose_1.default.model('discord-games', DiscordGame);
