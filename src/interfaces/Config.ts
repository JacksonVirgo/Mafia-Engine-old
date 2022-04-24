export interface Config {
	PORT: string;

	// Discord
	discordToken?: string;
	discordPrefix: string;

	// Database
	databaseUrl?: string;

	// Dev
	isDevelopment: boolean;
	developmentGuild?: string;

	// Auth
	discordAuthToken?: string;
	discordAuthSecret?: string;
}

export const fetchConfig = (): Config => {
	const { discordToken, discordAuthToken, databaseToken, PORT, discordPrefix, developmentGuild, databaseUrl, isDevelopment } = process.env;
	return {
		discordToken,
		databaseToken,
		PORT: PORT || 3001,
		discordPrefix: discordPrefix || 'dev!',
		discordAuthToken,

		isDevelopment: !!isDevelopment,
		developmentGuild,

		databaseUrl,
	} as Config;
};
