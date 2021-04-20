import socketIOClient from 'socket.io-client';
import { getServerURL } from './network';
export function createSocket() {
	const socket = socketIOClient(getServerURL());
	return socket;
}
