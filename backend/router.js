const { socketSelector } = require('./config.json');
const path = require('path');
const commandHub = require('./api/commands/commandHub');

//#region RESTful API
const express = require('express'),
	cors = require('cors'),
	router = express.Router();

router.use(cors());
router.get('ping', (req, res) => res.send('pong'));
//#endregion

//#region Socket Handler
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

//#endregion

module.exports = {
	expressRouter: router,
	initializeSocket,
};
