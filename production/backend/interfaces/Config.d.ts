export interface Config {
    PORT: string;
    discordToken?: string;
    discordPrefix: string;
    databaseUrl?: string;
    isDevelopment: boolean;
    developmentGuild?: string;
    discordAuthToken?: string;
    discordAuthSecret?: string;
}
export declare const fetchConfig: () => Config;
