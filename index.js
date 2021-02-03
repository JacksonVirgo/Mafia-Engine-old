"use strict"

// External Dependencies;
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');

// Custom Dependencies
const webSocketRoot = require('./backend/api/websocket/root');

const port = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
8
webSocketServer.on('connection', (webSocketClient) => webSocketRoot.init(webSocketClient));
// mongoose.connect('mongodb://localhost:27017/mern', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }, () => console.log('Connected to MongoDB database'));

// const screen = require('./backend/tools/scrape/screenScraper');
// let url = 'https://forum.mafiascum.net/viewtopic.php?f=2&t=85556';
// screen.scrapeVotes.getDataFromThread(url);

app.use('/api', require('./backend/api/router'));

const isProduct = true;
if (isProduct) {
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    })
}
server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});

/*
// TODO: Remove Socket.io entirely from the tool.
const io = require(`socket.io`)(server, { cors: { origin: '*' } });
io.sockets.on('connection', (socket) => {
    Stats.addUser();
    console.log(`User connected with ID ${socket.id}`);

    // Functions
    socket.on('parse-card', (data) => parseCard(data, socket));
    socket.on("console", (data) => console.log(data));
    socket.on('rand', (data) => randGame(data, socket));
    socket.on('scrapeReplacement', (data) => scrapeReplacement(data, socket));
    socket.on('scrapeVotecount', (data) => scrapeVotecount(data, socket));

    // On Disconnect
    socket.on("disconnect", () => {
        Stats.removeUser();
        console.log(`User disconnected with ID ${socket.id}`);
    });
});

function parseCard({ block, globals, list }, socket) {
    let processed = [];
    for (const value of list) {
        processed.push(Tools.RoleCard.lexer.parse({ block, globals, value }));
    }
    socket.emit('parse-card', { list: processed });
}

function scrapeReplacement({ url }, socket) {
    Tools.Replacement.getReplacement(url, socket);
}

async function scrapeVotecount({ url }, socket) {
    let voteCount = await Tools.VoteCount.getDataFromThread(url);
    socket.emit("scrapeVotecount", { voteCount });
}

function randGame({ list, players }, socket) {
    let randedArray = Tools.Rand.rand(players, list);
    socket.emit('rand', { rand: randedArray });
}
*/