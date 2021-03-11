const express = require('express'),
    mongoose = require('mongoose'),
    http = require('http'),
    path = require('path'),
    cors = require('cors'),
    router = require('./router'),
    socketio = require('socket.io'),
    port = process.env.PORT || 5000,
    app = express(),
    server = http.createServer(app),
    io = socketio(server, { cors: { origin: '*' } });

mongoose.connect('mongodb://localhost:27017/mern', { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to MongoDB database'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', router.expressRouter);

if (process.env.type === 'production') {
    app.use(express.static('../frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    });
}

io.sockets.on('connection', async (socket) => await router.initializeSocket({ io, socket }));
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
