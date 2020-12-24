const express = require('express');
const app = express();
const server = require('http').Server(app);

const request = require("request");
const cheerio = require("cheerio");

const screenScrape = require('./server/screenScraper');
 app.get('/', function(req, res) {
     res.sendFile(__dirname + `/client/index.html`);
 });
app.use('/', express.static(__dirname + `/client`));

const PORT = process.env.PORT || 2000;
server.listen(PORT);
console.log(`Server Initialized. Port ${PORT}`);``

const io = require(`socket.io`)(server, {
    cors: {
        origin: '*'
    }
});
io.sockets.on('connection', (socket) => {
    console.log(socket.id);
    socket.emit('connected', false);

    socket.on('mafiascum-page', (data) => {
        console.log("potato");
        request(data, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                console.log("Entry");

                var results = {};

                const $ = cheerio.load(html);
        
                var header = $("h2").text();
                var pageNum = parseInt($("#jumpto1").val());
                var nextLink = $(".right-box.right").attr("href");
                var lastPage = $(".pagination").children("span").children("a:last-child").html();
                var firstPoster = $(".postprofile").text();

                console.log(firstPoster);
        
                results.header = header;
                results.currentPage = pageNum;
                results.pageCount = lastPage;

                socket.emit("mafiascum-page", results);
                console.log("Exit");
            }
            else {
                console.log("Failed");
            }
        });
    })
});