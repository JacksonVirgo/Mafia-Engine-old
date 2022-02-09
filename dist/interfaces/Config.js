"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchConfig = void 0;
const fetchConfig = () => {
    const { discordToken, databaseToken, PORT, discordPrefix } = process.env;
    return { discordToken, databaseToken, PORT: PORT || 5000, discordPrefix: discordPrefix || 'dev!' };
};
exports.fetchConfig = fetchConfig;
