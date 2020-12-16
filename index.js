const express = require('express');
const app = express();
const server = require('http').Server(app);

app.get('/', function(req, res) {
    res.sendFile(__dirname + `/client/index.html`);
});
app.use('/', express.static(__dirname + `/client`));

const PORT = process.env.PORT || 2000;
server.listen(PORT);
console.log(`Server Initialized. Port ${PORT}`);``

const io = require(`socket.io`)(server, {});
io.sockets.on('connection', (socket) => {
    console.log(socket.id);
});