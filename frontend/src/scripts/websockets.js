import socketIOClient from 'socket.io-client';
import { serverUrl } from "./reference";

export function createSocket(commands = []) {
    const socket = socketIOClient(serverUrl);
    return socket;
}
// Create a managable abstraction over this.