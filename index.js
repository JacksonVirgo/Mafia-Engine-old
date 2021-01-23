const express = require('express');
const app = express();
const server = require('http').Server(app);

const Tools = require('./_backend/util/toolReference');
const Stats = require('./_backend/statistics/userHandling');

// Routing
app.use(require('./_backend/routes/routes'));

// Setting port and running server.
const PORT = process.env.PORT || 80;
server.listen(PORT);
console.log(`Server Initialized. Port ${PORT}`);``

// Start SOCKET.IO
const io = require(`socket.io`)(server, {cors:{origin:'*'}});
io.sockets.on('connection', (socket) => {
    Stats.addUser();
    console.log(`User connected with ID ${socket.id}`);

    // let url = 'https://forum.mafiascum.net/viewtopic.php?f=56&t=77970';
    // Tools.VoteCount.getDataFromThread(url);
   
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
        processed.push(Tools.RoleCard.lexer.parse({block, globals, value}));
    }
    socket.emit('parse-card', {list: processed});
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