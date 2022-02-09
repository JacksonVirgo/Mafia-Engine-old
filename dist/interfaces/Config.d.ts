export interface Config {
    discordToken?: string;
    databaseToken?: string;
    PORT: string;
    discordPrefix: string;
}
export declare const fetchConfig: () => Config;
