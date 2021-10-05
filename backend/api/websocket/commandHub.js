const commands = [require('./commands/genReplace'), require('./commands/generateVotecount')];

const attach = (socket) => {
    for (const cmd of commands) {
        const { tag, exe } = cmd;
        socket.on(tag, (data) => {
            exe(socket, data, tag);
        });
    }
};

module.exports = { attach };
