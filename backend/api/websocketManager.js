const socketio = require('socket.io');

const init = (server) => {
    const io = socketio(server, { cors: { origin: '*' } });

    // Global Commands
    io.sockets.on('connection', async (socket) => {
        socket.on('ping', console.log);
        require('./websocket/commandHub').attach(socket);
    });
};

module.exports = { attach: init };
