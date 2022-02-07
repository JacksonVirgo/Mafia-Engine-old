export interface Config {
	discordToken?: string;
	databaseToken?: string;
	PORT: string;
	discordPrefix: string;
}

export const fetchConfig = (): Config => {
	const { discordToken, databaseToken, PORT, discordPrefix } = process.env;
	return { discordToken, databaseToken, PORT: PORT || 5000, discordPrefix: discordPrefix || 'dev!' } as Config;
};
