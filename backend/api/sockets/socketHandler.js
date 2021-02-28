const replacementHandler = require('../../tools/scrape/scrapeReplacement'),
    voteCountHandler = require('../../tools/scrape/scrapeVotes');

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
        socket.on('replacement', async (data) => {
            try {
                let result = await replacementHandler.getReplacementFromUrl(data.url);
                socket.emit('replacement', result);
            } catch (err) {
                console.log('[ERROR] Replacement Form');
                socket.emit('error', err);
            }
        });
        socket.on('votecount', async (data) => {
            console.log('VoteCount was Called');
            let result = await voteCountHandler.scrapeThread(data.url, (e) => socket.emit('progress', e));
            socket.emit('ping', result);
            socket.emit('votecount', result);
        });
        socket.on('ping', (data) => { console.log(data) });
    } else {
        console.log('SocketIO Failed to Initialize');
    }
}
module.exports = { initializeSocket }