const protocol = require('http');
const express = require('express');

const app = express();
const server = protocol.createServer(app);

module.exports = { app, server };
