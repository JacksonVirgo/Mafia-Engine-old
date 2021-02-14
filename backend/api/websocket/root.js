const socketio = require('socket.io');
const WebSocket = require('ws');
const scrapeReplacement = require('../../tools/scrape/scrapeReplacement');
const screenScraper = require('../../tools/scrape/screenScraper');

function initializeWebSocket(server) {
    const io = socketio(server, {
        cors: {
            origin: 'http://localhost:5000',
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        console.log(`Client Connected at ${socket.id}`);
        socket.on('replacement', (data) => getReplacement(socket, data));
        socket.on('votecount', (data) => getVoteCount(socket, data));
    });

    return io;
}

async function getReplacement(socket, data) {
    let replacement = await screenScraper.scrapeReplacement.getReplacementFromUrl(data.gameThread);
    socket.emit('replacement', { replacement });
}

async function getVoteCount(socket, data) {
    let voteCount = await screenScraper.scrapeVotes.getDataFromThread(data.gameThread, (e) => socket.emit('progress', e));
    socket.emit('votecount', { voteCount });
}

function init(ws) {
    console.log("Client Connected");
    ws.on('message', (data) => {
        let json = { "cmd": null };
        try {
            json = JSON.parse(data);
        } catch (err) {
            console.log(err);
        }
        if (json.cmd !== null) {
            callCommand(ws, json);
        }
    });
    ws.on('close', () => {
        console.log("Client Disconnected");
    });
}

async function callCommand(ws, json) {
    const command = json.cmd;
    const data = json.data;

    switch (command) {
        case 'ping':
            sendData(ws, 'console', { ping: 'pong' });
            break;
        case 'replacement':
            let replacement = await screenScraper.scrapeReplacement.getReplacementFromUrl(data.gameThread);
            sendData(ws, 'replacement', { replacement, departingPlayer: data.departingPlayer });
            break;
        case 'votecount':
            let voteCount = await screenScraper.scrapeVotes.getDataFromThread(data.gameThread, (e) => sendData(ws, 'progress', e));
            sendData(ws, 'votecount', voteCount);
            break;
        default:
            break;
    }
}

function sendData(ws, cmd, data) {
    console.log(data);
    ws.send({ cmd, data });
}

module.exports = {
    init: initializeWebSocket
};