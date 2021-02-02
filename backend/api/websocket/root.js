const WebSocket = require('ws');
const scrapeReplacement = require('../../tools/scrape/scrapeReplacement');

const screenScraper = require('../../tools/scrape/screenScraper');

class Command {
    constructor(on, fn) {
        Command.list[on] = this;
        this.fn = null;
        this.setCommand(fn);
    }
    setCommand(fn) {
        this.fn = fn;
    }
}
Command.list = {};

function init(ws) {
    console.log("Client Connected");
    ws.on('message', (data) => {
        let json = { "cmd": null };
        try {
            json = JSON.parse(data);
        } catch (err) {
            console.log(err);
        }
        if (json.cmd !== null) {
            callCommand(ws, json);
        }
    });
    ws.on('close', () => {
        console.log("Client Disconnected");
    });
}

async function callCommand(ws, json) {
    const command = json.cmd;
    const data = json.data;

    switch (command) {
        case 'ping':
            sendData(ws, 'console', { ping: 'pong' });
            break;
        case 'replacement':
            let result = await screenScraper.scrapeReplacement.getReplacementFromUrl(data.gameThread);
            sendData(ws, 'replacement', { replacement: result, departingPlayer: data.departingPlayer });
            break;
        case 'votecount':
            //let result = screenScraper.scrapeVotes.
            break;
        default:
            break;
    }
}

function sendData(ws, cmd, data) {
    ws.send(JSON.stringify({ cmd, data }));
}

module.exports = {
    init: init
};