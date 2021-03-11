const { socketSelector } = require('./config.json');
const path = require('path');
//#region RESTful API
const express = require('express'),
    cors = require('cors'),
    router = express.Router(),
    handler = {
        replacement: require('./tools/scrape/scrapeReplacement'),
        votecount: require('./tools/scrape/scrapeVotes'),
    };

router.use(cors());
router.get('ping', (req, res) => res.send('pong'));
router.route('/download').get((req, res) => {
    let fileName = null;
    switch (req.query.id) {
        case 'mathblade':
            fileName = 'MathBlade_VoteCounter_MafiaScum.zip';
            break;
    }
    const filePath = path.join(__dirname, '../', 'files', 'MathBlade_VoteCounter_MafiaScum.zip');

    if (fileName) res.download(filePath);
    else res.send("File Doesn't Exist");
});
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
        socket.on('replacement', async (data) => {
            console.log('Replacement Called');
            try {
                const result = await handler.replacement.getReplacementFromUrl(data.url);
                socket.emit('replacement', result);
            } catch (err) {
                console.log('[ERROR] Replacement Form');
                socket.emit('error', err);
            }
        });
        socket.on('votecount', async (data) => {
            console.log(data);
            try {
                const result = await handler.votecount.scrapeThread(data.url, (e) => socket.emit('progress', e));
                console.log(result);
                socket.emit('result', result);
            } catch (err) {
                console.log(err);
            }
        });
    } else {
        console.log('SocketIO Failed to Initialize');
    }
}

//#endregion

module.exports = {
    expressRouter: router,
    initializeSocket,
};
