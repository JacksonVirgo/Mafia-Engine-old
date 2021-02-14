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
            let result = await replacementHandler.getReplacementFromUrl(data.url);
            socket.emit('replacement', result);
        });
        socket.on('votecount', async (data) => {
            console.log('%c VoteCount was Called', "background-color: red;");
            let result = await voteCountHandler.scrapeThread(data.url);
            console.log(result);
            socket.emit('ping', result);
        });
        socket.on('ping', (data) => { console.log(data); console.log('F'); socket.emit('ping', data) });
    } else {
        console.log('SocketIO Failed to Initialize');
    }
}
module.exports = { initializeSocket }