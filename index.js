const express = require('express');
const app = express();
const server = require('http').Server(app);
const request = require("request");
const cheerio = require("cheerio");

// Custom Dependencies
const CONFIG = require('./config.json');
const screenScrape = require('./server/screenScraper');

// Setting Routes
app.get("/", (req, res) => { res.sendFile(`${__dirname}/client/index.html`); });
app.get("/rolecards", (req, res) => { res.sendFile(`${__dirname}/client/role_card_generator/rolecards.html`) });

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
    console.log("Connection Occurred");
    socket.emit('connected', false);

    socket.on('scrape-send', (data) => {
        var type = data.type;
        var link = data.link
        request(link, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                console.log("Entry");

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

                console.log(results);

                socket.emit("scrape-send", results);
                console.log("Exit");
            }
            else {
                console.log("Failed");
            }
        });
    })
});