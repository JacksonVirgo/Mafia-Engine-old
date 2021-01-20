const express = require('express');
const app = express();
const server = require('http').Server(app);
const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');

// Custom Dependencies
const CONFIG = require('./config.json');
const Tools = require('./server/util/toolReference');
const Rand = require('./server/randing/randing_core');

const apiKeys = ["foo","bar","baz"];
const repos = [{name: "John"}];

app.use(express.json());

// Setting Routes
app.get("/", (req, res) => { res.sendFile(`${__dirname}/client/index.html`); });
app.get("/rolecard", (req, res) => { res.sendFile(`${__dirname}/client/rolecard/rolecard.html`) });
app.get("/replacement", (req, res) => { res.sendFile(`${__dirname}/client/replacement_form/replacement.html`) });
app.use('/', express.static(__dirname + `/client`));

app.use('/api', (req, res, next) => {
    let key = req.query['api-key'];
    if (!key) return next(error(400, "API Key Required"));
    if (!~apiKeys.indexOf(key)) return next(error(401, "Invalid API key"));
    req.key = key;
    next();
});
app.use('/api/users', (req, res, next) => {
    res.send(repos);
});

// Setting port and running server.
const PORT = process.env.PORT || 2000;
server.listen(PORT);
console.log(`Server Initialized. Port ${PORT}`);``

// Start SOCKET.IO
const io = require(`socket.io`)(server, {
    cors: {
        origin: '*'
    }
});

io.sockets.on('connection', (socket) => {
    // On Connect
    socket.emit('connected', false);
    console.log(`User connected with ID ${socket.id}`);
    Tools.ScreenScraper.getVotes("https://forum.mafiascum.net/viewtopic.php?f=2&t=85556", socket);
    
    // Functions
    socket.on('parse-card', (data) => parseCard(data, socket));
    socket.on("console", (data) => console.log(data));
    socket.on('rand', (data) => randGame(data, socket));
    socket.on('scrapeReplacement', (data) => scrapeReplacement(data, socket));

    // On Disconnect
    socket.on("disconnect", () => console.log(`User disconnected with ID ${socket.id}`));
});

function parseCard({ block, globals, list }, socket) {
    let processed = [];
    for (const value of list) {
        processed.push(Tools.RoleCard.lexer.parse({block, globals, value}));
    }
    socket.emit('parse-card', {list: processed});
}

function scrapeReplacement({ url }, socket) {
    Tools.ScreenScraper.getReplacement(url, socket);
}

function randGame({ list, players }, socket) {
    let randedArray = Rand.rand(players, list);
    socket.emit('rand', { rand: randedArray });
}