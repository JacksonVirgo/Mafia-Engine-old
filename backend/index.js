const { PORT, running, database, cert, privateKey } = process.env;
const canRunHTTPS = cert && privateKey;
const express = require('express');
const mongoose = require('mongoose');
const http = cert && privateKey ? require('https') : require('http');
const path = require('path');
const cors = require('cors');
const router = require('./router');
const socketio = require('socket.io');
const app = express();
const options = {
	key: privateKey,
	cert: cert,
};
const server = canRunHTTPS ? http.createServer(options, app) : http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

mongoose.connect(database || 'mongodb://localhost:27017/mern', { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to MongoDB database'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', router.expressRouter);
if (running == 'production') {
	app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
	});
}
io.sockets.on('connection', async (socket) => {
	await router.initializeSocket({ io, socket });
});
server.listen(PORT || 5000, () => {
	console.log(`Server listening on port ${PORT || 5000}`);
});
