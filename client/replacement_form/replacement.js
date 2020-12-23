const request = require("request");

var io = io();

var departingPlayer;

function requestPageScrape(link) {
    io.emit('mafiacsum-page', link);
}
io.on('mafiascum-page', (data) => {
    var data = data;
});


$(document).ready(() => {
    $(form).submit((e) => {
        e.preventDefault();
        var serial = serialize($("#fieldForm"));              
        var array = serialToObject(serial);

        var link = array.game_thread;
        var play = array.departing_player;

        departingPlayer = play;
        requestPageScrape(link);
    });
});