"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchConfig = void 0;
const fetchConfig = () => {
    const { discordToken, discordAuthToken, databaseToken, PORT, discordPrefix, developmentGuild, databaseUrl, isDevelopment } = process.env;
    return {
        discordToken,
        databaseToken,
        PORT: PORT || 5000,
        discordPrefix: discordPrefix || 'dev!',
        discordAuthToken,
        isDevelopment: !!isDevelopment,
        developmentGuild,
        databaseUrl,
    };
};
exports.fetchConfig = fetchConfig;
