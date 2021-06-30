const voteCount = require('./votecount');
const replacement = require('./replacement');
const rolecard = require('./rolecard');
const parseVotecount = require('./formatting/parseVotecount');
module.exports = {
	addCommands: (socket) => {
		socket.on('ping', (data) => socket.emit('ping', data));
		socket.on('votecount', (data) => voteCount(socket, data));
		socket.on('replacement', (data) => replacement(socket, data));
		socket.on('parseCSV', (data) => rolecard.parseCSV(socket, data));
	},
};
