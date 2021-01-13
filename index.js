const express = require('express');
const app = express();
const server = require('http').Server(app);
const request = require("request");
const cheerio = require("cheerio");
const fs = require('fs');
// Custom Dependencies
const CONFIG = require('./config.json');
const screenScrape = require('./server/screenScraper');
const roleCards = require('./server/role_cards/role_cards_core');
const Rand = require('./server/randing/randing_core');

// Setting Routes
app.get("/", (req, res) => { res.sendFile(`${__dirname}/client/index.html`); });
app.get("/rolecard", (req, res) => { res.sendFile(`${__dirname}/client/role_card_generator/rolecards.html`) });
app.get("/replacement", (req, res) => { res.sendFile(`${__dirname}/client/replacement_form/replacement.html`) });
app.use('/', express.static(__dirname + `/client`));

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
    socket.emit('connected', false);

    let string = "{{potato{{tomato}}potato}}";
    roleCards.lexer.parse({chunk: string, globals: null, value: null})
    
    // Role Cards
    socket.on('parse-card', (data) => {
        let { chunk, globals, list } = data;
        let processed = [];
        for (const value of list) {
            processed.push(roleCards.lexer.parse({chunk, globals, value}));
        }
        socket.emit('parse-card', {list: processed});
    });

    // Randing
    socket.on('rand', (data) => {
        let { list, players } = data;
        let randedArray = Rand.rand(players, list);
        socket.emit('rand', { rand: randedArray });
    });

    // Replacement Form
    socket.on('scrape-send', (data) => {
        var type = data.type;
        var link = data.link
        request(link, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                var results = {};
                const $ = cheerio.load(html);
                var header = $("h2").text();
                var pageNum = parseInt($("#jumpto1").val());
                var nextLink = $(".right-box.right").attr("href");
                var lastPage = $(".pagination").children("span").children("a:last-child").html();
                var firstPosterList = $(".postprofile dt a:first").text();
                
                results.header = header;
                results.author = firstPosterList;
                results.currentPage = pageNum;
                results.pageCount = lastPage;
                socket.emit("scrape-send", results);
            }
            else {
            }
        });
    })
});