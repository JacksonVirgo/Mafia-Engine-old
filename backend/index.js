const express = require('express'),
	mongoose = require('mongoose'),
	http = require('http'),
	path = require('path'),
	cors = require('cors'),
	router = require('./router'),
	socketio = require('socket.io'),
	port = process.env.PORT || 5000,
	app = express(),
	server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

mongoose.connect('mongodb://localhost:27017/mern', { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to MongoDB database'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/api', router.expressRouter);

console.log(process.env.running);
if ((process.env.running = 'production')) {
	console.log('TEST1');
	app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
	app.get('*', (req, res) => {
		console.log('TEST2');
		res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
		console.log('TEST3');
	});
}

io.sockets.on('connection', async (socket) => {
	await router.initializeSocket({ io, socket });
});
server.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});
