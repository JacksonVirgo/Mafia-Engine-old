export interface Config {
	discordToken?: string;
	databaseToken?: string;
	PORT: string;
	discordPrefix: string;
	isDevelopment: boolean;
}

export const fetchConfig = (): Config => {
	const { discordToken, databaseToken, PORT, discordPrefix } = process.env;
	return {
		discordToken,
		databaseToken,
		PORT: PORT || 5000,
		discordPrefix: discordPrefix || 'dev!',
		isDevelopment: !!discordPrefix,
	} as Config;
};
