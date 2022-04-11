"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = (0, mongoose_1.model)('discord-servers', new mongoose_1.Schema({
    serverId: String,
    gamePlayerRoles: [String],
    staffRoles: [String],
}));
