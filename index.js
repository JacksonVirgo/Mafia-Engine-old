const express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    cors = require('cors'),
    socketio = require('socket.io'),
    socketHandler = require('./backend/api/sockets/socketHandler');

const port = process.env.PORT || 5000,
    app = express(),
    server = http.createServer(app),
    io = socketio(server, { cors: { origin: '*' } });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mern',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('Connected to MongoDB database'));
app.use('/api', require('./backend/api/router'));
const isProduct = process.env.type === 'production';
if (isProduct) {
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    })
}
io.sockets.on('connection', (socket) => socketHandler.initializeSocket({ io, socket }));
server.listen(port, () => { console.log(`Server listening on port ${port}`) });