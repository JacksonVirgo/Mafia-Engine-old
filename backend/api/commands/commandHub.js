const voteCount = require('./votecount');
const replacement = require('./replacement');

module.exports = {
	addCommands: (socket) => {
		socket.on('votecount', (data) => voteCount(socket, data));
		socket.on('replacement', (data) => replacement(socket, data));
	},
};
