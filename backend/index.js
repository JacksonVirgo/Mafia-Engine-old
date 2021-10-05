require('dotenv').config();
const mongoose = require('mongoose');
const { app, server } = require('./api/serverManager');
const express = require('express');
const path = require('path');

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => console.log('Connected to MongoDB database'));
const port = process.env.PORT || 5000;

(async () => {
    if (process.env.running === 'production') {
        app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
        });
    }
    require('./api/restManager').attach(app);
    require('./api/websocketManager').attach(server);
    await require('./test.js')();
    server.listen(port, () => {
        console.log(`Server Start. [PORT=${port}]`);
    });
})();
