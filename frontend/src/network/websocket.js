import { io } from 'socket.io-client';
import { getServerURL, isLocalURL } from './network';
export function createSocket() {
	let serverUrl = getServerURL();
	return isLocalURL(serverUrl) ? io(serverUrl) : io();
}
