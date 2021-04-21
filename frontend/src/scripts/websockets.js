import socketIOClient from 'socket.io-client';
import { getServerURL } from '../network/network';
export function createSocket(commands = []) {
	const socket = socketIOClient(getServerURL());
	return socket;
}
// Create a managable abstraction over this.
