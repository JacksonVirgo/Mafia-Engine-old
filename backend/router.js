const commandHub = require('./api/commands/commandHub');

const currentSockets = {};
function addSocket(socket) {
	currentSockets[socket.id] = socket;
	console.log(`Client connected with id ${socket.id}`);
}
function removeSocket(socket) {
	let tmpId = socket.id;
	delete currentSockets[socket.id];
	console.log(`Client disconnected with id ${tmpId}`);
}
async function initializeSocket(socketPkg) {
	if (socketPkg.io && socketPkg.socket) {
		const { io, socket } = socketPkg;
		addSocket(socket);
		socket.on('disconnect', () => removeSocket(socket));
		socket.on('ping', console.log);
		commandHub.addCommands(socket);
	} else {
		console.log('SocketIO Failed to Initialize');
	}
}

const router = require('express').Router();
router.use('/', require('./routes/mainRouter'));

module.exports = {
	expressRouter: router,
	initializeSocket,
};
