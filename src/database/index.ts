import { connect, Connection } from 'mongoose';
import { Config } from '../';

let db: Connection;
export default (): Connection | undefined => db;
export const databaseInit = async (): Promise<any> => {
	if (!Config.databaseUrl) return console.log('Database token not supplied');

	try {
		db = (await connect(Config.databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })).connection;
		if (db) console.log('Database Connected');
		else console.log('Database failed to connect.');
	} catch (err) {
		console.log('Database connection error', err);
	}
};

/*

Database Design

Root Game Schema which stores the _id's
of subsidiary processes, stored in seperate schemas.

Discord Game
- List of Hosts
- List of Players
- List of Replacements (orig, new, timestamp)
- List of Dead Players
- Day-Start Timestamps (message_id, timestamp)
- Game Channel ID
- Subsidiary Channels (all other channels)

? Vote Counter _id

Vote Counter
- Latest Static VC Post
- List of all Votes [target, voter, timestamp]

 */
