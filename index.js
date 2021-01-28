const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
//const Tools = require('./_backend/util/toolReference');
//const Stats = require('./_backend/statistics/userHandling');

mongoose.connect('mongodb://localhost:27017/mern', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => console.log('Connected to MongoDB database'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api', require('./backend/api/router'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    })
}

app.listen(port, () => console.log(`Server listening on port ${port}`));

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