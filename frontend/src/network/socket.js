import io from 'socket.io-client';

export function connectSocket() {
    return io.connect();
}
