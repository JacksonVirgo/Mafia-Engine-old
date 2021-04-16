import socketIOClient from 'socket.io-client';
import { serverUrl } from './reference';

export function createSocket(commands = []) {
	const socket = socketIOClient(process.env.SERVER_URL);
	return socket;
}
// Create a managable abstraction over this.
