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
	const { discordToken, databaseToken, PORT, discordPrefix, developmentGuild, databaseUrl, isDevelopment } = process.env;
	return {
		discordToken,
		databaseToken,
		PORT: PORT || 5000,
		discordPrefix: discordPrefix || 'dev!',

		isDevelopment: !!isDevelopment,
		developmentGuild,

		databaseUrl,
	} as Config;
};
